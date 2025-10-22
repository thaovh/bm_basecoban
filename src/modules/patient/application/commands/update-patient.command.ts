import { UpdatePatientDto } from '../commands/dto/update-patient.dto';

export class UpdatePatientCommand {
    constructor(
        public readonly id: string,
        public readonly updatePatientDto: UpdatePatientDto,
    ) {}
}
