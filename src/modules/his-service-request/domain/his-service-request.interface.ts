// HIS Service Request Response Interfaces
export interface HisServiceRequestResponse {
  serviceRequest: ServiceRequestInfo;
  resultTracking?: ResultTrackingInfo;
}

export interface ResultTrackingInfo {
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
  lisPatientId?: string | null; // LIS Patient ID from BMM_PATIENTS table
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
