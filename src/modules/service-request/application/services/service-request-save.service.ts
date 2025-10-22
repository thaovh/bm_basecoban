import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
    IServiceRequestSaveService,
    HisServiceRequestData,
    ServiceRequestSaveResult,
    BulkSaveServiceRequestResult
} from '../../domain/service-request-save.interface';
import { ServiceRequest } from '../../domain/service-request.entity';
import { ServiceRequestItem } from '../../domain/service-request-item.entity';
import { ServiceRequestItemTest } from '../../domain/service-request-item-test.entity';
import { IServiceRequestRepository } from '../../domain/service-request.interface';
import { IServiceRequestItemRepository } from '../../domain/service-request.interface';

@Injectable()
export class ServiceRequestSaveService implements IServiceRequestSaveService {
    private readonly logger = new Logger(ServiceRequestSaveService.name);

    constructor(
        @Inject('IServiceRequestRepository')
        private readonly serviceRequestRepository: IServiceRequestRepository,
        @Inject('IServiceRequestItemRepository')
        private readonly serviceRequestItemRepository: IServiceRequestItemRepository,
        private readonly dataSource: DataSource,
    ) { }

    async saveServiceRequestFromHis(hisData: HisServiceRequestData): Promise<ServiceRequestSaveResult> {
        this.logger.log(`Saving ServiceRequest from HIS data: ${hisData.serviceReqCode}`);

        try {
            // Check if ServiceRequest already exists
            const existingSR = await this.serviceRequestRepository.findByCode(hisData.serviceReqCode);

            if (existingSR) {
                this.logger.log(`ServiceRequest already exists, updating: ${hisData.serviceReqCode}`);
                return await this.updateServiceRequestFromHis(existingSR.id, hisData);
            } else {
                this.logger.log(`Creating new ServiceRequest: ${hisData.serviceReqCode}`);
                return await this.createServiceRequestFromHis(hisData);
            }
        } catch (error) {
            this.logger.error(`Error saving ServiceRequest from HIS: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async saveServiceRequestFromLis(createDto: any): Promise<ServiceRequestSaveResult> {
        this.logger.log(`Saving ServiceRequest from LIS form data`);

        try {
            // Convert LIS form data to HIS format
            const hisData = this.convertLisToHisFormat(createDto);
            return await this.createServiceRequestFromHis(hisData);
        } catch (error) {
            this.logger.error(`Error saving ServiceRequest from LIS: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }

    async bulkSaveServiceRequestsFromHis(hisDataList: HisServiceRequestData[]): Promise<BulkSaveServiceRequestResult> {
        this.logger.log(`Bulk saving ${hisDataList.length} ServiceRequests from HIS`);

        const result: BulkSaveServiceRequestResult = {
            totalProcessed: hisDataList.length,
            successful: 0,
            failed: 0,
            results: [],
            errors: []
        };

        for (const hisData of hisDataList) {
            try {
                const saveResult = await this.saveServiceRequestFromHis(hisData);
                result.results.push(saveResult);
                result.successful++;
            } catch (error) {
                result.failed++;
                result.errors.push({
                    serviceReqCode: hisData.serviceReqCode,
                    error: error instanceof Error ? error.message : String(error)
                });
                this.logger.error(`Failed to save ServiceRequest ${hisData.serviceReqCode}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }

        this.logger.log(`Bulk save completed: ${result.successful} successful, ${result.failed} failed`);
        return result;
    }

    async updateServiceRequestFromHis(serviceRequestId: string, hisData: HisServiceRequestData): Promise<ServiceRequestSaveResult> {
        this.logger.log(`Updating ServiceRequest: ${serviceRequestId}`);

        return await this.dataSource.transaction(async (manager) => {
            // Update ServiceRequest
            const serviceRequest = await manager.findOne(ServiceRequest, {
                where: { id: serviceRequestId }
            });

            if (!serviceRequest) {
                throw new Error(`ServiceRequest not found: ${serviceRequestId}`);
            }

            // Update ServiceRequest fields
            this.updateServiceRequestFields(serviceRequest, hisData);
            const updatedServiceRequest = await manager.save(ServiceRequest, serviceRequest);

            // Delete existing items and tests
            await manager.delete(ServiceRequestItemTest, { serviceRequestItemId: serviceRequestId });
            await manager.delete(ServiceRequestItem, { serviceRequestId });

            // Create new items and tests
            const { serviceRequestItems, serviceRequestItemTests } = await this.createServiceRequestItems(
                manager, updatedServiceRequest.id, hisData.lisServices
            );

            return {
                serviceRequest: updatedServiceRequest,
                serviceRequestItems,
                serviceRequestItemTests,
                isNew: false,
                hisMapping: {
                    hisServiceReqId: hisData.hisServiceReqId,
                    lisServiceRequestId: updatedServiceRequest.id
                }
            };
        });
    }

    private async createServiceRequestFromHis(hisData: HisServiceRequestData): Promise<ServiceRequestSaveResult> {
        return await this.dataSource.transaction(async (manager) => {
            // Create ServiceRequest
            const serviceRequest = new ServiceRequest();
            this.mapHisDataToServiceRequest(serviceRequest, hisData);
            const savedServiceRequest = await manager.save(ServiceRequest, serviceRequest);

            // Create ServiceRequestItems and Tests
            const { serviceRequestItems, serviceRequestItemTests } = await this.createServiceRequestItems(
                manager, savedServiceRequest.id, hisData.lisServices
            );

            return {
                serviceRequest: savedServiceRequest,
                serviceRequestItems,
                serviceRequestItemTests,
                isNew: true,
                hisMapping: {
                    hisServiceReqId: hisData.hisServiceReqId,
                    lisServiceRequestId: savedServiceRequest.id
                }
            };
        });
    }

    private async createServiceRequestItems(
        manager: any,
        serviceRequestId: string,
        lisServices: any[]
    ): Promise<{ serviceRequestItems: ServiceRequestItem[], serviceRequestItemTests: ServiceRequestItemTest[] }> {
        const serviceRequestItems: ServiceRequestItem[] = [];
        const serviceRequestItemTests: ServiceRequestItemTest[] = [];

        // Check if lisServices exists and is an array
        if (!lisServices || !Array.isArray(lisServices)) {
            this.logger.warn('No lisServices provided or lisServices is not an array');
            return { serviceRequestItems, serviceRequestItemTests };
        }

        for (let i = 0; i < lisServices.length; i++) {
            const lisService = lisServices[i];

            // Create ServiceRequestItem
            const serviceRequestItem = new ServiceRequestItem();
            serviceRequestItem.id = uuidv4();
            serviceRequestItem.serviceRequestId = serviceRequestId;
            serviceRequestItem.hisSereServId = lisService.hisSereServId;
            serviceRequestItem.hisServiceId = lisService.hisServiceId;
            serviceRequestItem.hisServiceCode = lisService.hisServiceCode;
            serviceRequestItem.hisServiceName = lisService.hisServiceName;
            serviceRequestItem.hisPrice = lisService.hisPrice;
            serviceRequestItem.lisServiceId = lisService.lisServiceId;
            serviceRequestItem.lisServiceCode = lisService.lisServiceCode;
            serviceRequestItem.lisServiceName = lisService.lisServiceName;
            serviceRequestItem.lisShortName = lisService.lisShortName;
            serviceRequestItem.lisCurrentPrice = lisService.lisCurrentPrice;
            serviceRequestItem.serviceGroupId = lisService.serviceGroupId;
            serviceRequestItem.serviceGroupName = lisService.serviceGroupName;
            serviceRequestItem.unitOfMeasureId = lisService.unitOfMeasureId;
            serviceRequestItem.unitOfMeasureName = lisService.unitOfMeasureName;
            serviceRequestItem.quantity = lisService.quantity || 1;
            serviceRequestItem.unitPrice = lisService.unitPrice || lisService.hisPrice;
            serviceRequestItem.totalPrice = lisService.totalPrice || (serviceRequestItem.quantity * serviceRequestItem.unitPrice);
            serviceRequestItem.status = lisService.status || 'PENDING';
            serviceRequestItem.itemOrder = lisService.itemOrder || (i + 1);
            serviceRequestItem.isActiveFlag = 1;

            const savedItem = await manager.save(ServiceRequestItem, serviceRequestItem);
            serviceRequestItems.push(savedItem);

            // Create ServiceRequestItemTests
            if (lisService.serviceTests && lisService.serviceTests.length > 0) {
                for (let j = 0; j < lisService.serviceTests.length; j++) {
                    const test = lisService.serviceTests[j];

                    const serviceRequestItemTest = new ServiceRequestItemTest();
                    serviceRequestItemTest.id = uuidv4();
                    serviceRequestItemTest.serviceRequestItemId = savedItem.id;
                    serviceRequestItemTest.serviceTestId = test.serviceTestId || uuidv4();
                    serviceRequestItemTest.testCode = test.testCode;
                    serviceRequestItemTest.testName = test.testName;
                    serviceRequestItemTest.shortName = test.shortName;
                    serviceRequestItemTest.testOrder = test.testOrder || (j + 1);
                    serviceRequestItemTest.isActiveFlag = 1;

                    const savedTest = await manager.save(ServiceRequestItemTest, serviceRequestItemTest);
                    serviceRequestItemTests.push(savedTest);
                }
            }
        }

        return { serviceRequestItems, serviceRequestItemTests };
    }

    private mapHisDataToServiceRequest(serviceRequest: ServiceRequest, hisData: HisServiceRequestData): void {
        serviceRequest.id = uuidv4();
        serviceRequest.hisServiceReqId = hisData.hisServiceReqId;
        serviceRequest.serviceReqCode = hisData.serviceReqCode;
        serviceRequest.serviceReqSttId = hisData.serviceReqSttId;
        serviceRequest.serviceReqSttCode = hisData.serviceReqSttCode;
        serviceRequest.serviceReqTypeId = hisData.serviceReqTypeId;
        serviceRequest.serviceReqTypeCode = hisData.serviceReqTypeCode;
        serviceRequest.instructionTime = new Date(hisData.instructionTime);
        serviceRequest.instructionDate = new Date(hisData.instructionDate);
        serviceRequest.icdCode = hisData.icdCode;
        serviceRequest.icdName = hisData.icdName;
        serviceRequest.icdSubCode = hisData.icdSubCode;
        serviceRequest.icdText = hisData.icdText;
        serviceRequest.treatmentId = hisData.treatmentId;
        serviceRequest.treatmentCode = hisData.treatmentCode;
        serviceRequest.note = hisData.note;
        serviceRequest.totalAmount = hisData.totalAmount || 0;
        serviceRequest.status = hisData.status || 'PENDING';
        serviceRequest.isActiveFlag = 1;

        // Patient data
        serviceRequest.patientId = hisData.patientId;
        serviceRequest.patientCode = hisData.patientCode;
        serviceRequest.patientName = hisData.patientName;
        serviceRequest.patientDob = hisData.patientDob;
        serviceRequest.patientCmndNumber = hisData.patientCmndNumber;
        serviceRequest.patientCmndDate = hisData.patientCmndDate;
        serviceRequest.patientCmndPlace = hisData.patientCmndPlace;
        serviceRequest.patientMobile = hisData.patientMobile;
        serviceRequest.patientPhone = hisData.patientPhone;
        serviceRequest.patientProvinceCode = hisData.patientProvinceCode;
        serviceRequest.patientProvinceName = hisData.patientProvinceName;
        serviceRequest.patientCommuneCode = hisData.patientCommuneCode;
        serviceRequest.patientCommuneName = hisData.patientCommuneName;
        serviceRequest.patientAddress = hisData.patientAddress;
        serviceRequest.patientGenderId = hisData.patientGenderId;
        serviceRequest.patientGenderName = hisData.patientGenderName;
        serviceRequest.patientCareerName = hisData.patientCareerName;
        serviceRequest.lisPatientId = hisData.lisPatientId;

        // Room & Department data
        serviceRequest.requestRoomId = hisData.requestRoomId;
        serviceRequest.requestRoomCode = hisData.requestRoomCode;
        serviceRequest.requestRoomName = hisData.requestRoomName;
        serviceRequest.requestDepartmentId = hisData.requestDepartmentId;
        serviceRequest.requestDepartmentCode = hisData.requestDepartmentCode;
        serviceRequest.requestDepartmentName = hisData.requestDepartmentName;
        serviceRequest.executeRoomId = hisData.executeRoomId;
        serviceRequest.executeRoomCode = hisData.executeRoomCode;
        serviceRequest.executeRoomName = hisData.executeRoomName;
        serviceRequest.executeDepartmentId = hisData.executeDepartmentId;
        serviceRequest.executeDepartmentCode = hisData.executeDepartmentCode;
        serviceRequest.executeDepartmentName = hisData.executeDepartmentName;
    }

    private updateServiceRequestFields(serviceRequest: ServiceRequest, hisData: HisServiceRequestData): void {
        // Update only fields that can change
        serviceRequest.serviceReqSttId = hisData.serviceReqSttId;
        serviceRequest.serviceReqSttCode = hisData.serviceReqSttCode;
        serviceRequest.icdCode = hisData.icdCode;
        serviceRequest.icdName = hisData.icdName;
        serviceRequest.icdSubCode = hisData.icdSubCode;
        serviceRequest.icdText = hisData.icdText;
        serviceRequest.note = hisData.note;
        serviceRequest.totalAmount = hisData.totalAmount || 0;
        serviceRequest.status = hisData.status || 'PENDING';

        // Update patient data if changed
        serviceRequest.patientName = hisData.patientName;
        serviceRequest.patientAddress = hisData.patientAddress;
        serviceRequest.patientMobile = hisData.patientMobile;
        serviceRequest.patientPhone = hisData.patientPhone;
        serviceRequest.lisPatientId = hisData.lisPatientId;
    }

    private convertLisToHisFormat(createDto: any): HisServiceRequestData {
        // Convert LIS form data to HIS format
        const hisData: HisServiceRequestData = {
            ...createDto,
            // Ensure lisServices is an empty array if not provided
            lisServices: createDto.lisServices || []
        };
        return hisData;
    }
}
