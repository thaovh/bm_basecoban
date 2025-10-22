import { CheckOutTrackingDto } from '../../domain/result-tracking.dto';

export class CheckOutTrackingCommand {
    constructor(
        public readonly id: string,
        public readonly checkOutTrackingDto: CheckOutTrackingDto
    ) { }
}
