import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  IsEnum,
} from 'class-validator';
import { UserRole } from './../schema/user.schema';

export class CreateUserDto {
  @ApiProperty({ description: 'First name of the user', example: 'Test' })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Code' })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

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
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
    message:
      'Password must contain at least one letter, one number, and one special character',
  })
  readonly password: string;

  @ApiProperty({ enum: UserRole, description: 'Role of the user' })
  @IsEnum(UserRole)
  @IsNotEmpty()
  readonly role: UserRole;
}

// export class UpdateUserStatusDto {
//   @ApiProperty({
//     example: true,
//     description: 'Indicates whether the user account is active',
//   })
//   @IsBoolean()
//   isActive: boolean;
// }
