import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';

export type DataEntryQuestionDocument = DataEntryQuestion & Document;

@Schema({ timestamps: true })
export class DataEntryQuestion {
  @Prop({ type: String, required: true })
  question: string;

  @Prop({
    type: String,
    enum: ['single-choice', 'multiple-choice', 'text'],
    required: true,
  })
  questionType: string;

  @Prop({ type: [String], required: false })
  options: string[]; // For multiple-choice and single-choice questions

  @Prop({ type: Boolean, default: false })
  required: boolean; // Whether the question is mandatory

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId; // Admin who created the question

  @Prop({ type: Boolean, default: true })
  isActive: boolean; // Flag to indicate if the question is active or deleted
}

export const DataEntryQuestionSchema =
  SchemaFactory.createForClass(DataEntryQuestion);
