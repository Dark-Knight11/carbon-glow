import { Test, TestingModule } from '@nestjs/testing';
import { MfController } from './mf.controller';
import { MfService } from './mf.service';

describe('MfController', () => {
  let controller: MfController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MfController],
      providers: [MfService],
    }).compile();

    controller = module.get<MfController>(MfController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
