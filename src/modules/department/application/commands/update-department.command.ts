import { UpdateDepartmentDto } from './dto/update-department.dto';

export class UpdateDepartmentCommand {
    constructor(
        public readonly id: string,
        public readonly updateDepartmentDto: UpdateDepartmentDto
    ) { }
}
