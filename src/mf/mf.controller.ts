import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { MfService } from './mf.service';
import { ApiResponse } from '../utils/api-response';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@Controller()
@ApiTags('Mutual Funds')
export class MfController {
  constructor(private readonly mfService: MfService) {}

  @Get('api/mf')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getMfData(@Request() req: any) {
    const data = await this.mfService.getMfData(req.user.sub);
    return new ApiResponse(200, data);
  }

  @Post('api/fetch-mf')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async fetchMfData(@Request() req: any) {
    return this.mfService.fetchMfData(req.user.sub);
  }
}
