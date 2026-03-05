import styles from './styles.module.css';

export default function Dropdown({ title, children }) {
  return (
    <details className={styles.container}>
      <summary className={styles.toggle}>
        <span className={styles.icon}>▶</span>
        <span className={styles.label}>{title}</span>
        <span className={styles.chevron}>▼</span>
      </summary>
      <div className={styles.content}>
        {children}
      </div>
    </details>
  );
}
