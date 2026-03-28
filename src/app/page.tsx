"use client";

import { useMemo, useState } from "react";
import { GenderSelector } from "@/components/GenderSelector";
import { LanguageSelector } from "@/components/LanguageSelector";
import { StartTestCTA } from "@/components/StartTestCTA";
import { useLanguage } from "@/i18n/LanguageContext";
import { HOME_COPY } from "@/i18n/translations";
import styles from "./page.module.css";

export default function HomePage() {
  const { language } = useLanguage();
  const t = useMemo(() => HOME_COPY[language] ?? HOME_COPY.en, [language]);
  const [gender, setGender] = useState<"male" | "female" | null>(null);

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.brandWrap}>
          <div className={styles.brandMark}>IQ</div>
          <div>
            <p className={styles.brandName}>IQ Decoder</p>
            <p className={styles.brandTag}>Simple IQ test flow</p>
          </div>
        </div>
        <LanguageSelector />
      </header>

      <section className={styles.shell}>
        <article className={styles.copyCol}>
          <p className={styles.kicker}>{t.kicker}</p>
          <h1>{t.title}</h1>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </article>

        <article className={styles.actionCard}>
          <p className={styles.choose}>{t.chooseGender}</p>
          <GenderSelector maleLabel={t.male} femaleLabel={t.female} value={gender} onChange={setGender} />

          <p className={styles.hint}>{t.hint}</p>
          <StartTestCTA label={t.start} disabled={!gender} gender={gender} />
          <p className={styles.trust}>{t.trustLine}</p>
        </article>
      </section>

      <p className={styles.disclaimer}>{t.disclaimer}</p>
    </main>
  );
}
