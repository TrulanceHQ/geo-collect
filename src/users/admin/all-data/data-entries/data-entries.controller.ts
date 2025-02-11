import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { DataEntryService } from './data-entries-service';
import { SubmitDataEntryDto } from './data-entires.dto';
import { RolesGuard } from 'src/utils/roles/roles.guard';
import { Roles } from 'src/utils/roles/roles.decorator';

@ApiTags('Enumerator Data Entries')
@ApiBearerAuth()
@Controller('api/v1/enumerator/data-entries')
@UseGuards(RolesGuard)
export class EnumeratorDataEntryController {
  constructor(private readonly dataEntryService: DataEntryService) {}

  @Roles('enumerator')
  @Post('/submit')
  @ApiOperation({ summary: 'Submit a new data entry' })
  @ApiResponse({
    status: 201,
    description: 'Data entry submitted successfully',
  })
  async submitDataEntry(
    @Body() createDataEntryDto: SubmitDataEntryDto,
    @Request() req: any,
  ) {
    const enumeratorId = req.user.userId;
    return this.dataEntryService.createDataEntry(
      createDataEntryDto,
      enumeratorId,
    );
  }

  @Roles('admin')
  @Get('/:id')
  @ApiOperation({ summary: 'Get data entry by ID' })
  @ApiResponse({
    status: 200,
    description: 'Data entry retrieved successfully',
  })
  async getDataEntryById(@Param('id') id: string) {
    return this.dataEntryService.getDataEntryById(id);
  }
}
