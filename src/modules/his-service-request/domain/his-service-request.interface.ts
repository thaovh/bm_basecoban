// HIS Service Request Response Interfaces
export interface HisServiceRequestResponse {
  serviceRequest: ServiceRequestInfo;
}

export interface ServiceRequestInfo {
  id: string;
  serviceReqCode: string;
  serviceReqSttId: string;
  serviceReqSttCode: string;
  serviceReqTypeId: string;
  serviceReqTypeCode: string;
  instructionTime: string;
  instructionDate: string;
  icdCode: string;
  icdName: string;
  icdSubCode: string;
  icdText: string;
  treatmentId: string;
  treatmentCode: string;
  patient: PatientInfo;
  services: ServiceInfo[];
}

export interface PatientInfo {
  id: string;
  code: string;
  name: string;
  dob: string;
  address: string;
  genderId: string;
  genderName: string;
  careerName: string;
}

export interface ServiceInfo {
  hisSereServId: string;
  serviceId: string;
  serviceCode: string;
  serviceName: string;
  price: number;
}

// Query Parameters
export interface GetServiceRequestParams {
  serviceReqCode: string;
}

// Repository Interface
export interface IHisServiceRequestRepository {
  getServiceRequestByCode(serviceReqCode: string): Promise<ServiceRequestInfo | null>;
}
