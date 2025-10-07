import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdateWardDto {
    @ApiProperty({ description: 'Ward code', example: '001', required: false })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(10)
    @Matches(/^[A-Z0-9]+$/, { message: 'Ward code can only contain uppercase letters and numbers' })
    wardCode?: string;

    @ApiProperty({ description: 'Ward name', example: 'Phường Bến Nghé', required: false })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    wardName?: string;

    @ApiProperty({ description: 'Province ID', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525', required: false })
    @IsOptional()
    @IsUUID()
    provinceId?: string;

    @ApiProperty({ description: 'Is ward active', example: true, required: false })
    @IsOptional()
    isActive?: boolean;
}
