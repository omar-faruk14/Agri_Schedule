import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./AgricultureTable.module.css";
import { fetchData } from "@Om/app/utils/fetchdata";

interface AgriculturePageProps {
  column_id: string;
}

interface DataEntry {
  when: string;
  weather: string;
  datetime: string;
  disease: string;
}

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

// ✅ Convert AgriculturePage to an async function (Server Component)
const AgriculturePage = async ({ column_id }: AgriculturePageProps) => {
  // Fetch data
  const data2 = await fetchData<ShodokuRecord[]>(
    "http://localhost:3000/api/shodoku",
    5
  );
  const record2 = data2.find((rec) => rec.column_code === column_id);

  if (!record2) {
    return <p>データが見つかりません。</p>;
  }

  // Convert record2 to DataEntry format
  const data: DataEntry[] = [
    {
      when: record2.itsu,
      weather: record2.tenki,
      datetime: `${record2.nichi} ${record2.ji}`,
      disease: record2.byoki,
    },
  ];

  return (
    <div className={`container ${styles.pageContainer}`}>
      <h1 className={styles.title}>🌱 農薬管理システム</h1>
      <p className={styles.subtitle}>農作物の健康を管理するための情報</p>

      <div className={`table-responsive ${styles.tableWrapper}`}>
        <table
          className={`table table-striped table-bordered ${styles.customTable}`}
        >
          <thead>
            <tr>
              <th>いつ</th>
              <th>天気</th>
              <th>日時</th>
              <th>病気</th>
              <th>詳細</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.when}</td>
                <td>{row.weather}</td>
                <td>{row.datetime}</td>
                <td>{row.disease}</td>
                <td>
                  <button className={`btn btn-success ${styles.detailButton}`}>
                    詳細
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgriculturePage;
