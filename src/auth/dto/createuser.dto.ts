import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsString,
  IsOptional,
} from 'class-validator';
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

  @ApiProperty({ description: 'Selected state of the user' })
  @IsNotEmpty()
  readonly selectedState: string; // Add this field

  @ApiProperty({ description: 'Admin ID of the creator' })
  @IsString()
  @IsOptional()
  readonly adminId: string; // Add this field

  @ApiProperty({ description: 'Field Coordinator ID of the creator' })
  @IsString()
  @IsOptional()
  readonly fieldCoordinatorId: string; // Add this field
}
