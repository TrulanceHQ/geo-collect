import { Module } from '@nestjs/common';
import { DataEntryQuestionsService } from './data-questions.service';
import { DataEntryQuestionsController } from './data-questions.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DataEntryQuestion,
  DataEntryQuestionSchema,
} from './data-questions.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default_secret'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    AuthModule, // For authentication integration
    MongooseModule.forFeature([
      { name: DataEntryQuestion.name, schema: DataEntryQuestionSchema },
    ]),
  ],
  controllers: [DataEntryQuestionsController],
  providers: [DataEntryQuestionsService],
})
export class DataEntryQuestionModule {}
