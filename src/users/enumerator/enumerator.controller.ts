/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DataEntryQuestionsService } from './../admin/all-data/data-questions/data-questions.service';
import { DataEntryQuestion } from './../admin/all-data/data-questions/data-questions.schema';
import { EnumeratorFlowService } from './enumerator.service';
import { JwtAuthGuard } from 'src/utils/JwtAuthGuard';
import { SurveyResponse } from './survey-response.schema';

@ApiTags('Enumerator Flow')
@ApiBearerAuth()
@Controller('api/v1')
// @Controller('api/v1/enumerator')
export class EnumeratorController {
  constructor(
    private readonly dataEntryQuestionsService: DataEntryQuestionsService,
    private readonly EnumeratorFlowService: EnumeratorFlowService,
  ) {}

  @Get('enumerator/survey/all')
  @ApiOperation({ summary: 'Get all question' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all question sets.',
  })
  async getAllQuestionSets(): Promise<DataEntryQuestion[]> {
    return this.dataEntryQuestionsService.getAllQuestionSets();
  }

  
  @UseGuards(JwtAuthGuard)
  @Post('survey/submit')
  @ApiOperation({ summary: 'Submit survey responses' })
  async submitSurveyResponse(@Body() body: any, @Req() req) {
    const enumeratorId = req.user.sub as string;
    const { surveyId, responses, location, mediaUrl } = body;
    return this.EnumeratorFlowService.submitSurveyResponse(
      surveyId,
      responses,
      enumeratorId,
      location,
      mediaUrl,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('survey/responses')
  @ApiOperation({
    summary: 'Get all survey responses for the authenticated enumerator',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns a list of all survey responses for the authenticated enumerator.',
  })
  async getSurveyResponses(@Req() req): Promise<SurveyResponse[]> {
    const enumeratorId = req.user.sub as string;
    return this.EnumeratorFlowService.getSurveyResponsesByEnumerator(
      enumeratorId,
    );
  }
}
