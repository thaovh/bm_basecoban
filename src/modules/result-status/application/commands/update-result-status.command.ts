import { UpdateResultStatusDto } from '../../domain/result-status.dto';

export class UpdateResultStatusCommand {
    constructor(
        public readonly id: string,
        public readonly updateResultStatusDto: UpdateResultStatusDto
    ) {}
}
