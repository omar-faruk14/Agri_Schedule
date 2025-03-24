import { style, styleVariants, globalStyle } from "@vanilla-extract/css";

// Colors & Theme
const colors = {
  background: "#f3f9f1",
  border: "#c2d6a0",
  titleBg: "linear-gradient(45deg, #4caf50, #2d572c)",
  titleText: "white",
  label: "#3d7a28",
  inputBorder: "#8fbf6d",
  inputFocusBorder: "#4a7729",
  buttonBg: "linear-gradient(135deg, #6CBF3F, #3A7D34)",
  buttonHoverBg: "linear-gradient(135deg, #5AA82D, #2F6928)",
  buttonDisabledBg: "#D4C089",
  buttonDisabledText: "#6E6E6E",
  alertSuccessBg: "#d4edda",
  alertSuccessText: "#155724",
  alertErrorBg: "#f8d7da",
  alertErrorText: "#842029",
};

// Container
export const container = style({
  maxWidth: "650px",
  margin: "30px auto",
  padding: "25px",
  backgroundColor: colors.background,
  borderRadius: "12px",
  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.15)",
  border: `1px solid ${colors.border}`,
});

// Title
export const title = style({
  textAlign: "center",
  fontSize: "28px",
  fontWeight: "bold",
  color: colors.titleText,
  marginBottom: "20px",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  padding: "12px 24px",
  background: colors.titleBg,
  borderRadius: "10px",
  boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
});

// Form Group
export const formGroup = style({
  marginBottom: "18px",
  display: "flex",
  flexDirection: "column",
});

// Label
export const label = style({
  fontWeight: "bold",
  color: colors.label,
  marginBottom: "6px",
  fontSize: "16px",
});

// Input Fields
export const input = style({
  width: "100%",
  maxWidth: "100%",
  padding: "12px",
  border: `1px solid ${colors.inputBorder}`,
  borderRadius: "8px",
  fontSize: "16px",
  backgroundColor: "#ffffff",
  transition: "border 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  boxSizing: "border-box",

  ":focus": {
    borderColor: colors.inputFocusBorder,
    outline: "none",
    boxShadow: "0 0 5px rgba(74, 119, 41, 0.5)",
  },
});

// Textarea
export const textarea = style([
  input,
  {
    resize: "vertical",
    minHeight: "100px",
  },
]);

// Button
export const button = style({
  width: "100%",
  padding: "14px 18px",
  background: colors.buttonBg,
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease-in-out",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",

  ":hover": {
    background: colors.buttonHoverBg,
    transform: "translateY(-2px)",
    boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.15)",
  },

  ":active": {
    transform: "translateY(1px)",
    boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.1)",
  },
});

// Disabled Button
export const buttonDisabled = style({
  background: colors.buttonDisabledBg,
  color: colors.buttonDisabledText,
  cursor: "not-allowed",
});

// Alerts
export const alertVariants = styleVariants({
  success: {
    backgroundColor: colors.alertSuccessBg,
    color: colors.alertSuccessText,
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px",
    border: `1px solid ${colors.alertSuccessBg}`,
  },
  error: {
    backgroundColor: colors.alertErrorBg,
    color: colors.alertErrorText,
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px",
    border: `1px solid ${colors.alertErrorBg}`,
  },
});

// ✅ **RESPONSIVE STYLES**
globalStyle("@media (max-width: 768px)", {
  [`.${container}`]: {
    padding: "15px",
    maxWidth: "90%",
  },
  [`.${title}`]: {
    fontSize: "22px",
    padding: "10px 20px",
  },
  [`.${formGroup} input, .${formGroup} textarea`]: {
    fontSize: "14px",
    padding: "10px",
  },
  [`.${button}`]: {
    fontSize: "14px",
    padding: "10px",
  },
});
