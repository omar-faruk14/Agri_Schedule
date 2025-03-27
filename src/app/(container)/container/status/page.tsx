"use client";

import { useState } from "react";

import Header2 from "../component/Header2"; 
import Sidebar2 from "../component/Sidebar2"; 


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

    const response = await fetch("/api/container/register", {
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
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>コンテナのステータス</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">ホーム</a>
                  </li>
                  <li className="breadcrumb-item active">
                    コンテナのステータス
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <form onSubmit={handleSubmit}>
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">一般</h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label>
                    借用者情報<span className="text-danger">*</span>
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

                <div className="form-group">
                  <label>
                    コンテナ QR_ID<span className="text-danger">*</span>
                  </label>
                  <select
                    name="container_status"
                    className="form-control"
                    value={formData.container_status}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      選択してくださ
                    </option>
                    <option value="利用可能">利用可能</option>
                    <option value="返却済み">返却済み</option>
                    <option value="貸出中">貸出中</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    コンテナのステータス<span className="text-danger">*</span>
                  </label>
                  <select
                    name="container_status"
                    className="form-control"
                    value={formData.container_status}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      選択してくださ
                    </option>
                    <option value="利用可能">利用可能</option>
                    <option value="返却済み">返却済み</option>
                    <option value="貸出中">貸出中</option>
                  </select>
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
                  className="btn btn-success float-right"
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
                    "提出"
                  )}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
