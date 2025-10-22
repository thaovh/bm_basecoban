import { GetServiceRequestsDto } from '../../domain/service-request.dto';

export class GetServiceRequestsQuery {
    constructor(public readonly query: GetServiceRequestsDto) { }
}
