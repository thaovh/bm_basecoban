import { CreateBranchDto } from './dto/create-branch.dto';

export class CreateBranchCommand {
    constructor(public readonly createBranchDto: CreateBranchDto) { }
}
