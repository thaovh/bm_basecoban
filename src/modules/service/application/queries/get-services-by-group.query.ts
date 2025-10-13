import { IQuery } from '@nestjs/cqrs';

export class GetServicesByGroupQuery implements IQuery {
    constructor(
        public readonly serviceGroupId: string,
        public readonly limit: number = 10,
        public readonly offset: number = 0,
    ) { }
}
