import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsNumber, IsBoolean, Length, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServiceRequestDto {
    @ApiProperty({ description: 'Service Request Code', example: '000054090874' })
    @IsString()
    @Length(1, 50)
    serviceReqCode: string;

    @ApiProperty({ description: 'Service Request Status ID', example: 3 })
    @IsNumber()
    serviceReqSttId: number;

    @ApiProperty({ description: 'Service Request Status Code', example: '03' })
    @IsString()
    @Length(1, 10)
    serviceReqSttCode: string;

    @ApiProperty({ description: 'Service Request Type ID', example: 2 })
    @IsNumber()
    serviceReqTypeId: number;

    @ApiProperty({ description: 'Service Request Type Code', example: 'XN' })
    @IsString()
    @Length(1, 10)
    serviceReqTypeCode: string;

    @ApiProperty({ description: 'Instruction Time', example: '2025-09-27T08:00:00Z' })
    @IsDateString()
    instructionTime: string;

    @ApiProperty({ description: 'Instruction Date', example: '2025-09-27' })
    @IsDateString()
    instructionDate: string;

    @ApiProperty({ description: 'ICD Code', example: 'D44.1', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    icdCode?: string;

    @ApiProperty({ description: 'ICD Name', example: 'U vị trí đuôi tụy', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 500)
    icdName?: string;

    @ApiProperty({ description: 'ICD Sub Code', example: ';E11;I10', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    icdSubCode?: string;

    @ApiProperty({ description: 'Treatment ID', example: 5139025, required: false })
    @IsOptional()
    @IsNumber()
    treatmentId?: number;

    @ApiProperty({ description: 'Treatment Code', example: '000005138950', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    treatmentCode?: string;

    @ApiProperty({ description: 'Patient ID', example: 3110600 })
    @IsNumber()
    patientId: number;

    @ApiProperty({ description: 'Patient Code', example: '0003110473' })
    @IsString()
    @Length(1, 50)
    patientCode: string;

    @ApiProperty({ description: 'Patient Name', example: 'NGUYỄN THỊ QUÝ' })
    @IsString()
    @Length(1, 200)
    patientName: string;

    @ApiProperty({ description: 'Patient Date of Birth', example: 19890104000000 })
    @IsNumber()
    patientDob: number;

    @ApiProperty({ description: 'Patient CMND Number', example: '025189009861', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    patientCmndNumber?: string;

    @ApiProperty({ description: 'Patient CMND Date', example: 20210625000000, required: false })
    @IsOptional()
    @IsNumber()
    patientCmndDate?: number;

    @ApiProperty({ description: 'Patient CMND Place', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    patientCmndPlace?: string;

    @ApiProperty({ description: 'Patient Mobile', example: '0902267672', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    patientMobile?: string;

    @ApiProperty({ description: 'Patient Phone', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    patientPhone?: string;

    @ApiProperty({ description: 'Patient Province Code', example: '25', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 10)
    patientProvinceCode?: string;

    @ApiProperty({ description: 'Patient Province Name', example: 'Phú Thọ', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    patientProvinceName?: string;

    @ApiProperty({ description: 'Patient Commune Code', example: '08203', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 10)
    patientCommuneCode?: string;

    @ApiProperty({ description: 'Patient Commune Name', example: 'Xã Hoàng Cương', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    patientCommuneName?: string;

    @ApiProperty({ description: 'Patient Address', example: 'KHU 1 Ninh Dân, Xã Hoàng Cương, Phú Thọ' })
    @IsString()
    @Length(1, 1000)
    patientAddress: string;

    @ApiProperty({ description: 'Patient Gender ID', example: 1 })
    @IsNumber()
    patientGenderId: number;

    @ApiProperty({ description: 'Patient Gender Name', example: 'Nữ' })
    @IsString()
    @Length(1, 50)
    patientGenderName: string;

    @ApiProperty({ description: 'Patient Career Name', example: 'Không xác định', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    patientCareerName?: string;

    @ApiProperty({ description: 'LIS Patient ID', example: 'uuid-patient-id', required: false })
    @IsOptional()
    @IsString()
    lisPatientId?: string;

    @ApiProperty({ description: 'Request Room ID', example: 4828, required: false })
    @IsOptional()
    @IsNumber()
    requestRoomId?: number;

    @ApiProperty({ description: 'Request Room Code', example: 'NPKNTBB0623', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    requestRoomCode?: string;

    @ApiProperty({ description: 'Request Room Name', example: 'Phòng 623', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 200)
    requestRoomName?: string;

    @ApiProperty({ description: 'Request Department ID', example: 38, required: false })
    @IsOptional()
    @IsNumber()
    requestDepartmentId?: number;

    @ApiProperty({ description: 'Request Department Code', example: '30', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    requestDepartmentCode?: string;

    @ApiProperty({ description: 'Request Department Name', example: 'Khoa Nội tiết - Đái tháo đường', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 200)
    requestDepartmentName?: string;

    @ApiProperty({ description: 'Execute Room ID', example: 410, required: false })
    @IsOptional()
    @IsNumber()
    executeRoomId?: number;

    @ApiProperty({ description: 'Execute Room Code', example: 'P168', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    executeRoomCode?: string;

    @ApiProperty({ description: 'Execute Room Name', example: 'Phòng Xét Nghiệm Sinh Hóa', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 200)
    executeRoomName?: string;

    @ApiProperty({ description: 'Execute Department ID', example: 58, required: false })
    @IsOptional()
    @IsNumber()
    executeDepartmentId?: number;

    @ApiProperty({ description: 'Execute Department Code', example: '37', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    executeDepartmentCode?: string;

    @ApiProperty({ description: 'Execute Department Name', example: 'Khoa Hóa Sinh', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 200)
    executeDepartmentName?: string;

    @ApiProperty({ description: 'Note', required: false })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiProperty({ description: 'Total Amount', example: 0, required: false })
    @IsOptional()
    @IsNumber()
    totalAmount?: number;

    @ApiProperty({ description: 'Status', example: 'PENDING', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    status?: string;

    @ApiProperty({ description: 'Is Active', example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateServiceRequestDto {
    @ApiProperty({ description: 'Service Request Status ID', example: 3, required: false })
    @IsOptional()
    @IsNumber()
    serviceReqSttId?: number;

    @ApiProperty({ description: 'Service Request Status Code', example: '03', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 10)
    serviceReqSttCode?: string;

    @ApiProperty({ description: 'Instruction Time', example: '2025-09-27T08:00:00Z', required: false })
    @IsOptional()
    @IsDateString()
    instructionTime?: string;

    @ApiProperty({ description: 'Instruction Date', example: '2025-09-27', required: false })
    @IsOptional()
    @IsDateString()
    instructionDate?: string;

    @ApiProperty({ description: 'ICD Code', example: 'D44.1', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    icdCode?: string;

    @ApiProperty({ description: 'ICD Name', example: 'U vị trí đuôi tụy', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 500)
    icdName?: string;

    @ApiProperty({ description: 'Note', required: false })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiProperty({ description: 'Total Amount', example: 0, required: false })
    @IsOptional()
    @IsNumber()
    totalAmount?: number;

    @ApiProperty({ description: 'Status', example: 'PENDING', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    status?: string;

    @ApiProperty({ description: 'Is Active', example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class CreateServiceRequestItemDto {
    @ApiProperty({ description: 'Service Request ID', example: 'uuid-service-request-id' })
    @IsString()
    serviceRequestId: string;

    @ApiProperty({ description: 'HIS Sere Serv ID', example: 110006624 })
    @IsNumber()
    hisSereServId: number;

    @ApiProperty({ description: 'HIS Service ID', example: 5853 })
    @IsNumber()
    hisServiceId: number;

    @ApiProperty({ description: 'HIS Service Code', example: 'BM00132' })
    @IsString()
    @Length(1, 50)
    hisServiceCode: string;

    @ApiProperty({ description: 'HIS Service Name', example: 'Điện giải đồ (Na, K, Cl)' })
    @IsString()
    @Length(1, 200)
    hisServiceName: string;

    @ApiProperty({ description: 'HIS Price', example: 30200 })
    @IsNumber()
    hisPrice: number;

    @ApiProperty({ description: 'LIS Service ID', example: 'uuid-lis-service-id', required: false })
    @IsOptional()
    @IsString()
    lisServiceId?: string;

    @ApiProperty({ description: 'LIS Service Code', example: 'LAB_001', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    lisServiceCode?: string;

    @ApiProperty({ description: 'LIS Service Name', example: 'Dien giai do (Na, K, Cl)', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 200)
    lisServiceName?: string;

    @ApiProperty({ description: 'LIS Short Name', example: 'Dien giai do', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    lisShortName?: string;

    @ApiProperty({ description: 'LIS Current Price', example: 35000, required: false })
    @IsOptional()
    @IsNumber()
    lisCurrentPrice?: number;

    @ApiProperty({ description: 'Service Group ID', example: 'uuid-service-group-id', required: false })
    @IsOptional()
    @IsString()
    serviceGroupId?: string;

    @ApiProperty({ description: 'Service Group Name', example: 'Laboratory Services', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 200)
    serviceGroupName?: string;

    @ApiProperty({ description: 'Unit of Measure ID', example: 'uuid-unit-of-measure-id', required: false })
    @IsOptional()
    @IsString()
    unitOfMeasureId?: string;

    @ApiProperty({ description: 'Unit of Measure Name', example: 'Lan', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    unitOfMeasureName?: string;

    @ApiProperty({ description: 'Quantity', example: 1, required: false })
    @IsOptional()
    @IsNumber()
    quantity?: number;

    @ApiProperty({ description: 'Unit Price', example: 30200, required: false })
    @IsOptional()
    @IsNumber()
    unitPrice?: number;

    @ApiProperty({ description: 'Total Price', example: 30200, required: false })
    @IsOptional()
    @IsNumber()
    totalPrice?: number;

    @ApiProperty({ description: 'Status', example: 'PENDING', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    status?: string;

    @ApiProperty({ description: 'Item Order', example: 1, required: false })
    @IsOptional()
    @IsNumber()
    itemOrder?: number;

    @ApiProperty({ description: 'Is Active', example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class GetServiceRequestsDto {
    @ApiProperty({ description: 'Page limit', example: 10, required: false })
    @IsOptional()
    @IsNumber()
    limit?: number;

    @ApiProperty({ description: 'Page offset', example: 0, required: false })
    @IsOptional()
    @IsNumber()
    offset?: number;

    @ApiProperty({ description: 'Search term', example: '000054090874', required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ description: 'Filter by active status', example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({ description: 'Filter by patient ID', example: 3110600, required: false })
    @IsOptional()
    @IsNumber()
    patientId?: number;

    @ApiProperty({ description: 'Filter by treatment ID', example: 5139025, required: false })
    @IsOptional()
    @IsNumber()
    treatmentId?: number;
}

export class SearchServiceRequestsDto {
    @ApiProperty({ description: 'Search term', example: '000054090874' })
    @IsString()
    @Length(1, 100)
    searchTerm: string;

    @ApiProperty({ description: 'Page limit', example: 10, required: false })
    @IsOptional()
    @IsNumber()
    limit?: number;

    @ApiProperty({ description: 'Page offset', example: 0, required: false })
    @IsOptional()
    @IsNumber()
    offset?: number;
}
