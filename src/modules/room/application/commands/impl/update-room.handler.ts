import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException, ConflictException } from '@nestjs/common';

import { UpdateRoomCommand } from '../update-room.command';
import { Room } from '../../../domain/room.entity';
import { IRoomRepository } from '../../../domain/room.interface';

@CommandHandler(UpdateRoomCommand)
export class UpdateRoomHandler implements ICommandHandler<UpdateRoomCommand> {
    private readonly logger = new Logger(UpdateRoomHandler.name);

    constructor(
        @Inject('IRoomRepository')
        private readonly roomRepository: IRoomRepository,
    ) { }

    async execute(command: UpdateRoomCommand): Promise<Room> {
        const { id, updateRoomDto } = command;
        this.logger.log(`Updating room: ${id}`);

        // Find existing room
        const existingRoom = await this.roomRepository.findById(id);
        if (!existingRoom) {
            throw new NotFoundException('Room not found');
        }

        // Check if room code already exists (if being updated)
        if (updateRoomDto.roomCode && updateRoomDto.roomCode !== existingRoom.roomCode) {
            const existingByCode = await this.roomRepository.findByCode(updateRoomDto.roomCode);
            if (existingByCode) {
                throw new ConflictException('Room code already exists');
            }
        }

        // Check if room name already exists (if being updated)
        if (updateRoomDto.roomName && updateRoomDto.roomName !== existingRoom.roomName) {
            const existingByName = await this.roomRepository.findByName(updateRoomDto.roomName);
            if (existingByName) {
                throw new ConflictException('Room name already exists');
            }
        }

        // Update room fields
        if (updateRoomDto.roomCode) {
            existingRoom.roomCode = updateRoomDto.roomCode;
        }
        if (updateRoomDto.roomName) {
            existingRoom.roomName = updateRoomDto.roomName;
        }
        if (updateRoomDto.roomAddress) {
            existingRoom.roomAddress = updateRoomDto.roomAddress;
        }
        if (updateRoomDto.departmentId) {
            existingRoom.departmentId = updateRoomDto.departmentId;
        }
        if (updateRoomDto.description !== undefined) {
            existingRoom.description = updateRoomDto.description;
        }
        if (updateRoomDto.isActive !== undefined) {
            existingRoom.isActiveFlag = updateRoomDto.isActive ? 1 : 0;
        }
        existingRoom.updatedBy = 'system';

        const updatedRoom = await this.roomRepository.save(existingRoom);
        this.logger.log(`Room updated successfully: ${updatedRoom.id}`);

        return updatedRoom;
    }
}
