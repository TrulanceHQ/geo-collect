import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description:
      'Old password of the user. Password with at least one letter, one number, and one special character',
    example: 'oldPassword123@',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
    message:
      'Password must contain at least one letter, one number, and one special character',
  })
  oldPassword: string;

  @ApiProperty({
    description:
      'New password of the user. Password with at least one letter, one number, and one special character',
    example: 'newPassword123@',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
    message:
      'Password must contain at least one letter, one number, and one special character',
  })
  newPassword: string;
}
