import { GetProvincesDto } from './dto/get-provinces.dto';

export class GetProvincesQuery {
    constructor(public readonly getProvincesDto: GetProvincesDto) { }
}
