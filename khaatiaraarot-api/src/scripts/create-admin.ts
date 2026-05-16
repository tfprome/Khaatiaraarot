import 'dotenv/config';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { users } from '../db/schema';

const EMAIL = 'admin@khaatiaraarot.com';
const PASSWORD = 'Admin@123456';

async function main() {
  const existing = await db.query.users.findFirst({ where: eq(users.email, EMAIL) });

  if (existing) {
    if (existing.role === 'admin') {
      console.log('Admin user already exists.');
    } else {
      await db.update(users).set({ role: 'admin' }).where(eq(users.email, EMAIL));
      console.log('User promoted to admin.');
    }
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(PASSWORD, 12);
  await db.insert(users).values({ email: EMAIL, passwordHash, fullName: 'Admin', role: 'admin' });

  console.log('Admin user created.');
  console.log('  Email:', EMAIL);
  console.log('  Password:', PASSWORD);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
