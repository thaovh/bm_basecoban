import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsDateString, IsEnum, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'Username', example: 'john_doe' })
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' })
    username: string;

    @ApiProperty({ description: 'Email address', example: 'john.doe@example.com' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @ApiProperty({ description: 'Password', example: 'password123' })
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    password: string;

    @ApiProperty({ description: 'First name', example: 'John' })
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    firstName: string;

    @ApiProperty({ description: 'Last name', example: 'Doe' })
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    lastName: string;

    @ApiProperty({ description: 'Phone number', example: '+84901234567', required: false })
    @IsOptional()
    @IsString()
    @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Please provide a valid phone number' })
    phoneNumber?: string;

    @ApiProperty({ description: 'Date of birth', example: '1990-01-15', required: false })
    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;

    @ApiProperty({ description: 'Address', example: '123 Main St, Ho Chi Minh City', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    address?: string;

    @ApiProperty({ description: 'User role', example: 'user', enum: ['admin', 'user'], required: false })
    @IsOptional()
    @IsEnum(['admin', 'user'])
    role?: 'admin' | 'user';
}
