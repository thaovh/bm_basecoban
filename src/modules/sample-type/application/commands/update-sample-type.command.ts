import { UpdateSampleTypeDto } from './dto/update-sample-type.dto';

export class UpdateSampleTypeCommand {
    constructor(
        public readonly id: string,
        public readonly updateSampleTypeDto: UpdateSampleTypeDto
    ) { }
}
