import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntityDto {
    @ApiProperty({ description: 'Unique identifier', example: '123e4567-e89b-12d3-a456-426614174000' })
    id: string;

    @ApiProperty({ description: 'Creation timestamp', example: '2024-01-15T10:30:00Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp', example: '2024-01-15T10:30:00Z' })
    updatedAt: Date;

    @ApiProperty({ description: 'Soft delete timestamp', example: null, required: false })
    deletedAt?: Date;

    @ApiProperty({ description: 'User who created the record', example: 'admin', required: false })
    createdBy?: string;

    @ApiProperty({ description: 'User who last updated the record', example: 'admin', required: false })
    updatedBy?: string;

    @ApiProperty({ description: 'Version number for optimistic locking', example: 1 })
    version: number;
}
