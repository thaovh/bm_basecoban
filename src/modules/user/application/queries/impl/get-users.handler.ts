import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

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
    fullName: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    address?: string;
    role: 'admin' | 'user';
    provinceId?: string;
    wardId?: string;
    departmentId?: string;
    province?: {
        id: string;
        provinceName: string;
        provinceCode: string;
        shortName?: string;
    };
    ward?: {
        id: string;
        wardName: string;
        wardCode: string;
        shortName?: string;
    };
    department?: {
        id: string;
        departmentName: string;
        departmentCode: string;
        shortName?: string;
    };
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
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
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
                // Load relationships for active users
                [users, total] = await this.userRepo.findAndCount({
                    where: { isActiveFlag: 1, deletedAt: IsNull() },
                    relations: ['province', 'ward', 'department'],
                    take: limit,
                    skip: offset,
                    order: { createdAt: 'DESC' },
                });
            }

            // Filter by isActive if specified
            if (isActive !== undefined) {
                const activeValue = isActive ? 1 : 0;
                users = users.filter(user => user.isActiveFlag === activeValue);
                total = users.length;
            }

            const userResponseDtos: UserResponseDto[] = users.map(user => ({
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                dateOfBirth: user.dateOfBirth,
                address: user.address,
                role: user.role,
                provinceId: user.provinceId,
                wardId: user.wardId,
                departmentId: user.departmentId,
                province: user.province ? {
                    id: user.province.id,
                    provinceName: user.province.provinceName,
                    provinceCode: user.province.provinceCode,
                    shortName: user.province.shortName,
                } : undefined,
                ward: user.ward ? {
                    id: user.ward.id,
                    wardName: user.ward.wardName,
                    wardCode: user.ward.wardCode,
                    shortName: user.ward.shortName,
                } : undefined,
                department: user.department ? {
                    id: user.department.id,
                    departmentName: user.department.departmentName,
                    departmentCode: user.department.departmentCode,
                    shortName: user.department.shortName,
                } : undefined,
                isActive: user.isActiveFlag,
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
