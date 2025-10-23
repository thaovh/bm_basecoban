import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNotEmpty, IsOptional } from 'class-validator';

export class SaveToLisDto {
    @ApiProperty({ description: 'Service Request Code from HIS', example: '000054090874' })
    @IsString()
    @IsNotEmpty()
    serviceReqCode: string;

    @ApiProperty({ description: 'Request Room ID for tracking', example: 'uuid-room-id' })
    @IsUUID()
    @IsNotEmpty()
    roomId: string;

    @ApiProperty({ description: 'Result Status ID for tracking', example: 'uuid-status-id' })
    @IsUUID()
    @IsNotEmpty()
    statusId: string;

    @ApiProperty({ description: 'In Room ID for tracking', example: 'uuid-in-room-id', required: false })
    @IsOptional()
    @IsUUID()
    inRoomId?: string;

    @ApiProperty({ description: 'Sample Type ID for tracking', example: 'uuid-sample-type-id', required: false })
    @IsOptional()
    @IsUUID()
    sampleTypeId?: string;

    @ApiProperty({ description: 'Sample Code for tracking', example: 'BLD-2024-001', required: false })
    @IsOptional()
    @IsString()
    sampleCode?: string;

    @ApiProperty({ description: 'Note for tracking', example: 'Bắt đầu xử lý mẫu xét nghiệm', required: false })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiProperty({ description: 'Start tracking time', example: '2024-01-15T10:30:00Z', required: false })
    @IsOptional()
    inTrackingTime?: Date;
}

export class SaveToLisResult {
    @ApiProperty({ description: 'Service Request ID created in LIS' })
    serviceRequestId: string;

    @ApiProperty({ description: 'Result Tracking ID created' })
    resultTrackingId: string;

    @ApiProperty({ description: 'Service Request Code' })
    serviceReqCode: string;

    @ApiProperty({ description: 'Full nested service request data' })
    serviceRequest: {
        id: string;
        hisServiceReqId: number;
        serviceReqCode: string;
        serviceReqSttId: number;
        serviceReqSttCode: string;
        serviceReqTypeId: number;
        serviceReqTypeCode: string;
        instructionTime: Date;
        instructionDate: Date;
        icdCode?: string;
        icdName?: string;
        treatmentId?: number;
        treatmentCode?: string;
        totalAmount: number;
        status: string;
        isActive: boolean;
        createdAt: Date;

        patient: {
            id: number;
            code: string;
            name: string;
            dob: number;
            cmndNumber?: string;
            cmndDate?: number;
            cmndPlace?: string;
            mobile?: string;
            phone?: string;
            provinceId?: string;
            provinceCode?: string;
            provinceName?: string;
            wardId?: string;
            communeCode?: string;
            communeName?: string;
            address: string;
            genderId: number;
            genderName: string;
            careerName?: string;
            lisPatientId?: string;
        };

        requestRoom?: {
            id: string;
            roomName: string;
            roomCode: string;
        };

        requestDepartment?: {
            id: number;
            code: string;
            name: string;
        };

        executeRoom?: {
            id: number;
            roomName: string;
            roomCode: string;
        };

        executeDepartment?: {
            id: number;
            code: string;
            name: string;
        };

        serviceRequestItems: Array<{
            id: string;
            hisSereServId: number;
            hisServiceId: number;
            hisServiceCode: string;
            hisServiceName: string;
            hisPrice: number;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
            status: string;
            itemOrder: number;
            isActive: boolean;

            lisService?: {
                id: string;
                serviceCode: string;
                serviceName: string;
                shortName: string;
                currentPrice: number;
                serviceGroup: {
                    id: string;
                    serviceGroupName: string;
                };
                unitOfMeasure: {
                    id: string;
                    unitOfMeasureName: string;
                };
                serviceTests: Array<{
                    id: string;
                    testCode: string;
                    testName: string;
                    shortName: string;
                    rangeText?: string;
                    rangeLow?: number;
                    rangeHigh?: number;
                    mapping?: string;
                    testOrder: number;
                    isActiveFlag: number;
                    testStatus?: string;
                    expectedResult?: string;
                    actualResult?: string;
                    resultUnit?: string;
                    normalRange?: string;
                    criticalValues?: any;
                    testMethod?: string;
                    specimenType?: string;
                    processingTime?: string;
                    unitOfMeasure: {
                        id: string;
                        unitOfMeasureName: string;
                    };
                }>;
            };
        }>;

        resultTracking?: {
            id: string;
            inTrackingTime?: Date;
            outTrackingTime?: Date;
            note?: string;
            resultStatus?: {
                id: string;
                statusCode: string;
                statusName: string;
                orderNumber: number;
            };
            requestRoom?: {
                id: string;
                roomName: string;
                roomCode: string;
            };
            inRoom?: {
                id: string;
                roomName: string;
                roomCode: string;
            };
            sample?: {
                sampleType?: {
                    id: string;
                    typeCode: string;
                    typeName: string;
                    shortName?: string;
                };
                sampleCode?: string;
                sampleStatus?: string;
            };
            workflow?: {
                currentStep: string;
                nextStep: string;
                estimatedCompletionTime?: Date;
                priority: string;
                assignedTo?: {
                    userId: string;
                    userName: string;
                    role: string;
                };
            };
            timeline?: {
                createdAt: Date;
                estimatedProcessingTime: string;
                estimatedCompletionTime?: Date;
                lastUpdatedAt: Date;
            };
            businessRules?: {
                canModify: boolean;
                canCancel: boolean;
                canReassign: boolean;
                requiresApproval: boolean;
                autoProcessing: boolean;
                notificationsSent: string[];
            };
        };
    };

    @ApiProperty({ description: 'Success message' })
    message: string;
}
