import { HisServiceRequestData } from '../../domain/service-request-save.interface';

export class BulkSaveServiceRequestsFromHisCommand {
    constructor(public readonly hisDataList: HisServiceRequestData[]) {}
}
