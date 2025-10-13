import { ICommand } from '@nestjs/cqrs';
import { CreateServiceDto } from './dto/create-service.dto';

export class CreateServiceCommand implements ICommand {
    constructor(public readonly createServiceDto: CreateServiceDto) { }
}
