import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

import { GetUsersQuery } from '../get-users.query';
import { User } from '../../../domain/user.entity';
import { IUserRepository } from '../../../domain/user.interface';
import { AppError } from '../../../../../common/dtos/base-response.dto';

export interface GetUsersResult {
    users: UserResponseDto[];
    total: number;
    limit: number;
    offset: number;
}

export interface UserResponseDto {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    address?: string;
    role: 'admin' | 'user';
    isActive: number;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
    private readonly logger = new Logger(GetUsersHandler.name);

    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(query: GetUsersQuery): Promise<GetUsersResult> {
        const { getUsersDto } = query;
        this.logger.log(`Getting users with criteria: ${JSON.stringify(getUsersDto)}`);

        const { limit = 10, offset = 0, search, role, isActive } = getUsersDto;

        try {
            let users: User[];
            let total: number;

            if (search) {
                [users, total] = await this.userRepository.searchUsers(search, limit, offset);
            } else if (role) {
                [users, total] = await this.userRepository.findUsersByRole(role, limit, offset);
            } else {
                [users, total] = await this.userRepository.findActiveUsers(limit, offset);
            }

            // Filter by isActive if specified
            if (isActive !== undefined) {
                const activeValue = isActive ? 1 : 0;
                users = users.filter(user => user.isActive === activeValue);
                total = users.length;
            }

            const userResponseDtos: UserResponseDto[] = users.map(user => ({
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: user.getFullName(),
                phoneNumber: user.phoneNumber,
                dateOfBirth: user.dateOfBirth,
                address: user.address,
                role: user.role,
                isActive: user.isActive,
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }));

            return {
                users: userResponseDtos,
                total,
                limit,
                offset,
            };
        } catch (error) {
            this.logger.error(`Error getting users: ${(error as Error).message}`, (error as Error).stack);
            throw new AppError('SYS_001', 'Failed to retrieve users');
        }
    }
}
