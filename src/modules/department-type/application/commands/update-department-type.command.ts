import { UpdateDepartmentTypeDto } from './dto/update-department-type.dto';

export class UpdateDepartmentTypeCommand {
    constructor(
        public readonly id: string,
        public readonly updateDepartmentTypeDto: UpdateDepartmentTypeDto
    ) { }
}
