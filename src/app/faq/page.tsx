import Link from "next/link";
import styles from "../content-pages.module.css";

const FAQ_ITEMS = [
  {
    q: "Is the test free?",
    a: "Yes. Completing the test is free. You pay only if you choose to unlock the full premium report.",
  },
  {
    q: "How long does the test take?",
    a: "Around 20 minutes. You can navigate questions and review answers before submitting.",
  },
  {
    q: "Is there a subscription?",
    a: "No. IQ Decoder uses one-time payment only. There are no recurring charges.",
  },
  {
    q: "How do I receive my result?",
    a: "After payment confirmation from Stripe, your result page unlocks instantly and includes report details.",
  },
];

export default function FaqPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.badge}>FAQ</p>
        <h1 className={styles.title}>Everything about the IQ Decoder flow</h1>
        <p className={styles.subtitle}>From test start to result unlock, here is how the process works.</p>

        <div className={styles.faqList}>
          {FAQ_ITEMS.map((item) => (
            <article className={styles.faq} key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </div>

        <div className={styles.actions}>
          <Link className={styles.primary} href="/">
            Start Test
          </Link>
          <Link className={styles.secondary} href="/pricing">
            View Pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
