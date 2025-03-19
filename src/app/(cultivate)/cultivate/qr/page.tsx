// app/page.tsx (or pages/index.tsx depending on your Next.js version)

"use client";

import { useState } from "react";

const QRCodePage = () => {
  const [value, setValue] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleGenerateQRCode = async () => {
    if (!value) return;

    // Make a request to the server to generate the QR code
    const response = await fetch(`/api/qr/${value}`);
    const data = await response.json();

    if (data.qrCode) {
      setQrCodeDataUrl(data.qrCode);
    } else {
      alert("Failed to generate QR Code");
    }
  };

  const handleDownloadQRCode = () => {
    if (!qrCodeDataUrl) return;

    // Create a temporary link element to trigger download
    const link = document.createElement("a");
    link.href = qrCodeDataUrl;
    link.download = `${value}.png`; // Set the file name as the value
    link.click();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>QR Code Generator</h1>
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
  );
};

export default QRCodePage;
