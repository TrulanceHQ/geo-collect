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
import { User, UserRole } from 'src/auth/schema/user.schema';
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

    // Convert enumeratorId to ObjectId
    const enumeratorObjectId = new Types.ObjectId(enumeratorId);

    // Create and save the new SurveyResponse document
    const surveyResponse = new this.surveyResponseModel({
      surveyId,
      // enumeratorId,
      enumeratorId: enumeratorObjectId,
      responses: enrichedResponses,
      location,
      mediaUrl,
      startTime, // Save startTime as part of the response
    });

    await surveyResponse.save();
    return surveyResponse;
  }

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

  //get enumerators/surveyresponses for field coordinators
  // async getSurveyResponsesByFieldCoordinator(
  //   fieldCoordinatorId: string,
  // ): Promise<SurveyResponse[]> {
  //   // Log the fieldCoordinatorId
  //   console.log('Field Coordinator ID:', fieldCoordinatorId);

  //   const enumerators = await this.userModel
  //     .find({ fieldCoordinatorId, role: 'enumerator' })
  //     .select('_id')
  //     .exec();

  //   // Log the found enumerators
  //   console.log('Enumerators:', enumerators);

  //   const enumeratorIds = enumerators.map((enumerator) => enumerator._id);

  //   // Log the enumerator IDs
  //   console.log('Enumerator IDs:', enumeratorIds);

  //   const surveyResponses = await this.surveyResponseModel
  //     .find({ enumeratorId: { $in: enumeratorIds } })
  //     .exec();

  //   // Log the found survey responses
  //   console.log('Survey Responses:', surveyResponses);

  //   return surveyResponses;
  // }

  async getSurveyResponsesByFieldCoordinator(
    fieldCoordinatorId: string,
  ): Promise<SurveyResponse[]> {
    // Fetch enumerators created by the field coordinator
    const enumerators = await this.userModel
      .find({ fieldCoordinatorId, role: 'enumerator' })
      .select('_id')
      .exec();

    // Log the enumerators fetched
    console.log('Enumerators:', enumerators);

    if (enumerators.length === 0) {
      // No enumerators found for this field coordinator
      return [];
    }

    const enumeratorIds = enumerators.map((enumerator) => enumerator._id);

    // Fetch survey responses submitted by these enumerators and populate necessary fields
    const surveyResponses = await this.surveyResponseModel
      .find({ enumeratorId: { $in: enumeratorIds } })
      .populate({
        path: 'surveyId',
        select: 'title subtitle',
      })
      .populate({
        path: 'enumeratorId',
        select: { firstName: 1, lastName: 1, fieldCoordinatorId: 1 },
        populate: {
          path: 'fieldCoordinatorId',
          select: { firstName: 1, lastName: 1, selectedState: 1 },
        },
      })
      .exec();

    // Log the survey responses fetched
    console.log('Survey Responses:', surveyResponses);

    return surveyResponses;
  }

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
