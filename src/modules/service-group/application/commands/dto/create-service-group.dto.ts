import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateServiceGroupDto {
  @ApiProperty({
    description: 'Service group code (unique identifier)',
    example: 'LAB_001',
    maxLength: 50,
    minLength: 1
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  serviceGroupCode: string;

  @ApiProperty({
    description: 'Service group name',
    example: 'Laboratory Services',
    maxLength: 200,
    minLength: 1
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  serviceGroupName: string;

  @ApiProperty({
    description: 'Short name for service group',
    example: 'LAB',
    maxLength: 50,
    minLength: 1
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  shortName: string;

  @ApiProperty({
    description: 'Mapping information (JSON string or text mapping)',
    example: '{"hisCode": "LAB001", "externalSystem": "LIS"}',
    maxLength: 500,
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  mapping?: string;
}
