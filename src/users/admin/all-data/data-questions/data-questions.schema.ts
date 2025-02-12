import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export enum QuestionType {
  SINGLE_CHOICE = 'single-choice',
  MULTIPLE_CHOICE = 'multiple-choice',
  TEXT = 'text',
}

@Schema()
export class Question {
  @Prop({ default: uuidv4 }) // Auto-generate unique question ID
  questionId: string;

  @Prop({ required: true })
  question: string;

  @Prop({ required: true, enum: QuestionType })
  type: QuestionType;

  @Prop({ type: [String], required: false }) // Only required for choice-based questions
  options?: string[];
}

@Schema()
export class DataEntryQuestion {
  @Prop({ required: true })
  title: string; // A title for the question set

  @Prop({ type: [Question] }) // Array of questions
  questions: Question[];
}

export type DataEntryDocument = DataEntryQuestion & Document;
export const DataEntryQuestionSchema =
  SchemaFactory.createForClass(DataEntryQuestion);
