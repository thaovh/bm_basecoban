import { CreateDepartmentTypeDto } from './dto/create-department-type.dto';

export class CreateDepartmentTypeCommand {
    constructor(public readonly createDepartmentTypeDto: CreateDepartmentTypeDto) { }
}
