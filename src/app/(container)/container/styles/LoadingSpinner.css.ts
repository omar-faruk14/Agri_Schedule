// styles/LoadingSpinner.css.ts
import { style, keyframes } from '@vanilla-extract/css';

// Keyframes for the pulse animation
const pulse = keyframes({
  '0%': {
    transform: 'scale(1)',
    opacity: '0.6',
  },
  '50%': {
    transform: 'scale(1.3)',
    opacity: '1',
  },
  '100%': {
    transform: 'scale(1)',
    opacity: '0.6',
  },
});

// Styles for the loader container
export const loaderContainer = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f9f9f9', // Light and clean background color
  fontFamily: "'Noto Sans JP', sans-serif", // Elegant Japanese font
});

// Styles for the dot container
export const dotContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  width: '80px', // Slightly larger for more visibility
  marginBottom: '20px',
});

// Styles for the dot
export const dot = style({
  width: '14px',
  height: '14px',
  borderRadius: '50%',
  backgroundColor: '#0078D4', // A cool blue for a clean look
  animation: `${pulse} 1.5s infinite ease-in-out`,
  boxShadow: '0 0 10px rgba(0, 120, 212, 0.3)', // Soft glow around each dot
});

// Animation delay for each dot
export const dotFirst = style({
  animationDelay: '0s',
});

export const dotSecond = style({
  animationDelay: '0.3s',
});

export const dotThird = style({
  animationDelay: '0.6s',
});

// Styles for the loading text
export const loadingText = style({
  fontSize: '20px',
  fontWeight: '600', // Slightly bolder text for clarity
  color: '#333', // A dark gray for readability
  textAlign: 'center',
  marginTop: '10px',
  letterSpacing: '1px', // Elegant spacing between letters
});
