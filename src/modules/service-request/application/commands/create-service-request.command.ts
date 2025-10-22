import { CreateServiceRequestDto } from '../../domain/service-request.dto';

export class CreateServiceRequestCommand {
    constructor(public readonly createServiceRequestDto: CreateServiceRequestDto) { }
}
