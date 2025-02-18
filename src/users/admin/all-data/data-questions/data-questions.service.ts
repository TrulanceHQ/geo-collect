import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataEntryQuestion, DataEntryDocument } from './data-questions.schema';
import { CreateDataEntryQuestionDto } from './data-questions.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DataEntryQuestionsService {
  constructor(
    @InjectModel(DataEntryQuestion.name)
    private dataEntryModel: Model<DataEntryDocument>,
  ) {}

  // async createQuestionSet(
  //   dto: CreateDataEntryQuestionDto,
  // ): Promise<DataEntryQuestion> {
  //   // const questionsWithIds = dto.questions.map((q) => ({
  //   //   ...q,
  //   //   questionId: uuidv4(),
  //   // }));

  //   const newEntry = new this.dataEntryModel({
  //     title: dto.title,
  //     subtitle: dto.subtitle,
  //     questions: dto.questions,
  //     // questions: questionsWithIds,
  //   });

  //   return newEntry.save();
  // }

  // async createQuestionSet(
  //   dataEntryDto: CreateDataEntryQuestionDto,
  // ): Promise<DataEntryQuestion> {
  //   // Filter out empty likertQuestions
  //   dataEntryDto.questions = dataEntryDto.questions.map((q) => {
  //     if (Array.isArray(q.likertQuestions) && q.likertQuestions.length === 0) {
  //       delete q.likertQuestions;
  //     }
  //     return q;
  //   });

  //   return this.dataEntryModel.create(dataEntryDto);
  // }

  async createQuestionSet(
    dataEntryDto: CreateDataEntryQuestionDto,
  ): Promise<DataEntryQuestion> {
    // Filter out empty options and empty likertQuestions
    dataEntryDto.questions = dataEntryDto.questions.map((q) => {
      if (Array.isArray(q.options) && q.options.length === 0) {
        delete q.options;
      }
      if (Array.isArray(q.likertQuestions) && q.likertQuestions.length === 0) {
        delete q.likertQuestions;
      }
      return q;
    });

    return this.dataEntryModel.create(dataEntryDto);
  }

  async getAllQuestionSets(): Promise<DataEntryQuestion[]> {
    return this.dataEntryModel.find().exec();
  }

  async getQuestionSetById(id: string): Promise<DataEntryQuestion> {
    const questionSet = await this.dataEntryModel.findById(id).exec();
    if (!questionSet) {
      throw new NotFoundException('Question set not found');
    }
    return questionSet;
  }

  async updateQuestionSet(
    id: string,
    dto: CreateDataEntryQuestionDto,
  ): Promise<DataEntryQuestion> {
    const updatedEntry = await this.dataEntryModel
      .findByIdAndUpdate(
        id,
        // {
        //   title: dto.title,
        //   questions: dto.questions.map((q) => ({
        //     ...q,
        //     questionId: uuidv4(),
        //   })),
        // },
        // { new: true },
        {
          title: dto.title,
          subtitle: dto.subtitle,
          questions: dto.questions, // Keep existing questionId values
        },
        { new: true },
      )
      .exec();

    if (!updatedEntry) {
      throw new NotFoundException('Question set not found');
    }

    return updatedEntry;
  }

  async deleteQuestionSet(id: string): Promise<{ message: string }> {
    const deletedEntry = await this.dataEntryModel.findByIdAndDelete(id).exec();
    if (!deletedEntry) {
      throw new NotFoundException('Question set not found');
    }
    return { message: 'Question set deleted successfully' };
  }
}
