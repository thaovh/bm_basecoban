import { GetServiceRequestsDto } from '../../domain/service-request.dto';

export class GetServiceRequestsByTreatmentQuery {
    constructor(
        public readonly treatmentId: number,
        public readonly query: GetServiceRequestsDto,
    ) { }
}
