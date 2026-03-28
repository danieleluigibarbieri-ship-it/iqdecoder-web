import styles from "./Disclaimer.module.css";

export function Disclaimer({ text }: { text: string }) {
  return <p className={styles.text}>{text}</p>;
}
