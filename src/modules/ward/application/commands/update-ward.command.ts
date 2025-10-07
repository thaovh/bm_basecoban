import { UpdateWardDto } from './dto/update-ward.dto';

export class UpdateWardCommand {
    constructor(
        public readonly id: string,
        public readonly updateWardDto: UpdateWardDto
    ) {}
}
