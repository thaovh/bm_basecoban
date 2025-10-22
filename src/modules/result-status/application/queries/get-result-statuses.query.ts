import { GetResultStatusesDto } from '../../domain/result-status.dto';

export class GetResultStatusesQuery {
    constructor(public readonly query: GetResultStatusesDto) {}
}
