import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Request,
  Patch,
  Param,
  // ParseUUIDPipe,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/utils/roles/roles.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
import { NgStatesService } from './ng-states.service';
import { CreateStateDto, UpdateStateDto } from './ng-states.dto';

@ApiTags('Admin - Manage States')
@ApiBearerAuth()
@Controller('api/v1/admin')
@UseGuards(RolesGuard)
export class NgStatesController {
  constructor(private readonly statesService: NgStatesService) {}

  @Roles('admin')
  @Post('/create-state')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new state (Admin only)' })
  @ApiResponse({ status: 201, description: 'State created successfully' })
  @ApiResponse({ status: 409, description: 'Conflict: State already exists' })
  // async createState(
  //   @Body() createStateDto: CreateStateDto,
  //   @Request() req: any,
  // ) {
  //   const adminId = req.user.userId; // Extract the admin ID from the authenticated user
  //   console.log('Received request body:', createStateDto);
  //   return this.statesService.createState(createStateDto, adminId);
  // }
  async createState(@Body() createStateDto: CreateStateDto) {
    return this.statesService.createState(createStateDto);
  }

  @Roles('admin')
  @Patch('/update-state/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a state (Admin only)' })
  @ApiResponse({ status: 200, description: 'State updated successfully' })
  @ApiResponse({ status: 404, description: 'State not found' })
  @ApiResponse({ status: 400, description: 'Invalid state data' })
  async updateState(
    @Param('id') id: string,
    @Body() updateStateDto: UpdateStateDto,
    @Request() req: any,
  ) {
    const adminId = req.user.userId;
    return this.statesService.updateState(id, updateStateDto, adminId);
  }

  @Roles('admin')
  @Get('/view-states')
  @HttpCode(200)
  @ApiOperation({ summary: 'View all states (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of states retrieved' })
  @ApiResponse({ status: 404, description: 'No states found' })
  async viewStates() {
    return this.statesService.viewStates();
  }
}
