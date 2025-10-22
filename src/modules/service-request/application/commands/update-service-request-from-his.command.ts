import { HisServiceRequestData } from '../../domain/service-request-save.interface';

export class UpdateServiceRequestFromHisCommand {
    constructor(
        public readonly serviceRequestId: string,
        public readonly hisData: HisServiceRequestData
    ) {}
}
