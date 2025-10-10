import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like } from 'typeorm';

import { User } from '../../domain/user.entity';
import { IUserRepository } from '../../domain/user.interface';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { id, deletedAt: IsNull() },
            relations: ['province', 'ward', 'department'],
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { email, deletedAt: IsNull() },
        });
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { username, deletedAt: IsNull() },
        });
    }

    async save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async delete(id: string): Promise<void> {
        await this.userRepository.softDelete(id);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find({
            where: { deletedAt: IsNull() },
            order: { createdAt: 'DESC' },
        });
    }

    async findActiveUsers(limit: number, offset: number): Promise<[User[], number]> {
        return this.userRepository.findAndCount({
            where: { isActiveFlag: 1, deletedAt: IsNull() },
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async findUsersByRole(role: 'admin' | 'user', limit: number, offset: number): Promise<[User[], number]> {
        return this.userRepository.findAndCount({
            where: { role, deletedAt: IsNull() },
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async findUsersByDepartment(departmentId: string, limit: number, offset: number): Promise<[User[], number]> {
        return this.userRepository.findAndCount({
            where: { departmentId, deletedAt: IsNull() },
            relations: ['province', 'ward', 'department'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async findUsersByProvince(provinceId: string, limit: number, offset: number): Promise<[User[], number]> {
        return this.userRepository.findAndCount({
            where: { provinceId, deletedAt: IsNull() },
            relations: ['province', 'ward', 'department'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async findUsersByWard(wardId: string, limit: number, offset: number): Promise<[User[], number]> {
        return this.userRepository.findAndCount({
            where: { wardId, deletedAt: IsNull() },
            relations: ['province', 'ward', 'department'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async searchUsers(searchTerm: string, limit: number, offset: number): Promise<[User[], number]> {
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.province', 'province')
            .leftJoinAndSelect('user.ward', 'ward')
            .leftJoinAndSelect('user.department', 'department')
            .where('user.deletedAt IS NULL')
            .andWhere(
                '(user.fullName LIKE :search OR user.email LIKE :search OR user.username LIKE :search)',
                { search: `%${searchTerm}%` }
            )
            .orderBy('user.createdAt', 'DESC')
            .take(limit)
            .skip(offset);

        return queryBuilder.getManyAndCount();
    }
}
