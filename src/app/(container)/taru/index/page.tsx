"use client";

import { useState } from "react";

import Header2 from "../../clist/component/Header2"; 
import Sidebar2 from "../../clist/component/Sidebar2"; 
import * as styles from "@Om/app/(container)/clist/styles/pageh.css";
import Link from "next/link";

interface FormData {
  container_id: string;
  container_status: string;
}

export default function ContainerRecord() {
  const initialFormState = {
    container_id: "",
    container_status: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/taru/register", {
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
    <>
      <Header2 />
      <Sidebar2 />
      <div className="content-wrapper overflow-x-hidden overflow-y-auto">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col">
                <h2 className={`${styles.h2_map}`}>樽を登録する</h2>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <form onSubmit={handleSubmit}>
            <div className={styles.card_primary}>
              <div className={styles.card_header}>
                <h3 className={styles.card_title}>一般</h3>
              </div>
              <div className="card-body">
                <div className="form-group m-3">
                  <label>
                    樽 QRコード<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="container_id"
                    className="form-control"
                    value={formData.container_id}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                {successMessage && (
                  <div
                    className="alert alert-success alert-dismissible fade show"
                    role="alert"
                  >
                    {successMessage}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setSuccessMessage(null)}
                      aria-label="Close"
                    ></button>
                  </div>
                )}
                {error && (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    {error}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError(null)}
                      aria-label="Close"
                    ></button>
                  </div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary text-center float-right m-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span className="sr-only">処理中...</span>
                    </>
                  ) : (
                    "送信"
                  )}
                </button>
              </div>
            </div>
          </form>
        </section>
        <section className="content mt-4 text-center">
          <Link href="/taru/index/RegisterTable">
            <button
              className="btn btn-info rounded-pill px-5 py-3" // AdminLTE primary button, rounded and styled
              style={{
                minWidth: "200px", // Ensure button has a decent size
              }}
            >
              コンテナ登録一覧に移動
            </button>
          </Link>
        </section>
      </div>
    </>
  );
}
