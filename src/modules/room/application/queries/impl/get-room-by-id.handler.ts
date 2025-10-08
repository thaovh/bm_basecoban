import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException } from '@nestjs/common';

import { GetRoomByIdQuery } from '../get-room-by-id.query';
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

@QueryHandler(GetRoomByIdQuery)
export class GetRoomByIdHandler implements IQueryHandler<GetRoomByIdQuery> {
    private readonly logger = new Logger(GetRoomByIdHandler.name);

    constructor(
        @Inject('IRoomRepository')
        private readonly roomRepository: IRoomRepository,
    ) { }

    async execute(query: GetRoomByIdQuery): Promise<RoomResponseDto> {
        const { id } = query;
        this.logger.log(`Getting room by ID: ${id}`);

        const room = await this.roomRepository.findById(id);
        if (!room) {
            throw new NotFoundException('Room not found');
        }

        return {
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
        };
    }
}
