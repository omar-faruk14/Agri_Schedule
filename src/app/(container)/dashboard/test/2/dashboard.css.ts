import { style, keyframes, globalStyle } from "@vanilla-extract/css";

// --- Animation for hero ---
const typing = keyframes({
  from: { width: "0", opacity: 0 },
  to: { width: "100%", opacity: 1 },
});

// --- Background with darker gradient for better contrast ---
export const customBg = style({
  backgroundImage: `linear-gradient(
    rgba(20, 20, 20, 0.45), 
    rgba(20, 20, 20, 0.45)
  ), url('/img/bg.webp')`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  minHeight: "100vh",
  padding: "2rem",
  color: "#f5f5f5",
  fontFamily: "'Noto Sans JP', 'Inter', sans-serif",
});

// --- Content wrapper with max-width to keep layout tidy ---
export const contentContainer = style({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "2rem 1rem",
});

// --- Glassmorphism card with slight blur ---
export const glassBox = style({
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "18px",
  padding: "20px",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
  color: "#fff",
  transition: "all 0.3s ease",
  selectors: {
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.3)",
    },
  },
});

// ✅ These lines fix the nested tag styling issue:
globalStyle(`${glassBox} h4`, {
  fontSize: "1.2rem",
  fontWeight: "600",
  marginBottom: "0.5rem",
  color: "#ffffff",
});

globalStyle(`${glassBox} p`, {
  fontSize: "0.95rem",
  color: "#dddddd",
});

globalStyle(`${glassBox} .small-box-footer`, {
  marginTop: "1rem",
  fontSize: "0.9rem",
  color: "#ffc107",
  textDecoration: "none",
  fontWeight: 500,
});

// --- Section title ---
export const sectionTitle = style({
  fontSize: "1.8rem",
  fontWeight: 700,
  marginBottom: "1.5rem",
  color: "#ffffff",
});

// --- Hero title ---
export const heroTitle = style({
  display: "inline-block",
  overflow: "hidden",
  whiteSpace: "nowrap",
  width: "0",
  opacity: 0,
  animation: `${typing} 3s steps(40) forwards`,
  fontSize: "2.5rem",
  fontWeight: "bold",
  color: "#ffffff",
  marginBottom: "2rem",
});

// --- Icon style ---
export const iconBox = style({
  fontSize: "2rem",
  color: "#ffd54f",
  marginTop: "12px",
});

// --- Plain Section Background (White Card Area) ---
export const plainSection = style({
  backgroundColor: "#fff",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  marginTop: "2rem",
  color: "#333",
});

