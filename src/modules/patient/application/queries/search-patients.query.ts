import { SearchPatientsDto } from '../queries/dto/search-patients.dto';

export class SearchPatientsQuery {
    constructor(public readonly query: SearchPatientsDto) {}
}
