import { GetRoomsDto } from './dto/get-rooms.dto';

export class GetRoomsQuery {
    constructor(public readonly getRoomsDto: GetRoomsDto) { }
}
