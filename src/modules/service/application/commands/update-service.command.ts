import { ICommand } from '@nestjs/cqrs';
import { UpdateServiceDto } from './dto/update-service.dto';

export class UpdateServiceCommand implements ICommand {
    constructor(
        public readonly id: string,
        public readonly updateServiceDto: UpdateServiceDto,
    ) { }
}
