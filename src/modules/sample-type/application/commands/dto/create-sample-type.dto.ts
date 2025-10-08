import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength, Matches, IsJSON } from 'class-validator';

export class CreateSampleTypeDto {
    @ApiProperty({ description: 'Sample type code', example: 'BLD' })
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    @Matches(/^[A-Z0-9]+$/, { message: 'Sample type code can only contain uppercase letters and numbers' })
    typeCode: string;

    @ApiProperty({ description: 'Sample type name', example: 'Mẫu máu' })
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    typeName: string;

    @ApiProperty({ description: 'Sample type short name', example: 'Máu', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    shortName?: string;

    @ApiProperty({
        description: 'Code generation rule in JSON format',
        example: '{"prefix": "BLD", "sequence": "0001", "format": "{PREFIX}-{SEQUENCE}"}',
        required: false
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    codeGenerationRule?: string;

    @ApiProperty({ description: 'Sample type description', example: 'Mẫu máu để xét nghiệm', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiProperty({ description: 'Is sample type active', example: true, required: false })
    @IsOptional()
    isActive?: boolean;
}
