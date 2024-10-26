import { Test, TestingModule } from '@nestjs/testing';
import { GenAiController } from './gen-ai.controller';
import { GenAiService } from './gen-ai.service';

describe('GenAiController', () => {
  let controller: GenAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenAiController],
      providers: [GenAiService],
    }).compile();

    controller = module.get<GenAiController>(GenAiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
