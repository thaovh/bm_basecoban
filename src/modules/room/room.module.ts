import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { Room } from './domain/room.entity';
import { RoomRepository } from './infrastructure/database/room.repository';

// Commands
import { CreateRoomHandler } from './application/commands/impl/create-room.handler';
import { UpdateRoomHandler } from './application/commands/impl/update-room.handler';
import { DeleteRoomHandler } from './application/commands/impl/delete-room.handler';

// Queries
import { GetRoomByIdHandler } from './application/queries/impl/get-room-by-id.handler';
import { GetRoomsHandler } from './application/queries/impl/get-rooms.handler';
import { GetRoomsByDepartmentHandler } from './application/queries/impl/get-rooms-by-department.handler';

import { RoomController } from './room.controller';

const CommandHandlers = [
    CreateRoomHandler,
    UpdateRoomHandler,
    DeleteRoomHandler,
];

const QueryHandlers = [
    GetRoomByIdHandler,
    GetRoomsHandler,
    GetRoomsByDepartmentHandler,
];

@Module({
    imports: [
        TypeOrmModule.forFeature([Room]),
        CqrsModule,
    ],
    controllers: [RoomController],
    providers: [
        {
            provide: 'IRoomRepository',
            useClass: RoomRepository,
        },
        ...CommandHandlers,
        ...QueryHandlers,
    ],
    exports: [
        'IRoomRepository',
    ],
})
export class RoomModule { }
