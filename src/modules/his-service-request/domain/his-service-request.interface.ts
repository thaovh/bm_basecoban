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
  note?: string;
  requestRoom?: RoomInfo;
  requestDepartment?: DepartmentInfo;
  executeRoom?: RoomInfo;
  executeDepartment?: DepartmentInfo;
  patient: PatientInfo;
  services: ServiceInfo[];
}

export interface PatientInfo {
  id: string;
  code: string;
  name: string;
  dob: string;
  cmndNumber?: string;
  cmndDate?: string;
  cmndPlace?: string;
  mobile?: string;
  phone?: string;
  provinceId?: string | null;
  provinceCode?: string;
  provinceName?: string;
  wardId?: string | null;
  communeCode?: string;
  communeName?: string;
  address: string;
  genderId: string;
  genderName: string;
  careerName: string;
}

export interface RoomInfo {
  id: string;
  code: string;
  name: string;
}

export interface DepartmentInfo {
  id: string;
  code: string;
  name: string;
}

export interface ServiceInfo {
  hisSereServId: string;
  serviceId: string;
  serviceCode: string; // HIS service code
  serviceName: string;
  price: number;
  lisService?: LisServiceInfo; // LIS service information if mapped
}

export interface LisServiceInfo {
  id: string;
  serviceCode: string; // LIS service code
  serviceName: string;
  shortName: string;
  currentPrice?: number;
  serviceGroupId?: string;
  serviceGroupName?: string;
  unitOfMeasureId?: string;
  unitOfMeasureName?: string;
  serviceTests?: ServiceTestInfo[]; // Service tests for this service
}

export interface ServiceTestInfo {
  id: string;
  testCode: string;
  testName: string;
  shortName: string;
  unitOfMeasureId?: string;
  unitOfMeasureName?: string;
  rangeText?: string;
  rangeLow?: number;
  rangeHigh?: number;
  mapping?: string;
  testOrder?: number;
  isActiveFlag: number;
}

// Query Parameters
export interface GetServiceRequestParams {
  serviceReqCode: string;
}

// Repository Interface
export interface IHisServiceRequestRepository {
  getServiceRequestByCode(serviceReqCode: string): Promise<ServiceRequestInfo | null>;
}
