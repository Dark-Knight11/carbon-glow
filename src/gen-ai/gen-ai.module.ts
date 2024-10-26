import { Module } from '@nestjs/common';
import { GenAiService } from './gen-ai.service';
import { GenAiController } from './gen-ai.controller';

@Module({
  controllers: [GenAiController],
  providers: [GenAiService],
})
export class GenAiModule {}
