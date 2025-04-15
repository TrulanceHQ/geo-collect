// survey-aggregation.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SurveyResponse,
  SurveyResponseDocument,
} from '../../../enumerator/survey-response.schema';
import { Model } from 'mongoose';

@Injectable()
export class SurveyAggregationService {
  constructor(
    @InjectModel(SurveyResponse.name)
    private readonly surveyResponseModel: Model<SurveyResponseDocument>,
  ) {}

  /**
   * Aggregate by question text for categorical data.
   * Assumes responses.answer is an array.
   */
  async aggregateByQuestion(questionText: string): Promise<any> {
    // Use a regex for case-insensitive exact matching.
    const regex = new RegExp(`^${questionText.trim()}$`, 'i');

    return this.surveyResponseModel.aggregate([
      // Unwind responses array.
      { $unwind: '$responses' },
      // Match the question text.
      { $match: { 'responses.question': regex } },
      // Unwind the answer array so each answer becomes a separate document.
      { $unwind: '$responses.answer' },
      // Group by answer value and count the number of occurrences.
      {
        $group: {
          _id: '$responses.answer',
          count: { $sum: 1 },
        },
      },
      // Sort the results by count (descending).
      { $sort: { count: -1 } },
    ]);
  }

  /**
   * Aggregate for Likert scale or numeric responses.
   * Converts the answer to number and groups by numeric value.
   */
  async aggregateLikert(questionText: string): Promise<any> {
    const regex = new RegExp(`^${questionText.trim()}$`, 'i');

    return this.surveyResponseModel.aggregate([
      { $unwind: '$responses' },
      { $match: { 'responses.question': regex } },
      { $unwind: '$responses.answer' },
      // Convert answer value to a number.
      {
        $addFields: {
          answerNum: { $toDouble: '$responses.answer' },
        },
      },
      {
        $group: {
          _id: '$answerNum',
          count: { $sum: 1 },
        },
      },
      // Sort numerically.
      { $sort: { _id: 1 } },
    ]);
  }
}
