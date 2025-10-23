import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, Inject } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { SaveToLisCommand } from '../save-to-lis.command';
import { SaveToLisResult } from '../../../domain/save-to-lis.dto';
import { GetHisServiceRequestQuery } from '../../queries/get-his-service-request.query';
import { CheckInTrackingCommand } from '../../../../result-tracking/application/commands/check-in-tracking.command';
import { CheckInTrackingDto } from '../../../../result-tracking/domain/result-tracking.dto';
import { ServiceRequestSaveService } from '../../services/service-request-save.service';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(SaveToLisCommand)
export class SaveToLisHandler implements ICommandHandler<SaveToLisCommand> {
    private readonly logger = new Logger(SaveToLisHandler.name);

    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
        @Inject('IServiceRequestSaveService')
        private readonly serviceRequestSaveService: ServiceRequestSaveService,
    ) { }

    async execute(command: SaveToLisCommand): Promise<SaveToLisResult> {
        this.logger.log(`Executing SaveToLisCommand for service request: ${command.saveToLisDto.serviceReqCode}`);

        const { serviceReqCode, roomId, statusId, inRoomId, sampleTypeId, sampleCode, note } = command.saveToLisDto;

        try {
            // Step 1: Get data from HIS
            this.logger.log(`Step 1: Getting data from HIS for service request: ${serviceReqCode}`);
            const hisServiceRequest = await this.getHisServiceRequest(serviceReqCode);

            if (!hisServiceRequest) {
                throw new Error(`Service request ${serviceReqCode} not found in HIS system`);
            }

            // Step 2: Save to LIS database
            this.logger.log(`Step 2: Saving service request to LIS database`);
            const saveResult = await this.saveServiceRequestToLis(hisServiceRequest);
            const savedServiceRequest = saveResult.serviceRequest;

            // Step 3: Start tracking
            this.logger.log(`Step 3: Starting tracking for service request: ${savedServiceRequest.id}`);
            const resultTracking = await this.startTracking(savedServiceRequest.id, {
                roomId,
                statusId,
                inRoomId,
                sampleTypeId,
                sampleCode,
                note
            });

            // Prepare nested response
            const result: SaveToLisResult = {
                serviceRequestId: savedServiceRequest.id,
                resultTrackingId: resultTracking.id,
                serviceReqCode: serviceReqCode,
                serviceRequest: {
                    id: savedServiceRequest.id,
                    hisServiceReqId: savedServiceRequest.hisServiceReqId,
                    serviceReqCode: savedServiceRequest.serviceReqCode,
                    serviceReqSttId: savedServiceRequest.serviceReqSttId,
                    serviceReqSttCode: savedServiceRequest.serviceReqSttCode,
                    serviceReqTypeId: savedServiceRequest.serviceReqTypeId,
                    serviceReqTypeCode: savedServiceRequest.serviceReqTypeCode,
                    instructionTime: savedServiceRequest.instructionTime,
                    instructionDate: savedServiceRequest.instructionDate,
                    icdCode: savedServiceRequest.icdCode,
                    icdName: savedServiceRequest.icdName,
                    treatmentId: savedServiceRequest.treatmentId,
                    treatmentCode: savedServiceRequest.treatmentCode,
                    totalAmount: savedServiceRequest.totalAmount,
                    status: savedServiceRequest.status,
                    isActive: savedServiceRequest.isActiveFlag === 1,
                    createdAt: savedServiceRequest.createdAt,

                    patient: {
                        id: savedServiceRequest.patientId,
                        code: savedServiceRequest.patientCode,
                        name: savedServiceRequest.patientName,
                        dob: savedServiceRequest.patientDob,
                        cmndNumber: savedServiceRequest.patientCmndNumber,
                        cmndDate: savedServiceRequest.patientCmndDate,
                        cmndPlace: savedServiceRequest.patientCmndPlace,
                        mobile: savedServiceRequest.patientMobile,
                        phone: savedServiceRequest.patientPhone,
                        provinceId: savedServiceRequest.patientProvinceCode,
                        provinceCode: savedServiceRequest.patientProvinceCode,
                        provinceName: savedServiceRequest.patientProvinceName,
                        wardId: savedServiceRequest.patientCommuneCode,
                        communeCode: savedServiceRequest.patientCommuneCode,
                        communeName: savedServiceRequest.patientCommuneName,
                        address: savedServiceRequest.patientAddress,
                        genderId: savedServiceRequest.patientGenderId,
                        genderName: savedServiceRequest.patientGenderName,
                        careerName: savedServiceRequest.patientCareerName,
                        lisPatientId: savedServiceRequest.lisPatientId
                    },

                    requestRoom: savedServiceRequest.requestRoomId ? {
                        id: savedServiceRequest.requestRoomId.toString(),
                        roomName: savedServiceRequest.requestRoomName,
                        roomCode: savedServiceRequest.requestRoomCode
                    } : undefined,

                    requestDepartment: savedServiceRequest.requestDepartmentId ? {
                        id: savedServiceRequest.requestDepartmentId,
                        code: savedServiceRequest.requestDepartmentCode,
                        name: savedServiceRequest.requestDepartmentName
                    } : undefined,

                    executeRoom: savedServiceRequest.executeRoomId ? {
                        id: savedServiceRequest.executeRoomId,
                        roomName: savedServiceRequest.executeRoomName,
                        roomCode: savedServiceRequest.executeRoomCode
                    } : undefined,

                    executeDepartment: savedServiceRequest.executeDepartmentId ? {
                        id: savedServiceRequest.executeDepartmentId,
                        code: savedServiceRequest.executeDepartmentCode,
                        name: savedServiceRequest.executeDepartmentName
                    } : undefined,

                    serviceRequestItems: saveResult.serviceRequestItems.map(item => ({
                        id: item.id,
                        hisSereServId: item.hisSereServId,
                        hisServiceId: item.hisServiceId,
                        hisServiceCode: item.hisServiceCode,
                        hisServiceName: item.hisServiceName,
                        hisPrice: item.hisPrice,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalPrice: item.totalPrice,
                        status: item.status,
                        itemOrder: item.itemOrder,
                        isActive: item.isActiveFlag === 1,

                        lisService: item.lisService ? {
                            id: item.lisService.id,
                            serviceCode: item.lisService.serviceCode,
                            serviceName: item.lisService.serviceName,
                            shortName: item.lisService.shortName,
                            currentPrice: item.lisService.currentPrice,
                            serviceGroup: {
                                id: item.lisService.serviceGroupId,
                                serviceGroupName: item.lisService.serviceGroupName
                            },
                            unitOfMeasure: {
                                id: item.lisService.unitOfMeasureId,
                                unitOfMeasureName: item.lisService.unitOfMeasureName
                            },
                            serviceTests: item.lisService.serviceTests || []
                        } : undefined
                    })),

                    resultTracking: {
                        id: resultTracking.id,
                        inTrackingTime: resultTracking.inTrackingTime,
                        outTrackingTime: resultTracking.outTrackingTime,
                        note: resultTracking.note,
                        resultStatus: resultTracking.resultStatus ? {
                            id: resultTracking.resultStatus.id,
                            statusCode: resultTracking.resultStatus.statusCode,
                            statusName: resultTracking.resultStatus.statusName,
                            orderNumber: resultTracking.resultStatus.orderNumber
                        } : undefined,
                        requestRoom: resultTracking.room ? {
                            id: resultTracking.room.id,
                            roomName: resultTracking.room.roomName,
                            roomCode: resultTracking.room.roomCode
                        } : undefined,
                        inRoom: resultTracking.inRoom ? {
                            id: resultTracking.inRoom.id,
                            roomName: resultTracking.inRoom.roomName,
                            roomCode: resultTracking.inRoom.roomCode
                        } : undefined,
                        sample: {
                            sampleType: resultTracking.sampleType ? {
                                id: resultTracking.sampleType.id,
                                typeCode: resultTracking.sampleType.typeCode,
                                typeName: resultTracking.sampleType.typeName,
                                shortName: resultTracking.sampleType.shortName
                            } : undefined,
                            sampleCode: resultTracking.sampleCode,
                            sampleStatus: 'COLLECTED'
                        },
                        workflow: {
                            currentStep: 'SAMPLE_COLLECTED',
                            nextStep: 'SAMPLE_PROCESSING',
                            priority: 'NORMAL'
                        },
                        timeline: {
                            createdAt: resultTracking.createdAt,
                            estimatedProcessingTime: '2 hours',
                            lastUpdatedAt: resultTracking.updatedAt
                        },
                        businessRules: {
                            canModify: true,
                            canCancel: true,
                            canReassign: false,
                            requiresApproval: false,
                            autoProcessing: true,
                            notificationsSent: ['SAMPLE_COLLECTED', 'TRACKING_STARTED']
                        }
                    }
                },
                message: `Successfully saved service request ${serviceReqCode} to LIS and started tracking`
            };

            this.logger.log(`Successfully completed SaveToLisCommand for service request: ${serviceReqCode}`);
            return result;

        } catch (error) {
            this.logger.error(`Failed to execute SaveToLisCommand: ${error instanceof Error ? error.message : String(error)}`, error);
            throw error;
        }
    }

    private async getHisServiceRequest(serviceReqCode: string): Promise<any> {
        try {
            const hisResponse = await this.queryBus.execute(new GetHisServiceRequestQuery(serviceReqCode));
            
            // Check if response has data
            if (!hisResponse || !hisResponse.services) {
                this.logger.error('Invalid HIS response structure', { hisResponse });
                throw new Error('Invalid HIS response structure');
            }
            
            // Map HIS response to HisServiceRequestData format
            const hisData = {
                hisServiceReqId: hisResponse.id,
                serviceReqCode: hisResponse.serviceReqCode,
                serviceReqSttId: hisResponse.serviceReqSttId,
                serviceReqSttCode: hisResponse.serviceReqSttCode,
                serviceReqTypeId: hisResponse.serviceReqTypeId,
                serviceReqTypeCode: hisResponse.serviceReqTypeCode,
                instructionTime: hisResponse.instructionTime,
                instructionDate: hisResponse.instructionDate,
                icdCode: hisResponse.icdCode,
                icdName: hisResponse.icdName,
                treatmentId: hisResponse.treatmentId,
                treatmentCode: hisResponse.treatmentCode,
                note: hisResponse.note,
                totalAmount: hisResponse.services.reduce((sum: number, s: any) => sum + (s.price || 0), 0),
                status: 'PENDING',
                
                // Patient data
                patientId: hisResponse.patient.id,
                patientCode: hisResponse.patient.code,
                patientName: hisResponse.patient.name,
                patientDob: hisResponse.patient.dob,
                patientCmndNumber: hisResponse.patient.cmndNumber,
                patientCmndDate: hisResponse.patient.cmndDate,
                patientCmndPlace: hisResponse.patient.cmndPlace,
                patientMobile: hisResponse.patient.mobile,
                patientPhone: hisResponse.patient.phone,
                patientProvinceCode: hisResponse.patient.provinceCode,
                patientProvinceName: hisResponse.patient.provinceName,
                patientCommuneCode: hisResponse.patient.communeCode,
                patientCommuneName: hisResponse.patient.communeName,
                patientAddress: hisResponse.patient.address,
                patientGenderId: hisResponse.patient.genderId,
                patientGenderName: hisResponse.patient.genderName,
                patientCareerName: hisResponse.patient.careerName,
                lisPatientId: hisResponse.patient.lisPatientId,
                
                // Room & Department data
                requestRoomId: hisResponse.requestRoom?.id,
                requestRoomCode: hisResponse.requestRoom?.code,
                requestRoomName: hisResponse.requestRoom?.name,
                requestDepartmentId: hisResponse.requestDepartment?.id,
                requestDepartmentCode: hisResponse.requestDepartment?.code,
                requestDepartmentName: hisResponse.requestDepartment?.name,
                executeRoomId: hisResponse.executeRoom?.id,
                executeRoomCode: hisResponse.executeRoom?.code,
                executeRoomName: hisResponse.executeRoom?.name,
                executeDepartmentId: hisResponse.executeDepartment?.id,
                executeDepartmentCode: hisResponse.executeDepartment?.code,
                executeDepartmentName: hisResponse.executeDepartment?.name,
                
                // Map HIS services to LIS services
                lisServices: hisResponse.services.map((service: any) => ({
                    hisSereServId: service.hisSereServId,
                    hisServiceId: service.serviceId,
                    hisServiceCode: service.serviceCode,
                    hisServiceName: service.serviceName,
                    hisPrice: service.price,
                    quantity: 1,
                    unitPrice: service.price,
                    totalPrice: service.price,
                    status: 'PENDING',
                    itemOrder: 1,
                    isActiveFlag: 1,
                    
                    // LIS service mapping
                    lisServiceId: service.lisService?.id,
                    lisServiceCode: service.lisService?.serviceCode,
                    lisServiceName: service.lisService?.serviceName,
                    lisShortName: service.lisService?.shortName,
                    lisCurrentPrice: service.lisService?.currentPrice,
                    serviceGroupId: service.lisService?.serviceGroupId,
                    serviceGroupName: service.lisService?.serviceGroupName,
                    unitOfMeasureId: service.lisService?.unitOfMeasureId,
                    unitOfMeasureName: service.lisService?.unitOfMeasureName,
                    serviceTests: service.lisService?.serviceTests || []
                }))
            };
            
            this.logger.log(`Mapped HIS data with ${hisData.lisServices.length} LIS services`);
            return hisData;
        } catch (error) {
            this.logger.error(`Failed to get HIS service request: ${error instanceof Error ? error.message : String(error)}`, error);
            throw error;
        }
    }

    private async saveServiceRequestToLis(hisServiceRequest: any): Promise<any> {
        try {
            return await this.serviceRequestSaveService.saveServiceRequestFromHis(hisServiceRequest);
        } catch (error) {
            this.logger.error(`Failed to save service request to LIS: ${error instanceof Error ? error.message : String(error)}`, error);
            throw error;
        }
    }

    private async startTracking(serviceRequestId: string, trackingData: any): Promise<any> {
        try {
            const checkInTrackingDto: CheckInTrackingDto = {
                serviceRequestId: serviceRequestId,
                resultStatusId: trackingData.statusId,
                roomId: trackingData.roomId,
                inRoomId: trackingData.inRoomId,
                sampleTypeId: trackingData.sampleTypeId,
                sampleCode: trackingData.sampleCode,
                note: trackingData.note || `Bắt đầu xử lý mẫu xét nghiệm ${serviceRequestId}`
            };

            return await this.commandBus.execute(new CheckInTrackingCommand(checkInTrackingDto));
        } catch (error) {
            this.logger.error(`Failed to start tracking: ${error instanceof Error ? error.message : String(error)}`, error);
            throw error;
        }
    }
}