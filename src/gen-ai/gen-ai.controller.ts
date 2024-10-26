import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { GenAiService } from './gen-ai.service';
import { ApiResponse } from '../utils/api-response';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@Controller('gen-ai')
@ApiTags('GenAi')
export class GenAiController {
  constructor(private readonly genAiService: GenAiService) {}

  @Get('api/carbon-footprint')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getCarbonFootprint(@Request() req: any) {
    const data = await this.genAiService.getCarbonFootprint(req.user.sub);
    return new ApiResponse(200, data);
  }
}
