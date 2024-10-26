import { Test, TestingModule } from '@nestjs/testing';
import { MfService } from './mf.service';

describe('MfService', () => {
  let service: MfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MfService],
    }).compile();

    service = module.get<MfService>(MfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
