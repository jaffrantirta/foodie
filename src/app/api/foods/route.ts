import { NextResponse } from "next/server";
import { ilike, sql } from "drizzle-orm";
import { db } from "@/db";
import { foods } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  const results = q
    ? await db
        .select()
        .from(foods)
        .where(
          sql`${ilike(foods.name, `%${q}%`)} OR ${foods.aliases}::text ILIKE ${`%${q}%`}`
        )
        .orderBy(foods.name)
        .limit(20)
    : await db.select().from(foods).orderBy(foods.name).limit(20);

  return NextResponse.json(results);
}
