import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetRoomsDto {
    @ApiProperty({ description: 'Search term for room name or code', example: 'Tim Mạch', required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ description: 'Department ID filter', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525', required: false })
    @IsOptional()
    @IsString()
    departmentId?: string;

    @ApiProperty({ description: 'Filter by active status', example: true, required: false })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    isActive?: boolean;

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
