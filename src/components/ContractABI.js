import styles from './ContractABI.module.css';

export default function ContractABI({ children }) {
  return (
    <details className={styles.container}>
      <summary className={styles.toggle}>
        <span className={styles.icon}>{'{ }'}</span>
        <span className={styles.label}>Contract ABI</span>
        <span className={styles.chevron}>▼</span>
      </summary>
      <div className={styles.content}>
        {children}
      </div>
    </details>
  );
}
