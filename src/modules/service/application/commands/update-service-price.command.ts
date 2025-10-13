import { ICommand } from '@nestjs/cqrs';
import { UpdatePriceDto } from './dto/update-price.dto';

export class UpdateServicePriceCommand implements ICommand {
    constructor(
        public readonly serviceId: string,
        public readonly updatePriceDto: UpdatePriceDto,
    ) { }
}
