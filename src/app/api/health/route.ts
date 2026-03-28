import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const stripe = getStripe();
    const supabase = getSupabaseAdmin();

    await stripe.balance.retrieve();
    const { error } = await supabase.from("iq_attempts").select("id").limit(1);
    if (error) throw error;

    return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 503 },
    );
  }
}
