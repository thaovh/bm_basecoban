import { GetSampleTypesDto } from './dto/get-sample-types.dto';

export class GetSampleTypesQuery {
    constructor(public readonly getSampleTypesDto: GetSampleTypesDto) { }
}
