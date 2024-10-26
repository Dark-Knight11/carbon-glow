import { Controller, Get, Post } from '@nestjs/common';
import { MfService } from './mf.service';
import { ApiResponse } from '../utils/api-response';
import { ApiTags } from '@nestjs/swagger';

@Controller('mf')
@ApiTags('Mutual Funds')
export class MfController {
  constructor(private readonly mfService: MfService) {}

  @Get('api/mf')
  async getMfData(userId: string) {
    const data = this.mfService.getMfData(userId);
    return new ApiResponse(200, data);
  }

  @Post('api/fetch-mf')
  async fetchMfData(userId: string) {
    return this.mfService.fetchMfData(userId);
  }
}
