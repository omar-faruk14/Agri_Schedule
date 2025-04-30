"use client";

import { useState} from "react";

import Header2 from "@Om/app/(container)/clist/component/Header2";
import Sidebar2 from "@Om/app/(container)/clist/component/Sidebar2";

import * as styles from "@Om/app/(container)/clist/styles/pageh.css";

interface FormData {
  Record_number: string;
  ingredients_name: string;
  ingredients_qrCode: string;
  ingredients_Categories: string;
  ingredients_unit: string;
  ingredients_Registered_Date: string;
  ingredients_inside_information?: string;
}

export default function ContainerRecord() {
  const initialFormState = {
    Record_number: "",
    ingredients_name: "",
    ingredients_qrCode: "",
    ingredients_Categories: "",
    ingredients_unit: "",
    ingredients_Registered_Date: "",
    ingredients_inside_information: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

 



  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/zairiyo/status", {
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
                    <h2 className={`${styles.h2_map}`}>材料</h2>
                  </div>
                </div>
              </div>
            </section>
            <section className="content">
              <form onSubmit={handleSubmit}>
                <div className="card card-outline card-info shadow-sm">
                  <div className="card-header bg-primary">
                    <h3 className="card-title">材料管理の入力フォーム</h3>
                  </div>
                  <div className="card-body">
                    <div className="input-group mb-3">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-box-open text-secondary"></i>
                      </span>
                      <input
                        type="text"
                        name="ingredients_name"
                        className="form-control"
                        placeholder="材料名"
                        value={formData.ingredients_name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <div className="form-group m-3">
                          <label>
                            カテゴリ (任意)
                          </label>
                          <input
                            type="text"
                            name="ingredients_Categories"
                            className="form-control"
                            value={formData.ingredients_Categories}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-sm-6">
                        <div className="form-group m-3">
                          <label>
                            単位 (任意)<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="ingredients_unit"
                            className="form-control"
                            value={formData.ingredients_unit}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <div className="form-group m-3">
                          <label>
                            材料ID (QRコード)
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="ingredients_qrCode"
                            className="form-control"
                            value={formData.ingredients_qrCode}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-sm-6">
                        <div className="form-group m-3">
                          <label>
                            登録日<span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            name="ingredients_Registered_Date"
                            className="form-control"
                            value={formData.ingredients_Registered_Date}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="input-group mb-3">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-align-left text-secondary"></i>
                      </span>
                      <textarea
                        name="ingredients_inside_information"
                        className="form-control"
                        placeholder="中身の状況を入力してください"
                        rows={4}
                        value={formData.ingredients_inside_information}
                        onChange={handleChange}
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
                      className="btn btn-primary float-right m-3"
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
         
      </div>
    </>
  );
}
