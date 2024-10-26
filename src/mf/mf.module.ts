import { Module } from '@nestjs/common';
import { MfService } from './mf.service';
import { MfController } from './mf.controller';

@Module({
  controllers: [MfController],
  providers: [MfService],
})
export class MfModule {}
