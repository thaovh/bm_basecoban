import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class HisLoginDto {
    @ApiProperty({ description: 'HIS username (optional - will use current user HIS credentials if not provided)', example: 'vht2', required: false })
    @IsOptional()
    @IsString()
    @MinLength(1)
    username?: string;

    @ApiProperty({ description: 'HIS password (optional - will use current user HIS credentials if not provided)', example: 't123456', required: false })
    @IsOptional()
    @IsString()
    @MinLength(1)
    password?: string;
}
