// src/demo-requests/demo-requests.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { DemoRequestsService } from './demo-request.service';
import { DemoRequestsController } from './demo-request.controller';
import { DemoRequest, DemoRequestSchema } from './demo-request.schema';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/utils/email/email.module';

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

    AuthModule,
    EmailModule,

    MongooseModule.forFeature([
      { name: DemoRequest.name, schema: DemoRequestSchema },
    ]),
  ],
  controllers: [DemoRequestsController],
  providers: [DemoRequestsService],
})
export class DemoRequestsModule {}
