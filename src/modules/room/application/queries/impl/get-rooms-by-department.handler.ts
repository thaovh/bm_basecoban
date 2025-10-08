import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';

import { GetRoomsByDepartmentQuery } from '../get-rooms-by-department.query';
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

export interface GetRoomsByDepartmentResult {
    items: RoomResponseDto[];
    total: number;
    limit: number;
    offset: number;
}

@QueryHandler(GetRoomsByDepartmentQuery)
export class GetRoomsByDepartmentHandler implements IQueryHandler<GetRoomsByDepartmentQuery> {
    private readonly logger = new Logger(GetRoomsByDepartmentHandler.name);

    constructor(
        @Inject('IRoomRepository')
        private readonly roomRepository: IRoomRepository,
    ) { }

    async execute(query: GetRoomsByDepartmentQuery): Promise<GetRoomsByDepartmentResult> {
        const { departmentId, limit, offset } = query;
        this.logger.log(`Getting rooms by department: ${departmentId}`);

        const [rooms, total] = await this.roomRepository.findRoomsByDepartment(departmentId, limit, offset);

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
