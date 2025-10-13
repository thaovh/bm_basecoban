import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsNumber, IsUUID, Min } from 'class-validator';

export class UpdateServiceDto {
    @ApiProperty({ description: 'Tên dịch vụ', example: 'Xét nghiệm máu tổng quát cập nhật', required: false })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    serviceName?: string;

    @ApiProperty({ description: 'Tên viết tắt', example: 'XN Máu TQ UPD', required: false })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    shortName?: string;

    @ApiProperty({ description: 'ID nhóm dịch vụ', example: 'uuid-service-group-id', required: false })
    @IsOptional()
    @IsString()
    @IsUUID()
    serviceGroupId?: string;

    @ApiProperty({ description: 'ID đơn vị tính', example: 'uuid-unit-of-measure-id', required: false })
    @IsOptional()
    @IsString()
    @IsUUID()
    unitOfMeasureId?: string;

    @ApiProperty({
        description: 'Thông tin mapping (JSON string)',
        example: '{"hisCode": "LAB001_UPD", "externalSystem": "LIS"}',
        required: false
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    mapping?: string;

    @ApiProperty({ description: 'Số thứ tự', example: 2, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    numOrder?: number;

    @ApiProperty({ description: 'Giá hiện tại', example: 160000.00, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    currentPrice?: number;

    @ApiProperty({ description: 'ID dịch vụ cha', example: 'uuid-parent-service-id', required: false })
    @IsOptional()
    @IsString()
    @IsUUID()
    parentServiceId?: string;

    @ApiProperty({ description: 'Trạng thái hoạt động', example: 0, required: false })
    @IsOptional()
    @IsNumber()
    isActiveFlag?: number;
}
