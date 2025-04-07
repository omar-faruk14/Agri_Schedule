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

    // You don't need to concatenate base URL here, as the full URL is passed from frontend
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
      value, // Use the full URL directly here
      qrOptions as QRCode.QRCodeToDataURLOptions
    );

    return NextResponse.json({ qrCode: qrCodeDataUrl, url: value });
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
