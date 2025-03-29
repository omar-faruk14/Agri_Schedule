
import styles from "@Om/app/(container)/container/styles/LoadingSpinner.module.css";

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
