import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateServiceRequestCommand } from '../update-service-request.command';
import { ServiceRequest } from '../../../domain/service-request.entity';
import { IServiceRequestRepository } from '../../../domain/service-request.interface';

@CommandHandler(UpdateServiceRequestCommand)
export class UpdateServiceRequestHandler implements ICommandHandler<UpdateServiceRequestCommand> {
    private readonly logger = new Logger(UpdateServiceRequestHandler.name);

    constructor(
        @Inject('IServiceRequestRepository')
        private readonly serviceRequestRepository: IServiceRequestRepository,
    ) { }

    async execute(command: UpdateServiceRequestCommand): Promise<ServiceRequest> {
        this.logger.log(`Updating service request with ID: ${command.id}`);

        try {
            // Find existing service request
            const existingServiceRequest = await this.serviceRequestRepository.findById(command.id);

            if (!existingServiceRequest) {
                throw new Error(`Service request with ID ${command.id} not found`);
            }

            // Update fields if provided
            if (command.updateServiceRequestDto.serviceReqSttId !== undefined) {
                existingServiceRequest.serviceReqSttId = command.updateServiceRequestDto.serviceReqSttId;
            }
            if (command.updateServiceRequestDto.serviceReqSttCode !== undefined) {
                existingServiceRequest.serviceReqSttCode = command.updateServiceRequestDto.serviceReqSttCode;
            }
            if (command.updateServiceRequestDto.instructionTime !== undefined) {
                existingServiceRequest.instructionTime = new Date(command.updateServiceRequestDto.instructionTime);
            }
            if (command.updateServiceRequestDto.instructionDate !== undefined) {
                existingServiceRequest.instructionDate = new Date(command.updateServiceRequestDto.instructionDate);
            }
            if (command.updateServiceRequestDto.icdCode !== undefined) {
                existingServiceRequest.icdCode = command.updateServiceRequestDto.icdCode;
            }
            if (command.updateServiceRequestDto.icdName !== undefined) {
                existingServiceRequest.icdName = command.updateServiceRequestDto.icdName;
            }
            if (command.updateServiceRequestDto.note !== undefined) {
                existingServiceRequest.note = command.updateServiceRequestDto.note;
            }
            if (command.updateServiceRequestDto.totalAmount !== undefined) {
                existingServiceRequest.totalAmount = command.updateServiceRequestDto.totalAmount;
            }
            if (command.updateServiceRequestDto.status !== undefined) {
                existingServiceRequest.status = command.updateServiceRequestDto.status;
            }
            if (command.updateServiceRequestDto.isActive !== undefined) {
                existingServiceRequest.isActiveFlag = command.updateServiceRequestDto.isActive ? 1 : 0;
            }

            const updatedServiceRequest = await this.serviceRequestRepository.save(existingServiceRequest);

            this.logger.log(`Service request updated successfully with ID: ${updatedServiceRequest.id}`);
            return updatedServiceRequest;

        } catch (error) {
            this.logger.error(`Error updating service request: ${error instanceof Error ? error.message : String(error)}`, error);
            throw error;
        }
    }
}
