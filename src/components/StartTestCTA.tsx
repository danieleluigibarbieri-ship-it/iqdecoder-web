"use client";

import { useRouter } from "next/navigation";
import styles from "./StartTestCTA.module.css";

type Props = {
  label: string;
  disabled: boolean;
  gender: "male" | "female" | null;
};

export function StartTestCTA({ label, disabled, gender }: Props) {
  const router = useRouter();

  return (
    <button className={disabled ? styles.disabled : styles.btn} disabled={disabled} onClick={() => router.push(gender ? `/test?gender=${gender}` : "/test")}>
      {label}
    </button>
  );
}
