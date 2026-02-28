import styles from './Example.module.css';

export default function Example({ children }) {
  return (
    <details className={styles.container}>
      <summary className={styles.toggle}>
        <span className={styles.icon}>▶</span>
        <span className={styles.label}>Example</span>
        <span className={styles.chevron}>▼</span>
      </summary>
      <div className={styles.content}>
        {children}
      </div>
    </details>
  );
}
