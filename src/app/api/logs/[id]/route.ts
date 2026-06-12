import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { foodLogs } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  const { id } = await params;
  const deleted = await db
    .delete(foodLogs)
    .where(and(eq(foodLogs.id, id), eq(foodLogs.userId, session.userId)))
    .returning({ id: foodLogs.id });

  if (deleted.length === 0) {
    return NextResponse.json({ error: "Log tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
