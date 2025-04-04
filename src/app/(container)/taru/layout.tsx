import type { Metadata } from "next";
import "./global.css";
import { SidebarProvider } from "./component/SidebarContext";
export const metadata: Metadata = {
  title: "在庫管理",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="" />
        <meta name="description" content="" />
      </head>

      <body className="hold-transition sidebar-mini layout-fixed">
        <SidebarProvider>
          <div className="wrapper">{children}</div>
        </SidebarProvider>
   
      </body>
    </html>
  );
}
