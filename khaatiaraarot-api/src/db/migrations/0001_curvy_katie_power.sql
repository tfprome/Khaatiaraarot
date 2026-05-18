CREATE TABLE "rate_plan_districts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"district" text NOT NULL,
	"cost_per_unit" numeric(10, 2) NOT NULL,
	CONSTRAINT "uq_rate_plan_district" UNIQUE("plan_id","district")
);
--> statement-breakpoint
CREATE TABLE "rate_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_number_counter" (
	"year" integer NOT NULL,
	"last_seq" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "order_number_counter_year_pk" PRIMARY KEY("year")
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "rate_plan_id" uuid;--> statement-breakpoint
ALTER TABLE "rate_plan_districts" ADD CONSTRAINT "rate_plan_districts_plan_id_rate_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."rate_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_rate_plan_districts_plan" ON "rate_plan_districts" USING btree ("plan_id");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_rate_plan_id_rate_plans_id_fk" FOREIGN KEY ("rate_plan_id") REFERENCES "public"."rate_plans"("id") ON DELETE set null ON UPDATE no action;