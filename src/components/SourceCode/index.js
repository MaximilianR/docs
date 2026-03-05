import styles from './styles.module.css';

export default function SourceCode({ children }) {
  return (
    <details className={styles.container}>
      <summary className={styles.toggle}>
        <span className={styles.icon}>&lt;&gt;</span>
        <span className={styles.label}>Source code</span>
        <span className={styles.chevron}>▼</span>
      </summary>
      <div className={`${styles.content} sourcecode-content`}>
        {children}
      </div>
    </details>
  );
}
