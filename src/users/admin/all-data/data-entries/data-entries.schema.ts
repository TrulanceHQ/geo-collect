import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// @Schema({ timestamps: true })
// export class DataEntryResponse extends Document {
//   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
//   enumerator: Types.ObjectId;

//   @Prop({ type: Types.ObjectId, ref: 'DataEntryQuestion', required: true })
//   question: Types.ObjectId;

//   @Prop({ required: true })
//   response: string | string[]; // Text or array (for multiple-choice)
// }

// export const DataEntryResponseSchema =
//   SchemaFactory.createForClass(DataEntryResponse);

@Schema()
export class SurveyResponse {
  @Prop({ required: true })
  enumeratorId: string;

  @Prop({ required: true })
  surveyId: string;

  @Prop({ type: [{ questionId: String, answer: [String] }] })
  responses: { questionId: string; answer: string | string[] }[];
}

export type ResponseDocument = SurveyResponse & Document;
export const SurveyResponseSchema =
  SchemaFactory.createForClass(SurveyResponse);
