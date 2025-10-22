import { SyncPatientFromHisDto } from '../commands/dto/sync-patient-from-his.dto';

export class SyncPatientFromHisCommand {
    constructor(public readonly syncDto: SyncPatientFromHisDto) {}
}
