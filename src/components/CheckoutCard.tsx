"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./CheckoutCard.module.css";

const PRICE_LABEL = "EUR 0.50";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function CheckoutCard({ publicToken }: { publicToken: string }) {
  const searchParams = useSearchParams();
  const canceled = useMemo(() => searchParams.get("status") === "cancel", [searchParams]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCheckout() {
    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicToken,
          fullName: name.trim(),
          email: email.trim().toLowerCase(),
        }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        alreadyPaid?: boolean;
        resultUrl?: string;
        url?: string;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setError(data.error || "Checkout error");
        setLoading(false);
        return;
      }

      if (data.alreadyPaid && data.resultUrl) {
        window.location.href = data.resultUrl;
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setError("Missing checkout URL");
      setLoading(false);
    } catch {
      setError("Connection error. Please retry.");
      setLoading(false);
    }
  }

  return (
    <section className={styles.card}>
      <p className={styles.badge}>FINAL STEP</p>
      <h1>Unlock your premium IQ report</h1>
      <p>One-time payment. No subscription. Secure checkout via Stripe.</p>

      <div className={styles.priceRow}>
        <span>Total</span>
        <strong>{PRICE_LABEL}</strong>
      </div>

      <div className={styles.field}>
        <label htmlFor="name">Name on certificate</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
      </div>

      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
      </div>

      <button className={styles.primary} onClick={() => void onCheckout()} disabled={loading}>
        {loading ? "Redirecting..." : "Unlock report"}
      </button>

      {canceled ? <p className={styles.error}>Payment canceled. You can retry now.</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
    </section>
  );
}
