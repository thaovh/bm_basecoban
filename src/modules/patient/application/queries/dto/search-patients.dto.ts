import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchPatientsDto {
    @ApiProperty({ description: 'Search term', example: 'Nguyen' })
    @IsString()
    @Length(1, 100)
    searchTerm: string;

    @ApiProperty({ description: 'Page limit', example: 10, required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit?: number;

    @ApiProperty({ description: 'Page offset', example: 0, required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    offset?: number;
}
