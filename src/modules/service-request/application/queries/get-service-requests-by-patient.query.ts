import { GetServiceRequestsDto } from '../../domain/service-request.dto';

export class GetServiceRequestsByPatientQuery {
    constructor(
        public readonly patientId: number,
        public readonly query: GetServiceRequestsDto,
    ) { }
}
