/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
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
import { Roles } from 'src/utils/roles/roles.decorator';

@ApiTags('Enumerator Flow')
@ApiBearerAuth()
@Controller('api/v1/enumerator')
export class EnumeratorController {
  constructor(
    private readonly dataEntryQuestionsService: DataEntryQuestionsService,
    private readonly EnumeratorFlowService: EnumeratorFlowService,
  ) {}

  @Get('/survey/all')
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
    const { surveyId, responses, location, mediaUrl, startTime } = body;
    return this.EnumeratorFlowService.submitSurveyResponse(
      surveyId,
      responses,
      enumeratorId,
      location,
      mediaUrl,
      startTime,
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

  // @Roles('fieldCoordinator')
  // @Get('by-field-coordinator/:fieldCoordinatorId')
  // @ApiOperation({ summary: 'Get survey responses by field coordinator' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns the survey responses by field coordinator',
  // })
  // async getSurveyResponsesByFieldCoordinator(
  //   @Param('fieldCoordinatorId') fieldCoordinatorId: string,
  // ) {
  //   return this.EnumeratorFlowService.getSurveyResponsesByFieldCoordinator(
  //     fieldCoordinatorId,
  //   );
  // }

  // @UseGuards(JwtAuthGuard)
  // @Roles('fieldCoordinator')
  // @Get('responses/count/:fieldCoordinatorId')
  // @ApiOperation({ summary: 'Get total responses count by field coordinator' })
  // @ApiResponse({
  //   status: 200,
  //   description:
  //     'Returns the total number of responses submitted by enumerators created by the specified field coordinator.',
  // })
  // async getResponsesCountByFieldCoordinator(
  //   @Param('fieldCoordinatorId') fieldCoordinatorId: string,
  // ): Promise<{ count: number; message: string }> {
  //   return this.EnumeratorFlowService.getResponseCountByFieldCoordinator(
  //     fieldCoordinatorId,
  //   );
  // }

  // //fetch all data for admin
  @Roles('admin')
  @Get('all-responses-by-admin')
  @ApiOperation({ summary: 'Get all responses' })
  @ApiResponse({
    status: 200,
    description: 'Returns the all responses.',
  })
  async getAllSurveyResponses(): Promise<SurveyResponse[]> {
    return await this.EnumeratorFlowService.getAllSurveyResponses();
  }

  //survey count by admin

  @Roles('admin')
  @Get('survey-response-count')
  @ApiOperation({ summary: 'Get survey response count' })
  @ApiResponse({
    status: 200,
    description: 'Returns the total count of survey responses.',
  })
  async getSurveyResponseCount(): Promise<{ count: number }> {
    const count = await this.EnumeratorFlowService.getSurveyResponseCount();
    return { count };
  }

  //responses for field coord
  @Roles('fieldCoordinator')
  @Get('survey-responses/:fieldCoordinatorId')
  async getSurveyResponsesByFieldCoordinator(
    @Param('fieldCoordinatorId') fieldCoordinatorId: string,
  ): Promise<SurveyResponse[]> {
    return this.EnumeratorFlowService.getSurveyResponsesByFieldCoordinator(
      fieldCoordinatorId,
    );
  }
}
