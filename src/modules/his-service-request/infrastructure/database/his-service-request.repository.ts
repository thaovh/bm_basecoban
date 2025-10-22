import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IHisServiceRequestRepository, ServiceRequestInfo, PatientInfo, ServiceInfo, LisServiceInfo, ServiceTestInfo } from '../../domain/his-service-request.interface';
import { IProvinceRepository } from '../../../province/domain/province.interface';
import { IWardRepository } from '../../../ward/domain/ward.interface';
import { IPatientRepository } from '../../../patient/domain/patient.interface';

@Injectable()
export class HisServiceRequestRepository implements IHisServiceRequestRepository {
  private readonly logger = new Logger(HisServiceRequestRepository.name);

  constructor(
    @InjectDataSource('his')
    private readonly hisDataSource: DataSource,
    @InjectDataSource('default')
    private readonly lisDataSource: DataSource,
    @Inject('IProvinceRepository')
    private readonly provinceRepository: IProvinceRepository,
    @Inject('IWardRepository')
    private readonly wardRepository: IWardRepository,
    @Inject('IPatientRepository')
    private readonly patientRepository: IPatientRepository,
  ) { }

  async getServiceRequestByCode(serviceReqCode: string): Promise<ServiceRequestInfo | null> {
    this.logger.log(`Querying HIS database for service request: ${serviceReqCode}`);

    try {
      const query = `
        SELECT
          HSR.ID,
          HSR.SERVICE_REQ_CODE,
          HSR.SERVICE_REQ_STT_ID,
          HSR.SERVICE_REQ_STT_CODE,
          HSR.SERVICE_REQ_TYPE_ID,
          HSR.SERVICE_REQ_TYPE_CODE,
          HSR.INTRUCTION_TIME,
          HSR.INTRUCTION_DATE,
          HSR.ICD_CODE,
          HSR.ICD_NAME,
          HSR.ICD_SUB_CODE,
          HSR.ICD_TEXT,
          HSR.TREATMENT_ID,
          HSR.TDL_TREATMENT_CODE TREATMENT_CODE,
          HSR.TDL_PATIENT_ID PATIENT_ID,
          HSR.TDL_PATIENT_CODE PATIENT_CODE,
          HSR.TDL_PATIENT_NAME PATIENT_NAME,
          HSR.TDL_PATIENT_DOB PATIENT_DOB,
          HSR.TDL_PATIENT_CCCD_NUMBER PATIENT_CMND_NUMBER,
          HSR.TDL_PATIENT_CCCD_DATE PATIENT_CCCD_DATE,
          HSR.TDL_PATIENT_CCCD_PLACE PATIENT_CCCD_PLACE,
          B.TDL_PATIENT_RELATIVE_MOBILE PATIENT_MOBILE,
          B.TDL_PATIENT_RELATIVE_PHONE PATIENT_PHONE,
          HSR.TDL_PATIENT_PROVINCE_CODE PATIENT_PROVINCE_CODE,
          HSR.TDL_PATIENT_PROVINCE_NAME PATIENT_PROVINCE_NAME,
          HSR.TDL_PATIENT_COMMUNE_CODE PATIENT_COMMUNE_CODE,
          HSR.TDL_PATIENT_COMMUNE_NAME PATIENT_COMMUNE_NAME,
          HSR.TDL_PATIENT_ADDRESS PATIENT_ADDRESS,
          HSR.TDL_PATIENT_GENDER_ID PATIENT_GENDER_ID,
          HSR.TDL_PATIENT_GENDER_NAME PATIENT_GENDER_NAME,
          HSR.TDL_PATIENT_CAREER_NAME PATIENT_CAREER_NAME,
          HSR.NOTE,
          HSR.REQUEST_ROOM_ID,
          HSR.REQUEST_ROOM_CODE,
          HSR.REQUEST_ROOM_NAME,
          HSR.REQUEST_DEPARTMENT_ID,
          HSR.REQUEST_DEPARTMENT_CODE,
          HSR.REQUEST_DEPARTMENT_NAME,
          HSR.EXECUTE_ROOM_ID,
          HSR.EXECUTE_ROOM_CODE,
          HSR.EXECUTE_ROOM_NAME,
          HSR.EXECUTE_DEPARTMENT_ID,
          HSR.EXECUTE_DEPARTMENT_CODE,
          HSR.EXECUTE_DEPARTMENT_NAME,
          A.ID HIS_SERE_SERV_ID,
          A.SERVICE_ID,
          A.TDL_SERVICE_CODE,
          A.TDL_SERVICE_NAME,
          A.PRICE
        FROM
          V_HIS_SERVICE_REQ HSR
          LEFT JOIN HIS_SERE_SERV A ON HSR.ID = A.SERVICE_REQ_ID
          LEFT JOIN HIS_TREATMENT B ON HSR.TREATMENT_ID = B.ID
        WHERE
          HSR.SERVICE_REQ_CODE = :serviceReqCode
      `;

      const results = await this.hisDataSource.query(query, [serviceReqCode]);

      if (!results || results.length === 0) {
        this.logger.warn(`No service request found for code: ${serviceReqCode}`);
        return null;
      }

      // Group results by service request
      const firstRow = results[0];

      // Lookup Province ID từ provinceCode
      let provinceId: string | null = null;
      if (firstRow.PATIENT_PROVINCE_CODE) {
        try {
          const province = await this.provinceRepository.findByCode(firstRow.PATIENT_PROVINCE_CODE);
          provinceId = province?.id || null;
          this.logger.debug(`Found province ID: ${provinceId} for code: ${firstRow.PATIENT_PROVINCE_CODE}`);
        } catch (error) {
          this.logger.warn(`Could not find province with code: ${firstRow.PATIENT_PROVINCE_CODE}`, error);
          provinceId = null;
        }
      }

      // Lookup Ward ID từ communeCode  
      let wardId: string | null = null;
      if (firstRow.PATIENT_COMMUNE_CODE) {
        try {
          const ward = await this.wardRepository.findByCode(firstRow.PATIENT_COMMUNE_CODE);
          wardId = ward?.id || null;
          this.logger.debug(`Found ward ID: ${wardId} for code: ${firstRow.PATIENT_COMMUNE_CODE}`);
        } catch (error) {
          this.logger.warn(`Could not find ward with code: ${firstRow.PATIENT_COMMUNE_CODE}`, error);
          wardId = null;
        }
      }

      // Lookup LIS Patient ID từ patientCode
      let lisPatientId: string | null = null;
      if (firstRow.PATIENT_CODE) {
        try {
          const lisPatient = await this.patientRepository.findByCode(firstRow.PATIENT_CODE);
          lisPatientId = lisPatient?.id || null;
          this.logger.debug(`Found LIS Patient ID: ${lisPatientId} for code: ${firstRow.PATIENT_CODE}`);
        } catch (error) {
          this.logger.warn(`Could not find LIS patient with code: ${firstRow.PATIENT_CODE}`, error);
          lisPatientId = null;
        }
      }

      const serviceRequest: ServiceRequestInfo = {
        id: firstRow.ID,
        serviceReqCode: firstRow.SERVICE_REQ_CODE,
        serviceReqSttId: firstRow.SERVICE_REQ_STT_ID,
        serviceReqSttCode: firstRow.SERVICE_REQ_STT_CODE,
        serviceReqTypeId: firstRow.SERVICE_REQ_TYPE_ID,
        serviceReqTypeCode: firstRow.SERVICE_REQ_TYPE_CODE,
        instructionTime: firstRow.INTRUCTION_TIME,
        instructionDate: firstRow.INTRUCTION_DATE,
        icdCode: firstRow.ICD_CODE,
        icdName: firstRow.ICD_NAME,
        icdSubCode: firstRow.ICD_SUB_CODE,
        icdText: firstRow.ICD_TEXT,
        treatmentId: firstRow.TREATMENT_ID,
        treatmentCode: firstRow.TREATMENT_CODE,
        note: firstRow.NOTE,
        requestRoom: firstRow.REQUEST_ROOM_ID ? {
          id: firstRow.REQUEST_ROOM_ID,
          code: firstRow.REQUEST_ROOM_CODE,
          name: firstRow.REQUEST_ROOM_NAME,
        } : undefined,
        requestDepartment: firstRow.REQUEST_DEPARTMENT_ID ? {
          id: firstRow.REQUEST_DEPARTMENT_ID,
          code: firstRow.REQUEST_DEPARTMENT_CODE,
          name: firstRow.REQUEST_DEPARTMENT_NAME,
        } : undefined,
        executeRoom: firstRow.EXECUTE_ROOM_ID ? {
          id: firstRow.EXECUTE_ROOM_ID,
          code: firstRow.EXECUTE_ROOM_CODE,
          name: firstRow.EXECUTE_ROOM_NAME,
        } : undefined,
        executeDepartment: firstRow.EXECUTE_DEPARTMENT_ID ? {
          id: firstRow.EXECUTE_DEPARTMENT_ID,
          code: firstRow.EXECUTE_DEPARTMENT_CODE,
          name: firstRow.EXECUTE_DEPARTMENT_NAME,
        } : undefined,
        patient: {
          id: firstRow.PATIENT_ID,
          code: firstRow.PATIENT_CODE,
          name: firstRow.PATIENT_NAME,
          dob: firstRow.PATIENT_DOB,
          cmndNumber: firstRow.PATIENT_CMND_NUMBER,
          cmndDate: firstRow.PATIENT_CCCD_DATE,
          cmndPlace: firstRow.PATIENT_CCCD_PLACE,
          mobile: firstRow.PATIENT_MOBILE,
          phone: firstRow.PATIENT_PHONE,
          provinceId,
          provinceCode: firstRow.PATIENT_PROVINCE_CODE,
          provinceName: firstRow.PATIENT_PROVINCE_NAME,
          wardId,
          communeCode: firstRow.PATIENT_COMMUNE_CODE,
          communeName: firstRow.PATIENT_COMMUNE_NAME,
          address: firstRow.PATIENT_ADDRESS,
          genderId: firstRow.PATIENT_GENDER_ID,
          genderName: firstRow.PATIENT_GENDER_NAME,
          careerName: firstRow.PATIENT_CAREER_NAME,
          lisPatientId,
        },
        services: [],
      };

      // Process services
      const hisServiceCodes = new Set<string>();
      results.forEach((row: any) => {
        if (row.HIS_SERE_SERV_ID) {
          const service: ServiceInfo = {
            hisSereServId: row.HIS_SERE_SERV_ID,
            serviceId: row.SERVICE_ID,
            serviceCode: row.TDL_SERVICE_CODE,
            serviceName: row.TDL_SERVICE_NAME,
            price: row.PRICE || 0,
          };
          serviceRequest.services.push(service);
          hisServiceCodes.add(row.TDL_SERVICE_CODE);
        }
      });

      // Get LIS services mapping
      const lisServicesMap = await this.getLisServicesByHisCodes(Array.from(hisServiceCodes));

      // Map LIS services to HIS services
      serviceRequest.services.forEach(service => {
        const lisService = lisServicesMap.get(service.serviceCode);
        if (lisService) {
          service.lisService = lisService;
        }
      });

      this.logger.log(`Successfully retrieved service request with ${serviceRequest.services.length} services`);
      return serviceRequest;

    } catch (error) {
      this.logger.error('Database query failed', {
        serviceReqCode,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  private async getLisServicesByHisCodes(hisServiceCodes: string[]): Promise<Map<string, LisServiceInfo>> {
    if (hisServiceCodes.length === 0) {
      return new Map();
    }

    try {
      this.logger.log(`Querying LIS database for services with HIS codes: ${hisServiceCodes.join(', ')}`);

      const query = `
        SELECT 
          s.ID,
          s.SERVICE_CODE,
          s.SERVICE_NAME,
          s.SHORT_NAME,
          s.CURRENT_PRICE,
          s.SERVICE_GROUP_ID,
          sg.SERVICE_GROUP_NAME,
          s.UNIT_OF_MEASURE_ID,
          uom.UNIT_OF_MEASURE_NAME,
          s.MAPPING
        FROM BMM_SERVICES s
        LEFT JOIN BMM_SERVICE_GROUPS sg ON s.SERVICE_GROUP_ID = sg.ID
        LEFT JOIN BMM_UNIT_OF_MEASURES uom ON s.UNIT_OF_MEASURE_ID = uom.ID
        WHERE s.DELETED_AT IS NULL
        AND s.IS_ACTIVE = 1
        AND s.MAPPING IS NOT NULL
      `;

      const results = await this.lisDataSource.query(query);
      const lisServicesMap = new Map<string, LisServiceInfo>();

      results.forEach((row: any) => {
        try {
          const mapping = JSON.parse(row.MAPPING);
          if (mapping && mapping.hisCode && hisServiceCodes.includes(mapping.hisCode)) {
            const lisService: LisServiceInfo = {
              id: row.ID,
              serviceCode: row.SERVICE_CODE,
              serviceName: row.SERVICE_NAME,
              shortName: row.SHORT_NAME,
              currentPrice: row.CURRENT_PRICE,
              serviceGroupId: row.SERVICE_GROUP_ID,
              serviceGroupName: row.SERVICE_GROUP_NAME,
              unitOfMeasureId: row.UNIT_OF_MEASURE_ID,
              unitOfMeasureName: row.UNIT_OF_MEASURE_NAME,
            };
            lisServicesMap.set(mapping.hisCode, lisService);
          }
        } catch (error) {
          this.logger.warn(`Failed to parse mapping for service ${row.SERVICE_CODE}: ${error instanceof Error ? error.message : String(error)}`);
        }
      });

      // Get service tests for each LIS service
      const lisServiceIds = Array.from(lisServicesMap.values()).map(service => service.id);
      this.logger.log(`Getting service tests for LIS service IDs: ${lisServiceIds.join(', ')}`);
      const serviceTestsMap = await this.getServiceTestsByServiceIds(lisServiceIds);

      // Add service tests to each LIS service
      lisServicesMap.forEach((lisService, hisCode) => {
        const serviceTests = serviceTestsMap.get(lisService.id) || [];
        lisService.serviceTests = serviceTests;
      });

      this.logger.log(`Found ${lisServicesMap.size} LIS services mapped to HIS services`);
      return lisServicesMap;

    } catch (error) {
      this.logger.error('Failed to query LIS services', {
        hisServiceCodes,
        error: error instanceof Error ? error.message : String(error),
      });
      return new Map();
    }
  }

  private async getServiceTestsByServiceIds(serviceIds: string[]): Promise<Map<string, ServiceTestInfo[]>> {
    if (serviceIds.length === 0) {
      return new Map();
    }

    try {
      this.logger.log(`Querying LIS database for service tests with service IDs: ${serviceIds.join(', ')}`);

      // Create safe string concatenation for Oracle IN clause
      const serviceIdList = serviceIds.map(id => `'${id}'`).join(',');
      const query = `
        SELECT 
          st.ID,
          st.TEST_CODE,
          st.TEST_NAME,
          st.SHORT_NAME,
          st.SERVICE_ID,
          st.UNIT_OF_MEASURE_ID,
          uom.UNIT_OF_MEASURE_NAME,
          st.RANGE_TEXT,
          st.RANGE_LOW,
          st.RANGE_HIGH,
          st.MAPPING,
          st.TEST_ORDER,
          st.IS_ACTIVE_FLAG
        FROM BMM_SERVICE_TESTS st
        LEFT JOIN BMM_UNIT_OF_MEASURES uom ON st.UNIT_OF_MEASURE_ID = uom.ID
        WHERE st.DELETED_AT IS NULL
        AND st.IS_ACTIVE_FLAG = 1
        AND st.SERVICE_ID IN (${serviceIdList})
        ORDER BY st.SERVICE_ID, st.TEST_ORDER ASC, st.CREATED_AT ASC
      `;

      const results = await this.lisDataSource.query(query);
      this.logger.log(`Query returned ${results.length} service tests for ${serviceIds.length} services`);
      this.logger.log(`Service IDs being queried: ${serviceIds.join(', ')}`);

      const serviceTestsMap = new Map<string, ServiceTestInfo[]>();

      results.forEach((row: any) => {
        this.logger.log(`Processing service test: ${row.TEST_CODE} for service: ${row.SERVICE_ID}`);
        const serviceTest: ServiceTestInfo = {
          id: row.ID,
          testCode: row.TEST_CODE,
          testName: row.TEST_NAME,
          shortName: row.SHORT_NAME,
          unitOfMeasureId: row.UNIT_OF_MEASURE_ID,
          unitOfMeasureName: row.UNIT_OF_MEASURE_NAME,
          rangeText: row.RANGE_TEXT,
          rangeLow: row.RANGE_LOW,
          rangeHigh: row.RANGE_HIGH,
          mapping: row.MAPPING,
          testOrder: row.TEST_ORDER,
          isActiveFlag: row.IS_ACTIVE_FLAG,
        };

        const serviceId = row.SERVICE_ID;
        if (!serviceTestsMap.has(serviceId)) {
          serviceTestsMap.set(serviceId, []);
        }
        serviceTestsMap.get(serviceId)!.push(serviceTest);
      });

      this.logger.log(`Found service tests for ${serviceTestsMap.size} services`);
      return serviceTestsMap;

    } catch (error) {
      this.logger.error('Failed to query service tests', {
        serviceIds,
        error: error instanceof Error ? error.message : String(error),
      });
      return new Map();
    }
  }
}
