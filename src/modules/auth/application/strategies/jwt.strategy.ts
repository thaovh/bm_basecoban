import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthService, JwtPayload } from '../services/jwt.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtAuthService: JwtAuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET', 'your-secret-key'),
        });
    }

    async validate(payload: JwtPayload): Promise<JwtPayload> {
        try {
            // Validate the payload
            if (!payload.sub || !payload.username || !payload.role) {
                throw new UnauthorizedException('Invalid token payload');
            }

            // Return the payload to be attached to request.user
            return {
                sub: payload.sub,
                username: payload.username,
                email: payload.email,
                role: payload.role,
            };
        } catch (error) {
            throw new UnauthorizedException('Token validation failed');
        }
    }
}
