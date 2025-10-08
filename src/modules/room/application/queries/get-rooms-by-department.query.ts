export class GetRoomsByDepartmentQuery {
    constructor(
        public readonly departmentId: string,
        public readonly limit: number = 10,
        public readonly offset: number = 0
    ) { }
}
