/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { developmentConfig, productionConfig } from './config';
//modules
import { AuthModule } from './auth/auth.module';
import { NgStatesModule } from './users/admin/ng-states/ng-states.module';
import { DataEntryQuestionModule } from './users/admin/all-data/data-questions/data-questions.module';
import * as dotenv from 'dotenv';
dotenv.config();
console.log(process.env.DEVELOPMENT_MONGODB_CONNECTION_URL);
import { EmailUtil } from './utils/email/email.util';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, './../../.env'),
      load:
        process.env.NODE_ENV === 'development'
          ? [developmentConfig]
          : [productionConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>(
          process.env.NODE_ENV === 'production'
            ? 'production.mongodbConnectionUrl'
            : 'development.mongodbConnectionUrl',
        );
        if (!uri) {
          throw new Error('MongoDB connection URI is undefined');
        }
        return { uri };
      },
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: true, // true for 465, false for other ports
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: 'Data Collection: No Reply" <trulancehq@gmail.com>', // Replace with your default from address
        },
        template: {
          dir: join(__dirname, './../src/templates'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    NgStatesModule,
    DataEntryQuestionModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailUtil],
})
export class AppModule {}
