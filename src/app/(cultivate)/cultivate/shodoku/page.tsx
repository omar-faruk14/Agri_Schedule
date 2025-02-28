import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./AgricultureTable.module.css";

interface DataEntry {
  when: string;
  weather: string;
  datetime: string;
  disease: string;
}

const AgriculturePage: React.FC = () => {
  const data: DataEntry[] = [
    {
      when: "朝",
      weather: "晴れ",
      datetime: "2025-02-25 08:00",
      disease: "なし",
    },
    {
      when: "昼",
      weather: "曇り",
      datetime: "2025-02-25 12:00",
      disease: "あり",
    },
    {
      when: "夜",
      weather: "雨",
      datetime: "2025-02-25 19:00",
      disease: "なし",
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
