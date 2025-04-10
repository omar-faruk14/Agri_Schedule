"use client";
import React, { useState, useEffect } from "react";
import Header2 from "@Om/app/(container)/clist/component/Header2";
import Sidebar2 from "@Om/app/(container)/clist/component/Sidebar2";
import LoadingSpinner from "@Om/app/(container)/clist/component/LoadingFile";
import { use } from "react";
import { useRouter } from "next/navigation";
import * as styles from "@Om/app/(container)/taru/qrdisplay/[qrcode]/qr.css";

type ContainerData = {
  container_id: string;
  container_status: string;
  Borrower_Information: string;
  content_type_information: string;
};

const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case "返却済み":
    case "利用可能（洗浄済み）":
      return "badge badge-success";
    case "貸出中":
      return "badge badge-warning";
    case "利用不可（未洗浄）":
      return "badge badge-info";
    case "使用不可":
      return "badge badge-danger";
    default:
      return "badge badge-secondary";
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
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  const handleGenerateQRCode = async () => {
    if (!data?.container_id) return;
    try {
      const response = await fetch(`/api/taru/dynamic/${data.container_id}`);
      const result = await response.json();
      if (result.qrCode) {
        setQrCodeDataUrl(result.qrCode);
      } else {
        alert("QRコードの生成に失敗しました");
      }
    } catch (error) {
      console.error("QRコードの生成エラー:", error);
    }
  };

  useEffect(() => {
    if (!qrcode) return;

    async function fetchSchedule() {
      setLoading(true);
      try {
        const response = await fetch(`/api/taru/status?container_id=${qrcode}`);
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
          <h1 className="mb-4">📦 樽詳細情報</h1>
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
                  <span className="info-box-number">{data.container_id}</span>
                  <span className="float-right mt-2">
                    <span
                      className={getStatusBadgeClass(data.container_status)}
                    >
                      {data.container_status}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {data.content_type_information && (
              <div className="col-md-12">
                <div className="card card-outline card-warning shadow-sm">
                  <div className="card-header">
                    <h3 className="card-title">中身の種類</h3>
                  </div>
                  <div className="card-body">
                    {(data.content_type_information?.split("\n") ?? []).map(
                      (line, index) => (
                        <p key={index} className="mb-1">
                          {line}
                        </p>
                      )
                    )}
                    {!data.content_type_information && <p>N/A</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Borrower Info */}
            <div className="col-md-6">
              <div className="card card-outline card-info shadow-sm">
                <div className="card-header">
                  <h3 className="card-title">借用者情報</h3>
                </div>
                <div className="card-body">
                  {(data.Borrower_Information?.split("\n") ?? []).map(
                    (line, index) => (
                      <p key={index} className="mb-1">
                        {line}
                      </p>
                    )
                  )}
                  {!data.Borrower_Information && <p>N/A</p>}
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
                    onClick={() => router.push(`/taru/updateStatus/${qrcode}`)}
                  >
                    ✏️ ステータスを編集
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleGenerateQRCode}
                  >
                    📷 QRコードを生成
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
                          link.download = `${data.container_id}.png`;
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
