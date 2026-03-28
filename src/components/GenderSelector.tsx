import styles from "./GenderSelector.module.css";

type Props = {
  maleLabel: string;
  femaleLabel: string;
  value: "male" | "female" | null;
  onChange: (v: "male" | "female") => void;
};

export function GenderSelector({ maleLabel, femaleLabel, value, onChange }: Props) {
  return (
    <div className={styles.row}>
      <button className={value === "male" ? styles.active : styles.btn} onClick={() => onChange("male")}>
        {maleLabel}
      </button>
      <button className={value === "female" ? styles.active : styles.btn} onClick={() => onChange("female")}>
        {femaleLabel}
      </button>
    </div>
  );
}
