// styles.css.ts
import { style, keyframes } from "@vanilla-extract/css";

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




// Hero section with background
export const heroSection = style({
  backgroundImage: `url('/img/bg.webp')`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  minHeight: "80vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  textAlign: "center",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "3rem",
  textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
  zIndex: 1,
  overflow: "hidden",

  selectors: {
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "100px",
      background: `#f4f6f9`,
      borderTopLeftRadius: "50% 20%",
      borderTopRightRadius: "50% 20%",
      zIndex: -1,
      transform: "translateY(50%)",
    },
  },
});


export const customBg = style({
  backgroundImage: `url('/img/bg.webp')`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  minHeight: "100vh",
  padding: "1rem",
});

// Keyframes for typing effect using vanilla-extract keyframes
const typing = keyframes({
  from: {
    width: "0",
    opacity: 50,
  },
  to: {
    width: "100%",
    opacity: 1,
  },
});

// Hero title with a professional typewriter effect (no cursor)
export const heroTitle = style({
  display: "inline-block",
  overflow: "hidden", 
  whiteSpace: "nowrap",
  width: "0", 
  opacity: 0, 
  animation: `${typing} 5s steps(30) 1s forwards`, 
  fontSize: "3rem", 
  fontWeight: "bold",
  color: "#fff", 
  textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)", 
});



// 🧊 Elegant dark-glass style box
export const glassBox = style({
  background: "rgba(30, 30, 30, 0.6)", 
  backdropFilter: "blur(10px)",       
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)", 
  border: "1px solid rgba(255, 255, 255, 0.1)", 
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  selectors: {
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)", 
    },
  },
  color: "#ffffff", 
});





// 🎨 Icon box inside small-box
export const iconBox = style({
  fontSize: "2rem",
  color: "#007bff", // Bootstrap blue
  marginTop: "12px",
});




export const searchWrapper = style({
  display: "flex",
  justifyContent: "center",
  padding: "1rem 0.5rem",
  backgroundColor: "#f5f7fa",
});



export const searchBox = style({
  display: "flex",
  alignItems: "center",
  flexWrap: "nowrap", // stay in one row
  width: "100%",
  maxWidth: "500px",
  backgroundColor: "#fff",
  borderRadius: "9999px",
  border: "1px solid #e0e0e0",
  padding: "0.25rem 0.5rem",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",

  "@media": {
    "screen and (max-width: 500px)": {
      maxWidth: "100%", // use full width
      padding: "0.25rem 0.5rem",
    },
  },
});

export const searchInput = style({
  flex: 1,
  border: "none",
  fontSize: "0.95rem",
  padding: "0.4rem",
  outline: "none",
  backgroundColor: "transparent",
  minWidth: "0",

  selectors: {
    "&::placeholder": {
      color: "#aaa",
    },
  },
});

export const searchIcon = style({
  fontSize: "1.1rem",
  color: "#888",
  marginRight: "0.5rem",
  flexShrink: 0,
});

export const searchButton = style({
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "9999px",
  padding: "0.35rem 0.75rem",
  fontSize: "0.85rem",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  marginLeft: "0.5rem",
  flexShrink: 0,

  selectors: {
    "&:hover": {
      backgroundColor: "#0056b3",
    },
    "&:disabled": {
      backgroundColor: "#c0c0c0",
      cursor: "not-allowed",
    },
  },
});

export const clearButton = style({
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: "1rem",
  color: "#888",
  marginLeft: "0.25rem",
  marginRight: "0.25rem",
  flexShrink: 0,

  ":hover": {
    color: "#333",
  },
});
