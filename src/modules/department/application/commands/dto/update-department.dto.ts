import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdateDepartmentDto {
    @ApiProperty({ description: 'Department code', example: 'MED001', required: false })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    @Matches(/^[A-Z0-9]+$/, { message: 'Department code can only contain uppercase letters and numbers' })
    departmentCode?: string;

    @ApiProperty({ description: 'Department name', example: 'Khoa Tim Mạch', required: false })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    departmentName?: string;

    @ApiProperty({ description: 'Branch ID', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525', required: false })
    @IsOptional()
    @IsUUID()
    branchId?: string;

    @ApiProperty({ description: 'Head of department', example: 'BS. Nguyễn Văn A', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    headOfDepartment?: string;

    @ApiProperty({ description: 'Head nurse', example: 'ĐD. Trần Thị B', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    headNurse?: string;

    @ApiProperty({ description: 'Parent department ID', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525', required: false })
    @IsOptional()
    @IsUUID()
    parentDepartmentId?: string;

    @ApiProperty({ description: 'Department short name', example: 'TM', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    shortName?: string;

    @ApiProperty({ description: 'Department type ID', example: 'f1b42d3b-eccf-40f2-8305-4ee4cac61525', required: false })
    @IsOptional()
    @IsUUID()
    departmentTypeId?: string;

    @ApiProperty({ description: 'Is department active', example: true, required: false })
    @IsOptional()
    isActive?: boolean;
}
