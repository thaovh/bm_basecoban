export class GetDepartmentsByBranchQuery {
    constructor(
        public readonly branchId: string,
        public readonly limit: number = 10,
        public readonly offset: number = 0
    ) { }
}
