"use client";
import Header2 from "@Om/app/(container)/container/component/Header2";
import Sidebar2 from "@Om/app/(container)/container/component/Sidebar2";
import * as styles from "@Om/app/(container)/container/styles/pageh.css";

import { useState } from "react";
const QRCodePage = () => {
  const [value, setValue] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleGenerateQRCode = async () => {
    if (!value) return;
    const response = await fetch(`/api/container/dynamic/${value}`);
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
      <Header2 />
      <Sidebar2 />

      <div className="content-wrapper overflow-x-hidden overflow-y-auto">
        <section className="content-header">
          <div style={{ padding: "20px" }}>
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col">
                  <h2 className={`${styles.h2_map}`}>QR Code Generator</h2>
                </div>
              </div>
            </div>
            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              placeholder="Enter value"
              style={{ padding: "8px", marginBottom: "10px" }}
            />
            <button
              onClick={handleGenerateQRCode}
              style={{ padding: "8px 12px", marginRight: "10px" }}
            >
              Generate QR Code
            </button>
            {qrCodeDataUrl && (
              <div>
                <img src={qrCodeDataUrl} alt="Generated QR Code" />
                <button
                  onClick={handleDownloadQRCode}
                  style={{ padding: "8px 12px", marginTop: "10px" }}
                >
                  Download QR Code
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default QRCodePage;
