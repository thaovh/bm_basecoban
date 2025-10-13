import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUnitOfMeasuresDto {
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

    @ApiProperty({ description: 'Từ khóa tìm kiếm (code, name)', example: 'ML', required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ description: 'Lọc theo trạng thái hoạt động', example: true, required: false })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isActive?: boolean;
}
