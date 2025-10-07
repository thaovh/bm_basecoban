import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({ 
        description: 'Username or Email address', 
        example: 'john_doe or john.doe@example.com' 
    })
    @IsString()
    @MinLength(1, { message: 'Username or email is required' })
    usernameOrEmail: string;

    @ApiProperty({ description: 'Password', example: 'password123' })
    @IsString()
    @MinLength(1, { message: 'Password is required' })
    password: string;
}
