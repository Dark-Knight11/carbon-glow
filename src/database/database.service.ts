import { Inject, Injectable } from '@nestjs/common';
import { DB } from '@database/database.module-definition';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as SCHEMA from '@drizzle/schema';

@Injectable()
export class DatabaseService {
  public db: NodePgDatabase<typeof SCHEMA>;
  constructor(@Inject(DB) private readonly pool: Pool) {
    this.db = drizzle({
      client: this.pool,
      schema: SCHEMA,
      logger: true,
    });
  }
}
