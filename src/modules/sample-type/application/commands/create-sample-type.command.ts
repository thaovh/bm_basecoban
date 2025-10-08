import { CreateSampleTypeDto } from './dto/create-sample-type.dto';

export class CreateSampleTypeCommand {
    constructor(public readonly createSampleTypeDto: CreateSampleTypeDto) { }
}
