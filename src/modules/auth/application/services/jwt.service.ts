import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { User } from '../../../user/domain/user.entity';

export interface JwtPayload {
    sub: string; // user id
    username: string;
    email: string;
    role: 'admin' | 'user';
    iat?: number;
    exp?: number;
}

export interface LoginResponse {
    access_token: string;
    user: {
        id: string;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        role: 'admin' | 'user';
        isActive: number;
    };
}

@Injectable()
export class JwtAuthService {
    private readonly logger = new Logger(JwtAuthService.name);

    constructor(
        private readonly jwtService: NestJwtService,
        private readonly configService: ConfigService,
    ) { }

    async generateToken(user: User): Promise<string> {
        const payload: JwtPayload = {
            sub: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };

        const secret = this.configService.get<string>('JWT_SECRET', 'your-secret-key');
        const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '24h');

        return this.jwtService.sign(payload, {
            secret,
            expiresIn,
        });
    }

    async verifyToken(token: string): Promise<JwtPayload> {
        const secret = this.configService.get<string>('JWT_SECRET', 'your-secret-key');

        try {
            return this.jwtService.verify(token, { secret });
        } catch (error) {
            this.logger.error('JWT verification failed:', error);
            throw new Error('Invalid token');
        }
    }

    async createLoginResponse(user: User): Promise<LoginResponse> {
        const access_token = await this.generateToken(user);

        return {
            access_token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isActive: user.isActiveFlag,
            },
        };
    }
}
