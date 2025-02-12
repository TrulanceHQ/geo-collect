import { Module } from '@nestjs/common';
import { EnumeratorController } from './data-entries.controller';
import { SurveyResponseService } from './data-entries-service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveyResponse, SurveyResponseSchema } from './data-entries.schema';

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
      { name: SurveyResponse.name, schema: SurveyResponseSchema },
    ]),
  ],
  controllers: [EnumeratorController],
  providers: [SurveyResponseService],
})
export class DataEntryAnswerModule {}
