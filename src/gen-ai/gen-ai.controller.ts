import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GenAiService } from './gen-ai.service';
import { ApiResponse } from '../utils/api-response';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { TransportationDTO } from './dto';

@Controller('gen-ai')
@ApiTags('GenAi')
export class GenAiController {
  constructor(private readonly genAiService: GenAiService) {}

  @Get('api/carbon-footprint/transactions')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getCarbonFootprint(@Request() req: any) {
    const data = await this.genAiService.getCarbonFootprintOfTransactions(
      req.user.sub,
    );
    return new ApiResponse(200, data);
  }

  @Post('api/carbon-footprint/transportations')
  async getCarbonFootprintOfTranportations(@Body() body: TransportationDTO) {
    const data = await this.genAiService.getCarbonFootprintOfTransportation(
      body.from,
      body.to,
      body.distance,
    );
    return new ApiResponse(200, data);
  }
}
