"use client";

import React, { useState } from "react";
import styles from "./insert.module.css";
const InsertDataForm = () => {
  const initialFormState = {
    title: "",
    task: "",
    details: "",
    code: "",
    status: "",
    startTime_date: "",
    startTime_time: "",
    endTime_date: "",
    endTime_time: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
            <option value="プロジェクトA">プロジェクトA</option>
            <option value="プロジェクトB">プロジェクトB</option>
            <option value="プロジェクトC">プロジェクトC</option>
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
            <option value="">選択してください</option>
            <option value="設計">設計</option>
            <option value="開発">開発</option>
            <option value="テスト">テスト</option>
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
          <input
            type="text"
            className={styles.input}
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>

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
