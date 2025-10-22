import { UpdateResultTrackingDto } from '../../domain/result-tracking.dto';

export class UpdateResultTrackingCommand {
    constructor(
        public readonly id: string,
        public readonly updateResultTrackingDto: UpdateResultTrackingDto
    ) { }
}
