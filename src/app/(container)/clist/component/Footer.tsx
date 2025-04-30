import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Footer2({
  companyName = "株式会社ラポーザ",
  year = new Date().getFullYear(),
  language = "ja", // 'ja' or 'en'
}) {
  const copyrightText =
    language === "ja" ? "すべての権利を保有します。" : "All rights reserved.";

  return (
    <footer className="main-footer">
      <div className="float-right d-none d-sm-inline">{companyName}</div>
      <strong>Copyright © {year}</strong> {copyrightText}
    </footer>
  );
}
