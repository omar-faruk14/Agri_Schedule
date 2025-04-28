"use client";
import React, { useState, useEffect } from "react";
import Header2 from "@Om/app/(container)/clist/component/Header2";
import Sidebar2 from "@Om/app/(container)/clist/component/Sidebar2";
import LoadingSpinner from "@Om/app/(container)/clist/component/LoadingFile";
import { use } from "react";
import { useRouter } from "next/navigation";
import * as styles from "@Om/app/(container)/taru/qrdisplay/[qrcode]/qr.css";

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
  const [qrLoading, setQrLoading] = useState<boolean>(false);
  const router = useRouter();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  const handleGenerateQRCode = async (): Promise<void> => {
    if (!data?.ingredients_qrCode) return;
    setQrLoading(true); // Start QR generation loading

    try {
      const response = await fetch(`/api/zairiyo/dynamic/${data.ingredients_qrCode}`);
      const result = await response.json();

      if (result.qrCode) {
        setQrCodeDataUrl(result.qrCode);
      } else {
        alert("QRコードの生成に失敗しました");
      }
    } catch (error) {
      console.error("QRコードの生成エラー:", error);
      alert("QRコードの生成中にエラーが発生しました");
    } finally {
      setQrLoading(false); // End QR generation loading
    }
  };
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
      <div className="content-wrapper p-4">
        <section className="content-header">
          <h1 className="mb-4">
            <i className="fas fa-seedling" style={{ color: "#28a745" }}></i>{" "}
            材料管理
          </h1>
        </section>

        {loading ? (
          <LoadingSpinner />
        ) : data ? (
          <div className="row">
            {/* Container Status */}
            <div className="col-md-12 mb-3">
              <div className="info-box bg-light shadow-sm">
                <span className="info-box-icon">
                  <i className="fas fa-barcode"></i>
                </span>
                <div className="info-box-content">
                  <span className="info-box-text">QR識別番号</span>
                  <span className="info-box-number">
                    {data.ingredients_qrCode}
                  </span>
                  <span className="float-right mt-2">
                    <span>{data.ingredients_name}</span>
                  </span>
                </div>
              </div>
            </div>

            {data.ingredients_inside_information && (
              <div className="col-md-12">
                <div className="card card-outline card-warning shadow-sm">
                  <div className="card-header">
                    <h3 className="card-title">中身の状況</h3>
                  </div>
                  <div className="card-body">
                    {(
                      data.ingredients_inside_information?.split("\n") ?? []
                    ).map((line, index) => (
                      <p key={index} className="mb-1">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Borrower Info */}
            <div className="col-md-6">
              <div className="card card-outline card-info shadow-sm">
                <div className="card-header">
                  <h3 className="card-title">情報</h3>
                </div>
                <div className="card-body">
                  <div className="mb-2">
                    <strong>登録日:</strong>{" "}
                    {new Date(
                      data.ingredients_Registered_Date
                    ).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </div>
                  <div className="mb-2">
                    <strong>カテゴリ:</strong> {data.ingredients_Categories}
                  </div>
                  <div className="mb-2">
                    <strong>単位:</strong> {data.ingredients_unit}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="col-md-6">
              <div className="card card-outline card-primary shadow-sm">
                <div className="card-header">
                  <h3 className="card-title">操作</h3>
                </div>
                <div className="card-body d-flex flex-column gap-2">
                  <button
                    className="btn btn-warning mb-2"
                    onClick={() =>
                      router.push(`/zairiyo/updateStatus/${qrcode}`)
                    }
                  >
                    ✏️ ステータスを編集
                  </button>
                  <button
                    className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                    onClick={handleGenerateQRCode}
                    disabled={qrLoading}
                  >
                    {qrLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <span>生成中...</span>
                      </>
                    ) : (
                      "📷 QRコードを生成"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* QR Display */}
            {qrCodeDataUrl && (
              <div className="col-md-12">
                <div className="card card-outline card-success text-center shadow-sm">
                  <div className="card-header">
                    <h3 className="card-title">QRコード</h3>
                  </div>
                  <div className="card-body">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrCodeDataUrl}
                      alt="QRコード"
                      className={styles.qrImage}
                    />
                    <div className="mt-3">
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = qrCodeDataUrl;
                          link.download = `${data.ingredients_qrCode}.png`;
                          link.click();
                        }}
                      >
                        ⬇️ ダウンロード
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </>
  );
}
