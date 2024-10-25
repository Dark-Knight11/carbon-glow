import { Test, TestingModule } from '@nestjs/testing';
import { AccountAggregatorController } from './account-aggregator.controller';
import { AccountAggregatorService } from './account-aggregator.service';

describe('AccountAggregatorController', () => {
  let controller: AccountAggregatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountAggregatorController],
      providers: [AccountAggregatorService],
    }).compile();

    controller = module.get<AccountAggregatorController>(AccountAggregatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
