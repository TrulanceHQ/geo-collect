import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsEnum, IsString } from 'class-validator';
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

  // @ApiProperty({ example: 'user123', description: 'Enumerator ID' })
  // @IsString()
  // @IsNotEmpty()
  // fieldCoordinatorId: string;

  @ApiProperty({ description: 'Selected state of the user' })
  @IsNotEmpty()
  readonly selectedState: string; // Add this field

  // @ApiProperty({ description: 'fieldCoordinator id' })
  // @IsNotEmpty()
  // readonly fieldCoordinatorId?: string; // Add this field if it's part of the creation process
}
