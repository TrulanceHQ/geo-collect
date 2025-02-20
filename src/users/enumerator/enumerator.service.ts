/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SurveyResponse,
  SurveyResponseDocument,
} from './survey-response.schema';
import { SubmitSurveyResponseDto } from './dto/survey-response.dto';

@Injectable()
export class EnumeratorFlowService {
  constructor(
    @InjectModel(SurveyResponse.name)
    private surveyResponseModel: Model<SurveyResponseDocument>,
  ) {}

  async submitSurveyResponse(
    surveyId: string,
    responses: SubmitSurveyResponseDto['responses'],
    enumeratorId: string,
  ): Promise<SurveyResponse> {
    // const { surveyId, responses } = dto;

    const newResponse = new this.surveyResponseModel({
      surveyId,
      enumeratorId,
      responses,
    });

    return newResponse.save();
  }

  async getSurveyResponses(surveyId: string): Promise<SurveyResponse[]> {
    return this.surveyResponseModel
      .find({ surveyId })
      .populate('enumeratorId', 'name email')
      .exec();
  }
}
