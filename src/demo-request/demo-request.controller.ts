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
import { DemoRequestsService } from './demo-request.service';
import { CreateDemoRequestDto } from './demo-request.dto';
import { RolesGuard } from 'src/utils/roles/roles.guard';
import { Roles } from 'src/utils/roles/roles.decorator';

@ApiTags('Demo Requests')
@Controller('api/v1/demo-requests')
export class DemoRequestsController {
  constructor(private readonly demoRequestsService: DemoRequestsService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Submit a demo request' })
  @ApiResponse({
    status: 201,
    description: 'Your demo request has been submitted.',
  })
  createDemoRequest(@Body() dto: CreateDemoRequestDto) {
    return this.demoRequestsService.create(dto);
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Get('all')
  @ApiOperation({ summary: 'Get all demo requests (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all demo requests.',
  })
  getAllDemoRequests() {
    return this.demoRequestsService.findAll();
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Get(':id')
  @ApiOperation({ summary: 'Get a demo request by ID (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns the requested demo request.',
  })
  getDemoRequestById(@Param('id') id: string) {
    return this.demoRequestsService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a demo request (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The demo request has been successfully deleted.',
  })
  deleteDemoRequest(@Param('id') id: string) {
    return this.demoRequestsService.delete(id);
  }
}
