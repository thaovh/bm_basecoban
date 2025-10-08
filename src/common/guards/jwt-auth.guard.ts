import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        // Check if route is marked as public
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        return super.canActivate(context);
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
