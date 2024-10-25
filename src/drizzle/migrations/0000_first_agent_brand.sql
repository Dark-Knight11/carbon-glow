CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"mobile_number" text NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
