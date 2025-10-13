import { IQuery } from '@nestjs/cqrs';

export class GetServicesByParentQuery implements IQuery {
    constructor(
        public readonly parentServiceId: string,
        public readonly limit: number = 10,
        public readonly offset: number = 0,
    ) { }
}
