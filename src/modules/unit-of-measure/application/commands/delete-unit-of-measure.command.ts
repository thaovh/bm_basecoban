import { ICommand } from '@nestjs/cqrs';

export class DeleteUnitOfMeasureCommand implements ICommand {
    constructor(public readonly id: string) { }
}
