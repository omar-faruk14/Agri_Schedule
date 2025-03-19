import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ value: string }> }
) {
  try {
    const { value } = await params;

    if (!value) {
      return NextResponse.json({ error: "Value is required" }, { status: 400 });
    }

    const baseUrl =
      "https://main.d2hc7hdf8ja5ek.amplifyapp.com/cultivate/shukaku";
    const url = `${baseUrl}/${encodeURIComponent(value)}`;

    const qrOptions = {
      errorCorrectionLevel: "H",
      margin: 2,
      scale: 8,
      color: {
        dark: "#1A1A1A",
        light: "#F7F7F7",
      },
    };

    const qrCodeDataUrl = await QRCode.toDataURL(
      url,
      qrOptions as QRCode.QRCodeToDataURLOptions
    );

    return NextResponse.json({ qrCode: qrCodeDataUrl, url });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json(
      {
        error: "Failed to generate QR Code",
        details: e.message,
      },
      { status: 500 }
    );
  }
}
