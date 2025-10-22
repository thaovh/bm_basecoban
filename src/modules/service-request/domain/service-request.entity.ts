import {
    Entity,
    Column,
    Index,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ServiceRequestItem } from './service-request-item.entity';

@Entity('BMM_SERVICE_REQUESTS')
@Index('IDX_BMM_SR_CODE', ['serviceReqCode'])
@Index('IDX_BMM_SR_PATIENT', ['patientId'])
@Index('IDX_BMM_SR_TREATMENT', ['treatmentId'])
@Index('IDX_BMM_SR_ACTIVE', ['isActiveFlag'])
@Index('UK_BMM_SR_CODE', ['serviceReqCode'], { unique: true })
export class ServiceRequest extends BaseEntity {

    // HIS Integration Fields
    @Column({ name: 'HIS_SERVICE_REQ_ID', type: 'number', nullable: true })
    @ApiProperty({ description: 'HIS Service Request ID', example: 54091049, required: false })
    hisServiceReqId?: number;

    @Column({ name: 'SERVICE_REQ_CODE', type: 'varchar2', length: 50 })
    @ApiProperty({ description: 'Service Request Code', example: '000054090874' })
    serviceReqCode: string;

    // Status & Type
    @Column({ name: 'SERVICE_REQ_STT_ID', type: 'number' })
    @ApiProperty({ description: 'Service Request Status ID', example: 3 })
    serviceReqSttId: number;

    @Column({ name: 'SERVICE_REQ_STT_CODE', type: 'varchar2', length: 10 })
    @ApiProperty({ description: 'Service Request Status Code', example: '03' })
    serviceReqSttCode: string;

    @Column({ name: 'SERVICE_REQ_TYPE_ID', type: 'number' })
    @ApiProperty({ description: 'Service Request Type ID', example: 2 })
    serviceReqTypeId: number;

    @Column({ name: 'SERVICE_REQ_TYPE_CODE', type: 'varchar2', length: 10 })
    @ApiProperty({ description: 'Service Request Type Code', example: 'XN' })
    serviceReqTypeCode: string;

    // Timing
    @Column({ name: 'INSTRUCTION_TIME', type: 'timestamp' })
    @ApiProperty({ description: 'Instruction Time', example: '2025-09-27T08:00:00Z' })
    instructionTime: Date;

    @Column({ name: 'INSTRUCTION_DATE', type: 'date' })
    @ApiProperty({ description: 'Instruction Date', example: '2025-09-27' })
    instructionDate: Date;

    // Medical Information
    @Column({ name: 'ICD_CODE', type: 'varchar2', length: 20, nullable: true })
    @ApiProperty({ description: 'ICD Code', example: 'D44.1', required: false })
    icdCode?: string;

    @Column({ name: 'ICD_NAME', type: 'varchar2', length: 500, nullable: true })
    @ApiProperty({ description: 'ICD Name', example: 'U vị trí đuôi tụy', required: false })
    icdName?: string;

    @Column({ name: 'ICD_SUB_CODE', type: 'varchar2', length: 100, nullable: true })
    @ApiProperty({ description: 'ICD Sub Code', example: ';E11;I10', required: false })
    icdSubCode?: string;

    @Column({ name: 'ICD_TEXT', type: 'clob', nullable: true })
    @ApiProperty({ description: 'ICD Text', required: false })
    icdText?: string;

    // Treatment Reference
    @Column({ name: 'TREATMENT_ID', type: 'number', nullable: true })
    @ApiProperty({ description: 'Treatment ID', example: 5139025, required: false })
    treatmentId?: number;

    @Column({ name: 'TREATMENT_CODE', type: 'varchar2', length: 50, nullable: true })
    @ApiProperty({ description: 'Treatment Code', example: '000005138950', required: false })
    treatmentCode?: string;

    // Patient Information (Denormalized for performance)
    @Column({ name: 'PATIENT_ID', type: 'number' })
    @ApiProperty({ description: 'Patient ID', example: 3110600 })
    patientId: number;

