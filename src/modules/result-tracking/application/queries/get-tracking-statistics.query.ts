export class GetTrackingStatisticsQuery {
    constructor(
        public readonly serviceRequestId?: string,
        public readonly roomId?: string,
        public readonly resultStatusId?: string
    ) { }
}
