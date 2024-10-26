CREATE TABLE IF NOT EXISTS "mutual_funds" (
	"id" serial PRIMARY KEY NOT NULL,
	"isin" text NOT NULL,
	"user_id" uuid NOT NULL,
	"scheme_name" text NOT NULL,
	"broker_name" text NOT NULL,
	"cost_value" double precision NOT NULL,
	"market_value" double precision NOT NULL,
	"nav" double precision NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "mutual_funds_user_id_isin_unique" UNIQUE("user_id","isin")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mutual_funds" ADD CONSTRAINT "mutual_funds_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
