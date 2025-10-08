import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { Room } from '../../domain/room.entity';
import { IRoomRepository } from '../../domain/room.interface';

@Injectable()
export class RoomRepository implements IRoomRepository {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
    ) { }

    async findById(id: string): Promise<Room | null> {
        return this.roomRepository.findOne({
            where: { id, deletedAt: IsNull() },
            relations: ['department'],
        });
    }

    async findByCode(roomCode: string): Promise<Room | null> {
        return this.roomRepository.findOne({
            where: { roomCode, deletedAt: IsNull() },
        });
    }

    async findByName(roomName: string): Promise<Room | null> {
        return this.roomRepository.findOne({
            where: { roomName, deletedAt: IsNull() },
        });
    }

    async save(room: Room): Promise<Room> {
        return this.roomRepository.save(room);
    }

    async delete(id: string): Promise<void> {
        await this.roomRepository.softDelete(id);
    }

    async findAllRooms(limit: number, offset: number): Promise<[Room[], number]> {
        return this.roomRepository.findAndCount({
            where: { deletedAt: IsNull() },
            relations: ['department'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async findActiveRooms(limit: number, offset: number): Promise<[Room[], number]> {
        return this.roomRepository.findAndCount({
            where: { isActiveFlag: 1, deletedAt: IsNull() },
            relations: ['department'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async findRoomsByDepartment(departmentId: string, limit: number, offset: number): Promise<[Room[], number]> {
        return this.roomRepository.findAndCount({
            where: { departmentId, deletedAt: IsNull() },
            relations: ['department'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async searchRooms(searchTerm: string, limit: number, offset: number): Promise<[Room[], number]> {
        const queryBuilder = this.roomRepository
            .createQueryBuilder('room')
            .leftJoinAndSelect('room.department', 'department')
            .where('room.deletedAt IS NULL')
            .andWhere(
                '(room.roomName ILIKE :search OR room.roomCode ILIKE :search OR room.roomAddress ILIKE :search)',
                { search: `%${searchTerm}%` }
            )
            .orderBy('room.createdAt', 'DESC')
            .limit(limit)
            .offset(offset);

        return queryBuilder.getManyAndCount();
    }
}
