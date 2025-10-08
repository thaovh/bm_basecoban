import { CreateDepartmentDto } from './dto/create-department.dto';

export class CreateDepartmentCommand {
    constructor(public readonly createDepartmentDto: CreateDepartmentDto) { }
}
