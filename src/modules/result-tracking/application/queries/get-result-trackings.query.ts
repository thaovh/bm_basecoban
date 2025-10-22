import { GetResultTrackingsDto } from '../../domain/result-tracking.dto';

export class GetResultTrackingsQuery {
    constructor(public readonly query: GetResultTrackingsDto) { }
}
