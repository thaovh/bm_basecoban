export class GetBranchesByProvinceQuery {
    constructor(
        public readonly provinceId: string,
        public readonly limit: number = 10,
        public readonly offset: number = 0
    ) { }
}
