import { IQuery } from '@nestjs/cqrs';

export class GetServicePriceAtDateQuery implements IQuery {
    constructor(
        public readonly serviceId: string,
        public readonly date: Date,
    ) { }
}
