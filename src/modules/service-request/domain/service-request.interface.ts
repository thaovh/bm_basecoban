import { ServiceRequest } from './service-request.entity';
import { ServiceRequestItem } from './service-request-item.entity';

export interface IServiceRequestRepository {
    findById(id: string): Promise<ServiceRequest | null>;
    findByCode(serviceReqCode: string): Promise<ServiceRequest | null>;
    findByHisId(hisServiceReqId: number): Promise<ServiceRequest | null>;
    save(serviceRequest: ServiceRequest): Promise<ServiceRequest>;
    delete(id: string): Promise<void>;
    findActiveServiceRequests(limit: number, offset: number): Promise<[ServiceRequest[], number]>;
    findAllServiceRequests(limit: number, offset: number): Promise<[ServiceRequest[], number]>;
    searchServiceRequests(searchTerm: string, limit: number, offset: number): Promise<[ServiceRequest[], number]>;
    findByPatientId(patientId: number, limit: number, offset: number): Promise<[ServiceRequest[], number]>;
    findByTreatmentId(treatmentId: number, limit: number, offset: number): Promise<[ServiceRequest[], number]>;
}

export interface IServiceRequestItemRepository {
    findById(id: string): Promise<ServiceRequestItem | null>;
    findByServiceRequestId(serviceRequestId: string): Promise<ServiceRequestItem[]>;
    findByHisSereServId(hisSereServId: number): Promise<ServiceRequestItem | null>;
    save(serviceRequestItem: ServiceRequestItem): Promise<ServiceRequestItem>;
    delete(id: string): Promise<void>;
    findActiveServiceRequestItems(limit: number, offset: number): Promise<[ServiceRequestItem[], number]>;
    findAllServiceRequestItems(limit: number, offset: number): Promise<[ServiceRequestItem[], number]>;
    searchServiceRequestItems(searchTerm: string, limit: number, offset: number): Promise<[ServiceRequestItem[], number]>;
}

export interface IServiceRequestService {
    createServiceRequest(createServiceRequestDto: any): Promise<ServiceRequest>;
    updateServiceRequest(id: string, updateServiceRequestDto: any): Promise<ServiceRequest>;
    deleteServiceRequest(id: string): Promise<void>;
    getServiceRequestById(id: string): Promise<ServiceRequest>;
    getServiceRequestByCode(serviceReqCode: string): Promise<ServiceRequest>;
    getServiceRequestByHisId(hisServiceReqId: number): Promise<ServiceRequest>;
    getServiceRequests(query: any): Promise<any>;
    searchServiceRequests(searchTerm: string, query: any): Promise<any>;
    getServiceRequestsByPatient(patientId: number, query: any): Promise<any>;
    getServiceRequestsByTreatment(treatmentId: number, query: any): Promise<any>;
    syncServiceRequestFromHis(hisServiceRequestData: any): Promise<ServiceRequest>;
}
