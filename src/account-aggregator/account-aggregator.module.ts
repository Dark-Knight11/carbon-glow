import { Module } from '@nestjs/common';
import { AccountAggregatorService } from './account-aggregator.service';
import { AccountAggregatorController } from './account-aggregator.controller';

@Module({
  controllers: [AccountAggregatorController],
  providers: [AccountAggregatorService],
})
export class AccountAggregatorModule {}
