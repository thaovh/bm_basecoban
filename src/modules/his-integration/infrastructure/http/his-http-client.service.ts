import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { HisLoginResponse, HisApiResponse } from '../../domain/his-integration.interface';

@Injectable()
export class HisHttpClientService {
    private readonly logger = new Logger(HisHttpClientService.name);
    private readonly httpClient: AxiosInstance;
    private readonly hisBaseUrl: string;
    private readonly hisAppCode: string;

    constructor(private readonly configService: ConfigService) {
        this.hisBaseUrl = this.configService.get<string>('HIS_BASE_URL', 'http://192.168.7.200:1401');
        this.hisAppCode = this.configService.get<string>('HIS_APP_CODE', 'HIS');

        this.httpClient = axios.create({
            baseURL: this.hisBaseUrl,
            timeout: 30000, // 30 seconds
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        // Add request interceptor for logging
        this.httpClient.interceptors.request.use(
            (config) => {
                this.logger.debug(`HIS API Request: ${config.method?.toUpperCase()} ${config.url}`);
                return config;
            },
            (error) => {
                this.logger.error('HIS API Request Error:', error);
                return Promise.reject(error);
            }
        );

        // Add response interceptor for logging
        this.httpClient.interceptors.response.use(
            (response) => {
                this.logger.debug(`HIS API Response: ${response.status} ${response.config.url}`);
                return response;
            },
            (error) => {
                this.logger.error(`HIS API Response Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
                return Promise.reject(error);
            }
        );
    }

    async loginToHIS(username: string, password: string): Promise<HisLoginResponse> {
        try {
            this.logger.log(`Logging in to HIS for user: ${username}`);

            // Create Basic Auth header
            const credentials = `${this.hisAppCode}:${username}:${password}`;
            const base64Credentials = Buffer.from(credentials).toString('base64');

            const response: AxiosResponse<HisApiResponse<HisLoginResponse>> = await this.httpClient.get(
                '/api/Token/Login',
                {
                    headers: {
                        'Authorization': `Basic ${base64Credentials}`,
                    },
                }
            );

            if (!response.data.Success) {
                throw new HttpException('HIS login failed', HttpStatus.UNAUTHORIZED);
            }

            this.logger.log(`Successfully logged in to HIS for user: ${username}`);
            return response.data.Data;
        } catch (error) {
            this.logger.error(`HIS login failed for user: ${username}`, error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Failed to login to HIS', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async renewToken(renewCode: string): Promise<HisLoginResponse> {
        try {
            this.logger.log(`Renewing HIS token with renew code: ${renewCode.substring(0, 10)}...`);

            const response: AxiosResponse<HisApiResponse<HisLoginResponse>> = await this.httpClient.post(
                '/api/Token/Renew',
                {},
                {
                    headers: {
                        'RenewCode': renewCode,
                    },
                }
            );

            if (!response.data.Success) {
                throw new HttpException('HIS token renewal failed', HttpStatus.UNAUTHORIZED);
            }

            this.logger.log(`Successfully renewed HIS token`);
            return response.data.Data;
        } catch (error) {
            this.logger.error(`HIS token renewal failed`, error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Failed to renew HIS token', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async callHISAPI(endpoint: string, data?: any, tokenCode?: string): Promise<any> {
        try {
            this.logger.log(`Calling HIS API: ${endpoint}`);

            const headers: any = {};
            if (tokenCode) {
                headers['Authorization'] = `Bearer ${tokenCode}`;
            }

            const response: AxiosResponse<HisApiResponse> = await this.httpClient.post(
                endpoint,
                data,
                { headers }
            );

            if (!response.data.Success) {
                throw new HttpException(`HIS API call failed: ${endpoint}`, HttpStatus.BAD_REQUEST);
            }

            this.logger.log(`Successfully called HIS API: ${endpoint}`);
            return response.data.Data;
        } catch (error) {
            this.logger.error(`HIS API call failed: ${endpoint}`, error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(`Failed to call HIS API: ${endpoint}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async makeGetRequest(endpoint: string, tokenCode?: string): Promise<any> {
        try {
            this.logger.log(`Making GET request to HIS API: ${endpoint}`);

            const headers: any = {};
            if (tokenCode) {
                headers['Authorization'] = `Bearer ${tokenCode}`;
            }

            const response: AxiosResponse<HisApiResponse> = await this.httpClient.get(
                endpoint,
                { headers }
            );

            if (!response.data.Success) {
                throw new HttpException(`HIS API GET request failed: ${endpoint}`, HttpStatus.BAD_REQUEST);
            }

            this.logger.log(`Successfully made GET request to HIS API: ${endpoint}`);
            return response.data.Data;
        } catch (error) {
            this.logger.error(`HIS API GET request failed: ${endpoint}`, error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(`Failed to make GET request to HIS API: ${endpoint}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
