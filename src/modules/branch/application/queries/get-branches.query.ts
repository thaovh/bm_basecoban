import { GetBranchesDto } from './dto/get-branches.dto';

export class GetBranchesQuery {
    constructor(public readonly getBranchesDto: GetBranchesDto) { }
}
