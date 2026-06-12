import { NextResponse } from "next/server";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { bodyGoals, foodLogs } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { dayRange } from "@/lib/dayRange";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  const { start, end, dateStr } = dayRange(
    new URL(request.url).searchParams.get("date")
  );

  const [totals] = await db
    .select({
      calories: sql<number>`coalesce(sum(${foodLogs.calories}), 0)::float`,
      proteinG: sql<number>`coalesce(sum(${foodLogs.proteinG}), 0)::float`,
      fatG: sql<number>`coalesce(sum(${foodLogs.fatG}), 0)::float`,
      carbsG: sql<number>`coalesce(sum(${foodLogs.carbsG}), 0)::float`,
      entries: sql<number>`count(*)::int`,
    })
    .from(foodLogs)
    .where(
      and(
        eq(foodLogs.userId, session.userId),
        gte(foodLogs.consumedAt, start),
        lt(foodLogs.consumedAt, end)
      )
    );

  const [goal] = await db
    .select()
    .from(bodyGoals)
    .where(and(eq(bodyGoals.userId, session.userId), eq(bodyGoals.isActive, true)))
    .limit(1);

  return NextResponse.json({
    date: dateStr,
    totals,
    goal: goal ?? null,
    remaining: goal
      ? {
          calories: Math.round(goal.targetCalories - totals.calories),
          proteinG: Math.round(goal.targetProteinG - totals.proteinG),
          fatG: Math.round(goal.targetFatG - totals.fatG),
          carbsG: Math.round(goal.targetCarbsG - totals.carbsG),
        }
      : null,
  });
}
