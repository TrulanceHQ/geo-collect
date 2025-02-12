import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from './data-questions.schema';

class QuestionDto {
  @ApiProperty({
    example: 'What is your favorite color?',
    description: 'The survey question',
  })
  @IsString()
  question: string;

  @ApiProperty({
    enum: QuestionType,
    example: QuestionType.SINGLE_CHOICE,
    description: 'Type of question',
  })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiProperty({
    example: ['Red', 'Blue', 'Green'],
    required: false,
    description: 'Choices for single/multiple-choice questions',
  })
  @IsArray()
  @IsOptional()
  options?: string[];
}

export class CreateDataEntryQuestionDto {
  @ApiProperty({
    example: 'User Preferences Survey',
    description: 'The title of the question set',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: [QuestionDto],
    description: 'Array of survey questions',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
