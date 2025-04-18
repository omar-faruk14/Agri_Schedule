import { style, globalStyle } from "@vanilla-extract/css";


const colors = {
  primary: "#0056b3",
  success: "#28a745",
  danger: "#dc3545",
  text: "#212529",
  background: "#f8f9fa",
  cardBg: "#ffffff",
  border: "#dee2e6",
  accent: "#ffc107",
  hover: "#e2e6ea",
};


export const card = style({
  backgroundColor: colors.cardBg,
  borderRadius: "12px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
  border: `1px solid ${colors.border}`,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  padding: "20px",
  width: "90%",
  maxWidth: "600px",
  margin: "20px auto",
  textAlign: "center",
  ":hover": {
    transform: "scale(1.02)",
    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
  },
});

globalStyle(`@media (max-width: 768px)`, {
  [`.${card}`]: {
    width: "95%",
    padding: "15px",
  },
});


export const cardHeader = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "24px",
  fontWeight: "700",
  color: "#fff",
  padding: "20px",
  background: "linear-gradient(135deg, #0056b3, #4f7afc)",
  borderRadius: "12px 12px 0 0",
  textTransform: "uppercase",
  letterSpacing: "1.2px",
  width: "90%",
  margin: "0 auto",
});

globalStyle(`@media (max-width: 768px)`, {
  [`.${cardHeader}`]: {
    width: "95%",
    padding: "15px",
  },
});


export const gradientTitle = style({
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#ffffff",
  textAlign: "center",
  padding: "12px 20px",
  borderRadius: "8px",
  background: "linear-gradient(90deg, #0880e8, #8f6cc0, #4f7afc)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  fontFamily: `'Arial', sans-serif`,
  marginBottom: "20px",
  letterSpacing: "0.5px",
  transition: "background 0.3s ease",

  selectors: {
    "&:hover": {
      background: "linear-gradient(90deg, #4f7afc, #8f6cc0, #0880e8)",
    },
  },
});

// Success (返却済み)
export const badgeSuccess = style({
  backgroundColor: colors.success,  // Green from success
  color: "#fff",
  padding: "8px 16px",
  borderRadius: "25px",
  fontSize: "14px",
  fontWeight: "600",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  transition: "background 0.3s ease, transform 0.2s ease",
  ":hover": {
    backgroundColor: "#218838",  // Darker green on hover
    transform: "scale(1.05)",
  },
});

// Warning (貸出中)
export const badgeWarning = style({
  backgroundColor: colors.accent,  // Yellow from accent
  color: "#fff",
  padding: "8px 16px",
  borderRadius: "25px",
  fontSize: "14px",
  fontWeight: "600",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  transition: "background 0.3s ease, transform 0.2s ease",
  ":hover": {
    backgroundColor: "#e0a800",  // Darker yellow on hover
    transform: "scale(1.05)",
  },
});

// Available (利用可能)
export const badgeAvailable = style({
  backgroundColor: colors.primary,  // Blue from primary
  color: "#fff",
  padding: "8px 16px",
  borderRadius: "25px",
  fontSize: "14px",
  fontWeight: "600",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  transition: "background 0.3s ease, transform 0.2s ease",
  ":hover": {
    backgroundColor: "#004085",  // Darker blue on hover
    transform: "scale(1.05)",
  },
});

// Default fallback (for unknown status)
export const badgeDefault = style({
  backgroundColor: colors.border,  // Light gray from border
  color: "#fff",
  padding: "8px 16px",
  borderRadius: "25px",
  fontSize: "14px",
  fontWeight: "600",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  transition: "background 0.3s ease, transform 0.2s ease",
  ":hover": {
    backgroundColor: "#d6d8db",  // Slightly darker gray on hover
    transform: "scale(1.05)",
  },
});

export const badgeDanger = style({
  backgroundColor: colors.border, // Light gray from border
  color: "#ff0000",
  padding: "8px 16px",
  borderRadius: "25px",
  fontSize: "14px",
  fontWeight: "600",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  transition: "background 0.3s ease, transform 0.2s ease",
  ":hover": {
    backgroundColor: "#d6d8db", // Slightly darker gray on hover
    transform: "scale(1.05)",
  },
});


export const qrcodestyle = style({
  backgroundColor: "#e0f7fa", // Light blue highlight color
  padding: "4px 8px",
  borderRadius: "4px",
  fontWeight: "bold",
});

export const icon = style({
  fontSize: "18px",
  marginLeft: "6px",
  transition: "transform 0.3s ease, color 0.3s ease",
  ":hover": {
    transform: "scale(1.3)",
  },
});


export const text = style({
  fontSize: "14px",
  color: colors.text,
  lineHeight: "1.0",
  padding: "6px 0",
});





export const buttonEdit = style({
  backgroundColor: "#007bff", // Blue color
  color: "#fff",
  padding: "8px 16px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  border: "none",
  cursor: "pointer",
  transition: "background 0.3s ease, transform 0.2s ease",
  ":hover": {
    backgroundColor: "#0056b3", // Darker blue
    transform: "scale(1.05)",
  },
});

export const buttonDelete = style({
  backgroundColor: "#dc3545", // Red color
  color: "#fff",
  padding: "8px 16px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  border: "none",
  cursor: "pointer",
  transition: "background 0.3s ease, transform 0.2s ease",
  ":hover": {
    backgroundColor: "#c82333", // Darker red
    transform: "scale(1.05)",
  },
});
