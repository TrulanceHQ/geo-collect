import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class SurveyResponse {
  @Prop({ type: Types.ObjectId, required: true, ref: 'DataEntryQuestion' })
  surveyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' }) // Tracks who submitted
  enumeratorId: Types.ObjectId;

  @Prop({ required: true })
  responses: Array<{
    questionId: Types.ObjectId;
    question: string;
    //new
    subquestion: 'Rate';
    answer: string;
  }>;

  // @Prop({ required: true })
  // responses: Array<{
  //   questionId: Types.ObjectId;
  //   question: string;
  //   answer: string;
  // }>;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  mediaUrl: string;

  @Prop({ required: true }) // Remove default value
  startTime: Date;

  @Prop({ default: Date.now })
  submittedAt: Date;
}

export type SurveyResponseDocument = SurveyResponse & Document;
export const SurveyResponseSchema =
  SchemaFactory.createForClass(SurveyResponse);
