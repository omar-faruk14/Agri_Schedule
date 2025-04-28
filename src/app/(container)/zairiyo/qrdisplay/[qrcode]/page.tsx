"use client";
import React, { useState, useEffect } from "react";
import Header2 from "@Om/app/(container)/clist/component/Header2";
import Sidebar2 from "@Om/app/(container)/clist/component/Sidebar2";
import LoadingSpinner from "@Om/app/(container)/clist/component/LoadingFile";
import { use } from "react";
import * as styles from "./qr.css";

type ZairyoData = {
  Record_number: string;
  ingredients_name: string;
  ingredients_qrCode: string;
  ingredients_Categories: string;
  ingredients_unit: string;
  ingredients_Registered_Date: string;
  ingredients_inside_information: string;
};



export default function Page({
  params,
}: {
  params: Promise<{ qrcode: string }>;
}) {
  const { qrcode } = use(params);
  const [data, setData] = useState<ZairyoData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!qrcode) return;

    async function fetchSchedule() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/zairiyo/status/onevalue?ingredients_qrCode=${qrcode}`
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
                <h1 className={styles.header}>基本情報(QR)</h1>
              </section>

              <section className="content">
                <div className={styles.card}>
                  <div className="card-body">
                    <p className={styles.text}>
                      <strong>樽QRコード:</strong>{" "}
                      <span className={styles.qrcodestyle}>
                        {data.ingredients_qrCode}
                      </span>
                    </p>

                    <p className={styles.text}>
                      <strong>材料名:</strong> {data.ingredients_name}
                    </p>
                    {data.ingredients_Categories && (
                      <p className={styles.text}>
                        <strong>カテゴリ:</strong> {data.ingredients_Categories}
                      </p>
                    )}
                    {data.ingredients_unit && (
                      <p className={styles.text}>
                        <strong>単位:</strong> {data.ingredients_unit}
                      </p>
                    )}
                    {data.ingredients_inside_information && (
                      <p className={styles.text}>
                        <strong>中身の状況:</strong>{" "}
                        {(
                          data.ingredients_inside_information?.split("\n") ?? []
                        ).map((line, index) => (
                          <React.Fragment key={index}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      </p>
                    )}
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
