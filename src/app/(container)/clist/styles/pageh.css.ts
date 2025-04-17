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
  backgroundImage: `url('/img/bg.jpg')`,
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
  backgroundImage: `url('/img/bg.jpg')`,
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
    opacity: 0,
  },
  to: {
    width: "100%",
    opacity: 1,
  },
});

// Hero title with a professional typewriter effect (no cursor)
export const heroTitle = style({
  display: "inline-block",
  overflow: "hidden", // Ensures that text appears as it is typed
  whiteSpace: "nowrap",
  width: "0", // Start with width 0
  opacity: 0, // Start with invisible text
  animation: `${typing} 5s steps(30) 1s forwards`, // Typing animation without cursor
  fontSize: "3rem", // Adjust font size as needed
  fontWeight: "bold",
  color: "#fff", // Text color
  textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)", // Professional text shadow
});
