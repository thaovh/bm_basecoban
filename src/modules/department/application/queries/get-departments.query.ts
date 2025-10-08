import { GetDepartmentsDto } from './dto/get-departments.dto';

export class GetDepartmentsQuery {
    constructor(public readonly getDepartmentsDto: GetDepartmentsDto) { }
}
