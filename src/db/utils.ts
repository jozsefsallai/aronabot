import { SQL, sql } from 'drizzle-orm';
import { Db } from '.';
import { PgTable } from 'drizzle-orm/pg-core';

export async function exists(db: Db, table: PgTable, where: SQL) {
  const result = await db.execute<{ exists: boolean }>(
    sql`select exists(${db
      .select({ n: sql`1` })
      .from(table)
      .where(where)}) as exists`,
  );
  return result[0].exists;
}
