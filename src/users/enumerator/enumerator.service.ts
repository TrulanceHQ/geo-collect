import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  SurveyResponse,
  SurveyResponseDocument,
} from './survey-response.schema';
import { SubmitSurveyResponseDto } from './dto/survey-response.dto';
import { User } from 'src/auth/schema/user.schema';

@Injectable()
export class EnumeratorFlowService {
  private readonly logger = new Logger(EnumeratorFlowService.name);
  constructor(
    @InjectModel(SurveyResponse.name)
    private surveyResponseModel: Model<SurveyResponseDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async submitSurveyResponse(
    surveyId: string,
    responses: SubmitSurveyResponseDto['responses'],
    enumeratorId: string,
    location: SubmitSurveyResponseDto['location'],
    mediaUrl: SubmitSurveyResponseDto['mediaUrl'],
  ): Promise<SurveyResponse> {
    const newResponse = new this.surveyResponseModel({
      surveyId,
      enumeratorId,
      responses,
      location,
      mediaUrl,
    });

    return newResponse.save();
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
      .populate('surveyId', 'title')
      .exec();
  }

  async getEnumeratorsByFieldCoordinator(
    fieldCoordinatorId: string,
  ): Promise<User[]> {
    const enumerators = await this.userModel
      .find({ fieldCoordinatorId })
      .exec();
    this.logger.log(
      `Enumerators for fieldCoordinatorId ${fieldCoordinatorId}: ${JSON.stringify(enumerators)}`,
    );
    return enumerators;
  }

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

  //   const surveyResponses = await this.surveyResponseModel
  //     .find({ enumeratorId: { $in: enumeratorIds } })
  //     .populate('enumeratorId', 'name email')
  //     .populate('surveyId', 'title')
  //     .exec();

  //   this.logger.log(`Survey responses: ${JSON.stringify(surveyResponses)}`);

  //   return surveyResponses;
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

  //   const surveyResponses = await this.surveyResponseModel
  //     .find({ enumeratorId: { $in: enumeratorIds } })
  //     .populate('enumeratorId', 'name email')
  //     .populate('surveyId', 'title')
  //     .exec();

  //   this.logger.log(
  //     `Survey responses from DB: ${JSON.stringify(surveyResponses)}`,
  //   );

  //   const testQuery = await this.surveyResponseModel
  //     .findOne() // Fetch a single document for testing
  //     .populate('enumeratorId', 'name email')
  //     .populate('surveyId', 'title')
  //     .exec();

  //   this.logger.log(`Test query result: ${JSON.stringify(testQuery)}`);

  //   return surveyResponses;
  // }

  async getSurveyResponsesByFieldCoordinator(
    fieldCoordinatorId: string,
  ): Promise<SurveyResponse[]> {
    const enumerators =
      await this.getEnumeratorsByFieldCoordinator(fieldCoordinatorId);
    const enumeratorIds = enumerators.map((enumerator) => enumerator._id);

    this.logger.log(`Found enumerators: ${JSON.stringify(enumerators)}`);
    this.logger.log(`Enumerator IDs: ${JSON.stringify(enumeratorIds)}`);

    if (enumeratorIds.length === 0) {
      this.logger.warn(
        `No enumerators found for fieldCoordinatorId ${fieldCoordinatorId}`,
      );
      return [];
    }

    this.logger.log(
      `Fetching survey responses for enumeratorIds: ${JSON.stringify(enumeratorIds)}`,
    );

    try {
      const surveyResponses = await this.surveyResponseModel
        .find({ enumeratorId: { $in: enumeratorIds } })
        .populate('enumeratorId', 'name email')
        .populate('surveyId')
        // .populate('surveyId', 'title')
        // .populate('surveyId', 'title')
        .exec();

      this.logger.log(
        `Survey responses from DB: ${JSON.stringify(surveyResponses)}`,
      );

      const results = await this.surveyResponseModel.aggregate([
        {
          $match: { enumeratorId: { $in: enumeratorIds } },
        },
        {
          $lookup: {
            from: 'DataEntryQuestions', // Make sure the collection name matches
            localField: 'surveyId',
            foreignField: '_id',
            as: 'survey',
          },
        },
      ]);

      console.log(results);

      const responses = await this.surveyResponseModel
        .find({
          enumeratorId: { $in: enumeratorIds },
        })
        .exec();

      console.log(responses);

      if (surveyResponses.length === 0) {
        this.logger.warn(
          `No survey responses found for enumeratorIds: ${JSON.stringify(enumeratorIds)}`,
        );
      } else {
        surveyResponses.forEach((responses) => {
          this.logger.log(`Survey Response ID: ${responses._id}`);
          this.logger.log(`Survey ID: ${responses.surveyId}`);
          this.logger.log(`Enumerator ID: ${responses.enumeratorId}`);
        });
      }

      return surveyResponses;
    } catch (error) {
      this.logger.error(
        `Error fetching survey responses: ${error.message}`,
        error.stack,
      );
      throw new Error(
        `Failed to fetch survey responses for enumeratorIds: ${JSON.stringify(enumeratorIds)}`,
      );
    }
  }

  // async getSurveyResponsesByFieldCoordinator(
  //   fieldCoordinatorId: string,
  // ): Promise<SurveyResponse[]> {
  //   const enumerators =
  //     await this.getEnumeratorsByFieldCoordinator(fieldCoordinatorId);
  //   const enumeratorIds = enumerators.map((enumerator) => enumerator._id);

  //   if (enumeratorIds.length === 0) {
  //     this.logger.warn(
  //       `No enumerators found for fieldCoordinatorId ${fieldCoordinatorId}`,
  //     );
  //     return [];
  //   }

  //   this.logger.log(
  //     `Fetching survey responses for enumeratorIds: ${JSON.stringify(enumeratorIds)}`,
  //   );
  //   return this.surveyResponseModel
  //     .find({ enumeratorId: { $in: enumeratorIds } })
  //     .populate('enumeratorId', 'firstName emailAddress')
  //     .populate('enumeratorId', 'location')
  //     .exec();
  // }

  // //fetch enumerators by field coordinator id

  // async getEnumeratorsByFieldCoordinator(
  //   fieldCoordinatorId: string,
  // ): Promise<User[]> {
  //   return this.userModel.find({ fieldCoordinatorId }).exec();
  // }

  // // then fetch survey responses by enumerator IDs:

  // async getSurveyResponsesByFieldCoordinator(
  //   fieldCoordinatorId: string,
  // ): Promise<SurveyResponse[]> {
  //   const enumerators =
  //     await this.getEnumeratorsByFieldCoordinator(fieldCoordinatorId);
  //   const enumeratorIds = enumerators.map((enumerator) => enumerator._id);

  //   return this.surveyResponseModel
  //     .find({ enumeratorId: { $in: enumeratorIds } })
  //     .populate('enumeratorId', 'name email')
  //     .populate('surveyId', 'title')
  //     .exec();
  // }

  //new
  // async getResponsesByFieldCoordinator(
  //   fieldCoordinatorId: string,
  // ): Promise<SurveyResponse[]> {
  //   const enumerators = await this.userModel
  //     .find({ fieldCoordinatorId, role: 'enumerator' })
  //     .select('_id')
  //     .exec();

  //   const enumeratorIds = enumerators.map((enumerator) => enumerator._id);

  //   return this.surveyResponseModel
  //     .find({ enumeratorId: { $in: enumeratorIds } })
  //     .populate('enumeratorId', 'name email')
  //     .exec();
  // }

  // New method to get responses count by field coordinator
  // async getResponseCountByFieldCoordinator(
  //   fieldCoordinatorId: string,
  // ): Promise<number> {
  //   const enumerators = await this.userModel
  //     .find({ fieldCoordinatorId, role: 'enumerator' })
  //     .select('_id')
  //     .exec();

  //   const enumeratorIds = enumerators.map((enumerator) => enumerator._id);

  //   return this.surveyResponseModel
  //     .countDocuments({
  //       enumeratorId: { $in: enumeratorIds },
  //     })
  //     .exec();
  // }

  async getResponseCountByFieldCoordinator(
    fieldCoordinatorId: string,
  ): Promise<{ count: number; message: string }> {
    const enumerators = await this.userModel
      .find({ fieldCoordinatorId, role: 'enumerator' })
      .select('_id')
      .exec();

    const enumeratorIds = enumerators.map((enumerator) => enumerator._id);

    const count = await this.surveyResponseModel
      .countDocuments({
        enumeratorId: { $in: enumeratorIds },
      })
      .exec();

    let message = 'Total responses retrieved successfully';
    if (count === 0) {
      message = 'No responses found for the specified field coordinator';
    }

    return { count, message };
  }

  //fetch all data for admin
  async getAllSurveyResponses(): Promise<SurveyResponse[]> {
    return this.surveyResponseModel.find().populate('surveyId', 'title').exec();
  }
}
