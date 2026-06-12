import OpenAI from "openai";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { foodScans } from "@/db/schema";
import { getSession } from "@/lib/auth";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const PROMPT = `Analisis foto makanan ini untuk aplikasi pencatat nutrisi.

Identifikasi makanan/minuman utama di foto, estimasi berat porsinya (gram), lalu estimasi kandungan nutrisinya untuk porsi tersebut. Gunakan nama makanan dalam bahasa Indonesia.

Balas HANYA dengan JSON valid tanpa teks lain, format:
{
  "foodName": "<nama makanan>",
  "servingSizeG": <berat porsi gram, number>,
  "calories": <kkal, number>,
  "proteinG": <gram protein, number>,
  "fatG": <gram lemak, number>,
  "carbsG": <gram karbohidrat, number>,
  "confidence": <0-1, seberapa yakin>,
  "notes": "<catatan singkat bahasa Indonesia, mis. komposisi yang terlihat>"
}

Jika foto BUKAN makanan/minuman, balas: {"error": "bukan makanan"}`;

function extractJson(text: string): Record<string, unknown> {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Tidak menemukan JSON dalam respons AI");
  return JSON.parse(match[0]);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY belum di-set di server." },
      { status: 500 }
    );
  }

  let body: { imageDataUrl?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  if (!body.imageDataUrl?.startsWith("data:image/")) {
    return NextResponse.json({ error: "Field 'imageDataUrl' wajib diisi." }, { status: 400 });
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT },
            { type: "image_url", image_url: { url: body.imageDataUrl } },
          ],
        },
      ],
    });

    const result = extractJson(completion.choices[0]?.message?.content ?? "");

    if (result.error) {
      return NextResponse.json(
        { error: "Foto tidak terdeteksi sebagai makanan. Coba foto lain." },
        { status: 422 }
      );
    }

    const [scan] = await db
      .insert(foodScans)
      .values({
        userId: session.userId,
        detectedFoodName: String(result.foodName ?? "Makanan tidak dikenal"),
        estimatedServingSizeG: String(Number(result.servingSizeG) || 0),
        estimatedCalories: Math.round(Number(result.calories) || 0),
        estimatedProteinG: String(Number(result.proteinG) || 0),
        estimatedFatG: String(Number(result.fatG) || 0),
        estimatedCarbsG: String(Number(result.carbsG) || 0),
        confidenceData: {
          confidence: Number(result.confidence) || null,
          notes: result.notes ?? null,
          model: MODEL,
        },
      })
      .returning();

    return NextResponse.json(scan, { status: 201 });
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { error: "Gagal menganalisis foto. Coba lagi." },
      { status: 502 }
    );
  }
}
