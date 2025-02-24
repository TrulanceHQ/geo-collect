// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export enum QuestionType {
//   SINGLE_CHOICE = 'single-choice',
//   MULTIPLE_CHOICE = 'multiple-choice',
//   TEXT = 'text',
//   LIKERT_SCALE = 'likert-scale',
//   RECORD_AUDIO = 'record-audio',
//   RECORD_VIDEO = 'record-video',
//   TAKE_PICTURE = 'take-picture',
// }

// @Schema()
// export class Question {
//   @Prop({ required: true })
//   question: string;

//   @Prop({ required: true, enum: QuestionType })
//   type: QuestionType;

//   @Prop({
//     type: [String],
//     default: undefined, // ⬅ Ensures it's omitted if empty
//   })
//   options?: string[];

//   @Prop({
//     type: [{ question: String, options: [String] }],
//     default: undefined, // ⬅ Ensures it's omitted if empty
//   })
//   likertQuestions?: { question: string; options: string[] }[];
// }

// @Schema({
//   toJSON: {
//     transform: (_, ret) => {
//       if (ret.questions) {
//         ret.questions = ret.questions.map((q) => {
//           // Remove empty likertQuestions
//           if (
//             Array.isArray(q.likertQuestions) &&
//             q.likertQuestions.length === 0
//           ) {
//             delete q.likertQuestions;
//           }
//           // Remove empty options
//           if (Array.isArray(q.options) && q.options.length === 0) {
//             delete q.options;
//           }
//           return q;
//         });
//       }
//       return ret;
//     },
//   },
// })
// export class DataEntryQuestion {
//   @Prop({ required: true })
//   title: string;

//   @Prop({ required: true })
//   subtitle: string;

//   @Prop({ type: [Question] })
//   questions: Question[];
// }

// export type DataEntryDocument = DataEntryQuestion & Document;
// export const DataEntryQuestionSchema =
//   SchemaFactory.createForClass(DataEntryQuestion);

// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export enum QuestionType {
//   SINGLE_CHOICE = 'single-choice',
//   MULTIPLE_CHOICE = 'multiple-choice',
//   TEXT = 'text',
//   LIKERT_SCALE = 'likert-scale',
//   RECORD_AUDIO = 'record-audio',
//   RECORD_VIDEO = 'record-video',
//   TAKE_PICTURE = 'take-picture',
// }

// class Option {
//   value: string;
//   nextSection: number | null;
// }

// @Schema()
// export class Question {
//   @Prop({ required: true })
//   question: string;

//   @Prop({ required: true, enum: QuestionType })
//   type: QuestionType;

//   @Prop({ type: [{ value: String, nextSection: { type: Number, default: null } }], default: undefined })
//   options?: Option[];

//   @Prop({ type: [{ question: String, options: [String] }], default: undefined })
//   likertQuestions?: { question: string; options: string[] }[];
// }

// @Schema({ toJSON: { transform: (_, ret) => {
//   if (ret.questions) {
//     ret.questions = ret.questions.map((q) => {
//       if (Array.isArray(q.likertQuestions) && q.likertQuestions.length === 0) {
//         delete q.likertQuestions;
//       }
//       if (Array.isArray(q.options) && q.options.length === 0) {
//         delete q.options;
//       }
//       return q;
//     });
//   }
//   return ret;
// }, } })
// export class DataEntryQuestion {
//   @Prop({ required: true })
//   title: string;

//   @Prop({ required: true })
//   subtitle: string;

//   @Prop({ type: [Question] })
//   questions: Question[];
// }

// export type DataEntryDocument = DataEntryQuestion & Document;
// export const DataEntryQuestionSchema = SchemaFactory.createForClass(DataEntryQuestion);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum QuestionType {
  SINGLE_CHOICE = 'single-choice',
  MULTIPLE_CHOICE = 'multiple-choice',
  TEXT = 'text',
  LIKERT_SCALE = 'likert-scale',
  RECORD_AUDIO = 'record-audio',
  RECORD_VIDEO = 'record-video',
  TAKE_PICTURE = 'take-picture',
}

class Option {
  value: string;
  nextSection: number | null;
}

@Schema()
export class Question {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true, enum: QuestionType })
  type: QuestionType;

  @Prop({
    type: [{ value: String, nextSection: { type: Number, default: null } }],
    default: undefined,
  })
  options?: Option[];

  @Prop({ type: [{ question: String, options: [String] }], default: undefined })
  likertQuestions?: { question: string; options: string[] }[];
}

@Schema()
export class Section {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: [Question] })
  questions: Question[];
}

@Schema({
  toJSON: {
    transform: (_, ret) => {
      if (ret.sections) {
        ret.sections = ret.sections.map((section) => {
          section.questions = section.questions.map((q) => {
            if (
              Array.isArray(q.likertQuestions) &&
              q.likertQuestions.length === 0
            ) {
              delete q.likertQuestions;
            }
            if (Array.isArray(q.options) && q.options.length === 0) {
              delete q.options;
            }
            return q;
          });
          return section;
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

  @Prop({ type: [Section] })
  sections: Section[];
}

export type DataEntryDocument = DataEntryQuestion & Document;
export const DataEntryQuestionSchema =
  SchemaFactory.createForClass(DataEntryQuestion);
