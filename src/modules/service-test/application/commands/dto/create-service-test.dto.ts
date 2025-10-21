import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateServiceTestDto {
    @ApiProperty({
        description: 'Mã xét nghiệm',
        example: 'TEST_001',
        maxLength: 50
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    testCode: string;

    @ApiProperty({
        description: 'Tên xét nghiệm',
        example: 'Xét nghiệm máu tổng quát',
        maxLength: 200
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    testName: string;

    @ApiProperty({
        description: 'Tên viết tắt',
        example: 'XN Máu TQ',
        maxLength: 50
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    shortName: string;

    @ApiProperty({
        description: 'ID dịch vụ',
        example: '123e4567-e89b-12d3-a456-426614174001'
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    serviceId: string;

    @ApiProperty({
        description: 'ID đơn vị tính',
        example: '123e4567-e89b-12d3-a456-426614174001'
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    unitOfMeasureId: string;

    @ApiProperty({
        description: 'Mô tả khoảng giá trị',
        example: 'Bình thường: 3.5-5.5 g/dL',
        maxLength: 500,
        required: false
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    rangeText?: string;

    @ApiProperty({
        description: 'Giá trị thấp nhất',
        example: 3.5,
        required: false
    })
    @IsOptional()
    @IsNumber()
    rangeLow?: number;

    @ApiProperty({
        description: 'Giá trị cao nhất',
        example: 5.5,
        required: false
    })
    @IsOptional()
    @IsNumber()
    rangeHigh?: number;

    @ApiProperty({
        description: 'Thông tin mapping (JSON string)',
        example: '{"hisCode": "TEST001", "externalSystem": "LIS"}',
        maxLength: 500,
        required: false
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    mapping?: string;

    @ApiProperty({
        description: 'Thứ tự sắp xếp',
        example: 1,
        default: 0
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    testOrder?: number;

    @ApiProperty({
        description: 'Trạng thái hoạt động (1: hoạt động, 0: không hoạt động)',
        example: 1,
        default: 1
    })
    @IsOptional()
    @IsNumber()
    isActiveFlag?: number;
}
