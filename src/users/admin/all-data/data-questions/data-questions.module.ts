import { Module } from '@nestjs/common';
import { DataEntryQuestionsService } from './data-questions.service';
import { AdminController } from './data-questions.controller';
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
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default_secret'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
    AuthModule, // For authentication integration
    MongooseModule.forFeature([
      { name: DataEntryQuestion.name, schema: DataEntryQuestionSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [DataEntryQuestionsService],
})
export class DataEntryQuestionModule {}
