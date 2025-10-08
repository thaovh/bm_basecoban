import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateBranchDto {
    @ApiProperty({ description: 'Branch code', example: 'HN001' })
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    @Matches(/^[A-Z0-9]+$/, { message: 'Branch code can only contain uppercase letters and numbers' })
    branchCode: string;

    @ApiProperty({ description: 'Branch name', example: 'Bệnh viện Bạch Mai - Cơ sở Hà Nội' })
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    branchName: string;

    @ApiProperty({ description: 'Branch short name', example: 'BM-HN', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    shortName?: string;

    @ApiProperty({ description: 'Province ID', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525' })
    @IsUUID()
    provinceId: string;

    @ApiProperty({ description: 'Ward ID', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525' })
    @IsUUID()
    wardId: string;

    @ApiProperty({ description: 'Branch address', example: '78 Giải Phóng, Phường Phương Mai, Quận Đống Đa' })
    @IsString()
    @MinLength(1)
    @MaxLength(500)
    address: string;

    @ApiProperty({ description: 'Phone number', example: '024-3869-3731', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    phoneNumber?: string;

    @ApiProperty({ description: 'Hospital level', example: 'Hạng I', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    hospitalLevel?: string;

    @ApiProperty({ description: 'Representative person', example: 'Nguyễn Văn A', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    representative?: string;

    @ApiProperty({ description: 'BHYT code', example: 'BHYT001', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    bhytCode?: string;

    @ApiProperty({ description: 'Is branch active', example: true, required: false })
    @IsOptional()
    isActive?: boolean;
}
