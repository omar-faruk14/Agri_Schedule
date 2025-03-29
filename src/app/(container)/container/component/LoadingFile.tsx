
import * as styles from "@Om/app/(container)/container/styles/LoadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.dotContainer}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
      <p className={styles.loadingText}>読み込み中...</p> 
    </div>
  );
};

export default LoadingSpinner;
