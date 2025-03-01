// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// import { ApiProperty } from '@nestjs/swagger';
// import {
//   IsString,
//   IsArray,
//   ValidateNested,
//   IsEnum,
//   IsOptional,
//   ValidateIf,
//   IsNotEmpty,
//   ArrayNotEmpty,
// } from 'class-validator';
// import { Type } from 'class-transformer';
// import { QuestionType } from './data-questions.schema';

// export class QuestionDto {
//   @ApiProperty({
//     example: 'What is your favorite color?',
//     description: 'The survey question',
//   })
//   @IsString()
//   @IsNotEmpty()
//   question: string;

//   @ApiProperty({
//     enum: QuestionType,
//     example: QuestionType.SINGLE_CHOICE,
//     description: 'Type of question',
//   })
//   @IsEnum(QuestionType)
//   type: QuestionType;

//   // Validate options only when type is SINGLE_CHOICE or MULTIPLE_CHOICE
//   @ApiProperty({
//     example: ['Red', 'Blue', 'Green'],
//     required: false,
//     description: 'Choices for single/multiple-choice questions',
//   })
//   @IsArray()
//   @ArrayNotEmpty()
//   @ValidateIf(
//     (o) =>
//       o.type === QuestionType.SINGLE_CHOICE ||
//       o.type === QuestionType.MULTIPLE_CHOICE,
//   )
//   options?: string[];

//   // Validate likertQuestions only when type is LIKERT_SCALE
//   @ApiProperty({
//     example: [
//       {
//         question: 'Rate your experience with our product',
//         options: [
//           'Strongly Disagree',
//           'Disagree',
//           'Neutral',
//           'Agree',
//           'Strongly Agree',
//         ],
//       },
//     ],
//     required: false,
//     description: 'Likert scale questions with options',
//   })
//   @IsArray()
//   @ArrayNotEmpty()
//   @ValidateIf((o) => o.type === QuestionType.LIKERT_SCALE)
//   @Type(() => Object)
//   likertQuestions?: { question: string; options: string[] }[];

//   // Ensure TEXT type does not include options or likertQuestions
//   @ValidateIf((o) => o.type === QuestionType.TEXT)
//   validateTextQuestion() {
//     if (this.options || this.likertQuestions) {
//       throw new Error(
//         'Text questions should not have options or likertQuestions',
//       );
//     }
//   }
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

//   @ApiProperty({
//     example: true,
//     description: 'Enable audio recording',
//     required: false,
//   })
//   @IsOptional()
//   allowAudio?: boolean;

//   @ApiProperty({
//     example: true,
//     description: 'Enable video recording',
//     required: false,
//   })
//   @IsOptional()
//   allowVideo?: boolean;

//   @ApiProperty({
//     example: true,
//     description: 'Enable image capturing',
//     required: false,
//   })
//   @IsOptional()
//   allowImage?: boolean;
//   @ApiProperty({
//     example: 'This survey includes a promotional video.',
//     description: 'Instruction for media (if applicable)',
//     required: false,
//   })
//   @IsString()
//   @IsOptional()
//   mediaInstruction?: string;
// }

// import { ApiProperty } from '@nestjs/swagger';
// import { IsString, IsArray, ValidateNested, IsEnum, IsOptional, ValidateIf, IsNotEmpty, ArrayNotEmpty } from 'class-validator';
// import { Type } from 'class-transformer';
// import { QuestionType } from './data-questions.schema';

// class Option {
//   @ApiProperty({ example: 'Red', description: 'Option value' })
//   @IsString()
//   @IsNotEmpty()
//   value: string;

//   @ApiProperty({ example: 2, description: 'Next section number', required: false })
//   @IsOptional()
//   @Type(() => Number)
//   nextSection?: number | null;
// }

// class LikertQuestionDto {
//   @ApiProperty({ example: 'Rate your experience with our product', description: 'Likert scale question' })
//   @IsString()
//   @IsNotEmpty()
//   question: string;

//   @ApiProperty({ example: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], description: 'Likert scale options' })
//   @IsArray()
//   @ArrayNotEmpty()
//   options: string[];
// }

// export class QuestionDto {
//   @ApiProperty({ example: 'What is your favorite color?', description: 'The survey question' })
//   @IsString()
//   @IsNotEmpty()
//   question: string;

//   @ApiProperty({ enum: QuestionType, example: QuestionType.SINGLE_CHOICE, description: 'Type of question' })
//   @IsEnum(QuestionType)
//   type: QuestionType;

//   @ApiProperty({ type: [Option], required: false, description: 'Choices for single/multiple-choice questions' })
//   @IsArray()
//   @ArrayNotEmpty()
//   @ValidateIf(o => o.type === QuestionType.SINGLE_CHOICE || o.type === QuestionType.MULTIPLE_CHOICE)
//   options?: Option[];

