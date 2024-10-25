import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AccountAggregatorService } from './account-aggregator.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '../utils/api-response';

@ApiTags('Account Aggregator')
@Controller()
export class AccountAggregatorController {
  constructor(
    private readonly accountAggregatorService: AccountAggregatorService,
  ) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('api/account-aggregator/fetchTransactions')
  async fetchTransactions(@Request() req: any) {
    return this.accountAggregatorService.fetchAAData(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('api/account-aggregator/getTransactions')
  async getTransactions(@Request() req: any) {
    const data = await this.accountAggregatorService.getData(req.user.sub);
    return new ApiResponse(200, data);
  }
}
