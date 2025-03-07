import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./AgricultureTable.module.css";
import { fetchData } from "@Om/app/utils/fetchdata";
import Link from "next/link";

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
    "https://main.d2hc7hdf8ja5ek.amplifyapp.com/api/shodoku",
    5
  );
  const record2 = data2.find((rec) => rec.column_code === column_id);



  // Convert record2 to DataEntry format or set default "N/A"
  const data: DataEntry[] = [
    {
      when: record2?.itsu || "該当なし",
      weather: record2?.tenki || "該当なし",
      datetime: record2 ? `${record2.nichi} ${record2.ji}` : "該当なし",
      disease: record2?.byoki || "該当なし",
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
                  <Link
                    href={`/cultivate/shodoku/${record2?.Record_number}`} // Dynamic route
                    className={`btn btn-success ${styles.detailButton}`}
                  >
                    詳細
                  </Link>
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
