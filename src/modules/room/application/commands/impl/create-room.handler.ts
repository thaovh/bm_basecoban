import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, ConflictException } from '@nestjs/common';

import { CreateRoomCommand } from '../create-room.command';
import { Room } from '../../../domain/room.entity';
import { IRoomRepository } from '../../../domain/room.interface';

@CommandHandler(CreateRoomCommand)
export class CreateRoomHandler implements ICommandHandler<CreateRoomCommand> {
    private readonly logger = new Logger(CreateRoomHandler.name);

    constructor(
        @Inject('IRoomRepository')
        private readonly roomRepository: IRoomRepository,
    ) { }

    async execute(command: CreateRoomCommand): Promise<Room> {
        const { createRoomDto } = command;
        this.logger.log(`Creating room: ${createRoomDto.roomCode}`);

        // Check if room code already exists
        const existingByCode = await this.roomRepository.findByCode(createRoomDto.roomCode);
        if (existingByCode) {
            throw new ConflictException('Room code already exists');
        }

        // Check if room name already exists
        const existingByName = await this.roomRepository.findByName(createRoomDto.roomName);
        if (existingByName) {
            throw new ConflictException('Room name already exists');
        }

        // Create new room
        const room = new Room();
        room.roomCode = createRoomDto.roomCode;
        room.roomName = createRoomDto.roomName;
        room.roomAddress = createRoomDto.roomAddress;
        room.departmentId = createRoomDto.departmentId;
        room.description = createRoomDto.description;
        room.isActiveFlag = createRoomDto.isActive ? 1 : 1; // Default to active
        room.createdBy = 'system';

        const savedRoom = await this.roomRepository.save(room);
        this.logger.log(`Room created successfully: ${savedRoom.id}`);

        return savedRoom;
    }
}
