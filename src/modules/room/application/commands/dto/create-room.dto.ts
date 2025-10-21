import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateRoomDto {
    @ApiProperty({ description: 'Room code', example: 'R001' })
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    @Matches(/^[A-Z0-9]+$/, { message: 'Room code can only contain uppercase letters and numbers' })
    roomCode: string;

    @ApiProperty({ description: 'Room name', example: 'Phòng Khám Tim Mạch 1' })
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    roomName: string;

    @ApiProperty({ description: 'Room address', example: 'Tầng 2, Khu A, Khoa Tim Mạch' })
    @IsString()
    @MinLength(1)
    @MaxLength(500)
    roomAddress: string;

    @ApiProperty({ description: 'Department ID', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525' })
    @IsUUID()
    departmentId: string;

    @ApiProperty({ description: 'Room description', example: 'Phòng khám chuyên khoa tim mạch', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiProperty({ description: 'Is room active', example: true, required: false })
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ description: 'Mapping information (JSON string)', example: '{"hisCode": "ROOM001", "externalSystem": "HIS"}', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    mapping?: string;
}
