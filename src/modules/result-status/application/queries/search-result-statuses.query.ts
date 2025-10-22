import { SearchResultStatusesDto } from '../../domain/result-status.dto';

export class SearchResultStatusesQuery {
    constructor(public readonly query: SearchResultStatusesDto) {}
}
