import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DataEntryQuestion } from './data-questions.schema';
import {
  CreateDataEntryQuestionDto,
  UpdateDataEntryQuestionDto,
} from './data-questions.dto';

@Injectable()
export class DataEntryQuestionsService {
  constructor(
    @InjectModel(DataEntryQuestion.name)
    private readonly dataEntryQuestionModel: Model<DataEntryQuestion>,
  ) {}

  async createQuestion(
    createDataEntryQuestionDto: CreateDataEntryQuestionDto,
    adminId: string,
  ) {
    const createdQuestion = new this.dataEntryQuestionModel({
      ...createDataEntryQuestionDto,
      createdBy: new Types.ObjectId(adminId),
    });
    return await createdQuestion.save();
  }

  async getAllQuestions() {
    return this.dataEntryQuestionModel.find({ isActive: true }).exec();
  }

  async updateQuestion(
    id: string,
    updateDataEntryQuestionDto: UpdateDataEntryQuestionDto,
    adminId: string,
  ) {
    const existingQuestion = await this.dataEntryQuestionModel
      .findById(id)
      .exec();
    if (!existingQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found.`);
    }

    // if (existingQuestion.createdBy.toString() !== adminId) {
    //   throw new Error('You are not authorized to update this question.');
    // }

    Object.assign(existingQuestion, updateDataEntryQuestionDto, {
      updatedBy: adminId,
    });
    return await existingQuestion.save();
  }

  async deleteQuestion(id: string) {
    const existingQuestion = await this.dataEntryQuestionModel
      .findById(id)
      .exec();
    if (!existingQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found.`);
    }

    existingQuestion.isActive = false; // Mark as inactive instead of deleting it
    await existingQuestion.save();
    return { message: 'Question deleted successfully' };
  }
  // Retrieve all data entries
  async getAllDataEntries(): Promise<DataEntryQuestion[]> {
    return await this.dataEntryQuestionModel
      .find()
      .populate('createdBy')
      .exec();
  }

  // Retrieve a single data entry by its ID
  async getDataEntryById(id: string): Promise<DataEntryQuestion> {
    const entry = await this.dataEntryQuestionModel
      .findById(id)
      .populate('createdBy')
      .exec();

    if (!entry) {
      throw new NotFoundException(`Data entry with ID ${id} not found`);
    }
    return entry;
  }
  // count the total number of data entries collected
  async countDataEntries(): Promise<number> {
    return await this.dataEntryQuestionModel.countDocuments().exec();
  }
}
