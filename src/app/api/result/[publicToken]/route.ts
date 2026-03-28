import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

type Params = {
  params: Promise<{ publicToken: string }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    const { publicToken } = await params;
    const supabase = getSupabaseAdmin();

    const { data: attempt, error } = await supabase
      .from("iq_attempts")
      .select("status, locale, analysis, report_pdf_url")
      .eq("public_token", publicToken)
      .single();

    if (error || !attempt) {
      return NextResponse.json({ ok: false, error: "Attempt not found" }, { status: 404 });
    }

    const locked = attempt.status !== "paid";

    return NextResponse.json({
      ok: true,
      locked,
      locale: attempt.locale,
      analysis: locked ? null : attempt.analysis,
      downloadUrl: locked ? null : attempt.report_pdf_url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.startsWith("Missing environment variable:") ? 503 : 400;
    return NextResponse.json(
      { ok: false, error: message },
      { status },
    );
  }
}
