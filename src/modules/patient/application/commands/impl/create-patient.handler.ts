import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreatePatientCommand } from '../create-patient.command';
import { Patient } from '../../../domain/patient.entity';
import { IPatientRepository } from '../../../domain/patient.interface';

@CommandHandler(CreatePatientCommand)
export class CreatePatientHandler implements ICommandHandler<CreatePatientCommand> {
    private readonly logger = new Logger(CreatePatientHandler.name);

    constructor(
        @Inject('IPatientRepository')
        private readonly patientRepository: IPatientRepository,
    ) {}

    async execute(command: CreatePatientCommand): Promise<Patient> {
        const { createPatientDto } = command;
        this.logger.log(`Creating patient: ${createPatientDto.patientName}`);

        // Check if patient code already exists
        const existingByCode = await this.patientRepository.findByCode(createPatientDto.patientCode);
        if (existingByCode) {
            throw new ConflictException('Patient code already exists');
        }

        // Check if HIS ID already exists (if provided)
        if (createPatientDto.hisId) {
            const existingByHisId = await this.patientRepository.findByHisId(createPatientDto.hisId);
            if (existingByHisId) {
                throw new ConflictException('HIS Patient ID already exists');
            }
        }

        // Create new patient
        const patient = new Patient();
        patient.patientCode = createPatientDto.patientCode;
        patient.patientName = createPatientDto.patientName;
        patient.dateOfBirth = new Date(createPatientDto.dateOfBirth);
        patient.cmndNumber = createPatientDto.cmndNumber;
        patient.cmndDate = createPatientDto.cmndDate ? new Date(createPatientDto.cmndDate) : undefined;
        patient.cmndPlace = createPatientDto.cmndPlace;
        patient.mobile = createPatientDto.mobile;
        patient.phone = createPatientDto.phone;
        patient.provinceId = createPatientDto.provinceId;
        patient.wardId = createPatientDto.wardId;
        patient.address = createPatientDto.address;
        patient.genderId = createPatientDto.genderId;
        patient.genderName = createPatientDto.genderName;
        patient.careerName = createPatientDto.careerName;
        patient.hisId = createPatientDto.hisId;
        patient.isActiveFlag = createPatientDto.isActive !== false ? 1 : 0;
        patient.createdBy = 'system';

        const savedPatient = await this.patientRepository.save(patient);
        this.logger.log(`Patient created successfully: ${savedPatient.id}`);

        return savedPatient;
    }
}
