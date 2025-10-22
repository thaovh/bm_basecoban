import { ServiceRequest } from './service-request.entity';
import { ServiceRequestItem } from './service-request-item.entity';
import { ServiceRequestItemTest } from './service-request-item-test.entity';

export interface ServiceRequestSaveResult {
    serviceRequest: ServiceRequest;
    serviceRequestItems: ServiceRequestItem[];
    serviceRequestItemTests: ServiceRequestItemTest[];
    isNew: boolean;
    hisMapping: {
        hisServiceReqId: number;
        lisServiceRequestId: string;
    };
}

export interface HisServiceRequestData {
    // Service Request Data
    hisServiceReqId: number;
    serviceReqCode: string;
    serviceReqSttId: number;
    serviceReqSttCode: string;
    serviceReqTypeId: number;
    serviceReqTypeCode: string;
    instructionTime: string;
    instructionDate: string;
    icdCode?: string;
    icdName?: string;
    icdSubCode?: string;
    icdText?: string;
    treatmentId?: number;
    treatmentCode?: string;
    note?: string;
    totalAmount?: number;
    status?: string;

    // Patient Data
    patientId: number;
    patientCode: string;
    patientName: string;
    patientDob: number;
    patientCmndNumber?: string;
    patientCmndDate?: number;
    patientCmndPlace?: string;
    patientMobile?: string;
    patientPhone?: string;
    patientProvinceCode?: string;
    patientProvinceName?: string;
    patientCommuneCode?: string;
    patientCommuneName?: string;
    patientAddress: string;
    patientGenderId: number;
    patientGenderName: string;
    patientCareerName?: string;
    lisPatientId?: string;

    // Room & Department Data
    requestRoomId?: number;
    requestRoomCode?: string;
    requestRoomName?: string;
    requestDepartmentId?: number;
    requestDepartmentCode?: string;
    requestDepartmentName?: string;
    executeRoomId?: number;
    executeRoomCode?: string;
    executeRoomName?: string;
    executeDepartmentId?: number;
    executeDepartmentCode?: string;
    executeDepartmentName?: string;

    // Service Request Items Data
    lisServices: HisServiceRequestItemData[];
}

export interface HisServiceRequestItemData {
    hisSereServId: number;
    hisServiceId: number;
    hisServiceCode: string;
    hisServiceName: string;
    hisPrice: number;
    lisServiceId?: string;
    lisServiceCode?: string;
    lisServiceName?: string;
    lisShortName?: string;
    lisCurrentPrice?: number;
    serviceGroupId?: string;
    serviceGroupName?: string;
    unitOfMeasureId?: string;
    unitOfMeasureName?: string;
    quantity?: number;
    unitPrice?: number;
    totalPrice?: number;
    status?: string;
    itemOrder?: number;
    serviceTests?: HisServiceRequestItemTestData[];
}

export interface HisServiceRequestItemTestData {
    serviceTestId?: string;
    testCode: string;
    testName: string;
    shortName?: string;
    testOrder?: number;
}

export interface BulkSaveServiceRequestResult {
    totalProcessed: number;
    successful: number;
    failed: number;
    results: ServiceRequestSaveResult[];
    errors: Array<{
        serviceReqCode: string;
        error: string;
    }>;
}

export interface IServiceRequestSaveService {
    saveServiceRequestFromHis(hisData: HisServiceRequestData): Promise<ServiceRequestSaveResult>;
    saveServiceRequestFromLis(createDto: any): Promise<ServiceRequestSaveResult>;
    bulkSaveServiceRequestsFromHis(hisDataList: HisServiceRequestData[]): Promise<BulkSaveServiceRequestResult>;
    updateServiceRequestFromHis(serviceRequestId: string, hisData: HisServiceRequestData): Promise<ServiceRequestSaveResult>;
}
