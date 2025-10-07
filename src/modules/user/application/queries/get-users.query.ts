import { GetUsersDto } from './dto/get-users.dto';

export class GetUsersQuery {
    constructor(public readonly getUsersDto: GetUsersDto) { }
}
