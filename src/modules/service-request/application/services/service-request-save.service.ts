import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DataSource, IsNull } from 'typeorm';
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
import { Patient } from '../../../patient/domain/patient.entity';

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
            await this.mapHisDataToServiceRequest(serviceRequest, hisData);
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

    private async mapHisDataToServiceRequest(serviceRequest: ServiceRequest, hisData: HisServiceRequestData): Promise<void> {
        serviceRequest.id = uuidv4();
        serviceRequest.hisServiceReqId = hisData.hisServiceReqId;
        serviceRequest.serviceReqCode = hisData.serviceReqCode;
        serviceRequest.serviceReqSttId = hisData.serviceReqSttId;
        serviceRequest.serviceReqSttCode = hisData.serviceReqSttCode;
        serviceRequest.serviceReqTypeId = hisData.serviceReqTypeId;
        serviceRequest.serviceReqTypeCode = hisData.serviceReqTypeCode;
        // Parse dates safely - handle YYYYMMDDHHMMSS format
        try {
            if (hisData.instructionTime) {
                if (typeof hisData.instructionTime === 'number' && String(hisData.instructionTime).length === 14) {
                    // Parse YYYYMMDDHHMMSS format: 20251014085800 = 2025-10-14 08:58:00
                    const dateStr = String(hisData.instructionTime);
                    const year = parseInt(dateStr.substring(0, 4));      // 2025
                    const month = parseInt(dateStr.substring(4, 6)) - 1; // 10 -> 9 (0-based)
                    const day = parseInt(dateStr.substring(6, 8));       // 14
                    const hour = parseInt(dateStr.substring(8, 10));     // 08
                    const minute = parseInt(dateStr.substring(10, 12));  // 58
                    const second = parseInt(dateStr.substring(12, 14)); // 00
                    serviceRequest.instructionTime = new Date(year, month, day, hour, minute, second);
                } else {
                    serviceRequest.instructionTime = new Date(hisData.instructionTime);
                }
            } else {
                serviceRequest.instructionTime = new Date();
            }
            this.logger.debug(`Parsed instructionTime: ${serviceRequest.instructionTime.toISOString()}`);
        } catch (error) {
            this.logger.warn(`Failed to parse instructionTime: ${hisData.instructionTime}`, error);
            serviceRequest.instructionTime = new Date();
        }

        try {
            if (hisData.instructionDate) {
                if (typeof hisData.instructionDate === 'number' && String(hisData.instructionDate).length === 14) {
                    // Parse YYYYMMDDHHMMSS format: 20251014000000 = 2025-10-14 00:00:00
                    const dateStr = String(hisData.instructionDate);
                    const year = parseInt(dateStr.substring(0, 4));      // 2025
                    const month = parseInt(dateStr.substring(4, 6)) - 1; // 10 -> 9 (0-based)
                    const day = parseInt(dateStr.substring(6, 8));       // 14
                    const hour = parseInt(dateStr.substring(8, 10));     // 00
                    const minute = parseInt(dateStr.substring(10, 12));  // 00
                    const second = parseInt(dateStr.substring(12, 14)); // 00
                    serviceRequest.instructionDate = new Date(year, month, day, hour, minute, second);
                } else {
                    serviceRequest.instructionDate = new Date(hisData.instructionDate);
                }
            } else {
                serviceRequest.instructionDate = new Date();
            }
            this.logger.debug(`Parsed instructionDate: ${serviceRequest.instructionDate.toISOString()}`);
        } catch (error) {
            this.logger.warn(`Failed to parse instructionDate: ${hisData.instructionDate}`, error);
            serviceRequest.instructionDate = new Date();
        }
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
        this.logger.debug(`HIS Patient ID: ${hisData.patientId}, Type: ${typeof hisData.patientId}`);
        this.logger.debug(`HIS Data keys: ${Object.keys(hisData).join(', ')}`);

        // Use patient ID from HIS data - if null, try to extract from patientCode
        if (hisData.patientId === null || hisData.patientId === undefined) {
            // Try to get patient ID from nested patient object if available
            const patientIdFromNested = (hisData as any).patient?.id;
            if (patientIdFromNested) {
                serviceRequest.patientId = patientIdFromNested;
                this.logger.log(`Using patient ID from nested object: ${patientIdFromNested}`);
            } else {
                // Generate a numeric ID from patientCode (remove non-numeric characters and take first 10 digits)
                const numericCode = hisData.patientCode?.replace(/\D/g, '').substring(0, 10) || '0';
                serviceRequest.patientId = parseInt(numericCode) || 0;
                this.logger.warn(`HIS Patient ID is null, using generated ID: ${serviceRequest.patientId} from patientCode: ${hisData.patientCode}`);
            }
        } else {
            serviceRequest.patientId = hisData.patientId;
        }
        // Get patient code from nested object if not available directly
        serviceRequest.patientCode = hisData.patientCode || (hisData as any).patient?.code;
        this.logger.debug(`Patient Code: ${serviceRequest.patientCode}`);
        // Get patient data from nested object if not available directly
        serviceRequest.patientName = hisData.patientName || (hisData as any).patient?.name;
        serviceRequest.patientDob = hisData.patientDob || (hisData as any).patient?.dob;
        serviceRequest.patientCmndNumber = hisData.patientCmndNumber || (hisData as any).patient?.cmndNumber;
        serviceRequest.patientCmndDate = hisData.patientCmndDate || (hisData as any).patient?.cmndDate;
        serviceRequest.patientCmndPlace = hisData.patientCmndPlace || (hisData as any).patient?.cmndPlace;
        serviceRequest.patientMobile = hisData.patientMobile || (hisData as any).patient?.mobile;
        serviceRequest.patientPhone = hisData.patientPhone || (hisData as any).patient?.phone;
        serviceRequest.patientProvinceCode = hisData.patientProvinceCode || (hisData as any).patient?.provinceCode;
        serviceRequest.patientProvinceName = hisData.patientProvinceName || (hisData as any).patient?.provinceName;
        serviceRequest.patientCommuneCode = hisData.patientCommuneCode || (hisData as any).patient?.communeCode;
        serviceRequest.patientCommuneName = hisData.patientCommuneName || (hisData as any).patient?.communeName;
        serviceRequest.patientAddress = hisData.patientAddress || (hisData as any).patient?.address;
        serviceRequest.patientGenderId = hisData.patientGenderId || (hisData as any).patient?.genderId;
        serviceRequest.patientGenderName = hisData.patientGenderName || (hisData as any).patient?.genderName;
        serviceRequest.patientCareerName = hisData.patientCareerName || (hisData as any).patient?.careerName;

        // Handle LIS Patient ID: Check if patient exists, create if not found
        if (hisData.lisPatientId) {
            // Use existing LIS Patient ID
            serviceRequest.lisPatientId = hisData.lisPatientId;
            this.logger.log(`Using existing LIS Patient ID: ${hisData.lisPatientId}`);
        } else {
            // Check if patient exists in LIS database by patientCode
            const existingPatient = await this.findPatientByCode(hisData.patientCode);
            if (existingPatient) {
                // Use existing patient
                serviceRequest.lisPatientId = existingPatient.id;
                this.logger.log(`Found existing LIS Patient with ID: ${existingPatient.id}`);
            } else {
                // Create new patient in LIS
                const newPatientId = await this.createPatientFromHis(hisData);
                serviceRequest.lisPatientId = newPatientId;
                this.logger.log(`Created new LIS Patient with ID: ${newPatientId}`);
            }
        }

        // Note: patientId is HIS Patient ID (number), lisPatientId is LIS Patient ID (UUID)
        // Database PATIENT_ID field is number (HIS ID), LIS_PATIENT_ID field is UUID
        // Keep patientId as HIS Patient ID for reference

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

    private async findPatientByCode(patientCode: string): Promise<Patient | null> {
        try {
            const patient = await this.dataSource.manager.findOne(Patient, {
                where: { patientCode, deletedAt: IsNull() }
            });
            return patient;
        } catch (error) {
            this.logger.error(`Failed to find patient by code: ${patientCode}`, error);
            return null;
        }
    }

    private async createPatientFromHis(hisData: HisServiceRequestData): Promise<string> {
        // Extract patient data from nested structure
        const patientCode = hisData.patientCode || (hisData as any).patient?.code;
        const patientName = hisData.patientName || (hisData as any).patient?.name;
        const patientDob = hisData.patientDob || (hisData as any).patient?.dob;
        const patientCmndNumber = hisData.patientCmndNumber || (hisData as any).patient?.cmndNumber;
        const patientCmndDate = hisData.patientCmndDate || (hisData as any).patient?.cmndDate;
        const patientCmndPlace = hisData.patientCmndPlace || (hisData as any).patient?.cmndPlace;
        const patientMobile = hisData.patientMobile || (hisData as any).patient?.mobile;
        const patientPhone = hisData.patientPhone || (hisData as any).patient?.phone;
        const patientAddress = hisData.patientAddress || (hisData as any).patient?.address;
        const patientGenderId = hisData.patientGenderId || (hisData as any).patient?.genderId;
        const patientGenderName = hisData.patientGenderName || (hisData as any).patient?.genderName;
        const patientCareerName = hisData.patientCareerName || (hisData as any).patient?.careerName;

        this.logger.log(`Creating new LIS Patient from HIS data: ${patientCode}`);
        this.logger.debug(`HIS Data object keys: ${Object.keys(hisData).join(', ')}`);
        this.logger.debug(`HIS Data patientCode: ${patientCode}`);
        this.logger.debug(`HIS Data patientName: ${patientName}`);
        this.logger.debug(`HIS Data patientDob: ${patientDob}`);

        try {
            // Validate required fields
            if (!patientCode) {
                this.logger.error(`Patient code validation failed. Available fields: ${Object.keys(hisData).join(', ')}`);
                throw new Error('Patient code is required but not provided');
            }
            if (!patientName) {
                throw new Error('Patient name is required but not provided');
            }
            if (!patientDob) {
                throw new Error('Patient date of birth is required but not provided');
            }

            // Parse date safely
            let dateOfBirth: Date;
            try {
                // Handle different date formats from HIS
                if (typeof patientDob === 'number') {
                    // Check if it's YYYYMMDDHHMMSS format (14 digits)
                    if (patientDob.toString().length === 14) {
                        // Parse YYYYMMDDHHMMSS format
                        const dateStr = patientDob.toString();
                        const year = parseInt(dateStr.substring(0, 4));
                        const month = parseInt(dateStr.substring(4, 6)) - 1; // Month is 0-based
                        const day = parseInt(dateStr.substring(6, 8));
                        const hour = parseInt(dateStr.substring(8, 10));
                        const minute = parseInt(dateStr.substring(10, 12));
                        const second = parseInt(dateStr.substring(12, 14));

                        dateOfBirth = new Date(year, month, day, hour, minute, second);
                    } else if (patientDob > 1000000000000) {
                        // Already in milliseconds
                        dateOfBirth = new Date(patientDob);
                    } else {
                        // In seconds, convert to milliseconds
                        dateOfBirth = new Date(patientDob * 1000);
                    }
                } else if (typeof patientDob === 'string') {
                    // String date
                    dateOfBirth = new Date(patientDob);
                } else {
                    throw new Error('Invalid date format');
                }

                // Validate date
                if (isNaN(dateOfBirth.getTime())) {
                    throw new Error('Invalid date value');
                }

                this.logger.debug(`Parsed date of birth: ${dateOfBirth.toISOString()} from ${patientDob}`);
            } catch (dateError) {
                this.logger.error(`Failed to parse patient date of birth: ${patientDob}`, dateError);
                throw new Error(`Invalid patient date of birth: ${patientDob}`);
            }

            // Parse CMND date safely
            let cmndDate: Date | null = null;
            if (patientCmndDate) {
                try {
                    if (typeof patientCmndDate === 'number') {
                        // Check if it's YYYYMMDDHHMMSS format (14 digits)
                        if (patientCmndDate.toString().length === 14) {
                            // Parse YYYYMMDDHHMMSS format
                            const dateStr = patientCmndDate.toString();
                            const year = parseInt(dateStr.substring(0, 4));
                            const month = parseInt(dateStr.substring(4, 6)) - 1; // Month is 0-based
                            const day = parseInt(dateStr.substring(6, 8));
                            const hour = parseInt(dateStr.substring(8, 10));
                            const minute = parseInt(dateStr.substring(10, 12));
                            const second = parseInt(dateStr.substring(12, 14));

                            cmndDate = new Date(year, month, day, hour, minute, second);
                        } else if (patientCmndDate > 1000000000000) {
                            // Already in milliseconds
                            cmndDate = new Date(patientCmndDate);
                        } else {
                            // In seconds, convert to milliseconds
                            cmndDate = new Date(patientCmndDate * 1000);
                        }
                    } else if (typeof patientCmndDate === 'string') {
                        cmndDate = new Date(patientCmndDate);
                    }

                    if (isNaN(cmndDate.getTime())) {
                        cmndDate = null;
                    } else {
                        this.logger.debug(`Parsed CMND date: ${cmndDate.toISOString()} from ${patientCmndDate}`);
                    }
                } catch (cmndDateError) {
                    this.logger.warn(`Failed to parse CMND date: ${patientCmndDate}`, cmndDateError);
                    cmndDate = null;
                }
            }

            // Create new Patient entity
            const patient = new Patient();
            patient.id = uuidv4();
            patient.patientCode = patientCode;
            patient.patientName = patientName;
            patient.dateOfBirth = dateOfBirth;
            patient.cmndNumber = patientCmndNumber || null;
            patient.cmndDate = cmndDate;
            patient.cmndPlace = patientCmndPlace || null;
            patient.mobile = patientMobile || null;
            patient.phone = patientPhone || null;
            patient.provinceId = null; // Will be set later when province/ward data is available
            patient.wardId = null; // Will be set later when province/ward data is available
            patient.address = patientAddress || 'Unknown';
            patient.genderId = patientGenderId || 1; // Default to 1 if not provided
            patient.genderName = patientGenderName || 'Unknown';
            patient.careerName = patientCareerName || null;
            patient.hisId = hisData.patientId || (hisData as any).patient?.id;
            patient.isActiveFlag = 1; // Set as active

            // Save patient to database
            const savedPatient = await this.dataSource.manager.save(patient);

            this.logger.log(`Successfully created LIS Patient: ${savedPatient.id}`);
            return savedPatient.id;

        } catch (error) {
            this.logger.error(`Failed to create LIS Patient: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
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
