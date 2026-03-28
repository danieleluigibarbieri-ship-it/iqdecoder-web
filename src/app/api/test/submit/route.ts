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

    const { data, error } = await supabase
      .from("iq_attempts")
      .insert({
        public_token: publicToken,
        locale: parsed.locale as Lang,
        gender: parsed.gender ?? null,
        status: "completed",
        question_set_version: QUESTION_SET_VERSION,
        submitted_at: new Date().toISOString(),
        duration_sec: parsed.durationSec,
        answers: parsed.answers,
        score_total: evaluation.totalCorrect,
        score_breakdown: breakdown,
        analysis: evaluation,
      })
      .select("id, public_token")
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, attemptId: data.id, publicToken: data.public_token });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.startsWith("Missing environment variable:") ? 503 : 400;
    return NextResponse.json(
      { ok: false, error: message },
      { status },
    );
  }
}
