import type { Config } from 'drizzle-kit';
export default {
  schema: './src/drizzle/*.ts',
  out: './src/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // TODO: connection limit and pooling config to be added
    url: process.env.DB_URL ?? '',
  },
  introspect: {
    casing: 'preserve',
  },
} satisfies Config;