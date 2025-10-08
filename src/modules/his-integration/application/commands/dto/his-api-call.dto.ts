import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class HisApiCallDto {
    @ApiProperty({ description: 'HIS API endpoint', example: '/api/Patient/GetPatientInfo' })
    @IsString()
    @IsNotEmpty()
    endpoint: string;

    @ApiProperty({ description: 'Request data', example: { patientId: '12345' }, required: false })
    @IsOptional()
    @IsObject()
    data?: any;

    @ApiProperty({ description: 'Username for token (optional)', example: 'vht2', required: false })
    @IsOptional()
    @IsString()
    username?: string;
}
