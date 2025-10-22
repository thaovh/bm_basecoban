import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like } from 'typeorm';
import { Patient } from '../../domain/patient.entity';
import { IPatientRepository } from '../../domain/patient.interface';

@Injectable()
export class PatientRepository implements IPatientRepository {
    constructor(
        @InjectRepository(Patient)
        private readonly patientRepository: Repository<Patient>,
    ) {}

    async findById(id: string): Promise<Patient | null> {
        return this.patientRepository.findOne({
            where: { id, deletedAt: IsNull() },
            relations: ['province', 'ward'],
        });
    }

    async findByCode(patientCode: string): Promise<Patient | null> {
        return this.patientRepository.findOne({
            where: { patientCode, deletedAt: IsNull() },
            relations: ['province', 'ward'],
        });
    }

    async findByHisId(hisId: number): Promise<Patient | null> {
        return this.patientRepository.findOne({
            where: { hisId, deletedAt: IsNull() },
            relations: ['province', 'ward'],
        });
    }

    async save(patient: Patient): Promise<Patient> {
        return this.patientRepository.save(patient);
    }

    async delete(id: string): Promise<void> {
        await this.patientRepository.softDelete(id);
    }

    async findActivePatients(limit: number, offset: number): Promise<[Patient[], number]> {
        return this.patientRepository.findAndCount({
            where: { isActiveFlag: 1, deletedAt: IsNull() },
            relations: ['province', 'ward'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async findAllPatients(limit: number, offset: number): Promise<[Patient[], number]> {
        return this.patientRepository.findAndCount({
            where: { deletedAt: IsNull() },
            relations: ['province', 'ward'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }

    async searchPatients(searchTerm: string, limit: number, offset: number): Promise<[Patient[], number]> {
        return this.patientRepository.findAndCount({
            where: [
                { patientName: Like(`%${searchTerm}%`), deletedAt: IsNull() },
                { patientCode: Like(`%${searchTerm}%`), deletedAt: IsNull() },
                { cmndNumber: Like(`%${searchTerm}%`), deletedAt: IsNull() },
                { mobile: Like(`%${searchTerm}%`), deletedAt: IsNull() },
            ],
            relations: ['province', 'ward'],
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
    }
}
