import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

import { LoginCommand } from '../login.command';
import { User } from '../../../../user/domain/user.entity';
import { IUserRepository } from '../../../../user/domain/user.interface';
import { AppError } from '../../../../../common/dtos/base-response.dto';

export interface LoginResult {
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface UserResponseDto {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: 'admin' | 'user';
    isActive: number;
    lastLoginAt?: Date;
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
    private readonly logger = new Logger(LoginHandler.name);

    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async execute(command: LoginCommand): Promise<LoginResult> {
        const { loginDto } = command;
        this.logger.log(`Login attempt for username/email: ${loginDto.usernameOrEmail}`);

        // Find user by username or email
        let user = await this.userRepository.findByUsername(loginDto.usernameOrEmail);
        if (!user) {
            user = await this.userRepository.findByEmail(loginDto.usernameOrEmail);
        }

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Check if user is active
        if (!user.isAccountActive()) {
            throw new UnauthorizedException('Account is deactivated');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Update last login
        user.updateLastLogin();
        await this.userRepository.save(user);

        // Generate tokens
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRES_IN', '24h'),
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        });

        const expiresIn = this.parseExpiresIn(this.configService.get('JWT_EXPIRES_IN', '24h'));

        this.logger.log(`User ${user.username} logged in successfully`);

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                isActive: user.isActiveFlag,
                lastLoginAt: user.lastLoginAt,
            },
            accessToken,
            refreshToken,
            expiresIn,
        };
    }

    private parseExpiresIn(expiresIn: string): number {
        // Convert expiresIn string to seconds
        const unit = expiresIn.slice(-1);
        const value = parseInt(expiresIn.slice(0, -1));

        switch (unit) {
            case 's':
                return value;
            case 'm':
                return value * 60;
            case 'h':
                return value * 60 * 60;
            case 'd':
                return value * 24 * 60 * 60;
            default:
                return 24 * 60 * 60; // Default to 24 hours
        }
    }
}
