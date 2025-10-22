import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { SyncServiceRequestFromHisCommand } from '../sync-service-request-from-his.command';
import { ServiceRequest } from '../../../domain/service-request.entity';
import { IServiceRequestRepository } from '../../../domain/service-request.interface';

@CommandHandler(SyncServiceRequestFromHisCommand)
export class SyncServiceRequestFromHisHandler implements ICommandHandler<SyncServiceRequestFromHisCommand> {
    private readonly logger = new Logger(SyncServiceRequestFromHisHandler.name);

    constructor(
        @Inject('IServiceRequestRepository')
        private readonly serviceRequestRepository: IServiceRequestRepository,
    ) { }

    async execute(command: SyncServiceRequestFromHisCommand): Promise<ServiceRequest> {
        this.logger.log(`Syncing service request from HIS with code: ${command.hisServiceRequestData.serviceReqCode}`);

        try {
            // Check if service request already exists
            let existingServiceRequest = await this.serviceRequestRepository.findByCode(
                command.hisServiceRequestData.serviceReqCode
            );

            if (existingServiceRequest) {
                this.logger.log(`Service request already exists, updating: ${existingServiceRequest.id}`);

                // Update existing service request with HIS data
                existingServiceRequest.serviceReqSttId = command.hisServiceRequestData.serviceReqSttId;
                existingServiceRequest.serviceReqSttCode = command.hisServiceRequestData.serviceReqSttCode;
                existingServiceRequest.serviceReqTypeId = command.hisServiceRequestData.serviceReqTypeId;
                existingServiceRequest.serviceReqTypeCode = command.hisServiceRequestData.serviceReqTypeCode;
                existingServiceRequest.instructionTime = new Date(command.hisServiceRequestData.instructionTime);
                existingServiceRequest.instructionDate = new Date(command.hisServiceRequestData.instructionDate);
                existingServiceRequest.icdCode = command.hisServiceRequestData.icdCode;
                existingServiceRequest.icdName = command.hisServiceRequestData.icdName;
                existingServiceRequest.icdSubCode = command.hisServiceRequestData.icdSubCode;
                existingServiceRequest.treatmentId = command.hisServiceRequestData.treatmentId;
                existingServiceRequest.treatmentCode = command.hisServiceRequestData.treatmentCode;
                existingServiceRequest.patientId = command.hisServiceRequestData.patientId;
                existingServiceRequest.patientCode = command.hisServiceRequestData.patientCode;
                existingServiceRequest.patientName = command.hisServiceRequestData.patientName;
                existingServiceRequest.patientDob = command.hisServiceRequestData.patientDob;
                existingServiceRequest.patientCmndNumber = command.hisServiceRequestData.patientCmndNumber;
                existingServiceRequest.patientCmndDate = command.hisServiceRequestData.patientCmndDate;
                existingServiceRequest.patientCmndPlace = command.hisServiceRequestData.patientCmndPlace;
                existingServiceRequest.patientMobile = command.hisServiceRequestData.patientMobile;
                existingServiceRequest.patientPhone = command.hisServiceRequestData.patientPhone;
                existingServiceRequest.patientProvinceCode = command.hisServiceRequestData.patientProvinceCode;
                existingServiceRequest.patientProvinceName = command.hisServiceRequestData.patientProvinceName;
                existingServiceRequest.patientCommuneCode = command.hisServiceRequestData.patientCommuneCode;
                existingServiceRequest.patientCommuneName = command.hisServiceRequestData.patientCommuneName;
                existingServiceRequest.patientAddress = command.hisServiceRequestData.patientAddress;
                existingServiceRequest.patientGenderId = command.hisServiceRequestData.patientGenderId;
                existingServiceRequest.patientGenderName = command.hisServiceRequestData.patientGenderName;
                existingServiceRequest.patientCareerName = command.hisServiceRequestData.patientCareerName;
                existingServiceRequest.lisPatientId = command.hisServiceRequestData.lisPatientId;
                existingServiceRequest.requestRoomId = command.hisServiceRequestData.requestRoomId;
                existingServiceRequest.requestRoomCode = command.hisServiceRequestData.requestRoomCode;
                existingServiceRequest.requestRoomName = command.hisServiceRequestData.requestRoomName;
                existingServiceRequest.requestDepartmentId = command.hisServiceRequestData.requestDepartmentId;
                existingServiceRequest.requestDepartmentCode = command.hisServiceRequestData.requestDepartmentCode;
                existingServiceRequest.requestDepartmentName = command.hisServiceRequestData.requestDepartmentName;
                existingServiceRequest.executeRoomId = command.hisServiceRequestData.executeRoomId;
                existingServiceRequest.executeRoomCode = command.hisServiceRequestData.executeRoomCode;
                existingServiceRequest.executeRoomName = command.hisServiceRequestData.executeRoomName;
                existingServiceRequest.executeDepartmentId = command.hisServiceRequestData.executeDepartmentId;
                existingServiceRequest.executeDepartmentCode = command.hisServiceRequestData.executeDepartmentCode;
                existingServiceRequest.executeDepartmentName = command.hisServiceRequestData.executeDepartmentName;
                existingServiceRequest.note = command.hisServiceRequestData.note;
                existingServiceRequest.totalAmount = command.hisServiceRequestData.totalAmount || 0;
                existingServiceRequest.status = command.hisServiceRequestData.status || 'PENDING';

                return await this.serviceRequestRepository.save(existingServiceRequest);
            } else {
                // Create new service request from HIS data
                const serviceRequest = new ServiceRequest();
                serviceRequest.hisServiceReqId = command.hisServiceRequestData.hisServiceReqId;
                serviceRequest.serviceReqCode = command.hisServiceRequestData.serviceReqCode;
                serviceRequest.serviceReqSttId = command.hisServiceRequestData.serviceReqSttId;
                serviceRequest.serviceReqSttCode = command.hisServiceRequestData.serviceReqSttCode;
                serviceRequest.serviceReqTypeId = command.hisServiceRequestData.serviceReqTypeId;
                serviceRequest.serviceReqTypeCode = command.hisServiceRequestData.serviceReqTypeCode;
                serviceRequest.instructionTime = new Date(command.hisServiceRequestData.instructionTime);
                serviceRequest.instructionDate = new Date(command.hisServiceRequestData.instructionDate);
                serviceRequest.icdCode = command.hisServiceRequestData.icdCode;
                serviceRequest.icdName = command.hisServiceRequestData.icdName;
                serviceRequest.icdSubCode = command.hisServiceRequestData.icdSubCode;
                serviceRequest.treatmentId = command.hisServiceRequestData.treatmentId;
                serviceRequest.treatmentCode = command.hisServiceRequestData.treatmentCode;
                serviceRequest.patientId = command.hisServiceRequestData.patientId;
                serviceRequest.patientCode = command.hisServiceRequestData.patientCode;
                serviceRequest.patientName = command.hisServiceRequestData.patientName;
                serviceRequest.patientDob = command.hisServiceRequestData.patientDob;
                serviceRequest.patientCmndNumber = command.hisServiceRequestData.patientCmndNumber;
                serviceRequest.patientCmndDate = command.hisServiceRequestData.patientCmndDate;
                serviceRequest.patientCmndPlace = command.hisServiceRequestData.patientCmndPlace;
                serviceRequest.patientMobile = command.hisServiceRequestData.patientMobile;
                serviceRequest.patientPhone = command.hisServiceRequestData.patientPhone;
                serviceRequest.patientProvinceCode = command.hisServiceRequestData.patientProvinceCode;
                serviceRequest.patientProvinceName = command.hisServiceRequestData.patientProvinceName;
                serviceRequest.patientCommuneCode = command.hisServiceRequestData.patientCommuneCode;
                serviceRequest.patientCommuneName = command.hisServiceRequestData.patientCommuneName;
                serviceRequest.patientAddress = command.hisServiceRequestData.patientAddress;
                serviceRequest.patientGenderId = command.hisServiceRequestData.patientGenderId;
                serviceRequest.patientGenderName = command.hisServiceRequestData.patientGenderName;
                serviceRequest.patientCareerName = command.hisServiceRequestData.patientCareerName;
                serviceRequest.lisPatientId = command.hisServiceRequestData.lisPatientId;
                serviceRequest.requestRoomId = command.hisServiceRequestData.requestRoomId;
                serviceRequest.requestRoomCode = command.hisServiceRequestData.requestRoomCode;
                serviceRequest.requestRoomName = command.hisServiceRequestData.requestRoomName;
                serviceRequest.requestDepartmentId = command.hisServiceRequestData.requestDepartmentId;
                serviceRequest.requestDepartmentCode = command.hisServiceRequestData.requestDepartmentCode;
                serviceRequest.requestDepartmentName = command.hisServiceRequestData.requestDepartmentName;
                serviceRequest.executeRoomId = command.hisServiceRequestData.executeRoomId;
                serviceRequest.executeRoomCode = command.hisServiceRequestData.executeRoomCode;
                serviceRequest.executeRoomName = command.hisServiceRequestData.executeRoomName;
                serviceRequest.executeDepartmentId = command.hisServiceRequestData.executeDepartmentId;
                serviceRequest.executeDepartmentCode = command.hisServiceRequestData.executeDepartmentCode;
                serviceRequest.executeDepartmentName = command.hisServiceRequestData.executeDepartmentName;
                serviceRequest.note = command.hisServiceRequestData.note;
                serviceRequest.totalAmount = command.hisServiceRequestData.totalAmount || 0;
                serviceRequest.status = command.hisServiceRequestData.status || 'PENDING';
                serviceRequest.isActiveFlag = 1;

                const savedServiceRequest = await this.serviceRequestRepository.save(serviceRequest);

                this.logger.log(`Service request synced from HIS successfully with ID: ${savedServiceRequest.id}`);
                return savedServiceRequest;
            }

        } catch (error) {
            this.logger.error(`Error syncing service request from HIS: ${error instanceof Error ? error.message : String(error)}`, error);
            throw error;
        }
    }
}
