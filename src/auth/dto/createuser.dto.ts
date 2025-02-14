import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from './../schema/user.schema';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'testcode@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly emailAddress: string;

  @ApiProperty({ enum: UserRole, description: 'Role of the user' })
  @IsEnum(UserRole)
  @IsNotEmpty()
  readonly role: UserRole;

  @ApiProperty({ enum: UserRole, description: 'Role of the creator' })
  @IsEnum(UserRole)
  @IsNotEmpty()
  readonly creatorRole: UserRole;
}
