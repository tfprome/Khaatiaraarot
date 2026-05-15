import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';
import { config } from './index';

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 20,
});

export const db = drizzle(pool, { schema });
