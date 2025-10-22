import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeletePatientCommand } from '../delete-patient.command';
import { IPatientRepository } from '../../../domain/patient.interface';

@CommandHandler(DeletePatientCommand)
export class DeletePatientHandler implements ICommandHandler<DeletePatientCommand> {
    private readonly logger = new Logger(DeletePatientHandler.name);

    constructor(
        @Inject('IPatientRepository')
        private readonly patientRepository: IPatientRepository,
    ) {}

    async execute(command: DeletePatientCommand): Promise<void> {
        const { id } = command;
        this.logger.log(`Deleting patient: ${id}`);

        // Check if patient exists
        const existingPatient = await this.patientRepository.findById(id);
        if (!existingPatient) {
            throw new NotFoundException('Patient not found');
        }

        // Soft delete
        await this.patientRepository.delete(id);
        this.logger.log(`Patient deleted successfully: ${id}`);
    }
}
