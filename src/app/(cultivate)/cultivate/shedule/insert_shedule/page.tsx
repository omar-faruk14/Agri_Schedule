"use client";

import React, { useState, useEffect } from "react";
import styles from "./insert.module.css";
import Select from "react-select";

interface FormData {
  title: string;
  task: string;
  details: string;
  code: string;
  status: string;
  startTime_date: string;
  startTime_time: string;
  endTime_date: string;
  endTime_time: string;
  latitude: string;
  longitude: string;
  publish: string;
}

interface Coordinate {
  Record_number: string;
  longitude: string;
  latitude: string;
  code: string;
  comment_2: string;
}

const InsertDataForm = () => {
  const initialFormState: FormData = {
    title: "",
    task: "",
    details: "",
    code: "",
    status: "",
    startTime_date: "",
    startTime_time: "",
    endTime_date: "",
    endTime_time: "",
    latitude: "",
    longitude: "",
    publish: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch("/api/map/cordinate");
        const data: Coordinate[] = await response.json(); // Typing the response data
        setCoordinates(data);
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      } 
    };

    fetchCoordinates();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/shedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    setLoading(false);

    if (response.ok) {
      setSuccessMessage("レコードが正常に作成されました");
      setError(null);
      setFormData(initialFormState); // Reset form after success
    } else {
      setError(result.error || "エラーが発生しました");
      setSuccessMessage(null);
    }
  };

 

  const options = coordinates.map((coordinate) => ({
    value: coordinate.code,
    label: `${coordinate.code}`,
  }));


  return (
    <div className={styles.container}>
      <h2 className={styles.title}>データ挿入フォーム</h2>
      <form onSubmit={handleSubmit}>
        {loading && <div className={styles.alertInfo}>送信中...</div>}

        <div className={styles.formGroup}>
          <label className={styles.label}>タイトル</label>
          <select
            className={styles.input}
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          >
            <option value="">選択してください</option>
            <option value="りんご普通木">りんご普通木</option>
            <option value="りんごワイカ">りんごワイカ</option>
            <option value="ブドウ生食">ブドウ生食</option>
            <option value="ワインブドウ">ワインブドウ</option>
            <option value="ホップ">ホップ</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>タスク</label>
          <select
            className={styles.input}
            name="task"
            value={formData.task}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              選択してください
            </option>

            {formData.title === "りんご普通木" && (
              <>
                <option value="剪定">剪定</option>
                <option value="ふらん病防止薬液塗布">
                  ふらん病防止薬液塗布
                </option>
                <option value="花摘み">花摘み</option>
                <option value="摘果">摘果</option>
                <option value="徒長枝切り">徒長枝切り</option>
                <option value="葉摘み">葉摘み</option>
                <option value="玉まわし">玉まわし</option>
                <option value="剪定">剪定</option>
                <option value="収穫">収穫</option>
                <option value="消毒">消毒</option>
                <option value="支柱立て">支柱立て</option>
                <option value="選果">選果</option>
                <option value="枝こなし">枝こなし</option>
                <option value="支柱回収">支柱回収</option>
              </>
            )}

            {formData.title === "りんごワイカ" && (
              <>
                <option value="剪定">剪定</option>
                <option value="ふらん病防止薬液塗布">
                  ふらん病防止薬液塗布
                </option>
                <option value="花摘み">花摘み</option>
                <option value="摘果">摘果</option>
                <option value="徒長枝切り">徒長枝切り</option>
                <option value="葉摘み">葉摘み</option>
                <option value="玉まわし">玉まわし</option>
                <option value="消毒">消毒</option>
                <option value="枝こなし">枝こなし</option>
                <option value="ガムテープ貼り（誘引）">
                  ガムテープ貼り（誘引）
                </option>
              </>
            )}

            {formData.title === "ブドウ生食" && (
              <>
                <option value="剪定">剪定</option>
                <option value="摘芽">摘芽</option>
                <option value="誘引">誘引</option>
                <option value="房の整形">房の整形</option>
                <option value="ジベレリン処理">ジベレリン処理</option>
                <option value="摘心">摘心</option>
                <option value="摘粒">摘粒</option>
                <option value="副梢とり">副梢とり</option>
                <option value="袋がけ">袋がけ</option>
                <option value="収穫">収穫</option>
                <option value="消毒">消毒</option>
                <option value="巻きつるとり">巻きつるとり</option>
                <option value="選果">選果</option>
              </>
            )}

            {formData.title === "ワインブドウ" && (
              <>
                <option value="剪定">剪定</option>
                <option value="誘引(長梢)">誘引(長梢)</option>
                <option value="誘引(新梢)">誘引(新梢)</option>
                <option value="摘芽">摘芽</option>
                <option value="摘心">摘心</option>
                <option value="副梢切り">副梢切り</option>
                <option value="葉摘み">葉摘み</option>
                <option value="防鳥ネット張り">防鳥ネット張り</option>
                <option value="収穫">収穫</option>
                <option value="消毒">消毒</option>
                <option value="摘粒">摘粒</option>
              </>
            )}

            {formData.title === "ホップ" && (
              <>
                <option value="選芽">選芽</option>
                <option value="誘引">誘引</option>
                <option value="蔓まき">蔓まき</option>
                <option value="収穫">収穫</option>
                <option value="糸つけ">糸つけ</option>
              </>
            )}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>開始日</label>
          <input
            type="date"
            className={styles.input}
            name="startTime_date"
            value={formData.startTime_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>開始時間</label>
          <input
            type="time"
            className={styles.input}
            name="startTime_time"
            value={formData.startTime_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>終了日</label>
          <input
            type="date"
            className={styles.input}
            name="endTime_date"
            value={formData.endTime_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>終了時間</label>
          <input
            type="time"
            className={styles.input}
            name="endTime_time"
            value={formData.endTime_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>コード</label>
          <select
            className={styles.input}
            name="publish"
            value={formData.publish}
            onChange={handleChange}
            required
          >
            <option value="">選択してください</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>


        {formData.publish === "Yes" && (

        <div className={styles.formGroup}>
          <label className={styles.label}>コード</label>
          <Select
            options={options}
            value={options.find((option) => option.value === formData.code)}
            onChange={(selectedOption) => {
              const selectedCoordinate = coordinates.find(
                (coord) => coord.code === selectedOption?.value
              );

              setFormData({
                ...formData,
                code: selectedOption?.value || "",
                latitude: selectedCoordinate?.latitude || "",
                longitude: selectedCoordinate?.longitude || "",
              });
            }}
            isSearchable
            placeholder="検索..."
            instanceId="code-select"
          />
        </div>
      )}

        <div className={styles.formGroup}>
          <label className={styles.label}>詳細</label>
          <textarea
            className={styles.input}
            name="details"
            value={formData.details}
            onChange={handleChange}
            required
            rows={4}
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>ステータス</label>
          <select
            className={styles.input}
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">選択してください</option>
            <option value="途中">途中</option>
            <option value="完了">完了</option>
          </select>
        </div>

        {error && <div className={styles.alertDanger}>{error}</div>}
        {successMessage && (
          <div className={styles.alertSuccess}>{successMessage}</div>
        )}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "送信中..." : "提出"}
        </button>
      </form>
    </div>
  );
};

export default InsertDataForm;
