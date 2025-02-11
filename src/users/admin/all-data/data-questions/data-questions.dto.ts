import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsEnum,
  IsBoolean,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateDataEntryQuestionDto {
  @ApiProperty({ description: 'The question text' })
  @IsString()
  question: string;

  @ApiProperty({
    description: 'The type of question',
    enum: ['single-choice', 'multiple-choice', 'text'],
  })
  @IsEnum(['single-choice', 'multiple-choice', 'text'])
  questionType: string;

  @ApiPropertyOptional({
    description: 'Options for multiple-choice or single-choice questions',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  options: string[];

  @ApiProperty({
    description: 'Whether the question is required',
    default: false,
  })
  @IsBoolean()
  required: boolean;
}

export class UpdateDataEntryQuestionDto {
  @ApiPropertyOptional({ description: 'The updated question text' })
  @IsString()
  @IsOptional()
  question?: string;

  @ApiPropertyOptional({ description: 'Updated type of question' })
  @IsEnum(['single-choice', 'multiple-choice', 'text'])
  @IsOptional()
  questionType?: string;

  @ApiPropertyOptional({
    description:
      'Updated options for multiple-choice or single-choice questions',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  options?: string[];

  @ApiPropertyOptional({ description: 'Whether the question is required' })
  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @ApiPropertyOptional({
    description: 'Set whether the question is active or deleted',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
