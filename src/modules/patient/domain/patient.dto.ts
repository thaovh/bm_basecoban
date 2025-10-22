import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsNumber, IsBoolean, IsEmail, Length, MinLength, MaxLength } from 'class-validator';

export class CreatePatientDto {
    @ApiProperty({ description: 'Patient code', example: '0003110473' })
    @IsString()
    @Length(1, 50)
    patientCode: string;

    @ApiProperty({ description: 'Patient name', example: 'NGUYỄN THỊ QUÝ' })
    @IsString()
    @Length(1, 200)
    patientName: string;

    @ApiProperty({ description: 'Date of birth', example: '1989-01-04' })
    @IsDateString()
    dateOfBirth: string;

    @ApiProperty({ description: 'CMND/CCCD number', example: '025189009861', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    cmndNumber?: string;

    @ApiProperty({ description: 'CMND/CCCD issue date', example: '2021-06-25', required: false })
    @IsOptional()
    @IsDateString()
    cmndDate?: string;

    @ApiProperty({ description: 'CMND/CCCD issue place', example: 'CA HCM', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    cmndPlace?: string;

    @ApiProperty({ description: 'Mobile phone', example: '0902267672', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    mobile?: string;

    @ApiProperty({ description: 'Landline phone', example: '0281234567', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    phone?: string;

    @ApiProperty({ description: 'Province ID', example: 'uuid-province-id', required: false })
    @IsOptional()
    @IsString()
    provinceId?: string;

    @ApiProperty({ description: 'Ward ID', example: 'uuid-ward-id', required: false })
    @IsOptional()
    @IsString()
    wardId?: string;

    @ApiProperty({ description: 'Full address', example: 'KHU 1 Ninh Dân, Xã Hoàng Cương, Phú Thọ' })
    @IsString()
    @Length(1, 1000)
    address: string;

    @ApiProperty({ description: 'Gender ID', example: 1 })
    @IsNumber()
    genderId: number;

    @ApiProperty({ description: 'Gender name', example: 'Nữ' })
    @IsString()
    @Length(1, 50)
    genderName: string;

    @ApiProperty({ description: 'Career/Profession', example: 'Không xác định', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    careerName?: string;

    @ApiProperty({ description: 'HIS Patient ID', example: 3110600, required: false })
    @IsOptional()
    @IsNumber()
    hisId?: number;

    @ApiProperty({ description: 'Is patient active', example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdatePatientDto {
    @ApiProperty({ description: 'Patient name', example: 'NGUYỄN THỊ QUÝ', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 200)
    patientName?: string;

    @ApiProperty({ description: 'Date of birth', example: '1989-01-04', required: false })
    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;

    @ApiProperty({ description: 'CMND/CCCD number', example: '025189009861', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    cmndNumber?: string;

    @ApiProperty({ description: 'CMND/CCCD issue date', example: '2021-06-25', required: false })
    @IsOptional()
    @IsDateString()
    cmndDate?: string;

    @ApiProperty({ description: 'CMND/CCCD issue place', example: 'CA HCM', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    cmndPlace?: string;

    @ApiProperty({ description: 'Mobile phone', example: '0902267672', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    mobile?: string;

    @ApiProperty({ description: 'Landline phone', example: '0281234567', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    phone?: string;

    @ApiProperty({ description: 'Province ID', example: 'uuid-province-id', required: false })
    @IsOptional()
    @IsString()
    provinceId?: string;

    @ApiProperty({ description: 'Ward ID', example: 'uuid-ward-id', required: false })
    @IsOptional()
    @IsString()
    wardId?: string;

    @ApiProperty({ description: 'Full address', example: 'KHU 1 Ninh Dân, Xã Hoàng Cương, Phú Thọ', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 1000)
    address?: string;

    @ApiProperty({ description: 'Gender ID', example: 1, required: false })
    @IsOptional()
    @IsNumber()
    genderId?: number;

    @ApiProperty({ description: 'Gender name', example: 'Nữ', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    genderName?: string;

    @ApiProperty({ description: 'Career/Profession', example: 'Không xác định', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    careerName?: string;

    @ApiProperty({ description: 'Is patient active', example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class SyncPatientFromHisDto {
    @ApiProperty({ description: 'HIS Patient ID', example: 3110600 })
    @IsNumber()
    hisId: number;

    @ApiProperty({ description: 'Patient code', example: '0003110473' })
    @IsString()
    @Length(1, 50)
    patientCode: string;

    @ApiProperty({ description: 'Patient name', example: 'NGUYỄN THỊ QUÝ' })
    @IsString()
    @Length(1, 200)
    patientName: string;

    @ApiProperty({ description: 'Date of birth', example: '1989-01-04' })
    @IsDateString()
    dateOfBirth: string;

    @ApiProperty({ description: 'CMND/CCCD number', example: '025189009861', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    cmndNumber?: string;

    @ApiProperty({ description: 'CMND/CCCD issue date', example: '2021-06-25', required: false })
    @IsOptional()
    @IsDateString()
    cmndDate?: string;

    @ApiProperty({ description: 'CMND/CCCD issue place', example: 'CA HCM', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    cmndPlace?: string;

    @ApiProperty({ description: 'Mobile phone', example: '0902267672', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    mobile?: string;

    @ApiProperty({ description: 'Landline phone', example: '0281234567', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    phone?: string;

    @ApiProperty({ description: 'Province ID', example: 'uuid-province-id', required: false })
    @IsOptional()
    @IsString()
    provinceId?: string;

    @ApiProperty({ description: 'Ward ID', example: 'uuid-ward-id', required: false })
    @IsOptional()
    @IsString()
    wardId?: string;

    @ApiProperty({ description: 'Full address', example: 'KHU 1 Ninh Dân, Xã Hoàng Cương, Phú Thọ' })
    @IsString()
    @Length(1, 1000)
    address: string;

    @ApiProperty({ description: 'Gender ID', example: 1 })
    @IsNumber()
    genderId: number;

    @ApiProperty({ description: 'Gender name', example: 'Nữ' })
    @IsString()
    @Length(1, 50)
    genderName: string;

    @ApiProperty({ description: 'Career/Profession', example: 'Không xác định', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    careerName?: string;
}

export class GetPatientsDto {
    @ApiProperty({ description: 'Page limit', example: 10, required: false })
    @IsOptional()
    @IsNumber()
    limit?: number;

    @ApiProperty({ description: 'Page offset', example: 0, required: false })
    @IsOptional()
    @IsNumber()
    offset?: number;

    @ApiProperty({ description: 'Search term', example: 'Nguyen', required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ description: 'Filter by active status', example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class SearchPatientsDto {
    @ApiProperty({ description: 'Search term', example: 'Nguyen' })
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
