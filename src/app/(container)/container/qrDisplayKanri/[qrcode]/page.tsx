"use client";
import React, { useState, useEffect } from "react";
import Header2 from "@Om/app/(container)/clist/component/Header2";
import Sidebar2 from "@Om/app/(container)/clist/component/Sidebar2";
import LoadingSpinner from "@Om/app/(container)/clist/component/LoadingFile";
import { use } from "react";
import * as styles from "@Om/app/(container)/taru/qrdisplay/[qrcode]/qr.css";
import { useRouter } from "next/navigation";


type ContainerData = {
  container_id: string;
  container_status: string;
  Borrower_Information: string;
};

// Helper function for badge class based on status
const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case "返却済み":
      return styles.badgeSuccess;
    case "貸出中":
      return styles.badgeWarning;
    case "利用可能（洗浄済み）":
      return styles.badgeSuccess;
    case "利用不可（未洗浄）":
      return styles.badgeAvailable;
    case "使用不可":
      return styles.badgeDanger;
    default:
      return styles.badgeDefault;
  }
};

export default function Page({
  params,
}: {
  params: Promise<{ qrcode: string }>;
}) {
  const { qrcode } = use(params);
  const [data, setData] = useState<ContainerData | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!qrcode) return;

    async function fetchSchedule() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/taru/status?container_id=${qrcode}`
        );
        const result = await response.json();
        if (result && result.length > 0) {
          setData(result[0]);
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

  return (
    <>
      <Header2 />
      <Sidebar2 />
      <div className="content-wrapper overflow-x-hidden overflow-y-auto py-5">
        {loading ? (
          <LoadingSpinner />
        ) : (
          data && (
            <>
              <section className={styles.cardHeader}>
                <h1 className={styles.header}>樽情報</h1>
              </section>

              <section className="content">
                <div className={styles.card}>
                  <div className="card-body">
                    <p className={styles.text}>
                      <strong>樽QRコード:</strong>{" "}
                      <span className={styles.qrcodestyle}>
                        {data.container_id}
                      </span>
                    </p>

                    <p className={styles.text}>
                      <strong>借用者情報:</strong>{" "}
                      {(data.Borrower_Information?.split("\n") ?? []).map(
                        (line, index) => (
                          <React.Fragment key={index}>
                            {line}
                            <br />
                          </React.Fragment>
                        )
                      )}
                      {!data.Borrower_Information && "N/A"}
                    </p>
                    <span
                      className={getStatusBadgeClass(data.container_status)}
                    >
                      <i
                        className={`${
                          data.container_status === "返却済み"
                            ? "fas fa-check-circle" // Returned
                            : data.container_status === "貸出中"
                            ? "fas fa-clock" // Borrowed (in use)
                            : data.container_status === "利用可能（洗浄済み）"
                            ? "fas fa-check-circle" // Available (Cleaned)
                            : data.container_status === "利用不可（未洗浄）"
                            ? "fas fa-exclamation-triangle" // Not Available (Uncleaned)
                            : data.container_status === "使用不可"
                            ? "fas fa-times-circle" // Unusable
                            : "fas fa-question-circle" // Default case (unknown)
                        } ${styles.icon}`}
                      />

                      {data.container_status}
                    </span>

                    {/* === Edit & Delete Buttons Below === */}
                    <div className="d-flex justify-content-end"
                      style={{
                        marginTop: "20px",
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <button
                        className={styles.buttonEdit}
                        onClick={() =>
                          router.push(`/taru/updateStatus/${qrcode}`)
                        }
                      >
                        ✏️ 編集
                      </button>
                      {/* <button
                        className={styles.buttonDelete}
                        onClick={() => alert("削除機能は未実装です")}
                      >
                        <i
                          className="fas fa-trash-alt"
                          style={{ marginRight: "8px", color: "white" }}
                        ></i>
                        削除
                      </button> */}
                    </div>
                  </div>
                </div>
              </section>
            </>
          )
        )}
      </div>
    </>
  );
}
