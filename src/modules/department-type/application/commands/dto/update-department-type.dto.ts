import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdateDepartmentTypeDto {
    @ApiProperty({ description: 'Department type code', example: 'MED', required: false })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    @Matches(/^[A-Z0-9]+$/, { message: 'Department type code can only contain uppercase letters and numbers' })
    typeCode?: string;

    @ApiProperty({ description: 'Department type name', example: 'Khoa Nội', required: false })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    typeName?: string;

    @ApiProperty({ description: 'Department type description', example: 'Khoa điều trị nội khoa', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiProperty({ description: 'Is department type active', example: true, required: false })
    @IsOptional()
    isActive?: boolean;
}
