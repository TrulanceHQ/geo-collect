// import { IsMongoId, IsString, IsArray, IsEnum } from 'class-validator';
// import { QuestionType } from '../data-questions/data-questions.schema';

// export class CreateDataEntryResponseDto {
//   @IsMongoId()
//   questionId: string;

//   @IsString({ each: true })
//   response: string | string[];
// }
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AnswerDto {
  @ApiProperty({
    example: '60f5a3b8e13f4d5c9b123456',
    description: 'Question ID',
  })
  @IsString()
  questionId: string;

  @ApiProperty({ example: 'Blue', description: 'Answer to the question' })
  answer: string | string[];
}

export class SubmitSurveyDto {
  @ApiProperty({ example: 'enumerator-123', description: 'Enumerator ID' })
  @IsString()
  enumeratorId: string;

  @ApiProperty({ example: 'survey-abc', description: 'Survey ID' })
  @IsString()
  surveyId: string;

  @ApiProperty({ type: [AnswerDto], description: 'Responses to questions' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  responses: AnswerDto[];
}
