import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString, ArrayNotEmpty, IsOptional } from 'class-validator';

export class CreateStateDto {
  @ApiProperty({
    description: 'List of states in Nigeria',
    example: ['Lagos', 'Kano', 'Rivers'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ngstates: string[];
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
