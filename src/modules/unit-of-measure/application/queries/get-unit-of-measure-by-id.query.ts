import { IQuery } from '@nestjs/cqrs';

export class GetUnitOfMeasureByIdQuery implements IQuery {
    constructor(public readonly id: string) { }
}
