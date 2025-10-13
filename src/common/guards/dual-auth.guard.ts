import { Injectable, ExecutionContext, UnauthorizedException, Logger, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { HisIntegrationService } from '../../modules/his-integration/application/services/his-integration.service';
import { IUserRepository } from '../../modules/user/domain/user.interface';
import { IHisTokenRepository } from '../../modules/his-integration/domain/his-integration.interface';

@Injectable()
export class DualAuthGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger(DualAuthGuard.name);

    constructor(
        private reflector: Reflector,
        private readonly hisIntegrationService: HisIntegrationService,
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
        @Inject('IHisTokenRepository')
        private readonly hisTokenRepository: IHisTokenRepository,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Check if route is marked as public
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        // Check if route requires HIS authentication
        const requiresHisAuth = this.reflector.getAllAndOverride<boolean>('hisAuth', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (requiresHisAuth) {
            // Try HIS token first, fallback to JWT if HIS fails
            try {
                return await this.validateHisToken(context);
            } catch (hisError) {
                this.logger.debug(`HIS token validation failed, trying JWT: ${(hisError as Error).message}`);
                // Fallback to JWT authentication
                try {
                    const result = super.canActivate(context);
                    if (typeof result === 'boolean') {
                        return result;
                    } else if (result instanceof Promise) {
                        return await result;
                    } else {
                        return new Promise((resolve, reject) => {
                            result.subscribe({
                                next: (value) => resolve(value),
                                error: (error) => reject(error)
                            });
                        });
                    }
                } catch (jwtError) {
                    this.logger.debug(`JWT token validation also failed: ${(jwtError as Error).message}`);
                    throw hisError; // Throw the original HIS error
                }
            }
        }

        // Check token format to determine authentication method
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (this.isHisToken(token)) {
            // Token looks like HIS token, try HIS authentication
            try {
                return await this.validateHisToken(context);
            } catch (hisError) {
                this.logger.debug(`HIS token validation failed: ${(hisError as Error).message}`);
                throw hisError;
            }
        } else {
            // Token looks like JWT, try JWT authentication
            try {
                const result = super.canActivate(context);
                // Handle boolean, Promise, and Observable
                if (typeof result === 'boolean') {
                    return result;
                } else if (result instanceof Promise) {
                    return await result;
                } else {
                    // Observable - convert to Promise
                    return new Promise((resolve, reject) => {
                        result.subscribe({
                            next: (value) => resolve(value),
                            error: (error) => reject(error)
                        });
                    });
                }
            } catch (jwtError) {
                this.logger.debug(`JWT token validation failed: ${(jwtError as Error).message}`);
                throw jwtError;
            }
        }
    }

    private async validateHisToken(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const hisToken = this.extractHisTokenFromHeader(request);

        this.logger.debug(`Validating HIS token: ${hisToken ? 'present' : 'missing'}`);

        if (!hisToken) {
            throw new UnauthorizedException('HIS token is required');
        }

        try {
            // Find HIS token by token code
            const hisTokenEntity = await this.hisTokenRepository.findByTokenCode(hisToken);

            if (!hisTokenEntity) {
                throw new UnauthorizedException('Invalid HIS token');
            }

            if (hisTokenEntity.isTokenExpired()) {
                throw new UnauthorizedException('HIS token has expired');
            }

            // Find user by HIS username (optional for direct login)
            let appUser = null;
            try {
                appUser = await this.userRepository.findByUsername(hisTokenEntity.userLoginName);
                if (!appUser) {
                    // If user not found by HIS username, try to find by hisUsername field
                    const users = await this.userRepository.findAll();
                    appUser = users.find(u => u.hisUsername === hisTokenEntity.userLoginName);
                }
            } catch (error) {
                this.logger.warn(`Could not find app user for HIS username: ${hisTokenEntity.userLoginName}`);
            }

            // Attach user info to request (with or without app user mapping)
            if (appUser) {
                request.user = {
                    sub: appUser.id,
                    username: appUser.username,
                    email: appUser.email,
                    role: appUser.role,
                    hisUsername: hisTokenEntity.userLoginName,
                    hisToken: hisTokenEntity,
                };
            } else {
                // For direct login without app user mapping
                request.user = {
                    sub: hisTokenEntity.userLoginName, // Use HIS username as sub
                    username: hisTokenEntity.userLoginName,
                    email: hisTokenEntity.userEmail || '',
                    role: 'user', // Default role
                    hisUsername: hisTokenEntity.userLoginName,
                    hisToken: hisTokenEntity,
                };
            }

            this.logger.debug(`HIS authentication successful for user: ${request.user.username} (HIS: ${hisTokenEntity.userLoginName})`);
            return true;

        } catch (error) {
            this.logger.error(`HIS authentication failed: ${(error as Error).message}`);
            throw new UnauthorizedException(`HIS authentication failed: ${(error as Error).message}`);
        }
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private extractHisTokenFromHeader(request: any): string | undefined {
        return this.extractTokenFromHeader(request);
    }

    private isHisToken(token: string | undefined): boolean {
        if (!token) return false;

        // HIS tokens are typically longer and don't contain dots (JWT format)
        // JWT tokens have 3 parts separated by dots: header.payload.signature
        const hasDots = token.includes('.');
        
        // If it has dots, it's definitely a JWT token
        if (hasDots) {
            return false;
        }
        
        // If it's long and has no dots, it's likely a HIS token
        const isLongEnough = token.length > 50;
        return isLongEnough;
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            // Provide more specific error messages
            if (info?.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Access token has expired');
            } else if (info?.name === 'JsonWebTokenError') {
                throw new UnauthorizedException('Invalid access token format');
            } else if (info?.name === 'NotBeforeError') {
                throw new UnauthorizedException('Access token not active yet');
            } else if (!info && !user) {
                throw new UnauthorizedException('Access token is required');
            } else {
                throw err || new UnauthorizedException('Access token is invalid or expired');
            }
        }
        return user;
    }
}
