/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  SurveyResponse,
  SurveyResponseDocument,
} from './survey-response.schema';
// import { SubmitSurveyResponseDto } from './dto/survey-response.dto';
import { User } from 'src/auth/schema/user.schema';
import {
  DataEntryDocument,
  DataEntryQuestion,
  QuestionType,
} from '../admin/all-data/data-questions/data-questions.schema';

@Injectable()
export class EnumeratorFlowService {
  private readonly logger = new Logger(EnumeratorFlowService.name);
  constructor(
    @InjectModel(SurveyResponse.name)
    private surveyResponseModel: Model<SurveyResponseDocument>,
    @InjectModel(DataEntryQuestion.name)
    private dataEntryQuestionModel: Model<DataEntryDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // async submitSurveyResponse(
  //   surveyId: string,
  //   responses: SubmitSurveyResponseDto['responses'],
  //   enumeratorId: string,
  //   location: SubmitSurveyResponseDto['location'],
  //   mediaUrl: SubmitSurveyResponseDto['mediaUrl'],
  // ): Promise<SurveyResponse> {
  //   const newResponse = new this.surveyResponseModel({
  //     surveyId: new Types.ObjectId(surveyId),
  //     enumeratorId,
  //     responses,
  //     location,
  //     mediaUrl,
  //   });

  //   return newResponse.save();
  // }

  //new
  async submitSurveyResponse(
    surveyId: string,
    responses: Array<{ questionId: string; answer: any }>,
    enumeratorId: string,
    location: string,
    mediaUrl: string,
    startTime: Date,
  ): Promise<SurveyResponse> {
    const surveyDefinition = await this.dataEntryQuestionModel
      .findById(surveyId)
      .lean();
    if (!surveyDefinition || !surveyDefinition.sections) {
      throw new Error('Survey definition not found');
    }

    // Enrich responses with question text if needed
    const enrichedResponses = responses.map((entry) => {
      let question = '';
      let processedAnswer = entry.answer; // default for non-likert responses

      // Loop through each section and their questions to find the corresponding question.
      for (const section of surveyDefinition.sections) {
        const matchedQuestion = section.questions.find(
          (q: any) => String(q._id) === String(entry.questionId),
        );

        if (matchedQuestion) {
          question = matchedQuestion.question; // 'question' is the text from your schema

          // Handle likert-scale questions specifically
          if (
            matchedQuestion.type === 'likert-scale' &&
            matchedQuestion.likertQuestions
          ) {
            const subQuestion = matchedQuestion.likertQuestions.find(
              (likertQ: any, index: number) =>
                String(`${entry.questionId}-${index}`) ===
                String(entry.questionId),
            );
            if (subQuestion) {
              question = `${matchedQuestion.question} - ${subQuestion.question}`;
              processedAnswer = entry.answer;
            }
          }

          break;
        }
      }

      // Logging for debugging: make sure both fields are correctly captured.
      this.logger.debug(
        `Enriched entry: questionId: ${entry.questionId}, question: ${question}, response: ${processedAnswer}`,
      );

      return {
        questionId: entry.questionId,
        question: question,
        answer: processedAnswer,
      };
    });

    // Create and save the new SurveyResponse document
    const surveyResponse = new this.surveyResponseModel({
      surveyId,
      enumeratorId,
      responses: enrichedResponses,
      location,
      mediaUrl,
      startTime, // Save startTime as part of the response
    });

    await surveyResponse.save();
    return surveyResponse;
  }

  // async submitSurveyResponse(
  //   surveyId: string,
  //   responses: Array<{ questionId: string; answer: any }>,

  //   enumeratorId: string,
  //   location: string,
  //   mediaUrl: string,
  //   startTime: Date, // <-- New parameter added
  // ): Promise<SurveyResponse> {

  //   const surveyDefinition = await this.dataEntryQuestionModel
  //     .findById(surveyId)
  //     .lean();
  //   if (!surveyDefinition || !surveyDefinition.sections) {
  //     throw new Error('Survey definition not found');
  //   }

  //   // Enrich responses with question text if needed (see previous logic)
  //   const enrichedResponses = responses.map((entry) => {
  //     // let question = '';
  //     let question = '';
  //     let processedAnswer = entry.answer; // default for non-likert responses

  //     // Loop through each section and their questions to find the corresponding question.
  //     for (const section of surveyDefinition.sections) {

  //       const matchedQuestion = section.questions.find(
  //         (q: any) =>
  //           // Compare using string representations
  //           String(q._id) === String(entry.questionId),
  //       );

  //       if (matchedQuestion) {
  //         question = matchedQuestion.question; // 'question' is the text from your schema

  //         //new

  //         if (matchedQuestion.type === QuestionType.LIKERT_SCALE) {
  //           // For instance, if the client sends the answer as an object with sub-question responses,
  //           // you might want to store it as a JSON string.
  //           if (typeof entry.answer === 'object') {
  //             processedAnswer = JSON.stringify(entry.answer);
  //           } else {
  //             processedAnswer = entry.answer;
  //           }
  //         }
  //         //new ends
  //         break;
  //       }
  //     }
  //     // Logging for debugging: make sure both fields are correctly captured.
  //     this.logger.debug(
  //       // `Enriched entry: questionId: ${entry.questionId}, question: ${question}, response: ${entry.answer}`,
  //       `Enriched entry: questionId: ${entry.questionId}, question: ${question}, response: ${processedAnswer}`,
  //     );

  //     return {
  //       questionId: entry.questionId,
  //       // Optionally include question if you've updated your SurveyResponse schema.
  //       question: question,
  //       answer: processedAnswer,
  //       // answer: entry.answer,
  //     };
  //   });

  //   const newResponse = new this.surveyResponseModel({
  //     surveyId: new Types.ObjectId(surveyId),
  //     enumeratorId,
  //     responses: enrichedResponses,
  //     location,
  //     mediaUrl,
  //     startTime, // <-- Here is your startTime field
  //   });

  //   return newResponse.save();
  // }

  async getSurveyResponses(surveyId: string): Promise<SurveyResponse[]> {
    return this.surveyResponseModel
      .find({ surveyId })
      .populate('enumeratorId', 'name email')
      .exec();
  }

  async getSurveyResponsesByEnumerator(
    enumeratorId: string,
  ): Promise<SurveyResponse[]> {
    return this.surveyResponseModel
      .find({ enumeratorId })
      .select('surveyId responses location mediaUrl startTime submittedAt')
      .populate('surveyId', 'title')
      .exec();
  }

  // async getEnumeratorsByFieldCoordinator(
  //   fieldCoordinatorId: string,
  // ): Promise<User[]> {
  //   const enumerators = await this.userModel
  //     .find({ fieldCoordinatorId })
  //     .exec();
  //   this.logger.log(
  //     `Enumerators for fieldCoordinatorId ${fieldCoordinatorId}: ${JSON.stringify(enumerators)}`,
  //   );
  //   return enumerators;
  // }

  // async getSurveyResponsesByFieldCoordinator(
  //   fieldCoordinatorId: string,
  // ): Promise<SurveyResponse[]> {
  //   const enumerators =
  //     await this.getEnumeratorsByFieldCoordinator(fieldCoordinatorId);
  //   const enumeratorIds = enumerators.map((enumerator) => enumerator._id);

  //   this.logger.log(`Found enumerators: ${JSON.stringify(enumerators)}`);
  //   this.logger.log(`Enumerator IDs: ${JSON.stringify(enumeratorIds)}`);

  //   if (enumeratorIds.length === 0) {
  //     this.logger.warn(
  //       `No enumerators found for fieldCoordinatorId ${fieldCoordinatorId}`,
  //     );
  //     return [];
  //   }

  //   this.logger.log(
  //     `Fetching survey responses for enumeratorIds: ${JSON.stringify(enumeratorIds)}`,
  //   );

  //   try {
  //     const surveyResponses = await this.surveyResponseModel
  //       .find({ enumeratorId: { $in: enumeratorIds } })
  //       .populate('enumeratorId', 'name email')
  //       .populate('surveyId')
  //       // .populate('surveyId', 'title')
  //       // .populate('surveyId', 'title')
  //       .exec();

  //     this.logger.log(
  //       `Survey responses from DB: ${JSON.stringify(surveyResponses)}`,
  //     );

  //     const results = await this.surveyResponseModel.aggregate([
  //       {
  //         $match: { enumeratorId: { $in: enumeratorIds } },
  //       },
  //       {
  //         $lookup: {
  //           from: 'DataEntryQuestions', // Make sure the collection name matches
  //           localField: 'surveyId',
  //           foreignField: '_id',
  //           as: 'survey',
  //         },
  //       },
  //     ]);

  //     console.log(results);

  //     const responses = await this.surveyResponseModel
  //       .find({
  //         enumeratorId: { $in: enumeratorIds },
  //       })
  //       .exec();

  //     console.log(responses);

  //     if (surveyResponses.length === 0) {
  //       this.logger.warn(
  //         `No survey responses found for enumeratorIds: ${JSON.stringify(enumeratorIds)}`,
  //       );
  //     } else {
  //       surveyResponses.forEach((responses) => {
  //         this.logger.log(`Survey Response ID: ${responses._id}`);
  //         this.logger.log(`Survey ID: ${responses.surveyId}`);
  //         this.logger.log(`Enumerator ID: ${responses.enumeratorId}`);
  //       });
  //     }

  //     return surveyResponses;
  //   } catch (error) {
  //     this.logger.error(
  //       `Error fetching survey responses: ${error.message}`,
  //       error.stack,
  //     );
  //     throw new Error(
  //       `Failed to fetch survey responses for enumeratorIds: ${JSON.stringify(enumeratorIds)}`,
  //     );
  //   }
  // }

  // async getResponseCountByFieldCoordinator(
  //   fieldCoordinatorId: string,
  // ): Promise<{ count: number; message: string }> {
  //   const enumerators = await this.userModel
  //     .find({ fieldCoordinatorId, role: 'enumerator' })
  //     .select('_id')
  //     .exec();

  //   const enumeratorIds = enumerators.map((enumerator) => enumerator._id);

  //   const count = await this.surveyResponseModel
  //     .countDocuments({
  //       enumeratorId: { $in: enumeratorIds },
  //     })
  //     .exec();

  //   let message = 'Total responses retrieved successfully';
  //   if (count === 0) {
  //     message = 'No responses found for the specified field coordinator';
  //   }

  //   return { count, message };
  // }

  //fetch all data for admin

  async getAllSurveyResponses(): Promise<SurveyResponse[]> {
    return (
      this.surveyResponseModel
        .find()
        .populate({
          path: 'surveyId',
          select: 'title subtitle',
        })
        .populate({
          path: 'enumeratorId',
          select: { firstName: 1, lastName: 1, fieldCoordinatorId: 1 }, // Ensure fieldCoordinatorId is selected
          populate: {
            path: 'fieldCoordinatorId',
            select: { firstName: 1, lastName: 1, selectedState: 1 }, // Populate the related user (field coordinator) with these fields
          },
        })
        // .populate('responses.questionId', 'question')
        .exec()
    );
  }
}
