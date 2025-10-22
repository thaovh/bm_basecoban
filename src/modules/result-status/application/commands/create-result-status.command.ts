import { CreateResultStatusDto } from '../../domain/result-status.dto';

export class CreateResultStatusCommand {
    constructor(public readonly createResultStatusDto: CreateResultStatusDto) {}
}
