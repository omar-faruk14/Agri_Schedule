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
  background: "linear-gradient(135deg, #0056b3, #003366)",
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

export const badgeSuccess = style({
  backgroundColor: colors.success,
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
    backgroundColor: "#218838",
    transform: "scale(1.05)",
  },
});

export const badgeDanger = style({
  backgroundColor: colors.danger,
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
    backgroundColor: "#c82333",
    transform: "scale(1.05)",
  },
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
  fontSize: "16px",
  color: colors.text,
  lineHeight: "1.7",
  padding: "10px 0",
});



 export const header = style({
  fontSize: "30px",
  fontWeight: "800",
  color: "#ffffff", 
  marginBottom: "20px",
  textAlign: "center",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
});
