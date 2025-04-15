import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module'; // Adjust the path as needed
import {
  SurveyResponse,
  SurveyResponseSchema,
} from '../../../enumerator/survey-response.schema';
import { SurveyAggregationController } from './survey-aggregation.controller';
import { SurveyAggregationService } from './survey-aggregation.service';

@Module({
  imports: [
    // Register Mongoose model
    MongooseModule.forFeature([
      { name: SurveyResponse.name, schema: SurveyResponseSchema },
    ]),
    // Import ConfigModule (if you’re using it for configuration)
    ConfigModule,
    // Import JwtModule to provide JwtService
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default_secret'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
    // Import your AuthModule if it exports JwtService
    AuthModule,
  ],
  controllers: [SurveyAggregationController],
  providers: [SurveyAggregationService],
})
export class SurveyModule {}
