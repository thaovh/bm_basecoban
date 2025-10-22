import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdatePatientCommand } from '../update-patient.command';
import { Patient } from '../../../domain/patient.entity';
import { IPatientRepository } from '../../../domain/patient.interface';

@CommandHandler(UpdatePatientCommand)
export class UpdatePatientHandler implements ICommandHandler<UpdatePatientCommand> {
    private readonly logger = new Logger(UpdatePatientHandler.name);

    constructor(
        @Inject('IPatientRepository')
        private readonly patientRepository: IPatientRepository,
    ) {}

    async execute(command: UpdatePatientCommand): Promise<Patient> {
        const { id, updatePatientDto } = command;
        this.logger.log(`Updating patient: ${id}`);

        // Find existing patient
        const existingPatient = await this.patientRepository.findById(id);
        if (!existingPatient) {
            throw new NotFoundException('Patient not found');
        }

        // Update fields
        if (updatePatientDto.patientName !== undefined) {
            existingPatient.patientName = updatePatientDto.patientName;
        }
        if (updatePatientDto.dateOfBirth !== undefined) {
            existingPatient.dateOfBirth = new Date(updatePatientDto.dateOfBirth);
        }
        if (updatePatientDto.cmndNumber !== undefined) {
            existingPatient.cmndNumber = updatePatientDto.cmndNumber;
        }
        if (updatePatientDto.cmndDate !== undefined) {
            existingPatient.cmndDate = updatePatientDto.cmndDate ? new Date(updatePatientDto.cmndDate) : undefined;
        }
        if (updatePatientDto.cmndPlace !== undefined) {
            existingPatient.cmndPlace = updatePatientDto.cmndPlace;
        }
        if (updatePatientDto.mobile !== undefined) {
            existingPatient.mobile = updatePatientDto.mobile;
        }
        if (updatePatientDto.phone !== undefined) {
            existingPatient.phone = updatePatientDto.phone;
        }
        if (updatePatientDto.provinceId !== undefined) {
            existingPatient.provinceId = updatePatientDto.provinceId;
        }
        if (updatePatientDto.wardId !== undefined) {
            existingPatient.wardId = updatePatientDto.wardId;
        }
        if (updatePatientDto.address !== undefined) {
            existingPatient.address = updatePatientDto.address;
        }
        if (updatePatientDto.genderId !== undefined) {
            existingPatient.genderId = updatePatientDto.genderId;
        }
        if (updatePatientDto.genderName !== undefined) {
            existingPatient.genderName = updatePatientDto.genderName;
        }
        if (updatePatientDto.careerName !== undefined) {
            existingPatient.careerName = updatePatientDto.careerName;
        }
        if (updatePatientDto.isActive !== undefined) {
            existingPatient.isActiveFlag = updatePatientDto.isActive ? 1 : 0;
        }

        existingPatient.updateAuditFields('system');

        const updatedPatient = await this.patientRepository.save(existingPatient);
        this.logger.log(`Patient updated successfully: ${updatedPatient.id}`);

        return updatedPatient;
    }
}
