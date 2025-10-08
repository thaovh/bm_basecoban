import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, LessThan } from 'typeorm';

import { HisToken } from '../../domain/his-token.entity';
import { IHisTokenRepository } from '../../domain/his-integration.interface';

@Injectable()
export class HisTokenRepository implements IHisTokenRepository {
    constructor(
        @InjectRepository(HisToken)
        private readonly hisTokenRepository: Repository<HisToken>,
    ) { }

    async findById(id: string): Promise<HisToken | null> {
        return this.hisTokenRepository.findOne({
            where: { id, deletedAt: IsNull() },
        });
    }

    async findByTokenCode(tokenCode: string): Promise<HisToken | null> {
        return this.hisTokenRepository.findOne({
            where: { tokenCode, deletedAt: IsNull() },
        });
    }

    async findByUserLoginName(userLoginName: string): Promise<HisToken | null> {
        return this.hisTokenRepository.findOne({
            where: { userLoginName, deletedAt: IsNull() },
            order: { createdAt: 'DESC' },
        });
    }

    async findActiveTokenByUser(userLoginName: string): Promise<HisToken | null> {
        return this.hisTokenRepository.findOne({
            where: {
                userLoginName,
                isActiveFlag: 1,
                deletedAt: IsNull()
            },
            order: { createdAt: 'DESC' },
        });
    }

    async save(hisToken: HisToken): Promise<HisToken> {
        return this.hisTokenRepository.save(hisToken);
    }

    async delete(id: string): Promise<void> {
        await this.hisTokenRepository.softDelete(id);
    }

    async findAllActiveTokens(): Promise<HisToken[]> {
        return this.hisTokenRepository.find({
            where: {
                isActiveFlag: 1,
                deletedAt: IsNull()
            },
            order: { createdAt: 'DESC' },
        });
    }

    async findExpiredTokens(): Promise<HisToken[]> {
        const now = new Date();
        return this.hisTokenRepository.find({
            where: {
                expireTime: LessThan(now),
                deletedAt: IsNull()
            },
        });
    }

    async cleanupExpiredTokens(): Promise<void> {
        const now = new Date();
        await this.hisTokenRepository
            .createQueryBuilder()
            .update(HisToken)
            .set({
                isActiveFlag: 0,
                deletedAt: now,
                updatedAt: now
            })
            .where('expireTime < :now', { now })
            .andWhere('deletedAt IS NULL')
            .execute();
    }
}
