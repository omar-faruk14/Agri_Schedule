"use client";

import { useState } from "react";
import * as styles from "./yatta_koto.css";
import classNames from "classnames";

interface FormData {
  yatta_date: string;
  yatta_koto: string;
}

export default function YattaForm() {
  const initialFormState = {
    yatta_date: "",
    yatta_koto: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/shedule/yatta_koto", {
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
      setFormData(initialFormState);
    } else {
      setError(result.error || "エラーが発生しました");
      setSuccessMessage(null);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>予定記録フォーム</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            日付<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="date"
            name="yatta_date"
            className={styles.input}
            value={formData.yatta_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            予定タスク<span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            name="yatta_koto"
            className={styles.textarea}
            value={formData.yatta_koto}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <div className={classNames(styles.alertVariants.error)}>{error}</div>
        )}
        {successMessage && (
          <div className={classNames(styles.alertVariants.success)}>
            {successMessage}
          </div>
        )}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "送信中..." : "提出"}
        </button>
      </form>
    </div>
  );
}
