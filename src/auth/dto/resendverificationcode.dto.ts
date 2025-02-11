import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendVerificationCodeDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'testcode@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;
}
