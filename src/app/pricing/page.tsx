import Link from "next/link";
import styles from "../content-pages.module.css";

export default function PricingPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.badge}>PRICING</p>
        <h1 className={styles.title}>Start free. Unlock full report for EUR 0.50.</h1>
        <p className={styles.subtitle}>
          You only pay after finishing the assessment and only if you want the premium breakdown and certificate.
        </p>

        <h2 className={styles.sectionTitle}>What is included</h2>
        <ul className={styles.list}>
          <li>Instant IQ-style score estimate and percentile.</li>
          <li>Category analysis: logic, numeric, verbal, spatial, memory.</li>
          <li>Personalized recommendations and downloadable certificate.</li>
          <li>One-time payment via Stripe, no subscription.</li>
        </ul>

        <div className={styles.actions}>
          <Link className={styles.primary} href="/">
            Start Test
          </Link>
          <Link className={styles.secondary} href="/faq">
            Read FAQ
          </Link>
        </div>
      </section>
    </main>
  );
}
