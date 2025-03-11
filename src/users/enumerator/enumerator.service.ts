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

    const enrichedResponses = responses.map((entry) => {
      let question = '';
      let subquestion = ''; // New field for likert subquestion
      let processedAnswer = entry.answer;

      // Check if the questionId is a composite (e.g., "baseId-index")
      let baseId: string = entry.questionId;
      let likertIndex: number | null = null;
      if (entry.questionId.includes('-')) {
        const parts = entry.questionId.split('-');
        baseId = parts[0];
        likertIndex = Number(parts[1]);
        if (isNaN(likertIndex)) {
          // this.logger.warn(
          //   `Invalid likert index in response questionId: ${entry.questionId}`,
          // );
          likertIndex = null;
        }
      }

      // Loop through each section and their questions to find the corresponding question.
      for (const section of surveyDefinition.sections) {
        const matchedQuestion = section.questions.find(
          (q: any) => String(q._id) === String(baseId),
        );

        if (matchedQuestion) {
          // Handle likert-scale questions if a composite id was passed
          if (
            matchedQuestion.type === 'likert-scale' &&
            likertIndex !== null &&
            matchedQuestion.likertQuestions &&
            matchedQuestion.likertQuestions.length > likertIndex
          ) {
            // Save the base question and the subquestion separately.
            question = matchedQuestion.question;
            subquestion = matchedQuestion.likertQuestions[likertIndex].question;
            processedAnswer = entry.answer;
            // this.logger.debug(
            //   `Likert question matched: baseId ${baseId}, index ${likertIndex}, base question: ${question}, subquestion: ${subquestion}`,
            // );
          } else {
            // For non-likert or if no valid index is provided, use the base question text only
            question = matchedQuestion.question;
            // this.logger.debug(
            //   `Standard question matched: baseId ${baseId}, enriched question: ${question}`,
            // );
          }
          break;
        }
      }

      // if (!question) {
      //   this.logger.warn(
      //     `No matching question found for: ${entry.questionId} (baseId: ${baseId})`,
      //   );
      // }

      return {
        questionId: entry.questionId,
        question,
        subquestion, // new field will be empty for non-likert responses
        answer: processedAnswer,
      };
    });

    // Convert enumeratorId to ObjectId
    const enumeratorObjectId = new Types.ObjectId(enumeratorId);

    // Create and save the new SurveyResponse document
    const surveyResponse = new this.surveyResponseModel({
      surveyId,
      enumeratorId: enumeratorObjectId,
      responses: enrichedResponses,
      location,
      mediaUrl,
      startTime,
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
    const enumeratorObjectId = new Types.ObjectId(enumeratorId); // Ensure enumeratorId is of type ObjectId
    return this.surveyResponseModel
      .find({ enumeratorId: enumeratorObjectId })
      .select('surveyId responses location mediaUrl startTime submittedAt')
      .populate('surveyId', 'title')
      .exec();
  }

  //fetch all data for admin

  async getAllSurveyResponses(): Promise<SurveyResponse[]> {
    return this.surveyResponseModel
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

      .exec();
  }
  //survey count by admin
  async getSurveyResponseCount(): Promise<number> {
    return await this.surveyResponseModel.countDocuments();
  }

  //for field coord
  async getSurveyResponsesByFieldCoordinator(
    fieldCoordinatorId: string,
  ): Promise<SurveyResponse[]> {
    // Fetch enumerators created by the field coordinator
    const enumerators = await this.userModel
      .find({ fieldCoordinatorId, role: 'enumerator' })
      .select('_id')
      .exec();

    // Log the enumerators fetched
    // console.log('Enumerators:', enumerators);

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
    // console.log('Survey Responses:', surveyResponses);

    return surveyResponses;
  }
}
