import { IQuery } from '@nestjs/cqrs';
import { GetServicesDto } from './dto/get-services.dto';

export class GetServicesQuery implements IQuery {
    constructor(public readonly getServicesDto: GetServicesDto) { }
}
