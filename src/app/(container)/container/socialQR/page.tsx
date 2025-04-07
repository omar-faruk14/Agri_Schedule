"use client";
// import Header2 from "@Om/app/(container)/clist/component/Header2";
// import Sidebar2 from "@Om/app/(container)/clist/component/Sidebar2";
import * as styles from "@Om/app/(container)/clist/styles/pageh.css";
// import Footer from "@Om/app/(container)/clist/component/Footer";

import { useState } from "react";
const QRCodePage = () => {
  const [value, setValue] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleGenerateQRCode = async () => {
    if (!value) return;

    const response = await fetch(`/api/social/${encodeURIComponent(value)}`);
    const data = await response.json();

    if (data.qrCode) {
      setQrCodeDataUrl(data.qrCode);
    } else {
      alert("Failed to generate QR Code");
    }
  };


  const handleDownloadQRCode = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement("a");
    link.href = qrCodeDataUrl;
    link.download = `${value}.png`; 
    link.click();
  };

  return (
    <>
   

      <div className="content-wrapper overflow-x-hidden overflow-y-auto">
        <section className="content-header text-center">
          <div style={{ padding: "20px" }}>
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col">
                  <h2 className={`${styles.h2_map}`}>QRコードジェネレーター</h2>
                </div>
              </div>
            </div>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                value={value}
                onChange={handleInputChange}
                placeholder="値を入力してください"
                aria-label="QRコードの値"
              />
              <button
                onClick={handleGenerateQRCode}
                className="btn btn-primary"
              >
                生成
              </button>
            </div>

            {qrCodeDataUrl && (
              <div className="text-center mt-4">
                <img
                  src={qrCodeDataUrl}
                  alt="生成されたQRコード"
                  className="border p-2 rounded"
                />
                <div className="mt-3">
                  <button
                    onClick={handleDownloadQRCode}
                    className="btn btn-success"
                  >
                    ダウンロード
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      
    </>
  );
};

export default QRCodePage;
