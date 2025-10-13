import { ICommand } from '@nestjs/cqrs';

export class DeleteServiceCommand implements ICommand {
    constructor(public readonly id: string) { }
}
