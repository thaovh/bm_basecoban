import { Injectable, Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { SearchPatientsQuery } from '../search-patients.query';
import { Patient } from '../../../domain/patient.entity';
import { IPatientRepository } from '../../../domain/patient.interface';

export interface SearchPatientsResult {
    patients: Patient[];
    total: number;
    limit: number;
    offset: number;
    searchTerm: string;
}

@QueryHandler(SearchPatientsQuery)
export class SearchPatientsHandler implements IQueryHandler<SearchPatientsQuery> {
    private readonly logger = new Logger(SearchPatientsHandler.name);

    constructor(
        @Inject('IPatientRepository')
        private readonly patientRepository: IPatientRepository,
    ) {}

    async execute(query: SearchPatientsQuery): Promise<SearchPatientsResult> {
        const { searchTerm, limit = 10, offset = 0 } = query.query;
        this.logger.log(`Searching patients: "${searchTerm}", limit=${limit}, offset=${offset}`);

        const [patients, total] = await this.patientRepository.searchPatients(searchTerm, limit, offset);

        this.logger.log(`Found ${patients.length} patients matching "${searchTerm}" out of ${total} total`);

        return {
            patients,
            total,
            limit,
            offset,
            searchTerm,
        };
    }
}
