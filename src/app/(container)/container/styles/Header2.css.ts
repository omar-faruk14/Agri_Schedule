import { style } from "@vanilla-extract/css";

export const navbar = style({
  background: "#ffffff",
  backdropFilter: "blur(10px)",
  borderBottom: "2px solid rgba(0, 0, 0, 0.1)",
  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
  padding: "14px 24px",
  transition: "background 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
});

export const navLink = style({
  color: "#333333",
  fontWeight: 500,
  fontSize: "1rem",
  transition: "color 0.3s ease-in-out",
  selectors: {
    "&:hover": {
      color: "#1abc9c",
      textShadow: "0 0 8px rgba(26, 188, 156, 0.7)",
    },
  },
});

export const menuButton = style({
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#333333",
  fontSize: "1.5rem",
  transition: "color 0.3s ease-in-out",
  selectors: {
    "&:hover": {
      color: "#1abc9c",
    },
  },
});

export const fullScreen = style({
  color: "#333333",
  fontSize: "1.3rem",
  transition: "color 0.3s ease-in-out",
  selectors: {
    "&:hover": {
      color: "#1abc9c",
      textShadow: "0 0 8px rgba(26, 188, 156, 0.7)",
    },
  },
});

export const mobileStyles = {
  navbar: style({
    "@media": {
      "screen and (max-width: 768px)": {
        padding: "12px 18px",
      },
    },
  }),

  menuButton: style({
    "@media": {
      "screen and (max-width: 768px)": {
        fontSize: "1.4rem",
      },
    },
  }),

  fullScreen: style({
    "@media": {
      "screen and (max-width: 768px)": {
        fontSize: "1.1rem",
      },
    },
  }),
};
