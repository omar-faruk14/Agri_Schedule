import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchData } from "@Om/app/utils/fetchdata";
import styles from "../AgricultureTable.module.css";
import styles2 from "./shodoku2.module.css";

interface ShodokuRecord {
  Record_number: string;
  itsu: string;
  tenki: string;
  nichi: string;
  ji: string;
  byoki: string;
  mushi: string;
  kakunin: string;
  column_code: string;
}

const AgricultureDetailPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  // Fetch the specific record using the dynamic route parameter (id)
  const data = await fetchData<ShodokuRecord[]>(
    "http://localhost:3000/api/shodoku",
    5
  );
  const record = data.find((rec) => rec.Record_number === params.id);

  if (!record) {
    return <div>Record not found</div>;
  }

  return (
    <div className={`container ${styles.pageContainer}`}>
      <h1 className={styles.title}>🌱 農薬管理システム - 詳細</h1>
      <p className={styles.subtitle}>農作物の健康を管理するための詳細情報</p>

      {/* Card section with styles2 applied */}
      <div className={`card ${styles2.card}`}>
        <div className={`card-body ${styles2.cardBody}`}>
          <h5 className={`card-title ${styles2.cardTitle}`}>詳細情報</h5>
          <ul className="list-group list-group-flush">
            <li className={`list-group-item ${styles2.listGroupItem}`}>
              <strong>いつ:</strong> {record.itsu}
            </li>
            <li className={`list-group-item ${styles2.listGroupItem}`}>
              <strong>天気:</strong> {record.tenki}
            </li>
            <li className={`list-group-item ${styles2.listGroupItem}`}>
              <strong>日:</strong> {record.nichi}
            </li>
            <li className={`list-group-item ${styles2.listGroupItem}`}>
              <strong>時:</strong> {record.ji}
            </li>
            <li className={`list-group-item ${styles2.listGroupItem}`}>
              <strong>病気:</strong> {record.byoki}
            </li>
            <li className={`list-group-item ${styles2.listGroupItem}`}>
              <strong>虫:</strong> {record.mushi}
            </li>
            <li className={`list-group-item ${styles2.listGroupItem}`}>
              <strong>確認:</strong> {record.kakunin}
            </li>
            <li className={`list-group-item ${styles2.listGroupItem}`}>
              <strong>カラムコード:</strong> {record.column_code}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AgricultureDetailPage;
