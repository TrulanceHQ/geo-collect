import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnumeratorController } from './enumerator.controller';
import { DataEntryQuestionsService } from './../admin/all-data/data-questions/data-questions.service';
import {
  DataEntryQuestion,
  DataEntryQuestionSchema,
} from './../admin/all-data/data-questions/data-questions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DataEntryQuestion.name, schema: DataEntryQuestionSchema },
    ]),
  ],
  controllers: [EnumeratorController],
  providers: [DataEntryQuestionsService],
})
export class EnumeratorModule {}
