import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetServiceRequestDto {
  @ApiProperty({
    description: 'Service request code',
    example: '000054090874',
  })
  @IsString()
  @IsNotEmpty()
  serviceReqCode: string;
}
