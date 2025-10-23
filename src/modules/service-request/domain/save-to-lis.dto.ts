import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNotEmpty, IsOptional } from 'class-validator';

export class SaveToLisDto {
    @ApiProperty({ description: 'Service Request Code from HIS', example: '000054090874' })
    @IsString()
    @IsNotEmpty()
    serviceReqCode: string;

    @ApiProperty({ description: 'Request Room ID for tracking', example: 'uuid-room-id' })
    @IsUUID()
    @IsNotEmpty()
    roomId: string;

    @ApiProperty({ description: 'Result Status ID for tracking', example: 'uuid-status-id' })
    @IsUUID()
    @IsNotEmpty()
    statusId: string;

    @ApiProperty({ description: 'In Room ID for tracking', example: 'uuid-in-room-id', required: false })
    @IsOptional()
    @IsUUID()
    inRoomId?: string;

    @ApiProperty({ description: 'Sample Type ID for tracking', example: 'uuid-sample-type-id', required: false })
    @IsOptional()
    @IsUUID()
    sampleTypeId?: string;

    @ApiProperty({ description: 'Sample Code for tracking', example: 'BLD-2024-001', required: false })
    @IsOptional()
    @IsString()
    sampleCode?: string;

    @ApiProperty({ description: 'Note for tracking', example: 'Bắt đầu xử lý mẫu xét nghiệm', required: false })
    @IsOptional()
    @IsString()
    note?: string;
}

export class SaveToLisResult {
    @ApiProperty({ description: 'Service Request ID created in LIS' })
    serviceRequestId: string;

    @ApiProperty({ description: 'Result Tracking ID created' })
    resultTrackingId: string;

    @ApiProperty({ description: 'Service Request Code' })
    serviceReqCode: string;

    @ApiProperty({ description: 'Patient information' })
    patient: any;

    @ApiProperty({ description: 'Services information' })
    services: any[];

    @ApiProperty({ description: 'Total amount' })
    totalAmount: number;

    @ApiProperty({ description: 'Tracking information' })
    tracking: any;

    @ApiProperty({ description: 'Success message' })
    message: string;
}
