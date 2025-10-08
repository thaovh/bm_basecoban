import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { GetRoomsQuery } from '../get-rooms.query';
import { Room } from '../../../domain/room.entity';
import { IRoomRepository } from '../../../domain/room.interface';

export interface RoomResponseDto {
    id: string;
    roomCode: string;
    roomName: string;
    roomAddress: string;
    departmentId: string;
    description?: string;
    department?: {
        id: string;
        departmentCode: string;
        departmentName: string;
    };
    isActive: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface GetRoomsResult {
    items: RoomResponseDto[];
    total: number;
    limit: number;
    offset: number;
}

@QueryHandler(GetRoomsQuery)
export class GetRoomsHandler implements IQueryHandler<GetRoomsQuery> {
    private readonly logger = new Logger(GetRoomsHandler.name);

    constructor(
        @Inject('IRoomRepository')
        private readonly roomRepository: IRoomRepository,
    ) { }

    async execute(query: GetRoomsQuery): Promise<GetRoomsResult> {
        const { getRoomsDto } = query;
        const { search, departmentId, isActive, limit = 10, offset = 0 } = getRoomsDto;

        this.logger.log(`Getting rooms with filters: search=${search}, departmentId=${departmentId}, isActive=${isActive}`);

        let rooms: Room[];
        let total: number;

        if (search) {
            // Search rooms by name or code
            [rooms, total] = await this.roomRepository.searchRooms(search, limit, offset);
        } else if (departmentId) {
            // Get rooms by department
            [rooms, total] = await this.roomRepository.findRoomsByDepartment(departmentId, limit, offset);
        } else if (isActive !== undefined) {
            // Filter by active status
            if (isActive) {
                [rooms, total] = await this.roomRepository.findActiveRooms(limit, offset);
            } else {
                [rooms, total] = await this.roomRepository.findAllRooms(limit, offset);
            }
        } else {
            // Get all rooms
            [rooms, total] = await this.roomRepository.findAllRooms(limit, offset);
        }

        const items: RoomResponseDto[] = rooms.map(room => ({
            id: room.id,
            roomCode: room.roomCode,
            roomName: room.roomName,
            roomAddress: room.roomAddress,
            departmentId: room.departmentId,
            description: room.description,
            department: room.department ? {
                id: room.department.id,
                departmentCode: room.department.departmentCode,
                departmentName: room.department.departmentName,
            } : undefined,
            isActive: room.isActiveFlag,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt,
        }));

        return {
            items,
            total,
            limit,
            offset,
        };
    }
}