//   @ApiProperty({ type: [LikertQuestionDto], required: false, description: 'Likert scale questions with options' })
//   @IsArray()
//   @ArrayNotEmpty()
//   @ValidateIf(o => o.type === QuestionType.LIKERT_SCALE)
//   @Type(() => LikertQuestionDto)
//   likertQuestions?: LikertQuestionDto[];

//   @ValidateIf(o => o.type === QuestionType.TEXT)
//   validateTextQuestion() {
//     if (this.options || this.likertQuestions) {
//       throw new Error('Text questions should not have options or likertQuestions');
//     }
//   }
// }

// export class CreateDataEntryQuestionDto {
//   @ApiProperty({ example: 'User Preferences Survey', description: 'The title of the question set' })
//   @IsString()
//   title: string;

//   @ApiProperty({ example: 'User Preferences Survey', description: 'The subtitle of the question set' })
//   @IsString()
//   subtitle: string;

//   @ApiProperty({ type: [QuestionDto], description: 'Array of survey questions' })
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => QuestionDto)
//   questions: QuestionDto[];

//   @ApiProperty({ example: true, description: 'Enable audio recording', required: false })
//   @IsOptional()
//   allowAudio?: boolean;

//   @ApiProperty({ example: true, description: 'Enable video recording', required: false })
//   @IsOptional()
//   allowVideo?: boolean;

//   @ApiProperty({ example: true, description: 'Enable image capturing', required: false })
//   @IsOptional()
//   allowImage?: boolean;

//   @ApiProperty({ example: 'This survey includes a promotional video.', description: 'Instruction for media (if applicable)', required: false })
//   @IsString()
//   @IsOptional()
//   mediaInstruction?: string;
// }

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
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from './data-questions.schema';

class Option {
  @ApiProperty({ example: 'Red', description: 'Option value' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    example: 2,
    description: 'Next section number',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  nextSection?: number | null;
}

class LikertOptionDto {
  // @ApiProperty({
  //   example: 'Agree',
  //   description: 'Likert scale label',
  // })
  // @IsString()
  // label: string;

  @ApiProperty({
    example: 1,
    description: 'Likert scale value',
  })
  // @IsNumber()
  // value: number;
  @ApiProperty({
    example: 'Agree or 1',
    description: 'Likert scale option (can be text or number)',
  })
  @IsNotEmpty()
  option: string | number;
}

class LikertQuestionDto {
  @ApiProperty({
    example: 'Rate your experience with our product',
    description: 'Likert scale question',
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  //new
  @ApiProperty({
    example: [
      'Strongly Disagree',
      'Disagree',
      'Neutral',
      'Agree',
      'Strongly Agree',
    ],
    description: 'Likert scale options',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  options: string;
}
//new ends

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

  @ApiProperty({
    type: [Option],
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

  //new
  @ValidateNested({ each: true })
  @Type(() => Option)
  options?: Option[];

  @ApiProperty({
    example: false,
    description:
      'Enable an "Other" text field for additional responses in single-choice questions.',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  allowOther?: boolean;

  @ApiProperty({
    type: [LikertQuestionDto],
    required: false,
    description: 'Likert scale questions with options',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateIf((o) => o.type === QuestionType.LIKERT_SCALE)
  @ValidateNested({ each: true })
  @Type(() => LikertQuestionDto)
  likertQuestions?: LikertQuestionDto[];

  @ValidateIf((o) => o.type === QuestionType.TEXT)
  validateTextQuestion() {
    if (this.options && this.options.length > 0) {
      throw new Error('Text questions should not have options.');
    }
    if (this.likertQuestions && this.likertQuestions.length > 0) {
      throw new Error('Text questions should not have likertQuestions.');
    }
  }

  @ValidateIf((o) => o.type !== QuestionType.LIKERT_SCALE)
  validateNonLikertQuestion() {
    if (this.likertQuestions && this.likertQuestions.length > 0) {
      throw new Error('Non-Likert questions should not have likertQuestions.');
    }
  }
}

export class SectionDto {
  @ApiProperty({
    example: 'Personal Information',
    description: 'Title of the section',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'This section covers basic personal details.',
    description: 'Optional description of the section',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: [QuestionDto],
    description: 'Array of survey questions',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
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
    type: [SectionDto],
    description: 'Array of sections containing survey questions',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  sections: SectionDto[];

  @ApiProperty({
    example: true,
    description: 'Enable audio recording',
    required: false,
  })
  @IsOptional()
  allowAudio?: boolean;

  @ApiProperty({
    example: true,
    description: 'Enable video recording',
    required: false,
  })
  @IsOptional()
  allowVideo?: boolean;

  @ApiProperty({
    example: true,
    description: 'Enable image capturing',
    required: false,
  })
  @IsOptional()
  allowImage?: boolean;

  @ApiProperty({
    example: 'This survey includes a promotional video.',
    description: 'Instruction for media (if applicable)',
    required: false,
  })
  @IsString()
  @IsOptional()
  mediaInstruction?: string;
}
