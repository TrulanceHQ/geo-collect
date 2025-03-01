import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SurveyResponse,
  SurveyResponseDocument,
} from './survey-response.schema';
import { SubmitSurveyResponseDto } from './dto/survey-response.dto';
import { User } from 'src/auth/schema/user.schema';

@Injectable()
export class EnumeratorFlowService {
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
      .select('surveyId responses location mediaUrl')
      .populate('surveyId', 'title')
      .exec();
  }

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

  async getResponsesByFieldCoordinator(
    fieldCoordinatorId: string,
  ): Promise<SurveyResponse[]> {
    const enumerators = await this.userModel
      .find({ fieldCoordinatorId, role: 'enumerator' })
      .select('_id')
      .exec();

    if (enumerators.length === 0) {
      console.log(
        `No enumerators found for fieldCoordinatorId: ${fieldCoordinatorId}`,
      );
      return [];
    }

    const enumeratorIds = enumerators.map((enumerator) => enumerator._id);

    const responses = await this.surveyResponseModel
      .find({ enumeratorId: { $in: enumeratorIds } })
      .populate('enumeratorId', 'name email')
      .exec();

    return responses;
  }

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
}
