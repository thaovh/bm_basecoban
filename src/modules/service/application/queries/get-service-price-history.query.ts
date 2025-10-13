import { IQuery } from '@nestjs/cqrs';

export class GetServicePriceHistoryQuery implements IQuery {
    constructor(public readonly serviceId: string) { }
}
