"use client";

import { useState, useEffect } from "react";
import Select, { SingleValue } from "react-select";

import Header2 from "@Om/app/(container)/clist/component/Header2";
import Sidebar2 from "@Om/app/(container)/clist/component/Sidebar2";
import LoadingSpinner from "@Om/app/(container)/clist/component/LoadingFile";
import * as styles from "@Om/app/(container)/clist/styles/pageh.css";
import { use } from "react";
import { useRouter } from "next/navigation";
interface FormData {
  Record_number: string;
  container_id: string;
  container_status: string;
  Borrower_Information: string;
  typeCode: string;
  content_type_information?: string;
}

interface ContainerData {
  Record_number: string;
  container_id: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export default function ContainerRecord({ params }: { params: Promise<{ qrcode: string }> }) {
  const initialFormState = {
    Record_number: "",
    container_id: "",
    container_status: "",
    Borrower_Information: "",
    typeCode: "taru",
  };
  const { qrcode } = use(params);
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [container, setContainer] = useState<ContainerData[]>([]);
  const router = useRouter();


  useEffect(() => {
    if (!qrcode) return;

    async function fetchSchedule() {
      setLoading(true);
      try {
        const response = await fetch(`/api/taru/status?container_id=${qrcode}`);
        const result = await response.json();
        if (result && result.length > 0) {
          const existingData = result[0];
          // Update formData with the existing data from the API
          setFormData({
            Record_number: existingData.Record_number, // Add this line
            container_id: existingData.container_id,
            container_status: existingData.container_status,
            Borrower_Information: existingData.Borrower_Information,
            typeCode: "taru",
            content_type_information: existingData.content_type_information,
          });

        } else {
          console.error("No data found");
        }
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, [qrcode]);


  useEffect(() => {
    const fetchContainer = async () => {
      try {
        const response = await fetch("/api/taru/register");
        const data: ContainerData[] = await response.json();
        setContainer(data);
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      }
    };

    fetchContainer();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOption: SingleValue<SelectOption>) => {
    setFormData({ ...formData, container_id: selectedOption?.value || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/taru/status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    setLoading(false);

    if (response.ok) {
      setSuccessMessage("レコードが正常に更新されました");
      setError(null);
      setFormData(initialFormState);
      router.push(`/taru/qrDisplayKanri/${formData.container_id}`);
    } else {
      setError(result.error || "エラーが発生しました");
      setSuccessMessage(null);
    }
  };

  const options = container
    .sort((a, b) =>
      a.container_id.localeCompare(b.container_id, undefined, { numeric: true })
    )
    .map((container) => ({
      value: container.container_id,
      label: `${container.container_id}`,
    }));

  return (
    <>
      <Header2 />
      <Sidebar2 />
      <div className="content-wrapper overflow-x-hidden overflow-y-auto">
        {container.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <>
            <section className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col">
                    <h2 className={`${styles.h2_map}`}>樽のステータス</h2>
                  </div>
                </div>
              </div>
            </section>
            <section className="content">
              <form onSubmit={handleSubmit}>
                <div className={styles.card_primary}>
                  <div className={styles.card_header}>
                    <h3 className={styles.card_title}>更新フォーム</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-group m-3">
                      <label>
                        借用者情報<span className="text-danger">*</span>
                      </label>
                      <textarea
                        name="Borrower_Information"
                        className="form-control"
                        value={formData.Borrower_Information}
                        onChange={handleChange}
                        required
                        rows={4}
                      />
                    </div>

                    <div className="form-group p-3">
                      <label>
                        樽QRコード<span className="text-danger">*</span>
                      </label>
                      <Select
                        menuPlacement="auto"
                        maxMenuHeight={200}
                        options={options}
                        onChange={handleSelectChange}
                        value={options.find(
                          (option) => option.value === formData.container_id
                        )}
                        menuPosition="fixed"
                        isSearchable
                        placeholder="検索..."
                        instanceId="code-select"
                        required
                        isDisabled
                      />
                    </div>

                    <div className="form-group p-3">
                      <label>
                        樽のステータス
                        <span className="text-danger">*</span>
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
                        <option value="返却済み">返却済み</option>
                        <option value="貸出中">貸出中</option>
                        <option value="利用可能（洗浄済み）">
                          利用可能（洗浄済み）
                        </option>
                        <option value="利用不可（未洗浄）">
                          利用不可（未洗浄）
                        </option>
                        <option value="使用不可">使用不可</option>
                      </select>
                    </div>
                    <div className="form-group m-3">
                      <label>中身の種類 (任意)</label>
                      <textarea
                        name="content_type_information"
                        className="form-control"
                        value={formData.content_type_information}
                        onChange={handleChange}
                        rows={4}
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
          </>
        )}
      </div>
    </>
  );
}
