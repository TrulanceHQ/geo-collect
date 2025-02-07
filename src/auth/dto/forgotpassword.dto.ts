import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Enter the your email address',
  })
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;
}
