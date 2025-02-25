import { Module } from '@nestjs/common';
import { EmailUtil } from './email-util.service';

@Module({
  providers: [EmailUtil],
  exports: [EmailUtil],
})
export class EmailModule {}
