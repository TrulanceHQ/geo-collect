import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';

export enum QuestionType {
  SINGLE_CHOICE = 'single-choice',
  MULTIPLE_CHOICE = 'multiple-choice',
  TEXT = 'text',
  LIKERT_SCALE = 'likert-scale',
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
}

@Schema()
export class Question {
  // @Prop({ default: uuidv4 }) // Auto-generate unique question ID
  // questionId: string;

  @Prop({ required: true })
  question: string;

  @Prop({ required: true, enum: QuestionType })
  type: QuestionType;

  @Prop({ type: [String], default: undefined }) // Excludes the field if empty
  options?: string[];

  // Likert scale specific properties
  @Prop({ type: [{ question: String, options: [String] }], required: false })
  likertQuestions?: { question: string; options: string[] }[];

  @Prop({ enum: MediaType, required: false })
  mediaType?: MediaType;

  @Prop({ type: String, required: false })
  mediaInstruction?: string;
}

@Schema()
export class DataEntryQuestion {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subtitle: string;

  @Prop({ type: [Question] })
  questions: Question[];
}

export type DataEntryDocument = DataEntryQuestion & Document;
export const DataEntryQuestionSchema =
  SchemaFactory.createForClass(DataEntryQuestion);
