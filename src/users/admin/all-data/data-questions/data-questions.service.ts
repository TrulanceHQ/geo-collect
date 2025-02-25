import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  DataEntryQuestion,
  DataEntryDocument,
  QuestionType,
} from './data-questions.schema';
import {
  CreateDataEntryQuestionDto,
  QuestionDto,
  SectionDto,
} from './data-questions.dto';
// import { v4 as uuidv4 } from 'uuid';

// @Injectable()
// export class DataEntryQuestionsService {
//   constructor(
//     @InjectModel(DataEntryQuestion.name)
//     private dataEntryModel: Model<DataEntryDocument>,
//   ) {}

//   async createQuestionSet(
//     dataEntryDto: CreateDataEntryQuestionDto,
//   ): Promise<DataEntryQuestion> {
//     // Filter out empty options and empty likertQuestions
//     dataEntryDto.questions = dataEntryDto.questions.map((q) => {
//       if (Array.isArray(q.options) && q.options.length === 0) {
//         delete q.options;
//       }
//       if (Array.isArray(q.likertQuestions) && q.likertQuestions.length === 0) {
//         delete q.likertQuestions;
//       }
//       return q;
//     });

//     return this.dataEntryModel.create(dataEntryDto);
//   }

//new
@Injectable()
export class DataEntryQuestionsService {
  constructor(
    @InjectModel(DataEntryQuestion.name)
    private dataEntryModel: Model<DataEntryDocument>,
  ) {}

  // async createQuestionSet(
  //   dataEntryDto: CreateDataEntryQuestionDto,
  // ): Promise<DataEntryQuestion> {

  //   dataEntryDto.questions = dataEntryDto.questions.map((q) => {
  //     if (Array.isArray(q.options) && q.options.length === 0) {
  //       delete q.options;
  //     }
  //     if (Array.isArray(q.likertQuestions) && q.likertQuestions.length === 0) {
  //       delete q.likertQuestions;
  //     }
  //     return q;
  //   });

  //   return this.dataEntryModel.create(dataEntryDto);
  // }

  // async processSections(
  // async createQuestionSet(
  //   dataEntryDto: CreateDataEntryQuestionDto,
  // ): Promise<void> {
  //   dataEntryDto.sections = dataEntryDto.sections.map((section) => {
  //     section.questions = section.questions.map((q) => {
  //       // Your processing logic for each question

  //       return q;
  //     });
  //     return section;
  //   });
  // }

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

          // if (q.type === QuestionType.TEXT) {
          //   if (q.options || q.likertQuestions) {
          //     throw new HttpException(
          //       'Text questions should not have options of likertQuestions',
          //       HttpStatus.BAD_REQUEST,
          //     );
          //   }
          // }

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

  //working below
  // async createQuestionSet(
  //   dataEntryDto: CreateDataEntryQuestionDto,
  // ): Promise<DataEntryQuestion> {
  //   try {
  //     dataEntryDto.sections = dataEntryDto.sections.map((section) => {
  //       section.questions = section.questions.map((q) => {
  //         if (
  //           q.type === QuestionType.SINGLE_CHOICE ||
  //           q.type === QuestionType.MULTIPLE_CHOICE
  //         ) {
  //           if (!q.options || q.options.length === 0) {
  //             throw new HttpException(
  //               'Single-choice and multiple-choice questions must have options',
  //               HttpStatus.BAD_REQUEST,
  //             );
  //           }
  //         }

  //         if (q.type === QuestionType.LIKERT_SCALE) {
  //           if (!q.likertQuestions || q.likertQuestions.length === 0) {
  //             throw new HttpException(
  //               'Likert scale questions must have likertQuestions',
  //               HttpStatus.BAD_REQUEST,
  //             );
  //           }
  //         }

  //         if (q.type === QuestionType.TEXT) {
  //           if (q.options || q.likertQuestions) {
  //             throw new HttpException(
  //               'Text questions should not have options or likertQuestions',
  //               HttpStatus.BAD_REQUEST,
  //             );
  //           }
  //         }

  //         return q;
  //       });
  //       return section;
  //     });

  //     // Create a new document from the processed dataEntryDto
  //     const createdQuestionSet = new this.dataEntryModel(dataEntryDto);

  //     // Save the new document to the database
  //     const savedQuestionSet = await createdQuestionSet.save();

