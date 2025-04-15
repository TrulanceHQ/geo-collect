import {
  Controller,
  Get,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SurveyAggregationService } from './survey-aggregation.service';
import { RolesGuard } from 'src/utils/roles/roles.guard';
import { Roles } from 'src/utils/roles/roles.decorator';

@ApiTags('Survey Aggregation')
@ApiBearerAuth() // Remove this if the endpoint doesn't require a bearer token.
@Controller('api/v1') // Changed the prefix to avoid conflict.
@UseGuards(RolesGuard)
export class SurveyAggregationController {
  constructor(private readonly aggregationService: SurveyAggregationService) {}

  @Roles('admin')
  @Get('survey-aggregation') // Now using the root of 'survey-aggregation'
  @ApiOperation({
    summary: 'Aggregate survey responses for a given question',
    description:
      'Returns aggregated survey data for the specified question. For categorical questions (e.g., "Gender"), it groups responses by text; for Likert scale questions, it converts answers to numbers before grouping.',
  })
  @ApiResponse({
    status: 200,
    description: 'Aggregated data returned successfully.',
    schema: {
      example: [
        { _id: 'Male', count: 45 },
        { _id: 'Female', count: 35 },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Missing or invalid question parameter.',
  })
  async aggregate(
    @Query('question') question: string,
    @Query('type') type: string,
  ) {
    if (!question) {
      throw new BadRequestException(
        'The "question" query parameter is required.',
      );
    }

    if (type && type.toLowerCase() === 'likert') {
      return this.aggregationService.aggregateLikert(question);
    } else {
      // Default to categorical aggregation.
      return this.aggregationService.aggregateByQuestion(question);
    }
  }
}
