import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
  ValidateIf,
  IsNotEmpty,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType, MediaType } from './data-questions.schema';

export class QuestionDto {
  @ApiProperty({
    example: 'What is your favorite color?',
    description: 'The survey question',
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    enum: QuestionType,
    example: QuestionType.SINGLE_CHOICE,
    description: 'Type of question',
  })
  @IsEnum(QuestionType)
  type: QuestionType;

  // Validate options only when type is SINGLE_CHOICE or MULTIPLE_CHOICE
  @ApiProperty({
    example: ['Red', 'Blue', 'Green'],
    required: false,
    description: 'Choices for single/multiple-choice questions',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateIf(
    (o) =>
      o.type === QuestionType.SINGLE_CHOICE ||
      o.type === QuestionType.MULTIPLE_CHOICE,
  )
  options?: string[];

  // Validate likertQuestions only when type is LIKERT_SCALE
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
  @ArrayNotEmpty()
  @ValidateIf((o) => o.type === QuestionType.LIKERT_SCALE)
  @Type(() => Object)
  likertQuestions?: { question: string; options: string[] }[];

  // Ensure TEXT type does not include options or likertQuestions
  @ValidateIf((o) => o.type === QuestionType.TEXT)
  validateTextQuestion() {
    if (this.options || this.likertQuestions) {
      throw new Error(
        'Text questions should not have options or likertQuestions',
      );
    }
  }
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
