import { SearchServiceRequestsDto } from '../../domain/service-request.dto';

export class SearchServiceRequestsQuery {
    constructor(public readonly query: SearchServiceRequestsDto) { }
}
