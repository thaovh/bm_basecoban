import { UpdateProvinceDto } from './dto/update-province.dto';

export class UpdateProvinceCommand {
    constructor(
        public readonly id: string,
        public readonly updateProvinceDto: UpdateProvinceDto
    ) { }
}
