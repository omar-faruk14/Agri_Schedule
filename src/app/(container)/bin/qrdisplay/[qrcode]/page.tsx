"use client";
import React, { useState, useEffect } from "react";
import Header2 from "@Om/app/(container)/clist/component/Header2";
import Sidebar2 from "@Om/app/(container)/clist/component/Sidebar2";
import LoadingSpinner from "@Om/app/(container)/clist/component/LoadingFile";
import { use } from "react";
import * as styles from "./qr.css";

type ContainerData = {
  Record_number: string;
  bottle_QR_code: string;
  barrel_used: string;
  bottle_status: string;
  bottle_type_information: string;
};

type TaruData = {
  container_id: string;
  container_status: string;
  container_type: string;
  container_last_cleaned: string;
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
  const [taruData, setTaruData] = useState<TaruData | null>(null);

  useEffect(() => {
    if (!qrcode) return;

    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/bin/status/onevalue?bottle_QR_code=${qrcode}`
        );
        const result = await response.json();
        if (result && result.length > 0) {
          const bottleData = result[0];
          setData(bottleData);

          if (bottleData.barrel_used) {
            const taruRes = await fetch(
              `/api/taru/status?container_id=${bottleData.barrel_used}`
            );
            const taruResult = await taruRes.json();
            if (taruResult && taruResult.length > 0) {
              setTaruData(taruResult[0]);
            } else {
              console.error("樽データが見つかりませんでした");
            }
          }
        } else {
          console.error("データが見つかりませんでした");
        }
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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
                <h1>瓶QR 表示</h1>
              </section>

              <section className="content">
                <div className={styles.card}>
                  <div className="card-body">
                    <p className={styles.text}>
                      <strong>瓶QRコード:</strong>{" "}
                      <span className={styles.qrcodestyle}>
                        {data.bottle_QR_code}
                      </span>
                    </p>

                    <p className={styles.text}>
                      <strong>使用した樽:</strong> {data.barrel_used}
                    </p>
                    {taruData?.container_status && (
                      <p className={styles.text}>
                        <strong>樽のステータス:</strong>{" "}
                        {taruData.container_status}
                      </p>
                    )}
                    {data.bottle_type_information && (
                    <p className={styles.text}>
                      <strong>中身の種類:</strong>{" "}
                      {(data.bottle_type_information?.split("\n") ?? []).map(
                        (line, index) => (
                          <React.Fragment key={index}>
                            {line}
                            <br />
                          </React.Fragment>
                        )
                      )}
                      
                    </p>)}

                    <span className={getStatusBadgeClass(data.bottle_status)}>
                      <i
                        className={`${
                          data.bottle_status === "返却済み"
                            ? "fas fa-check-circle" // Returned
                            : data.bottle_status === "貸出中"
                            ? "fas fa-clock" // Borrowed (in use)
                            : data.bottle_status === "利用可能（洗浄済み）"
                            ? "fas fa-check-circle" // Available (Cleaned)
                            : data.bottle_status === "利用不可（未洗浄）"
                            ? "fas fa-exclamation-triangle" // Not Available (Uncleaned)
                            : data.bottle_status === "使用不可"
                            ? "fas fa-times-circle" // Unusable
                            : "fas fa-question-circle" // Default case (unknown)
                        } ${styles.icon}`}
                      />

                      {data.bottle_status}
                    </span>
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
