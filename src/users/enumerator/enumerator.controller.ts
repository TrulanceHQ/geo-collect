/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
  } from '@nestjs/swagger';
import { DataEntryQuestionsService } from './../admin/all-data/data-questions/data-questions.service';
import { DataEntryQuestion } from './../admin/all-data/data-questions/data-questions.schema';

@ApiTags('Enumerator')
@ApiBearerAuth()
@Controller('api/v1/enumerator/questions')
export class EnumeratorController {
  constructor(
    private readonly dataEntryQuestionsService: DataEntryQuestionsService,
  ) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all question' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all question sets.',
  })
  async getAllQuestionSets(): Promise<DataEntryQuestion[]> {
    return this.dataEntryQuestionsService.getAllQuestionSets();
  }
}
