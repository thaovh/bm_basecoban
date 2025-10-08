import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetDepartmentsDto {
    @ApiProperty({ description: 'Search term for department name or code', example: 'Tim Mạch', required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ description: 'Branch ID filter', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525', required: false })
    @IsOptional()
    @IsString()
    branchId?: string;

    @ApiProperty({ description: 'Department type ID filter', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525', required: false })
    @IsOptional()
    @IsString()
    departmentTypeId?: string;

    @ApiProperty({ description: 'Parent department ID filter', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525', required: false })
    @IsOptional()
    @IsString()
    parentDepartmentId?: string;

    @ApiProperty({ description: 'Filter by active status', example: true, required: false })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    isActive?: boolean;

    @ApiProperty({ description: 'Show only parent departments (no parent)', example: true, required: false })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    parentOnly?: boolean;

    @ApiProperty({ description: 'Show only sub departments (has parent)', example: true, required: false })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    subOnly?: boolean;

    @ApiProperty({ description: 'Number of items per page', example: 10, minimum: 1, maximum: 100, required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    @Max(100)
    limit?: number;

    @ApiProperty({ description: 'Number of items to skip', example: 0, minimum: 0, required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    offset?: number;
}
