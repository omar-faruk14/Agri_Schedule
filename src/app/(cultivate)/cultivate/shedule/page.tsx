"use client";

import React, { useEffect, useState } from "react";
import { fetchData } from "@Om/app/utils/fetchdata";
import styles from "./Schedule.module.css";

interface ScheduleRecord {
  Record_number: string;
  title: string;
  task: string;
  details: string;
  code: string;
  status: string;
  startTime_date: string;
  startTime_time: string;
  endTime_date: string;
  endTime_time: string;
}

interface yatta_koto {
  Record_number: string;
  yatta_date: string;
  yatta_koto: string;
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [data2, setData2] = useState<ScheduleRecord[] | null>(null);
  const [data3, setData3] = useState<yatta_koto[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate) return;

    async function fetchSchedule() {
      setLoading(true);
      try {
        const result = await fetchData<ScheduleRecord[]>(
          `/api/shedule?startTime_date=${selectedDate}`,
          5
        );
        setData2(result);
        const result3 = await fetchData<yatta_koto[]>(
          `/api/shedule/yatta_koto?yatta_date=${selectedDate}`,
          5
        );
        setData3(result3);
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, [selectedDate]);

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>🌾 スケジュール 🌿</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={styles.dateInput}
        />
        {loading && <p className={styles.loading}>⏳ 読み込み中...</p>}
        {!loading &&
          data2?.length === 0 &&
          data3?.length === 0 &&
          selectedDate && (
            <p className={styles.noData}>⚠️ データが見つかりません。</p>
          )}
        {data3 && data3.length > 0 && (
          <>
            <h2 className={styles.sectionTitle}>📌 スケジュール</h2>
            {data3.map((item, index) => (
              <div key={index} className={styles.card}>
                <p className={styles.date}>📅 日付: {item.yatta_date}</p>
                <p className={styles.details}>
                  {item.yatta_koto?.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  )) || "N/A"}
                </p>
              </div>
            ))}
          </>
        )}
        {data2 && data2.length > 0 && (
          <>
            <h2 className={styles.sectionTitle}>✅ やったこと</h2>
            {data2.map((schedule, index) => (
              <div key={index} className={styles.card}>
                <h2 className={styles.cardTitle}>{schedule.title}</h2>
                <p className={styles.details}>🌱 タイトル: {schedule.task}</p>
                <p className={styles.details}>
                  ⏰ 開始時間:{" "}
                  {`${schedule.startTime_date} ${schedule.startTime_time}`}
                </p>
                <p className={styles.details}>
                  ⏳ 終了時間:{" "}
                  {`${schedule.endTime_date} ${schedule.endTime_time}`}
                </p>
                <p className={styles.details}>🆔 コード: {schedule.code}</p>
                <p className={styles.details}>
                  📝 詳細:{" "}
                  {schedule.details?.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  )) || "N/A"}
                </p>
                <p className={styles.details}>🔄 作業状況: {schedule.status}</p>
              </div>
            ))}
          </>
        )}

        {/* Button to navigate to work schedule map */}
        {/* <button
          className={styles.mapButton}
          onClick={() => (window.location.href = "/cultivate/map")}
        >
          📍 作業スケジュールをマップで表示
        </button> */}
      </div>
    </>
  );
}
