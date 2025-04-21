import QRCode from "qrcode";
import { createCanvas, loadImage } from "canvas";

export async function GET(
  request: Request,
  { params }: { params: { QrID: string } }
) {
  try {
    const { QrID } = params;

    if (!QrID) {
      return new Response("QR ID is required", { status: 400 });
    }

    const baseUrl = "https://kanri.nagano-brewery.com/bin/qrdisplay";
    const qrTargetUrl = `${baseUrl}/${encodeURIComponent(QrID)}`;

    // Settings
    const qrSize = 500;
    const logoRatio = 0.2; // 20%
    const logoBackgroundPadding = 4;

    // Generate QR Code as Data URL
    const qrDataUrl = await QRCode.toDataURL(qrTargetUrl, {
      errorCorrectionLevel: "H",
      margin: 1,
      scale: 10,
      color: {
        dark: "#1A1A1A",
        light: "#FFFFFF",
      },
    });

    const canvas = createCanvas(qrSize, qrSize);
    const ctx = canvas.getContext("2d");

    // Load and draw QR code image
    const qrImage = await loadImage(qrDataUrl);
    ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);

    // Load and draw logo
    const logoUrl = `${process.env.NEXT_PUBLIC_BASE_Public_URL}/img/qrLogo.png`;

    try {
      const logoImage = await loadImage(logoUrl);

      const logoSize = qrSize * logoRatio;
      const centerX = qrSize / 2;
      const centerY = qrSize / 2;
      const logoX = centerX - logoSize / 2;
      const logoY = centerY - logoSize / 2;

      // Optional: White circle background for logo
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        logoSize / 2 + logoBackgroundPadding,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.restore();

      // Draw logo image on top
      ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
    } catch (logoError) {
      console.warn("Logo could not be loaded:", logoError);
    }

    const buffer = canvas.toBuffer("image/png");

    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="qr-${QrID}.png"`,
      },
    });
  } catch (error) {
    console.error("QR Generation Error:", error);
    return new Response("Failed to generate QR code", { status: 500 });
  }
}
// import QRCode from "qrcode";
// import { createCanvas, loadImage} from "canvas";

// export async function GET(
//   request: Request,
//   { params }: { params: { QrID: string } }
// ) {
//   try {
//     const { QrID } = params;

//     if (!QrID) {
//       return new Response("QR ID is required", { status: 400 });
//     }

//     const baseUrl = "https://kanri.nagano-brewery.com/bin/qrdisplay";
//     const qrTargetUrl = `${baseUrl}/${encodeURIComponent(QrID)}`;

//     // === Settings ===
//     const qrSize = 500;
//     const labelHeight = 60;
//     const canvasHeight = qrSize + labelHeight;
//     const canvasWidth = qrSize;
//     const logoRatio = 0.2;
//     const logoBackgroundPadding = 4;

//     // === Create canvas with extra space for label ===
//     const canvas = createCanvas(canvasWidth, canvasHeight);
//     const ctx = canvas.getContext("2d");

//     // Background white
//     ctx.fillStyle = "#FFFFFF";
//     ctx.fillRect(0, 0, canvasWidth, canvasHeight);

//     // === Generate QR Code ===
//     const qrDataUrl = await QRCode.toDataURL(qrTargetUrl, {
//       errorCorrectionLevel: "H",
//       margin: 1,
//       scale: 10,
//       color: {
//         dark: "#1A1A1A",
//         light: "#FFFFFF",
//       },
//     });

//     const qrImage = await loadImage(qrDataUrl);
//     ctx.drawImage(qrImage, 0, 0, qrSize, qrSize); // draw QR on top

//     // === Load and draw logo ===
//     const logoUrl = `${process.env.NEXT_PUBLIC_BASE_Public_URL}/img/qrLogo.png`;
//     try {
//       const logoImage = await loadImage(logoUrl);
//       const logoSize = qrSize * logoRatio;
//       const centerX = qrSize / 2;
//       const centerY = qrSize / 2;
//       const logoX = centerX - logoSize / 2;
//       const logoY = centerY - logoSize / 2;

//       // White circle background
//       ctx.save();
//       ctx.beginPath();
//       ctx.arc(
//         centerX,
//         centerY,
//         logoSize / 2 + logoBackgroundPadding,
//         0,
//         Math.PI * 2
//       );
//       ctx.fillStyle = "#FFFFFF";
//       ctx.fill();
//       ctx.restore();

//       ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
//     } catch (logoError) {
//       console.warn("Logo could not be loaded:", logoError);
//     }

//     // === Draw label below QR ===
//     ctx.fillStyle = "#000000";
//     ctx.font = "bold 28px sans-serif";
//     ctx.textAlign = "center";
//     ctx.fillText(QrID, canvasWidth / 2, qrSize + 40); // vertical position adjusted into label area

//     // Return PNG buffer
//     const buffer = canvas.toBuffer("image/png");

//     return new Response(buffer, {
//       headers: {
//         "Content-Type": "image/png",
//         "Content-Disposition": `inline; filename="qr-${QrID}.png"`,
//       },
//     });
//   } catch (error) {
//     console.error("QR Generation Error:", error);
//     return new Response("Failed to generate QR code", { status: 500 });
//   }
// }
