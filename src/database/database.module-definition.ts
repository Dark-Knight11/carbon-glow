import { DatabaseConfig } from '@database/database-options.interface';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const DB = 'db';

export const {
  ConfigurableModuleClass: ConfigurableDatabaseModule,
  MODULE_OPTIONS_TOKEN: DATABASE_OPTIONS,
} = new ConfigurableModuleBuilder<DatabaseConfig>()
  .setClassMethodName('forRoot')
  .build();