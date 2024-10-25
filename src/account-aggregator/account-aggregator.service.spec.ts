import { Test, TestingModule } from '@nestjs/testing';
import { AccountAggregatorService } from './account-aggregator.service';

describe('AccountAggregatorService', () => {
  let service: AccountAggregatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountAggregatorService],
    }).compile();

    service = module.get<AccountAggregatorService>(AccountAggregatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
