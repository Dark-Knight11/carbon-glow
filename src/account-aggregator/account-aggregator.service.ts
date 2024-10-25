import { DatabaseService } from '@database/database.service';
import { Injectable } from '@nestjs/common';
import { aaData } from './utils';
import { transactions } from '@drizzle/schema';
import { ApiResponse } from 'src/utils/api-response';
import { eq } from 'drizzle-orm';

@Injectable()
export class AccountAggregatorService {
  constructor(private readonly dbService: DatabaseService) {}

  async fetchAAData(userId: string) {
    // we'll implement account aggregator logic here
    const data = aaData;

    // save data to database
    const transactionsData = data.data['deposit.transactions'];

    const keys = transactionsData[0];
    const valuesArray = transactionsData.slice(1);

    const depositTransactionObjects = valuesArray.map((values) => {
      return keys.reduce((obj, key, index) => {
        obj[key] = values[index];
        return obj;
      }, {});
    });

    const dbData = depositTransactionObjects.map((transaction) => ({
      user_id: userId,
      amount: transaction['amount'] || 0,
      type: transaction['type'] || '',
      narration: transaction['narration'] || '',
      mode: transaction['mode'] || '',
      reference: transaction['reference'] || '',
      transaction_date: transaction['transaction_date'] || new Date(),
    }));

    await this.dbService.db.insert(transactions).values(dbData);

    return new ApiResponse(200, {}, 'Data fetched successfully');
  }

  async getData(userId: string) {
    return await this.dbService.db.query.transactions.findMany({
      where: eq(transactions.user_id, userId),
    });
  }
}
