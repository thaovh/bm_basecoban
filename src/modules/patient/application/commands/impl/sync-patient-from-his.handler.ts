import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { SyncPatientFromHisCommand } from '../sync-patient-from-his.command';
import { Patient } from '../../../domain/patient.entity';
import { IPatientRepository } from '../../../domain/patient.interface';

@CommandHandler(SyncPatientFromHisCommand)
export class SyncPatientFromHisHandler implements ICommandHandler<SyncPatientFromHisCommand> {
    private readonly logger = new Logger(SyncPatientFromHisHandler.name);

    constructor(
        @Inject('IPatientRepository')
        private readonly patientRepository: IPatientRepository,
    ) {}

    async execute(command: SyncPatientFromHisCommand): Promise<Patient> {
        const { syncDto } = command;
        this.logger.log(`Syncing patient from HIS: ${syncDto.hisId}`);

        // Check if patient already exists by HIS ID
        let existingPatient = await this.patientRepository.findByHisId(syncDto.hisId);
        
        if (existingPatient) {
            // Update existing patient
            this.logger.log(`Updating existing patient: ${existingPatient.id}`);
            existingPatient.patientCode = syncDto.patientCode;
            existingPatient.patientName = syncDto.patientName;
            existingPatient.dateOfBirth = new Date(syncDto.dateOfBirth);
            existingPatient.cmndNumber = syncDto.cmndNumber;
            existingPatient.cmndDate = syncDto.cmndDate ? new Date(syncDto.cmndDate) : undefined;
            existingPatient.cmndPlace = syncDto.cmndPlace;
            existingPatient.mobile = syncDto.mobile;
            existingPatient.phone = syncDto.phone;
            existingPatient.provinceId = syncDto.provinceId;
            existingPatient.wardId = syncDto.wardId;
            existingPatient.address = syncDto.address;
            existingPatient.genderId = syncDto.genderId;
            existingPatient.genderName = syncDto.genderName;
            existingPatient.careerName = syncDto.careerName;
            existingPatient.updateAuditFields('his-sync');

            const updatedPatient = await this.patientRepository.save(existingPatient);
            this.logger.log(`Patient updated from HIS: ${updatedPatient.id}`);
            return updatedPatient;
        } else {
            // Create new patient
            this.logger.log(`Creating new patient from HIS: ${syncDto.hisId}`);
            const patient = new Patient();
            patient.patientCode = syncDto.patientCode;
            patient.patientName = syncDto.patientName;
            patient.dateOfBirth = new Date(syncDto.dateOfBirth);
            patient.cmndNumber = syncDto.cmndNumber;
            patient.cmndDate = syncDto.cmndDate ? new Date(syncDto.cmndDate) : undefined;
            patient.cmndPlace = syncDto.cmndPlace;
            patient.mobile = syncDto.mobile;
            patient.phone = syncDto.phone;
            patient.provinceId = syncDto.provinceId;
            patient.wardId = syncDto.wardId;
            patient.address = syncDto.address;
            patient.genderId = syncDto.genderId;
            patient.genderName = syncDto.genderName;
            patient.careerName = syncDto.careerName;
            patient.hisId = syncDto.hisId;
            patient.isActiveFlag = 1;
            patient.createdBy = 'his-sync';

            const savedPatient = await this.patientRepository.save(patient);
            this.logger.log(`Patient created from HIS: ${savedPatient.id}`);
            return savedPatient;
        }
    }
}
