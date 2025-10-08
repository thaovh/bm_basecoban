import { UpdateBranchDto } from './dto/update-branch.dto';

export class UpdateBranchCommand {
    constructor(
        public readonly id: string,
        public readonly updateBranchDto: UpdateBranchDto
    ) { }
}
