import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
// import { AuthService } from 'src/auth/auth.service';
import { CreateStateDto, UpdateStateDto } from './ng-states.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NgStates } from './ng-states.schema';

@Injectable()
export class NgStatesService {
  constructor(
    @InjectModel(NgStates.name) private readonly statesModel: Model<NgStates>,
  ) {}

  async createState(createStateDto: CreateStateDto) {
    // async createState(createStateDto: CreateStateDto, adminId: string) {
    // for (const state of createStateDto.ngstates) {
    // const existingState = await this.statesModel
    //   .findOne({ states: state })
    //   .exec();
    // if (existingState) {
    //   throw new ConflictException(`State ${state} already exists.`);
    // }
    const existingState = await this.statesModel
      .findOne({ ngstates: { $in: createStateDto.ngstates } })
      .exec();
    if (existingState) {
      throw new ConflictException(`One of the states already exists.`);
    }
    // const createdStates = await this.statesModel.create({
    //   ngstates: createStateDto.ngstates,
    //   createdBy: new Types.ObjectId(adminId), // Store the admin's ID
    // });

    // return createdStates;
    // Create the state without linking to an admin
    return this.statesModel.create({
      ngstates: createStateDto.ngstates,
    });
  }

  async updateState(
    id: string,
    updateStateDto: UpdateStateDto,
    adminId: string,
  ) {
    // Validate that the provided ID is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid state ID format.`);
    }
    // Find existing state by ID
    const existingState = await this.statesModel.findById(id).exec();

    if (!existingState) {
      throw new NotFoundException(`State with ID ${id} not found.`);
    }

    // Update the state
    if (updateStateDto.ngstates) {
      existingState.ngstates = updateStateDto.ngstates;
    }
    // existingState.ngstates = updateStateDto.ngstates;
    // existingState.updatedAt = new Date();
    // existingState.createdBy = new Types.ObjectId(adminId);

    // Save the updated state
    // await existingState.save();
    // return existingState;

    //removed
    // existingState.createdBy = new Types.ObjectId(adminId); // Track the admin who updated
    await existingState.save();

    return existingState;
  }

  async viewStates() {
    const states = await this.statesModel.find().exec();
    if (!states || states.length === 0) {
      throw new NotFoundException('No states found.');
    }
    return states;
  }
}
