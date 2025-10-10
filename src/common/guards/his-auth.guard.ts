import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HisIntegrationService } from '../../modules/his-integration/application/services/his-integration.service';
import { User } from '../../modules/user/domain/user.entity';
import { IUserRepository } from '../../modules/user/domain/user.interface';

@Injectable()
export class HisAuthGuard {
    private readonly logger = new Logger(HisAuthGuard.name);

    constructor(
        private reflector: Reflector,
        private readonly hisIntegrationService: HisIntegrationService,
        private readonly userRepository: IUserRepository,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Check if route is marked as public
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const hisToken = this.extractHisTokenFromHeader(request);

        if (!hisToken) {
            throw new UnauthorizedException('HIS token is required');
        }

        try {
            // Validate HIS token
            const hisTokenEntity = await this.hisIntegrationService.getValidToken();
            
            if (!hisTokenEntity || hisTokenEntity.tokenCode !== hisToken) {
                throw new UnauthorizedException('Invalid HIS token');
            }

            if (hisTokenEntity.isTokenExpired()) {
                throw new UnauthorizedException('HIS token has expired');
            }

            // Find user by HIS username
            const user = await this.userRepository.findByUsername(hisTokenEntity.userLoginName);
            if (!user) {
                // If user not found by HIS username, try to find by hisUsername field
                const users = await this.userRepository.findAll();
                const userWithHisCredentials = users.find(u => u.hisUsername === hisTokenEntity.userLoginName);
                
                if (!userWithHisCredentials) {
                    throw new UnauthorizedException(`User not found for HIS username: ${hisTokenEntity.userLoginName}`);
                }

                // Attach user info to request
                request.user = {
                    sub: userWithHisCredentials.id,
                    username: userWithHisCredentials.username,
                    email: userWithHisCredentials.email,
                    role: userWithHisCredentials.role,
                    hisUsername: hisTokenEntity.userLoginName,
                    hisToken: hisTokenEntity,
                };
            } else {
                // Attach user info to request
                request.user = {
                    sub: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    hisUsername: hisTokenEntity.userLoginName,
                    hisToken: hisTokenEntity,
                };
            }

            this.logger.debug(`HIS authentication successful for user: ${request.user.username} (HIS: ${hisTokenEntity.userLoginName})`);
            return true;

        } catch (error) {
            this.logger.error(`HIS authentication failed: ${error.message}`);
            throw new UnauthorizedException(`HIS authentication failed: ${error.message}`);
        }
    }

    private extractHisTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
