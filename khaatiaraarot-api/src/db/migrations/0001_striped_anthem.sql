CREATE TABLE "order_number_counter" (
	"year" integer NOT NULL,
	"last_seq" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "order_number_counter_year_pk" PRIMARY KEY("year")
);
