import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateResultTrackingDto {
    @ApiProperty({ description: 'Service Request ID', example: 'uuid-service-request-id' })
    @IsUUID()
    @IsNotEmpty()
    serviceRequestId: string;

    @ApiProperty({ description: 'Result Status ID', example: 'uuid-result-status-id' })
    @IsUUID()
    @IsNotEmpty()
    resultStatusId: string;

    @ApiProperty({ description: 'Request Room ID', example: 'uuid-room-id', required: false })
    @IsOptional()
    @IsUUID()
    roomId?: string;

    @ApiProperty({ description: 'In Room ID', example: 'uuid-in-room-id', required: false })
    @IsOptional()
    @IsUUID()
    inRoomId?: string;

    @ApiProperty({ description: 'Sample Type ID', example: 'uuid-sample-type-id', required: false })
    @IsOptional()
    @IsUUID()
    sampleTypeId?: string;

    @ApiProperty({ description: 'Sample Code', example: 'BLD-2024-001', required: false })
    @IsOptional()
    @IsString()
    sampleCode?: string;

    @ApiProperty({ description: 'In Tracking Time', example: '2024-01-15T10:30:00Z', required: false })
    @IsOptional()
    @IsDateString()
    inTrackingTime?: string;

    @ApiProperty({ description: 'Out Tracking Time', example: '2024-01-15T11:30:00Z', required: false })
    @IsOptional()
    @IsDateString()
    outTrackingTime?: string;

    @ApiProperty({ description: 'Note', example: 'Sample processed successfully', required: false })
    @IsOptional()
    @IsString()
    note?: string;
}

export class UpdateResultTrackingDto {
    @ApiProperty({ description: 'Service Request ID', example: 'uuid-service-request-id', required: false })
    @IsOptional()
    @IsUUID()
    serviceRequestId?: string;

    @ApiProperty({ description: 'Result Status ID', example: 'uuid-result-status-id', required: false })
    @IsOptional()
    @IsUUID()
    resultStatusId?: string;

    @ApiProperty({ description: 'Request Room ID', example: 'uuid-room-id', required: false })
    @IsOptional()
    @IsUUID()
    roomId?: string;

    @ApiProperty({ description: 'In Room ID', example: 'uuid-in-room-id', required: false })
    @IsOptional()
    @IsUUID()
    inRoomId?: string;

    @ApiProperty({ description: 'Sample Type ID', example: 'uuid-sample-type-id', required: false })
    @IsOptional()
    @IsUUID()
    sampleTypeId?: string;

    @ApiProperty({ description: 'Sample Code', example: 'BLD-2024-001', required: false })
    @IsOptional()
    @IsString()
    sampleCode?: string;

    @ApiProperty({ description: 'In Tracking Time', example: '2024-01-15T10:30:00Z', required: false })
    @IsOptional()
    @IsDateString()
    inTrackingTime?: string;

    @ApiProperty({ description: 'Out Tracking Time', example: '2024-01-15T11:30:00Z', required: false })
    @IsOptional()
    @IsDateString()
    outTrackingTime?: string;

    @ApiProperty({ description: 'Note', example: 'Sample processed successfully', required: false })
    @IsOptional()
    @IsString()
    note?: string;
}

export class GetResultTrackingsDto {
    @ApiProperty({ description: 'Page limit', example: 10, required: false })
    @IsOptional()
    limit?: number;

    @ApiProperty({ description: 'Page offset', example: 0, required: false })
    @IsOptional()
    offset?: number;

    @ApiProperty({ description: 'Service Request ID filter', example: 'uuid-service-request-id', required: false })
    @IsOptional()
    @IsUUID()
    serviceRequestId?: string;

    @ApiProperty({ description: 'Result Status ID filter', example: 'uuid-result-status-id', required: false })
    @IsOptional()
    @IsUUID()
    resultStatusId?: string;

    @ApiProperty({ description: 'Request Room ID filter (phòng yêu cầu)', example: 'uuid-request-room-id', required: false })
    @IsOptional()
    @IsUUID()
    requestRoomId?: string;

    @ApiProperty({ description: 'In Room ID filter (phòng đang xử lý)', example: 'uuid-in-room-id', required: false })
    @IsOptional()
    @IsUUID()
    inRoomId?: string;

    @ApiProperty({ description: 'Sample Type ID filter', example: 'uuid-sample-type-id', required: false })
    @IsOptional()
    @IsUUID()
    sampleTypeId?: string;

    @ApiProperty({ description: 'Sample Code filter', example: 'BLD-2024-001', required: false })
    @IsOptional()
    @IsString()
    sampleCode?: string;

    @ApiProperty({ description: 'Search term', example: 'pending', required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ description: 'Start date filter', example: '2024-01-01', required: false })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiProperty({ description: 'End date filter', example: '2024-01-31', required: false })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiProperty({ description: 'Show only active trackings', example: true, required: false })
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ description: 'Show only overdue trackings', example: true, required: false })
    @IsOptional()
    isOverdue?: boolean;
}

export class SearchResultTrackingsDto {
    @ApiProperty({ description: 'Search term', example: 'pending' })
    @IsString()
    searchTerm: string;

    @ApiProperty({ description: 'Page limit', example: 10, required: false })
    @IsOptional()
    limit?: number;

    @ApiProperty({ description: 'Page offset', example: 0, required: false })
    @IsOptional()
    offset?: number;
}

export class CheckInTrackingDto {
    @ApiProperty({ description: 'Service Request ID', example: 'uuid-service-request-id' })
    @IsUUID()
    @IsNotEmpty()
    serviceRequestId: string;

    @ApiProperty({ description: 'Result Status ID', example: 'uuid-result-status-id' })
    @IsUUID()
    @IsNotEmpty()
    resultStatusId: string;

    @ApiProperty({ description: 'Request Room ID', example: 'uuid-room-id', required: false })
    @IsOptional()
    @IsUUID()
    roomId?: string;

    @ApiProperty({ description: 'In Room ID', example: 'uuid-in-room-id', required: false })
    @IsOptional()
    @IsUUID()
    inRoomId?: string;

    @ApiProperty({ description: 'Sample Type ID', example: 'uuid-sample-type-id', required: false })
    @IsOptional()
    @IsUUID()
    sampleTypeId?: string;

    @ApiProperty({ description: 'Sample Code', example: 'BLD-2024-001', required: false })
    @IsOptional()
    @IsString()
    sampleCode?: string;

    @ApiProperty({ description: 'In Tracking Time', example: '2024-01-15T10:30:00Z', required: false })
    @IsOptional()
    @IsDateString()
    inTrackingTime?: string;

    @ApiProperty({ description: 'Note', example: 'Started processing', required: false })
    @IsOptional()
    @IsString()
    note?: string;
}

export class CheckOutTrackingDto {
    @ApiProperty({ description: 'Note', example: 'Processing completed', required: false })
    @IsOptional()
    @IsString()
    note?: string;
}