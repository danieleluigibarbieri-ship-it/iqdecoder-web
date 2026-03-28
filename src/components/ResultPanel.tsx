"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./ResultPanel.module.css";

type ResultPayload = {
  ok: boolean;
  locked?: boolean;
  analysis?: {
    estimatedIq: number;
    percentile: number;
    summary: Record<string, string>;
    strengths: Record<string, string[]>;
    recommendations: Record<string, string[]>;
  } | null;
  downloadUrl?: string | null;
};

export function ResultPanel({ publicToken, locale }: { publicToken: string; locale: string }) {
  const searchParams = useSearchParams();
  const paidCallback = useMemo(() => searchParams.get("status") === "success", [searchParams]);

  const [data, setData] = useState<ResultPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchResult() {
      try {
        const res = await fetch(`/api/result/${publicToken}`, { cache: "no-store" });
        const json = (await res.json()) as ResultPayload;
        if (!mounted) return json;
        setData(json);
        setLoading(false);
        return json;
      } catch {
        if (!mounted) return { ok: false } as ResultPayload;
        setData({ ok: false });
        setLoading(false);
        return { ok: false } as ResultPayload;
      }
    }

    async function run() {
      const first = await fetchResult();
      if (paidCallback && first.ok && first.locked) {
        setPolling(true);
        for (let i = 0; i < 8; i += 1) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const retry = await fetchResult();
          if (retry.ok && !retry.locked) break;
        }
        if (mounted) setPolling(false);
      }
    }

    void run();
    return () => {
      mounted = false;
    };
  }, [paidCallback, publicToken]);

  if (loading) {
    return (
      <section className={styles.card}>
        <h1>Loading result...</h1>
      </section>
    );
  }

  if (!data?.ok) {
    return (
      <section className={styles.card}>
        <h1>Result not available</h1>
      </section>
    );
  }

  if (data.locked) {
    return (
      <section className={styles.card}>
        <h1>Result locked</h1>
        <p>{polling ? "Payment received, finalizing unlock..." : "Complete payment to unlock your full report."}</p>
        <a href={`/checkout/${publicToken}`} className={styles.primaryLink}>
          Go to checkout
        </a>
      </section>
    );
  }

  const lang = ["en", "it", "fr", "de", "es"].includes(locale) ? locale : "en";

  return (
    <section className={styles.card}>
      <h1>Premium report unlocked</h1>
      <p>{data.analysis?.summary?.[lang] ?? data.analysis?.summary?.en}</p>

      <div className={styles.metrics}>
        <article>
          <span>IQ</span>
          <strong>{data.analysis?.estimatedIq}</strong>
        </article>
        <article>
          <span>Percentile</span>
          <strong>{data.analysis?.percentile}</strong>
        </article>
      </div>

      <h2>Strengths</h2>
      <ul>
        {(data.analysis?.strengths?.[lang] ?? data.analysis?.strengths?.en ?? []).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>Recommendations</h2>
      <ul>
        {(data.analysis?.recommendations?.[lang] ?? data.analysis?.recommendations?.en ?? []).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {data.downloadUrl ? (
        <a href={data.downloadUrl} className={styles.primaryLink} target="_blank" rel="noreferrer">
          Download PDF
        </a>
      ) : null}
    </section>
  );
}
