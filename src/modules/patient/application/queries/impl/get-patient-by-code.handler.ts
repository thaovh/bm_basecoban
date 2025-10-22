import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetPatientByCodeQuery } from '../get-patient-by-code.query';
import { Patient } from '../../../domain/patient.entity';
import { IPatientRepository } from '../../../domain/patient.interface';

@QueryHandler(GetPatientByCodeQuery)
export class GetPatientByCodeHandler implements IQueryHandler<GetPatientByCodeQuery> {
    private readonly logger = new Logger(GetPatientByCodeHandler.name);

    constructor(
        @Inject('IPatientRepository')
        private readonly patientRepository: IPatientRepository,
    ) {}

    async execute(query: GetPatientByCodeQuery): Promise<Patient> {
        const { patientCode } = query;
        this.logger.log(`Getting patient by code: ${patientCode}`);

        const patient = await this.patientRepository.findByCode(patientCode);
        if (!patient) {
            throw new NotFoundException('Patient not found');
        }

        this.logger.log(`Patient found: ${patient.patientName}`);
        return patient;
    }
}
