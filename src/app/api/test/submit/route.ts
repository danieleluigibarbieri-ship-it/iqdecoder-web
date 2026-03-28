import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { QUESTIONS, QUESTION_SET_VERSION, evaluateAnswers, type QuestionCategory } from "@/lib/test";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Lang } from "@/i18n/translations";

const submitSchema = z.object({
  locale: z.enum(["en", "it", "fr", "de", "es"]).default("en"),
  gender: z.enum(["male", "female"]).optional().nullable(),
  durationSec: z.number().int().min(1).max(60 * 60),
  answers: z.array(z.number().int().min(-1).max(3)).length(QUESTIONS.length),
});

type Breakdown = Record<QuestionCategory, { correct: number; total: number }>;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return "Unknown error";
}

function extractMissingColumn(message: string): string | null {
  const match = message.match(/Could not find the '([^']+)' column/);
  return match?.[1] ?? null;
}

export async function POST(req: Request) {
  try {
    const parsed = submitSchema.parse(await req.json());
    const supabase = getSupabaseAdmin();

    const evaluation = evaluateAnswers(parsed.answers);
    const breakdown = evaluation.categories.reduce((acc, item) => {
      acc[item.category] = { correct: item.correct, total: item.total };
      return acc;
    }, {} as Breakdown);

    const publicToken = uuidv4();

    const insertPayload: Record<string, unknown> = {
      public_token: publicToken,
      locale: parsed.locale as Lang,
      status: "completed",
      gender: parsed.gender ?? null,
      question_set_version: QUESTION_SET_VERSION,
      submitted_at: new Date().toISOString(),
      duration_sec: parsed.durationSec,
      answers: parsed.answers,
      score_total: evaluation.totalCorrect,
      score_breakdown: breakdown,
      analysis: evaluation,
    };

    let data: { id: string; public_token: string } | null = null;
    let insertError: unknown = null;

    for (let i = 0; i < 10; i += 1) {
      const attempt = await supabase.from("iq_attempts").insert(insertPayload).select("id, public_token").single();
      if (!attempt.error) {
        data = attempt.data;
        insertError = null;
        break;
      }

      const missing = extractMissingColumn(getErrorMessage(attempt.error));
      if (!missing || !(missing in insertPayload)) {
        insertError = attempt.error;
        break;
      }

      delete insertPayload[missing];
      insertError = attempt.error;
    }

    if (!data || insertError) throw insertError;

    return NextResponse.json({ ok: true, attemptId: data.id, publicToken: data.public_token });
  } catch (error) {
    const message = getErrorMessage(error);
    const status = message.startsWith("Missing environment variable:") ? 503 : 400;
    return NextResponse.json(
      { ok: false, error: message },
      { status },
    );
  }
}
