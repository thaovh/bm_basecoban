import { GetWardsDto } from './dto/get-wards.dto';

export class GetWardsQuery {
    constructor(public readonly getWardsDto: GetWardsDto) {}
}
