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

    async findActiveUsers(limit: number, offset: number): Promise<[User[], number]> {
        return this.userRepository.findAndCount({
            where: { isActive: 1, deletedAt: IsNull() },
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

    async searchUsers(searchTerm: string, limit: number, offset: number): Promise<[User[], number]> {
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .where('user.deletedAt IS NULL')
            .andWhere(
                '(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search OR user.username LIKE :search)',
                { search: `%${searchTerm}%` }
            )
            .orderBy('user.createdAt', 'DESC')
            .take(limit)
            .skip(offset);

        return queryBuilder.getManyAndCount();
    }
}
