import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetBranchesDto {
    @ApiProperty({ description: 'Search term for branch name or code', example: 'Bạch Mai', required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ description: 'Province ID filter', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525', required: false })
    @IsOptional()
    @IsString()
    provinceId?: string;

    @ApiProperty({ description: 'Ward ID filter', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525', required: false })
    @IsOptional()
    @IsString()
    wardId?: string;

    @ApiProperty({ description: 'Hospital level filter', example: 'Hạng I', required: false })
    @IsOptional()
    @IsString()
    hospitalLevel?: string;

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
