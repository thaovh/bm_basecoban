import { GetPatientsDto } from '../queries/dto/get-patients.dto';

export class GetPatientsQuery {
    constructor(public readonly query: GetPatientsDto) {}
}
