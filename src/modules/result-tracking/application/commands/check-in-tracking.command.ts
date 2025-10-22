import { CheckInTrackingDto } from '../../domain/result-tracking.dto';

export class CheckInTrackingCommand {
    constructor(public readonly checkInTrackingDto: CheckInTrackingDto) { }
}
