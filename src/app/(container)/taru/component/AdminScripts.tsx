"use client";

import Script from "next/script";

export default function AdminScripts() {
//   useEffect(() => {
//     console.log("AdminLTE scripts loaded on client-side only");
//   }, []);

  return (
    <>
   
      <Script
        src="bootstrap/dist/js/bootstrap.bundle.min.js"
        strategy="afterInteractive"
      />
   
    </>
  );
}
