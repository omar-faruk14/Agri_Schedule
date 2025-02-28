import React from "react";
import styles from "./HarvestTable.module.css";
import AgriculturePage from "../../shodoku/page";
import { fetchData } from "@Om/app/utils/fetchdata";

// Define the expected data structure
interface HarvestRecord {
  Record_number: string;
  harvest_start_date: string;
  harvest_start_time: string;
  harvest_end_date: string;
  harvest_end_time: string;
  column_code: string;
}

export default async function Page({ params }: { params: Promise<{ column_id: string }> }) {
  const column_id = (await params).column_id;
  const data = await fetchData<HarvestRecord[]>("http://localhost:3000/api/harvest", 5);
  const record = data.find((rec) => rec.column_code === column_id);
 if (!record) {
   return <p>データが見つかりません。</p>;
 }

 
 const startDateTime = `${record.harvest_start_date} ${record.harvest_start_time}`;
 const endDateTime = `${record.harvest_end_date} ${record.harvest_end_time}`;

  return (
    <>
      <div className={`container py-4 ${styles.customContainer}`}>
        <h1 className={`text-center mb-4 ${styles.customTitle}`}>収穫記録</h1>
        <div className={styles.customGridContainer}>
          <div className={styles.customGridItem}>
            <h3 className={styles.customLabel}>開始日時</h3>
            <p className={styles.customValue}>{startDateTime}</p>
          </div>
          <div className={styles.customGridItem}>
            <h3 className={styles.customLabel}>終了日時</h3>
            <p className={styles.customValue}>{endDateTime}</p>
          </div>
        </div>
      </div>
      <AgriculturePage />
    </>
  );
}


