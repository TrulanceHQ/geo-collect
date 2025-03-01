import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNotEmpty, IsDate } from 'class-validator';

export class SurveyResponseDto {
  @ApiProperty({
    example: '65b47f5e3a25d1c4a6f6a9b0',
    description: 'Question ID',
  })
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({ example: 'Blue', description: 'Selected answer' })
  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class SubmitSurveyResponseDto {
  @ApiProperty({
    example: '65b47f5e3a25d1c4a6f6a9b0',
    description: 'Survey ID',
  })
  @IsString()
  @IsNotEmpty()
  surveyId: string;

  @ApiProperty({ example: 'user123', description: 'Enumerator ID' })
  @IsString()
  @IsNotEmpty()
  enumeratorId: string;

  @ApiProperty({ example: 'Lagos', description: 'Location' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: 'image',
    description: 'https://mypixsaaaaaaaaaaaaaaaa',
  })
  @IsString()
  @IsNotEmpty()
  mediaUrl: string;

  @ApiProperty({ type: [SurveyResponseDto], description: 'Responses' })
  @IsArray()
  @IsNotEmpty()
  responses: SurveyResponseDto[];

  // @ApiProperty({
  //   example: '2025-02-28T20:30:00Z',
  //   description: 'Survey Start Time',
  // })
  // @IsDate()
  // @IsNotEmpty()
  // startTime: Date;
}
