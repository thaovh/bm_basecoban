import { ICommand } from '@nestjs/cqrs';
import { CreateUnitOfMeasureDto } from './dto/create-unit-of-measure.dto';

export class CreateUnitOfMeasureCommand implements ICommand {
    constructor(public readonly createUnitOfMeasureDto: CreateUnitOfMeasureDto) { }
}
