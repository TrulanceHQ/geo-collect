/* eslint-disable @typescript-eslint/no-unsafe-call */
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

  //new

  @Roles('fieldCoordinator')
  @Get('/responses/:fieldCoordinatorId')
  @ApiOperation({ summary: 'Get survey responses by field coordinator' })
  @ApiResponse({
    status: 200,
    description: 'Survey responses retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'No survey responses found' })
  // async getResponsesByFieldCoordinator(
  //   @Param('fieldCoordinatorId') fieldCoordinatorId: string,
  // ): Promise<SurveyResponse[]> {
  //   // (
  //   //   @Param('fieldCoordinatorId') fieldCoordinatorId: string,
  //   // )

  //   return this.EnumeratorFlowService.getResponsesByFieldCoordinator(
  //     fieldCoordinatorId,
  //   );
  // }
  async getResponsesByFieldCoordinator(
    @Param('fieldCoordinatorId') fieldCoordinatorId: string,
  ): Promise<SurveyResponse[]> {
    console.log(
      `Fetching responses for fieldCoordinatorId: ${fieldCoordinatorId}`,
    );

    const responses: SurveyResponse[] =
      await this.EnumeratorFlowService.getResponsesByFieldCoordinator(
        fieldCoordinatorId,
      );

    if (responses.length === 0) {
      console.log(
        `No survey responses found for fieldCoordinatorId: ${fieldCoordinatorId}`,
      );
      throw new NotFoundException('No survey responses found');
    }

    console.log(
      `Found ${responses.length} responses for fieldCoordinatorId: ${fieldCoordinatorId}`,
    );
    return responses;
  }

  // @UseGuards(JwtAuthGuard)
  @Roles('fieldCoordinator')
  @Get('responses/count/:fieldCoordinatorId')
  @ApiOperation({ summary: 'Get total responses count by field coordinator' })
  @ApiResponse({
    status: 200,
    description:
      'Returns the total number of responses submitted by enumerators created by the specified field coordinator.',
  })
  async getResponsesCountByFieldCoordinator(
    @Param('fieldCoordinatorId') fieldCoordinatorId: string,
  ): Promise<{ count: number; message: string }> {
    const result: { count: number; message: string } | null =
      await this.EnumeratorFlowService.getResponseCountByFieldCoordinator(
        fieldCoordinatorId,
      );
    if (!result) {
      throw new NotFoundException('No response count found');
    }
    return result;
  }
}
