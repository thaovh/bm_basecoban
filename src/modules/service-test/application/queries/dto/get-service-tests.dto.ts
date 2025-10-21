import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetServiceTestsDto {
    @ApiProperty({
        description: 'Số lượng bản ghi trả về',
        example: 10,
        minimum: 1,
        maximum: 100,
        required: false
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiProperty({
        description: 'Vị trí bắt đầu (offset)',
        example: 0,
        minimum: 0,
        required: false
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(0)
    offset?: number = 0;

    @ApiProperty({
        description: 'Tìm kiếm theo tên xét nghiệm',
        example: 'máu',
        required: false
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({
        description: 'Lọc theo ID dịch vụ',
        example: '123e4567-e89b-12d3-a456-426614174001',
        required: false
    })
    @IsOptional()
    @IsString()
    serviceId?: string;

    @ApiProperty({
        description: 'Lọc theo ID đơn vị tính',
        example: '123e4567-e89b-12d3-a456-426614174001',
        required: false
    })
    @IsOptional()
    @IsString()
    unitOfMeasureId?: string;

    @ApiProperty({
        description: 'Lọc theo trạng thái hoạt động (1: hoạt động, 0: không hoạt động)',
        example: 1,
        required: false
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    isActiveFlag?: number;
}
