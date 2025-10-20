import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetAttendanceEventsDto {
    @ApiProperty({
        description: 'Employee number string',
        example: '1844'
    })
    @IsString()
    @IsNotEmpty()
    employeeNoString: string;

    @ApiProperty({
        description: 'Start time in ISO format',
        example: '2025-10-01T00:00:00+07:00'
    })
    @IsDateString()
    @IsNotEmpty()
    startTime: string;

    @ApiProperty({
        description: 'End time in ISO format',
        example: '2025-10-15T23:59:59+07:00'
    })
    @IsDateString()
    @IsNotEmpty()
    endTime: string;

    @ApiProperty({
        description: 'Maximum number of results',
        example: 30,
        required: false
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    @Max(100)
    maxResults?: number = 30;

    @ApiProperty({
        description: 'Search result position for pagination',
        example: 0,
        required: false
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(0)
    searchResultPosition?: number = 0;
}
