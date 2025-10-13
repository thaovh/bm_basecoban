import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsNumber } from 'class-validator';

export class CreateUnitOfMeasureDto {
    @ApiProperty({ description: 'Mã đơn vị tính', example: 'ML' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    unitOfMeasureCode: string;

    @ApiProperty({ description: 'Tên đơn vị tính', example: 'Milliliter' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    unitOfMeasureName: string;

    @ApiProperty({ description: 'Mô tả đơn vị tính', example: 'Đơn vị đo thể tích chất lỏng', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiProperty({
        description: 'Thông tin mapping (JSON string hoặc text mapping)',
        example: '{"hisCode": "ML", "externalSystem": "LIS", "conversionFactor": 1}',
        required: false
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    mapping?: string;

    @ApiProperty({ description: 'Trạng thái hoạt động', example: 1, required: false })
    @IsOptional()
    @IsNumber()
    isActiveFlag?: number;
}
