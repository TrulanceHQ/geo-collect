/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType, MediaType } from './data-questions.schema';

export class QuestionDto {
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
  @ValidateIf(
    (o) =>
      o.type === QuestionType.SINGLE_CHOICE ||
      o.type === QuestionType.MULTIPLE_CHOICE,
  ) // Ensures `options` only exists for these types
  options?: string[];

  // Likert scale specific properties
  @ApiProperty({
    example: [
      {
        question: 'Rate your experience with our product',
        options: [
          'Strongly Disagree',
          'Disagree',
          'Neutral',
          'Agree',
          'Strongly Agree',
        ],
      },
    ],
    required: false,
    description: 'Likert scale questions with options',
  })
  @IsArray()
  @IsOptional()
  likertQuestions?: { question: string; options: string[] }[];
}

export class CreateDataEntryQuestionDto {
  @ApiProperty({
    example: 'User Preferences Survey',
    description: 'The title of the question set',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'User Preferences Survey',
    description: 'The subtitle of the question set',
  })
  @IsString()
  subtitle: string;

  @ApiProperty({
    type: [QuestionDto],
    description: 'Array of survey questions',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
  @ApiProperty({
    example: 'image',
    enum: MediaType,
    description: 'Type of media for the entire survey (Optional)',
    required: false,
  })
  @IsEnum(MediaType)
  @IsOptional()
  mediaType?: MediaType;

  @ApiProperty({
    example: 'This survey includes a promotional video.',
    description: 'Instruction for media (if applicable)',
    required: false,
  })
  @IsString()
  @IsOptional()
  mediaInstruction?: string;
}
