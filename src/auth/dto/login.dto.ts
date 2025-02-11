import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'testcode@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly emailAddress: string;

  @ApiProperty({
    description:
      'Password with at least one letter, one number, and one special character',
    example: 'Passw0rd!',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
