import { Module } from '@nestjs/common';
import { EnumeratorDataEntryController } from './data-entries.controller';
import { DataEntryService } from './data-entries-service';
import { MongooseModule } from '@nestjs/mongoose';
import { DataEntry, DataEntrySchema } from './data-entries.schema';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    AuthModule,
    MongooseModule.forFeature([
      { name: DataEntry.name, schema: DataEntrySchema },
    ]),
  ],
  controllers: [EnumeratorDataEntryController],
  providers: [DataEntryService],
})
export class DataEntryModule {}
