import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IHisServiceRequestRepository, ServiceRequestInfo, PatientInfo, ServiceInfo } from '../../domain/his-service-request.interface';

@Injectable()
export class HisServiceRequestRepository implements IHisServiceRequestRepository {
  private readonly logger = new Logger(HisServiceRequestRepository.name);

  constructor(
    @InjectDataSource('his')
    private readonly hisDataSource: DataSource,
  ) {}

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
          HSR.TDL_PATIENT_ADDRESS PATIENT_ADDRESS,
          HSR.TDL_PATIENT_GENDER_ID PATIENT_GENDER_ID,
          HSR.TDL_PATIENT_GENDER_NAME PATIENT_GENDER_NAME,
          HSR.TDL_PATIENT_CAREER_NAME PATIENT_CAREER_NAME,
          A.ID HIS_SERE_SERV_ID,
          A.SERVICE_ID,
          A.TDL_SERVICE_CODE,
          A.TDL_SERVICE_NAME,
          A.PRICE
        FROM
          V_HIS_SERVICE_REQ HSR
          LEFT JOIN HIS_SERE_SERV A ON HSR.ID = A.SERVICE_REQ_ID
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
        patient: {
          id: firstRow.PATIENT_ID,
          code: firstRow.PATIENT_CODE,
          name: firstRow.PATIENT_NAME,
          dob: firstRow.PATIENT_DOB,
          address: firstRow.PATIENT_ADDRESS,
          genderId: firstRow.PATIENT_GENDER_ID,
          genderName: firstRow.PATIENT_GENDER_NAME,
          careerName: firstRow.PATIENT_CAREER_NAME,
        },
        services: [],
      };

      // Process services
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
}
