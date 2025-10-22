import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetPatientByHisIdQuery } from '../get-patient-by-his-id.query';
import { Patient } from '../../../domain/patient.entity';
import { IPatientRepository } from '../../../domain/patient.interface';

@QueryHandler(GetPatientByHisIdQuery)
export class GetPatientByHisIdHandler implements IQueryHandler<GetPatientByHisIdQuery> {
    private readonly logger = new Logger(GetPatientByHisIdHandler.name);

    constructor(
        @Inject('IPatientRepository')
        private readonly patientRepository: IPatientRepository,
    ) {}

    async execute(query: GetPatientByHisIdQuery): Promise<Patient> {
        const { hisId } = query;
        this.logger.log(`Getting patient by HIS ID: ${hisId}`);

        const patient = await this.patientRepository.findByHisId(hisId);
        if (!patient) {
            throw new NotFoundException('Patient not found');
        }

        this.logger.log(`Patient found: ${patient.patientName}`);
        return patient;
    }
}
