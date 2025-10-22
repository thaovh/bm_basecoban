import { UpdateServiceRequestDto } from '../../domain/service-request.dto';

export class UpdateServiceRequestCommand {
    constructor(
        public readonly id: string,
        public readonly updateServiceRequestDto: UpdateServiceRequestDto,
    ) { }
}
