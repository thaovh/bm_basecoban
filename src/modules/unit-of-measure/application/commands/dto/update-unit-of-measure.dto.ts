import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsNumber } from 'class-validator';

export class UpdateUnitOfMeasureDto {
    @ApiProperty({ description: 'Tên đơn vị tính', example: 'Milliliter Updated', required: false })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    unitOfMeasureName?: string;

    @ApiProperty({ description: 'Mô tả đơn vị tính', example: 'Đơn vị đo thể tích chất lỏng cập nhật', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiProperty({
        description: 'Thông tin mapping (JSON string hoặc text mapping)',
        example: '{"hisCode": "ML_UPD", "externalSystem": "LIS", "conversionFactor": 1}',
        required: false
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    mapping?: string;

    @ApiProperty({ description: 'Trạng thái hoạt động', example: 0, required: false })
    @IsOptional()
    @IsNumber()
    isActiveFlag?: number;
}
