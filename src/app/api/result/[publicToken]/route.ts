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

async function resolveDownloadUrl(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  reportPdfUrl: unknown,
  pdfPath: unknown,
): Promise<string | null> {
  if (typeof reportPdfUrl === "string" && reportPdfUrl.length > 0) return reportPdfUrl;
  if (typeof pdfPath !== "string" || pdfPath.length === 0) return null;

  const candidates: Array<{ bucket: string; path: string }> = [];

  if (pdfPath.includes("/")) {
    candidates.push({ bucket: "iq-results", path: pdfPath });
    candidates.push({ bucket: "iqdecoder-reports", path: pdfPath });
  }

  candidates.push({ bucket: "iq-results", path: pdfPath });
  candidates.push({ bucket: "iqdecoder-reports", path: pdfPath });

  for (const candidate of candidates) {
    const signed = await supabase.storage.from(candidate.bucket).createSignedUrl(candidate.path, 60 * 60);
    if (!signed.error && signed.data?.signedUrl) return signed.data.signedUrl;
  }

  return null;
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
    const downloadUrl = await resolveDownloadUrl(supabase, attempt.report_pdf_url, attempt.pdf_path);

    return NextResponse.json({
      ok: true,
      locked,
      locale,
      analysis: locked ? null : analysis,
      downloadUrl: locked ? null : downloadUrl,
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
