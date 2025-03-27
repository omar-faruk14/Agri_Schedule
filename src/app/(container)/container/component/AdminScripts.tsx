"use client";

import Script from "next/script";

export default function AdminScripts() {
//   useEffect(() => {
//     console.log("AdminLTE scripts loaded on client-side only");
//   }, []);

  return (
    <>
      <Script
        src="/assets/plugins/jquery/jquery.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/assets/plugins/bootstrap/js/bootstrap.bundle.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/dist/js/adminlte.min.js"
        strategy="afterInteractive"
      />
    </>
  );
}
