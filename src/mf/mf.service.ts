import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { mfData } from './constant';
import { mutual_funds } from '../drizzle/schema';
import { ApiResponse } from '../utils/api-response';
import { eq } from 'drizzle-orm';

@Injectable()
export class MfService {
  constructor(private readonly dbService: DatabaseService) {}

  async fetchMfData(userId: string) {
    // MF central API call will be made here
    const data = mfData;

    // Save the data in the database

    const summaryData = data.data[0].dtSummary;

    const mutualFunds = summaryData.map((summaryData) => ({
      user_id: userId,
      isin: summaryData.isin,
      scheme_name: summaryData.schemeName,
      broker_name: summaryData.brokerName,
      cost_value: Number(summaryData.costValue),
      market_value: Number(summaryData.marketValue),
      nav: Number(summaryData.nav),
    }));

    await this.dbService.db.insert(mutual_funds).values(mutualFunds);

    return new ApiResponse(201, {}, 'Mutual funds data saved successfully');
  }

  async getMfData(userId: string) {
    const mfData = await this.dbService.db
      .select()
      .from(mutual_funds)
      .where(eq(mutual_funds.user_id, userId));

    return new ApiResponse(200, mfData);
  }
}
