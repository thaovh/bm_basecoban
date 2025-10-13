import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateServiceDto {
    @ApiProperty({ description: 'Mã dịch vụ', example: 'LAB_001' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    serviceCode: string;

    @ApiProperty({ description: 'Tên dịch vụ', example: 'Xét nghiệm máu tổng quát' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    serviceName: string;

    @ApiProperty({ description: 'Tên viết tắt', example: 'XN Máu TQ' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    shortName: string;

    @ApiProperty({ description: 'ID nhóm dịch vụ', example: 'uuid-service-group-id' })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    serviceGroupId: string;

    @ApiProperty({ description: 'ID đơn vị tính', example: 'uuid-unit-of-measure-id' })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    unitOfMeasureId: string;

    @ApiProperty({
        description: 'Thông tin mapping (JSON string)',
        example: '{"hisCode": "LAB001", "externalSystem": "LIS"}',
        required: false
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    mapping?: string;

    @ApiProperty({ description: 'Số thứ tự', example: 1, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    numOrder?: number;

    @ApiProperty({ description: 'Giá hiện tại', example: 150000.00, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    currentPrice?: number;

    @ApiProperty({ description: 'ID dịch vụ cha', example: 'uuid-parent-service-id', required: false })
    @IsOptional()
    @IsString()
    @IsUUID()
    parentServiceId?: string;

    @ApiProperty({ description: 'Trạng thái hoạt động', example: 1, required: false })
    @IsOptional()
    @IsNumber()
    isActiveFlag?: number;
}
