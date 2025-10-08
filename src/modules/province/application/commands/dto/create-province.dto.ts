import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateProvinceDto {
    @ApiProperty({ description: 'Province code', example: '01' })
    @IsString()
    @MinLength(1)
    @MaxLength(10)
    @Matches(/^[A-Z0-9]+$/, { message: 'Province code can only contain uppercase letters and numbers' })
    provinceCode: string;

    @ApiProperty({ description: 'Province name', example: 'Hà Nội' })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    provinceName: string;

    @ApiProperty({ description: 'Province short name', example: 'HN', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    shortName?: string;

    @ApiProperty({ description: 'Is province active', example: true, required: false })
    @IsOptional()
    isActive?: boolean;
}
