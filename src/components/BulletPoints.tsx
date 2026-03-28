import styles from "./BulletPoints.module.css";

export function BulletPoints({ items }: { items: [string, string, string] }) {
  return (
    <ul className={styles.list}>
      {items.map((text) => (
        <li key={text}>{text}</li>
      ))}
    </ul>
  );
}
