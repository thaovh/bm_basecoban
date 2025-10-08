import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException } from '@nestjs/common';

import { DeleteRoomCommand } from '../delete-room.command';
import { IRoomRepository } from '../../../domain/room.interface';

@CommandHandler(DeleteRoomCommand)
export class DeleteRoomHandler implements ICommandHandler<DeleteRoomCommand> {
    private readonly logger = new Logger(DeleteRoomHandler.name);

    constructor(
        @Inject('IRoomRepository')
        private readonly roomRepository: IRoomRepository,
    ) { }

    async execute(command: DeleteRoomCommand): Promise<void> {
        const { id } = command;
        this.logger.log(`Deleting room: ${id}`);

        // Check if room exists
        const existingRoom = await this.roomRepository.findById(id);
        if (!existingRoom) {
            throw new NotFoundException('Room not found');
        }

        // Soft delete the room
        await this.roomRepository.delete(id);
        this.logger.log(`Room deleted successfully: ${id}`);
    }
}
