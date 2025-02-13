import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
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
  options?: string[];

  @ApiProperty({
    example: 'image',
    enum: MediaType,
    description: 'Type of media for the question (e.g., image, video, audio)',
    required: false,
  })
  @IsEnum(MediaType)
  @IsOptional()
  mediaType?: MediaType;

  @ApiProperty({
    example: 'This question relates to a promotional video.',
    description: 'Intrusion or description of media (if applicable)',
    required: false,
  })
  @IsString()
  @IsOptional()
  mediaIntruction?: string;
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
}
// class QuestionDto {
//   @ApiProperty({
//     example: 'What is your favorite color?',
//     description: 'The survey question',
//   })
//   @IsString()
//   question: string;

//   @ApiProperty({
//     enum: QuestionType,
//     example: QuestionType.SINGLE_CHOICE,
//     description: 'Type of question',
//   })
//   @IsEnum(QuestionType)
//   type: QuestionType;

//   @ApiProperty({
//     example: ['Red', 'Blue', 'Green'],
//     required: false,
//     description: 'Choices for single/multiple-choice questions',
//   })
//   @IsArray()
//   @IsOptional()
//   options?: string[];
// }

// export class CreateDataEntryQuestionDto {
//   @ApiProperty({
//     example: 'User Preferences Survey',
//     description: 'The title of the question set',
//   })
//   @IsString()
//   title: string;

//   @ApiProperty({
//     example: 'User Preferences Survey',
//     description: 'The subtitle of the question set',
//   })
//   @IsString()
//   subtitle: string;

//   @ApiProperty({
//     type: [QuestionDto],
//     description: 'Array of survey questions',
//   })
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => QuestionDto)
//   questions: QuestionDto[];
// }
