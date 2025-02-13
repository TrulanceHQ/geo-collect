import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export enum QuestionType {
  SINGLE_CHOICE = 'single-choice',
  MULTIPLE_CHOICE = 'multiple-choice',
  // CHECKBOX = 'checkbox', // New type added
  TEXT = 'text',
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
}

// @Schema()
// export class Question {
//   @Prop({ default: uuidv4 }) // Auto-generate unique question ID
//   questionId: string;

//   @Prop({ required: true })
//   question: string;

//   @Prop({ required: true, enum: QuestionType })
//   type: QuestionType;

//   @Prop({ type: [String], required: false }) // Only required for choice-based questions
//   options?: string[];
// }

// @Schema()
// export class DataEntryQuestion {
//   @Prop({ required: true })
//   title: string; // A title for the question set

//   @Prop({ required: true })
//   subtitle: string; // A subtitle for the question set

//   @Prop({ type: [Question] }) // Array of questions
//   questions: Question[];

// }

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

  // @Prop({
  //   type: [String],
  //   required: function (this: Question) {
  //     return (
  //       this.type === QuestionType.MULTIPLE_CHOICE ||
  //       this.type === QuestionType.CHECKBOX ||
  //       this.type === QuestionType.SINGLE_CHOICE ||
  //       this.type === QuestionType.TEXT
  //     );
  //   },
  // })
  // options?: string[];

  @Prop({ enum: MediaType, required: false }) // Optional media type (image, video, audio)
  mediaType?: MediaType;

  @Prop({ type: String, required: false }) // Optional intrusion/description for media
  mediaInstruction?: string;
}

@Schema()
export class DataEntryQuestion {
  @Prop({ required: true })
  title: string; // A title for the question set

  @Prop({ required: true })
  subtitle: string; // A subtitle for the question set

  @Prop({ type: [Question] }) // Array of questions
  questions: Question[];
}

export type DataEntryDocument = DataEntryQuestion & Document;
export const DataEntryQuestionSchema =
  SchemaFactory.createForClass(DataEntryQuestion);
