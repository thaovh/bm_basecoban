import { CreateRoomDto } from './dto/create-room.dto';

export class CreateRoomCommand {
    constructor(public readonly createRoomDto: CreateRoomDto) { }
}
