import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DataEntryQuestionsService } from './data-questions.service';
import { CreateDataEntryQuestionDto } from './data-questions.dto';
import { RolesGuard } from 'src/utils/roles/roles.guard';
import { Roles } from 'src/utils/roles/roles.decorator';

@ApiTags('Admin - Data Entry Questions')
@ApiBearerAuth()
@Controller('api/v1')
// @Controller('admin/questions')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private readonly questionsService: DataEntryQuestionsService) {}

  // Create a new data entry question
  @Roles('admin')
  @Post('create')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a set of questions' })
  @ApiResponse({
    status: 201,
    description: 'The question set has been successfully created.',
  })
  createQuestionSet(@Body() dto: CreateDataEntryQuestionDto) {
    return this.questionsService.createQuestionSet(dto);
  }
  //Get
  @Roles('admin')
  @Get('all')
  @ApiOperation({ summary: 'Get all question sets' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all question sets.',
  })
  getAllQuestionSets() {
    return this.questionsService.getAllQuestionSets();
  }

  @Roles('admin')
  @Get(':id')
  @ApiOperation({ summary: 'Get a question set by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the requested question set.',
  })
  getQuestionSetById(@Param('id') id: string) {
    return this.questionsService.getQuestionSetById(id);
  }

  // @Roles('admin')
  // @Patch(':id')
  // @ApiOperation({ summary: 'Update a question set' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The question set has been successfully updated.',
  // })
  // updateQuestionSet(
  //   @Param('id') id: string,
  //   @Body() dto: CreateDataEntryQuestionDto,
  // ) {
  //   return this.questionsService.updateQuestionSet(id, dto);
  // }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a question set' })
  @ApiResponse({
    status: 200,
    description: 'The question set has been successfully deleted.',
  })
  deleteQuestionSet(@Param('id') id: string) {
    return this.questionsService.deleteQuestionSet(id);
  }
}
