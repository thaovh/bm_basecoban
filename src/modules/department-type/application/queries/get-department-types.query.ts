import { GetDepartmentTypesDto } from './dto/get-department-types.dto';

export class GetDepartmentTypesQuery {
    constructor(public readonly getDepartmentTypesDto: GetDepartmentTypesDto) { }
}
