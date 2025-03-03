import { Module } from '@nestjs/common';
import { NgStatesService } from './ng-states.service';
import { NgStatesController } from './ng-states.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NgStates, NgStatesSchema } from './ng-states.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default_secret'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    MongooseModule.forFeature([
      { name: NgStates.name, schema: NgStatesSchema },
    ]),
  ],
  controllers: [NgStatesController],
  providers: [NgStatesService],
})
export class NgStatesModule {}
