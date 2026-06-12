import { NextResponse } from "next/server";
import { and, desc, eq, gte, lt } from "drizzle-orm";
import { db } from "@/db";
import { foodLogs } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { dayRange } from "@/lib/dayRange";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  const { start, end } = dayRange(new URL(request.url).searchParams.get("date"));

  const logs = await db
    .select()
    .from(foodLogs)
    .where(
      and(
        eq(foodLogs.userId, session.userId),
        gte(foodLogs.consumedAt, start),
        lt(foodLogs.consumedAt, end)
      )
    )
    .orderBy(desc(foodLogs.consumedAt));

  return NextResponse.json(logs);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  let body: {
    foodName?: string;
    portionG?: number;
    calories?: number;
    proteinG?: number;
    fatG?: number;
    carbsG?: number;
    sourceType?: "search" | "scan" | "manual";
    foodId?: string;
    scanId?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  if (!body.foodName?.trim() || !body.portionG || body.portionG <= 0) {
    return NextResponse.json(
      { error: "Field 'foodName' dan 'portionG' wajib diisi." },
      { status: 400 }
    );
  }

  const [log] = await db
    .insert(foodLogs)
    .values({
      userId: session.userId,
      foodId: body.foodId ?? null,
      scanId: body.scanId ?? null,
      sourceType: body.sourceType ?? "manual",
      foodName: body.foodName.trim(),
      portionG: String(body.portionG),
      calories: String(Math.max(0, body.calories ?? 0)),
      proteinG: String(Math.max(0, body.proteinG ?? 0)),
      fatG: String(Math.max(0, body.fatG ?? 0)),
      carbsG: String(Math.max(0, body.carbsG ?? 0)),
    })
    .returning();

  return NextResponse.json(log, { status: 201 });
}
