import { Module } from '@nestjs/common';
import { EmailUtil } from './email.util';

@Module({
  providers: [EmailUtil],
  exports: [EmailUtil],
})
export class EmailModule {}
