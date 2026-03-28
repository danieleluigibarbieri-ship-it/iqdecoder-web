import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

type Params = {
  params: Promise<{ publicToken: string }>;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return "Unknown error";
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { publicToken } = await params;
    const supabase = getSupabaseAdmin();

    const { data: attempt, error } = await supabase
      .from("iq_attempts")
      .select("*")
      .eq("public_token", publicToken)
      .single();

    if (error || !attempt) {
      return NextResponse.json({ ok: false, error: "Attempt not found" }, { status: 404 });
    }

    const locked = attempt.status !== "paid";
    const locale = typeof attempt.locale === "string" ? attempt.locale : "en";
    const analysis = attempt.analysis ?? null;
    const reportPdfUrl = typeof attempt.report_pdf_url === "string" ? attempt.report_pdf_url : null;

    return NextResponse.json({
      ok: true,
      locked,
      locale,
      analysis: locked ? null : analysis,
      downloadUrl: locked ? null : reportPdfUrl,
    });
  } catch (error) {
    const message = getErrorMessage(error);
    const status = message.startsWith("Missing environment variable:") ? 503 : 400;
    return NextResponse.json(
      { ok: false, error: message },
      { status },
    );
  }
}
