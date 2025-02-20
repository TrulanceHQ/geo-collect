import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  ArrayNotEmpty,
  IsOptional,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { UserRole } from 'src/auth/schema/user.schema';

export class CreateStateDto {
  @ApiProperty({
    description: 'List of states in Nigeria',
    example: ['Lagos', 'Kano', 'Rivers'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ngstates: string[];

  @ApiProperty({ enum: UserRole, description: 'Role of the creator' })
  @IsEnum(UserRole)
  @IsNotEmpty()
  readonly creatorRole: UserRole;
}

export class UpdateStateDto {
  @ApiPropertyOptional({
    description: 'List of states in Nigeria',
    example: ['Lagos', 'Kano', 'Rivers'],
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ngstates?: string[];
}
