import { SaveToLisDto } from '../../domain/save-to-lis.dto';

export class SaveToLisCommand {
    constructor(public readonly saveToLisDto: SaveToLisDto) { }
}
