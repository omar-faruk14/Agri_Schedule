"use client";
import React, { useState, useEffect } from "react";
import Header2 from "@Om/app/(container)/container/component/Header2";
import Sidebar2 from "@Om/app/(container)/container/component/Sidebar2";
import LoadingSpinner from "@Om/app/(container)/container/component/LoadingFile";
import { use } from "react";
import * as styles from "./qr.css";

type ContainerData = {
  container_id: string;
  container_status: string;
  Borrower_Information: string;
};

// Helper function for badge class
const getStatusBadgeClass = (status: string): string => {
  return status === "返却済み" ? styles.badgeSuccess : styles.badgeDanger;
};

export default function Page({
  params,
}: {
  params: Promise<{ qrcode: string }>;
}) {
  const { qrcode } = use(params);
  const [data, setData] = useState<ContainerData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!qrcode) return;

    async function fetchSchedule() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/container/status?container_id=${qrcode}`
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
      <div className="content-wrapper overflow-x-hidden overflow-y-auto p-1">
        {loading ? (
          <LoadingSpinner />
        ) : (
          data && (
            <>
              <section className={styles.cardHeader}>
                <h1 className={styles.header}>コンテナ情報</h1>
              </section>

              <section className="content">
                <div className={styles.card}>
                  <div className="card-body">
                    <p className={styles.text}>
                      <strong>コンテナ ID:</strong> {data.container_id}
                    </p>
                    <p className={styles.text}>
                      <strong>借用者情報:</strong> {data.Borrower_Information}
                    </p>
                    <span
                      className={getStatusBadgeClass(data.container_status)}
                    >
                      <i
                        className={`${
                          data.container_status === "返却済み"
                            ? "fas fa-check-circle"
                            : "fas fa-times-circle"
                        } ${styles.icon}`}
                      />
                      {data.container_status}
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
