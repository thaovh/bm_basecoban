import { CreateProvinceDto } from './dto/create-province.dto';

export class CreateProvinceCommand {
    constructor(public readonly createProvinceDto: CreateProvinceDto) { }
}
