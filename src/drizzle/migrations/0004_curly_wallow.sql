ALTER TABLE "transactions" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_reference_unique" UNIQUE("user_id","reference");