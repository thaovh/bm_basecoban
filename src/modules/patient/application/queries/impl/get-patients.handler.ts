import { Injectable, Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetPatientsQuery } from '../get-patients.query';
import { Patient } from '../../../domain/patient.entity';
import { IPatientRepository } from '../../../domain/patient.interface';

export interface GetPatientsResult {
    patients: Patient[];
    total: number;
    limit: number;
    offset: number;
}

@QueryHandler(GetPatientsQuery)
export class GetPatientsHandler implements IQueryHandler<GetPatientsQuery> {
    private readonly logger = new Logger(GetPatientsHandler.name);

    constructor(
        @Inject('IPatientRepository')
        private readonly patientRepository: IPatientRepository,
    ) {}

    async execute(query: GetPatientsQuery): Promise<GetPatientsResult> {
        const { limit = 10, offset = 0, search, isActive } = query.query;
        this.logger.log(`Getting patients: limit=${limit}, offset=${offset}, search=${search}, isActive=${isActive}`);

        let patients: Patient[];
        let total: number;

        if (search) {
            // Search patients
            [patients, total] = await this.patientRepository.searchPatients(search, limit, offset);
        } else if (isActive !== undefined) {
            // Filter by active status
            if (isActive) {
                [patients, total] = await this.patientRepository.findActivePatients(limit, offset);
            } else {
                [patients, total] = await this.patientRepository.findAllPatients(limit, offset);
            }
        } else {
            // Get all patients
            [patients, total] = await this.patientRepository.findAllPatients(limit, offset);
        }

        this.logger.log(`Found ${patients.length} patients out of ${total} total`);

        return {
            patients,
            total,
            limit,
            offset,
        };
    }
}
