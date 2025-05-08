import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  DataEntryQuestion,
  DataEntryDocument,
  QuestionType,
} from './data-questions.schema';
import { CreateDataEntryQuestionDto } from './data-questions.dto';

//new
@Injectable()
export class DataEntryQuestionsService {
  constructor(
    @InjectModel(DataEntryQuestion.name)
    private dataEntryModel: Model<DataEntryDocument>,
  ) {}

  async createQuestionSet(
    dataEntryDto: CreateDataEntryQuestionDto,
  ): Promise<DataEntryQuestion> {
    try {
      dataEntryDto.sections = dataEntryDto.sections.map((section) => {
        section.questions = section.questions.map((q) => {
          if (
            q.type === QuestionType.SINGLE_CHOICE ||
            q.type === QuestionType.MULTIPLE_CHOICE
          ) {
            if (!q.options || q.options.length === 0) {
              throw new HttpException(
                'Single-choice and multiple-choice questions must have options',
                HttpStatus.BAD_REQUEST,
              );
            }
          }

          if (q.type === QuestionType.LIKERT_SCALE) {
            if (!q.likertQuestions || q.likertQuestions.length === 0) {
              throw new HttpException(
                'Likert scale questions must have likertQuestions',
                HttpStatus.BAD_REQUEST,
              );
            }
          }

          return q;
        });
        return section;
      });

      // Create a new document from the processed dataEntryDto
      const createdQuestionSet = new this.dataEntryModel(dataEntryDto);

      // Save the new document to the database
      const savedQuestionSet = await createdQuestionSet.save();

      return savedQuestionSet; // Return the saved document
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
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

  async deleteQuestionSet(id: string): Promise<{ message: string }> {
    const deletedEntry = await this.dataEntryModel.findByIdAndDelete(id).exec();
    if (!deletedEntry) {
      throw new NotFoundException('Question set not found');
    }
    return { message: 'Question set deleted successfully' };
  }
}
