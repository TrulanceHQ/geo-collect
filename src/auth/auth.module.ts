import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { UsersController } from './auth.controller';
import { User, UserSchema } from './schema/user.schema';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from 'src/utils/roles/roles.guard';
import { LocalStrategy } from 'src/utils/localguard/local.strategy';
import { EmailModule } from 'src/utils/email/email.module';
import { JwtAuthGuard } from 'src/utils/JwtAuthGuard';
import {
  SurveyResponse,
  SurveyResponseSchema,
} from 'src/users/enumerator/survey-response.schema';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default_secret'),
        signOptions: { expiresIn: '2h' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: SurveyResponse.name, schema: SurveyResponseSchema },
    ]),
    EmailModule,
    CloudinaryModule,
  ],
  controllers: [UsersController],
  providers: [AuthService, LocalStrategy, RolesGuard, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
