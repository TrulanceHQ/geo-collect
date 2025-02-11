import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from './../schema/user.schema';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from './../schema/user.schema';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Profile image URL of the user',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'testcode@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  emailAddress?: string;

  @ApiProperty({
    description: 'Primary phone number of the user',
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ enum: UserRole, description: 'Role of the user' })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role?: UserRole;

  @ApiProperty({
    description: 'Gender of the user',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender?: Gender;
}
