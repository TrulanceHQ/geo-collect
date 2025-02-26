import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnumeratorController } from './enumerator.controller';
import { DataEntryQuestionsService } from './../admin/all-data/data-questions/data-questions.service';
import {
  DataEntryQuestion,
  DataEntryQuestionSchema,
} from './../admin/all-data/data-questions/data-questions.schema';
import { EnumeratorFlowService } from './enumerator.service';
import { SurveyResponse, SurveyResponseSchema } from './survey-response.schema';
import { JwtModule } from '@nestjs/jwt';
// import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/utils/JwtAuthGuard';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/auth/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DataEntryQuestion.name, schema: DataEntryQuestionSchema },
      { name: SurveyResponse.name, schema: SurveyResponseSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Ensure this matches the secret used to sign the JWT
      signOptions: { expiresIn: '60m' },
    }),
    AuthModule,
  ],
  controllers: [EnumeratorController],
  providers: [DataEntryQuestionsService, EnumeratorFlowService, JwtAuthGuard],
})
export class EnumeratorModule {}
