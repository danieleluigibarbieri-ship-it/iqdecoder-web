"use client";

import { LANG_OPTIONS } from "@/i18n/translations";
import { useLanguage } from "@/i18n/LanguageContext";
import styles from "./LanguageSelector.module.css";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={styles.wrap}>
      {LANG_OPTIONS.map((item) => (
        <button key={item.code} className={language === item.code ? styles.active : styles.btn} onClick={() => setLanguage(item.code)}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