    @Column({ name: 'PATIENT_CODE', type: 'varchar2', length: 50 })
    @ApiProperty({ description: 'Patient Code', example: '0003110473' })
    patientCode: string;

    @Column({ name: 'PATIENT_NAME', type: 'varchar2', length: 200 })
    @ApiProperty({ description: 'Patient Name', example: 'NGUYỄN THỊ QUÝ' })
    patientName: string;

    @Column({ name: 'PATIENT_DOB', type: 'number' })
    @ApiProperty({ description: 'Patient Date of Birth', example: 19890104000000 })
    patientDob: number;

    @Column({ name: 'PATIENT_CMND_NUMBER', type: 'varchar2', length: 20, nullable: true })
    @ApiProperty({ description: 'Patient CMND Number', example: '025189009861', required: false })
    patientCmndNumber?: string;

    @Column({ name: 'PATIENT_CMND_DATE', type: 'number', nullable: true })
    @ApiProperty({ description: 'Patient CMND Date', example: 20210625000000, required: false })
    patientCmndDate?: number;

    @Column({ name: 'PATIENT_CMND_PLACE', type: 'varchar2', length: 100, nullable: true })
    @ApiProperty({ description: 'Patient CMND Place', required: false })
    patientCmndPlace?: string;

    @Column({ name: 'PATIENT_MOBILE', type: 'varchar2', length: 20, nullable: true })
    @ApiProperty({ description: 'Patient Mobile', example: '0902267672', required: false })
    patientMobile?: string;

    @Column({ name: 'PATIENT_PHONE', type: 'varchar2', length: 20, nullable: true })
    @ApiProperty({ description: 'Patient Phone', required: false })
    patientPhone?: string;

    @Column({ name: 'PATIENT_PROVINCE_CODE', type: 'varchar2', length: 10, nullable: true })
    @ApiProperty({ description: 'Patient Province Code', example: '25', required: false })
    patientProvinceCode?: string;

    @Column({ name: 'PATIENT_PROVINCE_NAME', type: 'varchar2', length: 100, nullable: true })
    @ApiProperty({ description: 'Patient Province Name', example: 'Phú Thọ', required: false })
    patientProvinceName?: string;

    @Column({ name: 'PATIENT_COMMUNE_CODE', type: 'varchar2', length: 10, nullable: true })
    @ApiProperty({ description: 'Patient Commune Code', example: '08203', required: false })
    patientCommuneCode?: string;

    @Column({ name: 'PATIENT_COMMUNE_NAME', type: 'varchar2', length: 100, nullable: true })
    @ApiProperty({ description: 'Patient Commune Name', example: 'Xã Hoàng Cương', required: false })
    patientCommuneName?: string;

    @Column({ name: 'PATIENT_ADDRESS', type: 'clob' })
    @ApiProperty({ description: 'Patient Address', example: 'KHU 1 Ninh Dân, Xã Hoàng Cương, Phú Thọ' })
    patientAddress: string;

    @Column({ name: 'PATIENT_GENDER_ID', type: 'number' })
    @ApiProperty({ description: 'Patient Gender ID', example: 1 })
    patientGenderId: number;

    @Column({ name: 'PATIENT_GENDER_NAME', type: 'varchar2', length: 50 })
    @ApiProperty({ description: 'Patient Gender Name', example: 'Nữ' })
    patientGenderName: string;

    @Column({ name: 'PATIENT_CAREER_NAME', type: 'varchar2', length: 100, nullable: true })
    @ApiProperty({ description: 'Patient Career Name', example: 'Không xác định', required: false })
    patientCareerName?: string;

    // LIS Patient Reference
    @Column({ name: 'LIS_PATIENT_ID', type: 'varchar2', length: 36, nullable: true })
    @ApiProperty({ description: 'LIS Patient ID', example: 'uuid-patient-id', required: false })
    lisPatientId?: string;

    // Room & Department Information (Denormalized)
    @Column({ name: 'REQUEST_ROOM_ID', type: 'number', nullable: true })
    @ApiProperty({ description: 'Request Room ID', example: 4828, required: false })
    requestRoomId?: number;

