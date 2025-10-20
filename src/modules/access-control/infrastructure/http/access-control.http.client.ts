import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class AccessControlHttpClient {
    private readonly logger = new Logger(AccessControlHttpClient.name);
    private readonly baseURL: string;
    private readonly username: string;
    private readonly password: string;
    private readonly timeout: number;

    constructor(private readonly configService: ConfigService) {
        this.username = this.configService.get('ACCESS_CONTROL_USERNAME', 'admin');
        this.password = this.configService.get('ACCESS_CONTROL_PASSWORD', '!Qazxsw2');
        this.baseURL = this.configService.get('ACCESS_CONTROL_BASE_URL', 'http://192.168.68.2/ISAPI/AccessControl/AcsEvent');
        this.timeout = parseInt(this.configService.get('ACCESS_CONTROL_TIMEOUT', '30000'));

        this.logger.log(`Access Control HTTP Client initialized with base URL: ${this.baseURL}`);
    }

    async getAttendanceEvents(requestBody: any): Promise<any> {
        try {
            this.logger.log('Making request to Access Control API with Digest Auth');

            // First request to get digest challenge
            const challengeResponse = await axios.get(this.baseURL, {
                timeout: this.timeout,
                validateStatus: (status) => status === 401, // Expect 401 for digest challenge
            });

            const wwwAuthenticate = challengeResponse.headers['www-authenticate'];
            if (!wwwAuthenticate || !wwwAuthenticate.includes('Digest')) {
                throw new Error('Server does not support Digest authentication');
            }

            // Parse digest challenge
            const digestParams = this.parseDigestChallenge(wwwAuthenticate);

            // Generate digest response
            const digestResponse = this.generateDigestResponse(digestParams, 'POST', this.baseURL);

            // Make authenticated request
            const response: AxiosResponse = await axios.post(
                this.baseURL,
                requestBody,
                {
                    timeout: this.timeout,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Digest ${digestResponse}`,
                    },
                    params: { format: 'json' },
                }
            );

            this.logger.log('Access Control API response received successfully');
            return response.data;
        } catch (error: any) {
            this.logger.error('Failed to get attendance events', {
                error: error?.message || String(error),
                status: error?.response?.status,
                statusText: error?.response?.statusText,
            });
            throw new Error(`Access Control API error: ${error?.message || String(error)}`);
        }
    }

    private parseDigestChallenge(wwwAuthenticate: string): any {
        const params: any = {};
        const regex = /(\w+)="([^"]*)"/g;
        let match;

        while ((match = regex.exec(wwwAuthenticate)) !== null) {
            params[match[1]] = match[2];
        }

        return params;
    }

    private generateDigestResponse(digestParams: any, method: string, uri: string): string {
        const realm = digestParams.realm || '';
        const nonce = digestParams.nonce || '';
        const qop = digestParams.qop || '';
        const opaque = digestParams.opaque || '';

        // Generate cnonce
        const cnonce = crypto.randomBytes(16).toString('hex');

        // Calculate HA1
        const ha1 = crypto
            .createHash('md5')
            .update(`${this.username}:${realm}:${this.password}`)
            .digest('hex');

        // Calculate HA2
        const ha2 = crypto
            .createHash('md5')
            .update(`${method}:${uri}`)
            .digest('hex');

        // Calculate response
        let response: string;
        if (qop === 'auth') {
            const nc = '00000001'; // Nonce count
            response = crypto
                .createHash('md5')
                .update(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`)
                .digest('hex');
        } else {
            response = crypto
                .createHash('md5')
                .update(`${ha1}:${nonce}:${ha2}`)
                .digest('hex');
        }

        // Build digest response header
        const digestResponse = [
            `username="${this.username}"`,
            `realm="${realm}"`,
            `nonce="${nonce}"`,
            `uri="${uri}"`,
            `response="${response}"`,
        ];

        if (qop) {
            digestResponse.push(`qop=${qop}`);
            digestResponse.push(`nc=00000001`);
            digestResponse.push(`cnonce="${cnonce}"`);
        }

        if (opaque) {
            digestResponse.push(`opaque="${opaque}"`);
        }

        return digestResponse.join(', ');
    }

    async getImage(imageUrl: string): Promise<Buffer> {
        try {
            this.logger.log(`Fetching image from: ${imageUrl}`);

            // First request to get digest challenge
            const challengeResponse = await axios.get(imageUrl, {
                timeout: this.timeout,
                validateStatus: (status) => status === 401,
            });

            const wwwAuthenticate = challengeResponse.headers['www-authenticate'];
            if (!wwwAuthenticate || !wwwAuthenticate.includes('Digest')) {
                throw new Error('Server does not support Digest authentication');
            }

            // Parse digest challenge
            const digestParams = this.parseDigestChallenge(wwwAuthenticate);

            // Generate digest response
            const digestResponse = this.generateDigestResponse(digestParams, 'GET', imageUrl);

            // Make authenticated request for image
            const response: AxiosResponse = await axios.get(imageUrl, {
                timeout: this.timeout,
                responseType: 'arraybuffer',
                headers: {
                    'Authorization': `Digest ${digestResponse}`,
                },
            });

            this.logger.log('Image fetched successfully');
            return Buffer.from(response.data);
        } catch (error: any) {
            this.logger.error('Failed to fetch image', {
                error: error?.message || String(error),
                status: error?.response?.status,
                statusText: error?.response?.statusText,
            });
            throw new Error(`Image fetch error: ${error?.message || String(error)}`);
        }
    }
}
