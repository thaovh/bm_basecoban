import { CreateWardDto } from './dto/create-ward.dto';

export class CreateWardCommand {
    constructor(public readonly createWardDto: CreateWardDto) {}
}
