import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetPatientByIdQuery } from '../get-patient-by-id.query';
import { Patient } from '../../../domain/patient.entity';
import { IPatientRepository } from '../../../domain/patient.interface';

@QueryHandler(GetPatientByIdQuery)
export class GetPatientByIdHandler implements IQueryHandler<GetPatientByIdQuery> {
    private readonly logger = new Logger(GetPatientByIdHandler.name);

    constructor(
        @Inject('IPatientRepository')
        private readonly patientRepository: IPatientRepository,
    ) {}

    async execute(query: GetPatientByIdQuery): Promise<Patient> {
        const { id } = query;
        this.logger.log(`Getting patient by ID: ${id}`);

        const patient = await this.patientRepository.findById(id);
        if (!patient) {
            throw new NotFoundException('Patient not found');
        }

        this.logger.log(`Patient found: ${patient.patientName}`);
        return patient;
    }
}
