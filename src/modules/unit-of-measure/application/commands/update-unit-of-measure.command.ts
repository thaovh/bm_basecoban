import { ICommand } from '@nestjs/cqrs';
import { UpdateUnitOfMeasureDto } from './dto/update-unit-of-measure.dto';

export class UpdateUnitOfMeasureCommand implements ICommand {
    constructor(
        public readonly id: string,
        public readonly updateUnitOfMeasureDto: UpdateUnitOfMeasureDto,
    ) { }
}
