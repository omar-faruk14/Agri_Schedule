// // styles.css.ts
// import { style, keyframes } from "@vanilla-extract/css";

// export const card_primary = style({
//   background: "#ffffff",
//   borderRadius: "12px",
//   boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
//   overflow: "hidden",
//   border: "none",
// });

// export const card_header = style({
//   background: "linear-gradient(90deg, #0066cc, #004080)",
//   color: "white",
//   fontWeight: "bold",
//   fontSize: "1.2rem",
//   padding: "15px",
//   borderRadius: "12px 12px 0 0",
// });

// export const card_title = style({
//   margin: "0",
// });

// // export const h2_map = style({
// //   textAlign: "center",
// //   marginBottom: "30px",
// //   color: "#2c3e50",
// //   fontSize: "28px",
// //   fontWeight: "600",
// //   backgroundColor: "#ecf0f1",
// //   padding: "10px",
// //   borderRadius: "8px",
// // });

// // Hero section with background
// export const heroSection = style({
//   backgroundImage: `url('/img/bg.jpg')`,
//   backgroundSize: "cover",
//   backgroundRepeat: "no-repeat",
//   backgroundPosition: "center",
//   minHeight: "80vh",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   position: "relative",
//   textAlign: "center",
//   color: "#fff",
//   fontWeight: "bold",
//   fontSize: "3rem",
//   textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
//   zIndex: 1,
//   overflow: "hidden",

//   selectors: {
//     "&::after": {
//       content: '""',
//       position: "absolute",
//       bottom: 0,
//       left: 0,
//       width: "100%",
//       height: "100px",
//       background: `#f4f6f9`,
//       borderTopLeftRadius: "50% 20%",
//       borderTopRightRadius: "50% 20%",
//       zIndex: -1,
//       transform: "translateY(50%)",
//     },
//   },
// });

// export const customBg = style({
//   backgroundImage: `url('/img/bg.jpg')`,
//   backgroundSize: "cover",
//   backgroundRepeat: "no-repeat",
//   backgroundPosition: "center center",
//   minHeight: "100vh",
//   padding: "1rem",
// });

// // Keyframes for typing effect using vanilla-extract keyframes
// const typing = keyframes({
//   from: {
//     width: "0",
//     opacity: 0,
//   },
//   to: {
//     width: "100%",
//     opacity: 1,
//   },
// });

// // Hero title with a professional typewriter effect (no cursor)
// export const heroTitle = style({
//   display: "inline-block",
//   overflow: "hidden", // Ensures that text appears as it is typed
//   whiteSpace: "nowrap",
//   width: "0", // Start with width 0
//   opacity: 0, // Start with invisible text
//   animation: `${typing} 5s steps(30) 1s forwards`, // Typing animation without cursor
//   fontSize: "3rem", // Adjust font size as needed
//   fontWeight: "bold",
//   color: "#fff", // Text color
//   textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)", // Professional text shadow
// });



// export const glassContainer = style({
//   background: "rgba(255, 255, 255, 0.15)",
//   backdropFilter: "blur(10px)",
//   WebkitBackdropFilter: "blur(10px)",
//   borderRadius: "20px",
//   padding: "30px",
//   boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
//   color: "#fff",
// });



// export const h2_map = style({
//   color: "#fff",
//   fontWeight: 600,
//   fontSize: "28px",
// });

// export const glassBox = style({
//   background: "rgba(255, 255, 255, 0.25)",
//   borderRadius: "15px",
//   padding: "20px",
//   backdropFilter: "blur(6px)",
//   WebkitBackdropFilter: "blur(6px)",
//   boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
//   color: "#fff",
// });


// dashboard.css.ts
import { style, keyframes } from "@vanilla-extract/css";

// Animated typing effect (optional for headlines)
const typing = keyframes({
  from: { width: "0", opacity: 0 },
  to: { width: "100%", opacity: 1 },
});

// 🌈 Page background with image + soft white gradient
export const customBg = style({
  backgroundColor: "#f5f9ff", // fallback
  backgroundImage: `linear-gradient(
    rgba(255, 255, 255, 0.7), 
    rgba(255, 255, 255, 0.7)
  ), url('/img/bg.webp')`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  minHeight: "100vh",
  padding: "2rem",
  color: "#333",
});


// 🧊 Modern glass-style card
export const glassBox = style({
  background: "rgba(240, 248, 255, 0.85)", // soft bluish white (like AliceBlue)
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 8px 20px rgba(0, 123, 255, 0.1)",
  border: "1px solid rgba(0, 123, 255, 0.2)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  selectors: {
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 12px 28px rgba(0, 123, 255, 0.2)",
    },
  },
  color: "#1e3a5f", // deep blue text for better contrast
});


// 🧢 Section headers (like ダッシュボード)
export const h2_map = style({
  color: "#2c3e50",
  fontWeight: 700,
  fontSize: "28px",
  marginBottom: "1rem",
});

// 🎨 Icon box inside small-box
export const iconBox = style({
  fontSize: "2rem",
  color: "#007bff", // Bootstrap blue
  marginTop: "12px",
});


// 🔤 Optional: Animated hero title
export const heroTitle = style({
  display: "inline-block",
  overflow: "hidden",
  whiteSpace: "nowrap",
  width: "0",
  opacity: 0,
  animation: `${typing} 3s steps(40) forwards`,
  fontSize: "2.5rem",
  fontWeight: "bold",
  color: "#34495e",
});
