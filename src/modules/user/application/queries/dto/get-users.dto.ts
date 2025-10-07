import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsersDto {
    @ApiProperty({ description: 'Search term for username, email, or full name', example: 'john', required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ description: 'User role filter', example: 'user', enum: ['admin', 'user'], required: false })
    @IsOptional()
    @IsEnum(['admin', 'user'])
    role?: 'admin' | 'user';

    @ApiProperty({ description: 'Active status filter', example: true, required: false })
    @IsOptional()
    @Type(() => Boolean)
    isActive?: boolean;

    @ApiProperty({ description: 'Number of items per page', example: 10, minimum: 1, maximum: 100, required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiProperty({ description: 'Number of items to skip', example: 0, minimum: 0, required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    offset?: number = 0;
}
