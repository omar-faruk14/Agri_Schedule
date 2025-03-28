// components/LoadingSpinner.tsx
// components/LoadingSpinner.tsx
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.dotContainer}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
      <p className={styles.loadingText}>読み込み中...</p> {/* Japanese "Loading..." */}
    </div>
  );
};

export default LoadingSpinner;
