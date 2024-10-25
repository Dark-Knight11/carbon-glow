import { DatabaseConfig } from '@database/database-options.interface';
import {
  ConfigurableDatabaseModule,
  DATABASE_OPTIONS,
  DB,
} from '@database/database.module-definition';
import { DatabaseService } from '@database/database.service';
import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';

@Global()
@Module({
  exports: [DatabaseService],
  providers: [
    DatabaseService,
    {
      provide: DB,
      inject: [DATABASE_OPTIONS],
      useFactory: (databaseOptions: DatabaseConfig) => {
        return new Pool({
          connectionString: databaseOptions.url,
          max: 10,
          min: 5,
          idleTimeoutMillis: 30000,
        });
      },
    },
  ],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}