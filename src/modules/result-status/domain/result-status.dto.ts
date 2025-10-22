import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';

export class CreateResultStatusDto {
    @ApiProperty({ description: 'Status Code', example: 'PENDING' })
    @IsString()
    statusCode: string;

    @ApiProperty({ description: 'Status Name', example: 'Đang chờ xử lý' })
    @IsString()
    statusName: string;

    @ApiProperty({ description: 'Order Number', example: 1 })
    @IsNumber()
    @Min(1)
    orderNumber: number;

    @ApiProperty({ description: 'Description', example: 'Trạng thái chờ xử lý kết quả', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Color Code for UI', example: '#FFA500', required: false })
    @IsOptional()
    @IsString()
    colorCode?: string;

    @ApiProperty({ description: 'Is Active', example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateResultStatusDto {
    @ApiProperty({ description: 'Status Code', example: 'PENDING', required: false })
    @IsOptional()
    @IsString()
    statusCode?: string;

    @ApiProperty({ description: 'Status Name', example: 'Đang chờ xử lý', required: false })
    @IsOptional()
    @IsString()
    statusName?: string;

    @ApiProperty({ description: 'Order Number', example: 1, required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    orderNumber?: number;

    @ApiProperty({ description: 'Description', example: 'Trạng thái chờ xử lý kết quả', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Color Code for UI', example: '#FFA500', required: false })
    @IsOptional()
    @IsString()
    colorCode?: string;

    @ApiProperty({ description: 'Is Active', example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class GetResultStatusesDto {
    @ApiProperty({ description: 'Page limit', example: 10, required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number;

    @ApiProperty({ description: 'Page offset', example: 0, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    offset?: number;

    @ApiProperty({ description: 'Search term', example: 'pending', required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ description: 'Filter by active status', example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({ description: 'Sort by order number', example: true, required: false })
    @IsOptional()
    @IsBoolean()
    sortByOrder?: boolean;
}

export class SearchResultStatusesDto {
    @ApiProperty({ description: 'Search term', example: 'pending' })
    @IsString()
    searchTerm: string;

    @ApiProperty({ description: 'Page limit', example: 10, required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number;

    @ApiProperty({ description: 'Page offset', example: 0, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    offset?: number;
}
