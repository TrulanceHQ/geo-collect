import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  @Prop({ required: true })
  question: string;

  @Prop({ required: true, enum: QuestionType })
  type: QuestionType;

  @Prop({
    type: [String],
    default: undefined, // ⬅ Ensures it's omitted if empty
  })
  options?: string[];

  @Prop({
    type: [{ question: String, options: [String] }],
    default: undefined, // ⬅ Ensures it's omitted if empty
  })
  likertQuestions?: { question: string; options: string[] }[];
}

@Schema({
  toJSON: {
    transform: (_, ret) => {
      if (ret.questions) {
        ret.questions = ret.questions.map((q) => {
          // Remove empty likertQuestions
          if (
            Array.isArray(q.likertQuestions) &&
            q.likertQuestions.length === 0
          ) {
            delete q.likertQuestions;
          }
          // Remove empty options
          if (Array.isArray(q.options) && q.options.length === 0) {
            delete q.options;
          }
          return q;
        });
      }
      return ret;
    },
  },
})
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