    @Column({ name: 'REQUEST_ROOM_CODE', type: 'varchar2', length: 50, nullable: true })
    @ApiProperty({ description: 'Request Room Code', example: 'NPKNTBB0623', required: false })
    requestRoomCode?: string;

    @Column({ name: 'REQUEST_ROOM_NAME', type: 'varchar2', length: 200, nullable: true })
    @ApiProperty({ description: 'Request Room Name', example: 'Phòng 623', required: false })
    requestRoomName?: string;

    @Column({ name: 'REQUEST_DEPARTMENT_ID', type: 'number', nullable: true })
    @ApiProperty({ description: 'Request Department ID', example: 38, required: false })
    requestDepartmentId?: number;

    @Column({ name: 'REQUEST_DEPARTMENT_CODE', type: 'varchar2', length: 50, nullable: true })
    @ApiProperty({ description: 'Request Department Code', example: '30', required: false })
    requestDepartmentCode?: string;

    @Column({ name: 'REQUEST_DEPARTMENT_NAME', type: 'varchar2', length: 200, nullable: true })
    @ApiProperty({ description: 'Request Department Name', example: 'Khoa Nội tiết - Đái tháo đường', required: false })
    requestDepartmentName?: string;

    @Column({ name: 'EXECUTE_ROOM_ID', type: 'number', nullable: true })
    @ApiProperty({ description: 'Execute Room ID', example: 410, required: false })
    executeRoomId?: number;

    @Column({ name: 'EXECUTE_ROOM_CODE', type: 'varchar2', length: 50, nullable: true })
    @ApiProperty({ description: 'Execute Room Code', example: 'P168', required: false })
    executeRoomCode?: string;

    @Column({ name: 'EXECUTE_ROOM_NAME', type: 'varchar2', length: 200, nullable: true })
    @ApiProperty({ description: 'Execute Room Name', example: 'Phòng Xét Nghiệm Sinh Hóa', required: false })
    executeRoomName?: string;

    @Column({ name: 'EXECUTE_DEPARTMENT_ID', type: 'number', nullable: true })
    @ApiProperty({ description: 'Execute Department ID', example: 58, required: false })
    executeDepartmentId?: number;

    @Column({ name: 'EXECUTE_DEPARTMENT_CODE', type: 'varchar2', length: 50, nullable: true })
    @ApiProperty({ description: 'Execute Department Code', example: '37', required: false })
    executeDepartmentCode?: string;

    @Column({ name: 'EXECUTE_DEPARTMENT_NAME', type: 'varchar2', length: 200, nullable: true })
    @ApiProperty({ description: 'Execute Department Name', example: 'Khoa Hóa Sinh', required: false })
    executeDepartmentName?: string;

    // Additional Fields
    @Column({ name: 'NOTE', type: 'clob', nullable: true })
    @ApiProperty({ description: 'Note', required: false })
    note?: string;

    @Column({ name: 'TOTAL_AMOUNT', type: 'decimal', precision: 15, scale: 2, default: 0 })
    @ApiProperty({ description: 'Total Amount', example: 0 })
    totalAmount: number;

    @Column({ name: 'STATUS', type: 'varchar2', length: 20, default: 'PENDING' })
    @ApiProperty({ description: 'Status', example: 'PENDING' })
    status: string;

    @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
    @ApiProperty({ description: 'Is Active', example: true })
    isActiveFlag: number;

    // Relationships
    @OneToMany(() => ServiceRequestItem, item => item.serviceRequest)
    serviceRequestItems: ServiceRequestItem[];

    // Business methods
    isServiceRequestActive(): boolean {
        return this.isActiveFlag === 1 && super.isActive();
    }

    calculateTotalAmount(): number {
        return this.serviceRequestItems?.reduce((total, item) => total + item.totalPrice, 0) || 0;
    }

    getPatientFullName(): string {
        return this.patientName;
    }

    getPatientFullAddress(): string {
        return `${this.patientAddress}, ${this.patientCommuneName || ''}, ${this.patientProvinceName || ''}`;
    }
}
