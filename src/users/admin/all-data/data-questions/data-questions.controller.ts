import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Get,
  UseGuards,
  HttpCode,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/utils/roles/roles.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { DataEntryQuestionsService } from './data-questions.service';
import {
  CreateDataEntryQuestionDto,
  UpdateDataEntryQuestionDto,
} from './data-questions.dto';

@ApiTags('Admin Data Entry')
@ApiBearerAuth()
@Controller('api/v1/admin/data-entry-questions')
@UseGuards(RolesGuard)
export class DataEntryQuestionsController {
  constructor(
    private readonly dataEntryQuestionsService: DataEntryQuestionsService,
  ) {}

  // Create a new data entry question
  @Roles('admin')
  @Post('/create')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new data entry question' })
  @ApiResponse({ status: 201, description: 'Question created successfully' })
  async createQuestion(
    @Body() createDataEntryQuestionDto: CreateDataEntryQuestionDto,
    @Request() req: any,
  ) {
    const adminId = req.user.userId;
    return this.dataEntryQuestionsService.createQuestion(
      createDataEntryQuestionDto,
      adminId,
    );
  }

  // Retrieve all data entry questions
  @Roles('admin')
  @Get('/')
  @ApiOperation({ summary: 'Get all data entry questions' })
  @ApiResponse({ status: 200, description: 'List of all data entry questions' })
  async getQuestions() {
    return this.dataEntryQuestionsService.getAllQuestions();
  }

  // Update a data entry question
  @Roles('admin')
  @Patch('/update/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a data entry question' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  async updateQuestion(
    @Param('id') id: string,
    @Body() updateDataEntryQuestionDto: UpdateDataEntryQuestionDto,
    @Request() req: any,
  ) {
    const adminId = req.user.userId;
    return this.dataEntryQuestionsService.updateQuestion(
      id,
      updateDataEntryQuestionDto,
      adminId,
    );
  }

  // Delete a data entry question
  @Roles('admin')
  @Delete('/delete/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a data entry question' })
  @ApiResponse({ status: 200, description: 'Question deleted successfully' })
  async deleteQuestion(@Param('id') id: string) {
    return this.dataEntryQuestionsService.deleteQuestion(id);
  }

  // Retrieve all data entries
  @Roles('admin')
  @Get('/data-entries')
  @ApiOperation({ summary: 'Retrieve all data entries (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all data entries' })
  async getAllDataEntries() {
    return this.dataEntryQuestionsService.getAllDataEntries();
  }

  // Retrieve a single data entry by ID
  @Roles('admin')
  @Get('/data-entries/:id')
  @ApiOperation({ summary: 'Retrieve a single data entry by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Data entry details' })
  async getDataEntryById(@Param('id') id: string) {
    return this.dataEntryQuestionsService.getDataEntryById(id);
  }
  // Retrieve the count of all data entries
  @Roles('admin')
  @Get('/data-entries/count')
  @ApiOperation({ summary: 'Retrieve the total number of data entries' })
  @ApiResponse({ status: 200, description: 'Data entry count retrieved' })
  async getDataEntriesCount() {
    return { count: await this.dataEntryQuestionsService.countDataEntries() };
  }
}
