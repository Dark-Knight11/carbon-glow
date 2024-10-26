import {
  primaryKey,
  pgTable,
  serial,
  uuid,
  text,
  timestamp,
  integer,
  doublePrecision,
  unique,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: uuid('id').primaryKey().notNull().default(`gen_random_uuid()`),
  name: text('name').notNull(),
  password: text('password').notNull(),
  email: text('email').notNull(),
  mobile_number: text('mobile_number').notNull(),
  created_at: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  }).defaultNow(),
  updated_at: timestamp('updated_at', {
    withTimezone: true,
    mode: 'string',
  }).defaultNow(),
});

export const transactions = pgTable(
  'transactions',
  {
    id: serial('id').primaryKey().notNull(),
    user_id: uuid('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    amount: doublePrecision('amount').notNull(),
    type: text('type').notNull(),
    category: text('category'),
    item: text('item'),
    quantity: integer('quantity'),
    narration: text('narration').notNull(),
    mode: text('mode').notNull(),
    transaction_date: timestamp('transaction_date', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    reference: text('reference').notNull(),
    carbon_footprint: doublePrecision('carbon_footprint'),
    created_at: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updated_at: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (t) => ({
    unq: unique().on(t.user_id, t.reference),
  }),
);

export const mutual_funds = pgTable(
  'mutual_funds',
  {
    id: serial('id').primaryKey().notNull(),
    isin: text('isin').notNull(),
    user_id: uuid('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    scheme_name: text('scheme_name').notNull(),
    broker_name: text('broker_name').notNull(),
    cost_value: doublePrecision('cost_value').notNull(),
    market_value: doublePrecision('market_value').notNull(),
    nav: doublePrecision('nav').notNull(),
    created_at: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updated_at: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (t) => ({
    unq: unique().on(t.user_id, t.isin),
  }),
);
