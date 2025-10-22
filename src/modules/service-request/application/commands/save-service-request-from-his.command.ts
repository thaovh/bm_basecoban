import { HisServiceRequestData } from '../../domain/service-request-save.interface';

export class SaveServiceRequestFromHisCommand {
    constructor(public readonly hisData: HisServiceRequestData) {}
}
