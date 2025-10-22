import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateServiceRequestCommand } from '../create-service-request.command';
import { ServiceRequest } from '../../../domain/service-request.entity';
import { IServiceRequestRepository } from '../../../domain/service-request.interface';

@CommandHandler(CreateServiceRequestCommand)
export class CreateServiceRequestHandler implements ICommandHandler<CreateServiceRequestCommand> {
    private readonly logger = new Logger(CreateServiceRequestHandler.name);

    constructor(
        @Inject('IServiceRequestRepository')
        private readonly serviceRequestRepository: IServiceRequestRepository,
    ) { }

    async execute(command: CreateServiceRequestCommand): Promise<ServiceRequest> {
        this.logger.log(`Creating service request with code: ${command.createServiceRequestDto.serviceReqCode}`);

        try {
            // Check if service request already exists
            const existingServiceRequest = await this.serviceRequestRepository.findByCode(
                command.createServiceRequestDto.serviceReqCode
            );

            if (existingServiceRequest) {
                throw new Error(`Service request with code ${command.createServiceRequestDto.serviceReqCode} already exists`);
            }

            // Create new service request
            const serviceRequest = new ServiceRequest();
            serviceRequest.serviceReqCode = command.createServiceRequestDto.serviceReqCode;
            serviceRequest.serviceReqSttId = command.createServiceRequestDto.serviceReqSttId;
            serviceRequest.serviceReqSttCode = command.createServiceRequestDto.serviceReqSttCode;
            serviceRequest.serviceReqTypeId = command.createServiceRequestDto.serviceReqTypeId;
            serviceRequest.serviceReqTypeCode = command.createServiceRequestDto.serviceReqTypeCode;
            serviceRequest.instructionTime = new Date(command.createServiceRequestDto.instructionTime);
            serviceRequest.instructionDate = new Date(command.createServiceRequestDto.instructionDate);
            serviceRequest.icdCode = command.createServiceRequestDto.icdCode;
            serviceRequest.icdName = command.createServiceRequestDto.icdName;
            serviceRequest.icdSubCode = command.createServiceRequestDto.icdSubCode;
            serviceRequest.treatmentId = command.createServiceRequestDto.treatmentId;
            serviceRequest.treatmentCode = command.createServiceRequestDto.treatmentCode;
            serviceRequest.patientId = command.createServiceRequestDto.patientId;
            serviceRequest.patientCode = command.createServiceRequestDto.patientCode;
            serviceRequest.patientName = command.createServiceRequestDto.patientName;
            serviceRequest.patientDob = command.createServiceRequestDto.patientDob;
            serviceRequest.patientCmndNumber = command.createServiceRequestDto.patientCmndNumber;
            serviceRequest.patientCmndDate = command.createServiceRequestDto.patientCmndDate;
            serviceRequest.patientCmndPlace = command.createServiceRequestDto.patientCmndPlace;
            serviceRequest.patientMobile = command.createServiceRequestDto.patientMobile;
            serviceRequest.patientPhone = command.createServiceRequestDto.patientPhone;
            serviceRequest.patientProvinceCode = command.createServiceRequestDto.patientProvinceCode;
            serviceRequest.patientProvinceName = command.createServiceRequestDto.patientProvinceName;
            serviceRequest.patientCommuneCode = command.createServiceRequestDto.patientCommuneCode;
            serviceRequest.patientCommuneName = command.createServiceRequestDto.patientCommuneName;
            serviceRequest.patientAddress = command.createServiceRequestDto.patientAddress;
            serviceRequest.patientGenderId = command.createServiceRequestDto.patientGenderId;
            serviceRequest.patientGenderName = command.createServiceRequestDto.patientGenderName;
            serviceRequest.patientCareerName = command.createServiceRequestDto.patientCareerName;
            serviceRequest.lisPatientId = command.createServiceRequestDto.lisPatientId;
            serviceRequest.requestRoomId = command.createServiceRequestDto.requestRoomId;
            serviceRequest.requestRoomCode = command.createServiceRequestDto.requestRoomCode;
            serviceRequest.requestRoomName = command.createServiceRequestDto.requestRoomName;
            serviceRequest.requestDepartmentId = command.createServiceRequestDto.requestDepartmentId;
            serviceRequest.requestDepartmentCode = command.createServiceRequestDto.requestDepartmentCode;
            serviceRequest.requestDepartmentName = command.createServiceRequestDto.requestDepartmentName;
            serviceRequest.executeRoomId = command.createServiceRequestDto.executeRoomId;
            serviceRequest.executeRoomCode = command.createServiceRequestDto.executeRoomCode;
            serviceRequest.executeRoomName = command.createServiceRequestDto.executeRoomName;
            serviceRequest.executeDepartmentId = command.createServiceRequestDto.executeDepartmentId;
            serviceRequest.executeDepartmentCode = command.createServiceRequestDto.executeDepartmentCode;
            serviceRequest.executeDepartmentName = command.createServiceRequestDto.executeDepartmentName;
            serviceRequest.note = command.createServiceRequestDto.note;
            serviceRequest.totalAmount = command.createServiceRequestDto.totalAmount || 0;
            serviceRequest.status = command.createServiceRequestDto.status || 'PENDING';
            serviceRequest.isActiveFlag = command.createServiceRequestDto.isActive !== false ? 1 : 0;

            const savedServiceRequest = await this.serviceRequestRepository.save(serviceRequest);

            this.logger.log(`Service request created successfully with ID: ${savedServiceRequest.id}`);
            return savedServiceRequest;

        } catch (error) {
            this.logger.error(`Error creating service request: ${error instanceof Error ? error.message : String(error)}`, error);
            throw error;
        }
    }
}
