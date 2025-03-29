// styles.css.ts
import { style } from "@vanilla-extract/css";

export const card_primary = style({
  background: "#ffffff", 
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  border: "none",
});

export const card_header = style({
  background: "linear-gradient(90deg, #0066cc, #004080)", 
  color: "white",
  fontWeight: "bold",
  fontSize: "1.2rem",
  padding: "15px",
  borderRadius: "12px 12px 0 0",
});

export const card_title = style({
  margin: "0",
});

export const h2_map = style({
  textAlign: "center",
  marginBottom: "30px",
  color: "#2c3e50",
  fontSize: "28px",
  fontWeight: "600",
  backgroundColor: "#ecf0f1",
  padding: "10px",
  borderRadius: "8px",
});
