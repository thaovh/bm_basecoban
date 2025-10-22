import { CreateResultTrackingDto } from '../../domain/result-tracking.dto';

export class CreateResultTrackingCommand {
    constructor(public readonly createResultTrackingDto: CreateResultTrackingDto) { }
}
