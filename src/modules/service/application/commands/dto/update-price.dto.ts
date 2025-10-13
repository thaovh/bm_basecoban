import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional, IsString, MaxLength, Min, IsDateString } from 'class-validator';

export class UpdatePriceDto {
    @ApiProperty({ description: 'Giá mới', example: 160000.00 })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    price: number;

    @ApiProperty({ description: 'Có hiệu lực từ ngày', example: '2024-01-01T00:00:00Z' })
    @IsDateString()
    @IsNotEmpty()
    effectiveFrom: string;

    @ApiProperty({
        description: 'Lý do thay đổi giá',
        example: 'Tăng giá theo quy định mới',
        required: false
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    reason?: string;
}
