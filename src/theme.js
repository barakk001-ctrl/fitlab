import { createContext } from 'react';

// Light/dark palettes. The app reads PALETTE.* at render time (inline styles AND
// SVG attributes), so swapping these values + re-rendering re-themes everything.
// cream = page bg, ink = text/lines (opposites), paper = card bg; they invert
// together so the cream/ink pairing stays coherent in both themes.
const LIGHT = {
  cream: '#F2EBDD', ink: '#1B1B19', rust: '#C25A3F', forest: '#27392B', sage: '#8A9A82', paper: '#FBF7EF',
};
const DARK = {
  cream: '#15140F', ink: '#ECE6D8', rust: '#DA6E50', forest: '#33503A', sage: '#A6B79B', paper: '#211F18',
};
const PALETTE = { ...LIGHT };
function applyTheme(theme) { Object.assign(PALETTE, theme === 'dark' ? DARK : LIGHT); }
function readStoredTheme() {
  try { return window.localStorage.getItem('fitlab:theme') === 'dark' ? 'dark' : 'light'; } catch { return 'light'; }
}
// Apply at module load so the very first paint matches the stored theme.
applyTheme(readStoredTheme());

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export { LIGHT, DARK, PALETTE, applyTheme, readStoredTheme, ThemeContext };
