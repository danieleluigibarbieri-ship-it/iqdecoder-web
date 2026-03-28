"use client";

import { useMemo, useState } from "react";
import { BulletPoints } from "@/components/BulletPoints";
import { Disclaimer } from "@/components/Disclaimer";
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
        <div className={styles.brand}>IQ Decoder</div>
        <LanguageSelector />
      </header>

      <section className={styles.mainWrap}>
        <article className={styles.card}>
          <div className={styles.icon}>IQ</div>
          <h1>{t.title}</h1>

          <BulletPoints items={t.bullets} />

          <p className={styles.choose}>{t.chooseGender}</p>
          <GenderSelector maleLabel={t.male} femaleLabel={t.female} value={gender} onChange={setGender} />

          <p className={styles.hint}>{t.hint}</p>

          <StartTestCTA label={t.start} disabled={!gender} gender={gender} />
        </article>

        <Disclaimer text={t.disclaimer} />
      </section>
    </main>
  );
}
