import { IQuery } from '@nestjs/cqrs';
import { GetUnitOfMeasuresDto } from './dto/get-unit-of-measures.dto';

export class GetUnitOfMeasuresQuery implements IQuery {
    constructor(public readonly getUnitOfMeasuresDto: GetUnitOfMeasuresDto) { }
}
