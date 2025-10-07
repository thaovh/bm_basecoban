import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthController } from './auth.controller';
import { LoginHandler } from './application/commands/impl/login.handler';
import { UserModule } from '../user/user.module';

// Services
import { JwtAuthService } from './application/services/jwt.service';

// Strategies
import { JwtStrategy } from './application/strategies/jwt.strategy';

// Command Handlers
const CommandHandlers = [LoginHandler];

@Module({
    imports: [
        CqrsModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h'),
                },
            }),
            inject: [ConfigService],
        }),
        UserModule, // Import UserModule to access UserRepository
    ],
    controllers: [AuthController],
    providers: [
        // Services
        JwtAuthService,
        JwtStrategy,
        // Command Handlers
        ...CommandHandlers,
    ],
    exports: [
        JwtModule,
        JwtAuthService,
        ...CommandHandlers,
    ],
})
export class AuthModule { }
