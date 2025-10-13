import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, IsBoolean, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class GetServicesDto {
    @ApiProperty({ description: 'Số lượng item trên mỗi trang', example: 10, required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number;

    @ApiProperty({ description: 'Số lượng item bỏ qua', example: 0, required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    offset?: number;

    @ApiProperty({ description: 'Từ khóa tìm kiếm (code, name, short name)', example: 'LAB', required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ description: 'Lọc theo nhóm dịch vụ', example: 'uuid-service-group-id', required: false })
    @IsOptional()
    @IsString()
    @IsUUID()
    serviceGroupId?: string;

    @ApiProperty({ description: 'Lọc theo đơn vị tính', example: 'uuid-unit-of-measure-id', required: false })
    @IsOptional()
    @IsString()
    @IsUUID()
    unitOfMeasureId?: string;

    @ApiProperty({ description: 'Lọc theo dịch vụ cha', example: 'uuid-parent-service-id', required: false })
    @IsOptional()
    @IsString()
    @IsUUID()
    parentServiceId?: string;

    @ApiProperty({ description: 'Lọc theo trạng thái hoạt động', example: true, required: false })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isActive?: boolean;
}
