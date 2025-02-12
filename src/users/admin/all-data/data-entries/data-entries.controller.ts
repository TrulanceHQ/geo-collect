// import { Controller, Post, Get, Body, Req } from '@nestjs/common';
// import { DataEntryResponsesService } from './data-entries-service';
// import { CreateDataEntryResponseDto } from './data-entries.dto';

// @Controller('enumerator/responses')
// export class EnumeratorController {
//   constructor(private readonly responsesService: DataEntryResponsesService) {}

//   @Post('submit')
//   submitResponse(@Body() dto: CreateDataEntryResponseDto, @Req() req) {
//     return this.responsesService.submitResponse(dto, req.user.id);
//   }

//   @Get('my-responses')
//   getMyResponses(@Req() req) {
//     return this.responsesService.getEnumeratorResponses(req.user.id);
//   }
// }

import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SurveyResponseService } from './data-entries-service';
import { SubmitSurveyDto } from './data-entries.dto';
import { RolesGuard } from 'src/utils/roles/roles.guard';
import { Roles } from 'src/utils/roles/roles.decorator';

@ApiTags('Enumerator - Survey Responses')
@ApiBearerAuth()
@Controller('enumerator/responses')
@UseGuards(RolesGuard)
export class EnumeratorController {
  constructor(private readonly responseService: SurveyResponseService) {}

  // Create a new data entry question
  @Roles('enumerator')
  @Post('submit')
  @HttpCode(201)
  @ApiOperation({ summary: 'Submit survey answers' })
  @ApiResponse({
    status: 201,
    description: 'Survey responses submitted successfully',
  })
  submitSurvey(@Body() dto: SubmitSurveyDto) {
    return this.responseService.submitSurvey(dto);
  }
}
