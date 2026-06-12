import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { username?: string; password?: string; fullName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const username = body.username?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!username || !/^[a-z0-9_]{3,30}$/.test(username)) {
    return NextResponse.json(
      { error: "Username 3-30 karakter, hanya huruf/angka/underscore." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password minimal 6 karakter." },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  if (existing) {
    return NextResponse.json({ error: "Username sudah dipakai." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db
    .insert(users)
    .values({ username, passwordHash, fullName: body.fullName?.trim() || null })
    .returning({ id: users.id, username: users.username });

  await createSession({ userId: user.id, username: user.username });
  return NextResponse.json({ id: user.id, username: user.username }, { status: 201 });
}