  //     return savedQuestionSet; // Return the saved document
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  // async createQuestionSet(
  //   dataEntryDto: CreateDataEntryQuestionDto,
  // ): Promise<CreateDataEntryQuestionDto> {
  //   try {
  //     dataEntryDto.sections = dataEntryDto.sections.map(
  //       (section: SectionDto) => {
  //         section.questions = section.questions.map((q: QuestionDto) => {
  //           if (
  //             q.type === QuestionType.SINGLE_CHOICE ||
  //             q.type === QuestionType.MULTIPLE_CHOICE
  //           ) {
  //             if (!q.options || q.options.length === 0) {
  //               throw new HttpException(
  //                 'Single-choice and multiple-choice questions must have options',
  //                 HttpStatus.BAD_REQUEST,
  //               );
  //             }
  //           }

  //           if (q.type === QuestionType.LIKERT_SCALE) {
  //             if (!q.likertQuestions || q.likertQuestions.length === 0) {
  //               throw new HttpException(
  //                 'Likert scale questions must have likertQuestions',
  //                 HttpStatus.BAD_REQUEST,
  //               );
  //             }
  //           }

  //           if (q.type === QuestionType.TEXT) {
  //             if (q.options || q.likertQuestions) {
  //               throw new HttpException(
  //                 'Text questions should not have options or likertQuestions',
  //                 HttpStatus.BAD_REQUEST,
  //               );
  //             }
  //           }

  //           return q;
  //         });
  //         return section;
  //       },

  //     );

  //     return dataEntryDto; // Return the updated dataEntryDto
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  // async createQuestionSet(
  //   dataEntryDto: CreateDataEntryQuestionDto,
  // ): Promise<void> {
  //   dataEntryDto.sections = dataEntryDto.sections.map((section: SectionDto) => {
  //     section.questions = section.questions.map((q: QuestionDto) => {
  //       // Your processing logic for each question
  //       if (
  //         q.type === QuestionType.SINGLE_CHOICE ||
  //         q.type === QuestionType.MULTIPLE_CHOICE
  //       ) {
  //         if (!q.options || q.options.length === 0) {
  //           throw new Error(
  //             'Single-choice and multiple-choice questions must have options',
  //           );
  //         }
  //       }

  //       if (q.type === QuestionType.LIKERT_SCALE) {
  //         if (!q.likertQuestions || q.likertQuestions.length === 0) {
  //           throw new Error('Likert scale questions must have likertQuestions');
  //         }
  //       }

  //       if (q.type === QuestionType.TEXT) {
  //         if (q.options || q.likertQuestions) {
  //           throw new Error(
  //             'Text questions should not have options or likertQuestions',
  //           );
  //         }
  //       }

  //       // Additional processing logic can be added here

  //       return q;
  //     });
  //     return section;
  //   });
  // }

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

  // async updateQuestionSet(
  //   id: string,
  //   dto: CreateDataEntryQuestionDto,
  // ): Promise<DataEntryQuestion> {
  //   const updatedEntry = await this.dataEntryModel
  //     .findByIdAndUpdate(
  //       id,

  //       {
  //         title: dto.title,
  //         subtitle: dto.subtitle,
  //         questions: dto.questions, // Keep existing questionId values
  //       },
  //       { new: true },
  //     )
  //     .exec();

  //   if (!updatedEntry) {
  //     throw new NotFoundException('Question set not found');
  //   }

  //   return updatedEntry;
  // }

  // async updateDataEntryQuestion(dto: CreateDataEntryQuestionDto): Promise<DataEntryQuestion> {
  //   const updatedEntry = {
  //     ...existingEntry,
  //     title: dto.title,
  //     subtitle: dto.subtitle,
  //     sections: dto.sections.map((section) => {
  //       return {
  //         ...section,
  //         questions: section.questions.map((q) => {
  //           // Keep existing questionId values or any other logic
  //           return q;
  //         })
  //       };
  //     }),
  //     allowAudio: dto.allowAudio,
  //     allowVideo: dto.allowVideo,
  //     allowImage: dto.allowImage,
  //     mediaInstruction: dto.mediaInstruction,
  //   };

  async deleteQuestionSet(id: string): Promise<{ message: string }> {
    const deletedEntry = await this.dataEntryModel.findByIdAndDelete(id).exec();
    if (!deletedEntry) {
      throw new NotFoundException('Question set not found');
    }
    return { message: 'Question set deleted successfully' };
  }
}
