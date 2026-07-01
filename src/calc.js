import { PALETTE } from './theme.js';

// ------------------------------------------------------------
// Calculation helpers
// ------------------------------------------------------------

const ageNumber = { '20s': 25, '30s': 35, '40s': 45 };
const ACTIVITY_FACTOR = 1.55;
const lbToKg = (lb) => lb / 2.20462;
const inToCm = (inches) => inches * 2.54;

const calcBMR = (sex, weightKg, heightCm, ageNum) => {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageNum;
  if (sex === 'male') return base + 5;
  if (sex === 'female') return base - 161;
  return base - 78;
};

const calcBMI = (weightKg, heightCm) => {
  const m = heightCm / 100;
  if (!m) return null;
  const v = weightKg / (m * m);
  let categoryKey = 'bmi_healthy';
  let color = PALETTE.forest;
  if (v < 18.5) { categoryKey = 'bmi_below'; color = PALETTE.sage; }
  else if (v >= 25 && v < 30) { categoryKey = 'bmi_above'; color = PALETTE.rust; }
  else if (v >= 30) { categoryKey = 'bmi_high'; color = PALETTE.rust; }
  return { value: v, categoryKey, color };
};

const calcWeeksToTarget = (currentKg, targetKg, goals) => {
  const diff = Math.abs(currentKg - targetKg);
  if (diff < 0.5) return 0;
  const hasLoss = goals.includes('weight-loss');
  const hasMuscle = goals.includes('muscle');
  let ratePerWeek;
  if (hasLoss && hasMuscle) ratePerWeek = 0.35;
  else if (hasLoss) ratePerWeek = 0.6;
  else if (hasMuscle) ratePerWeek = 0.3;
  else ratePerWeek = 0.4;
  return Math.ceil(diff / ratePerWeek);
};

const fmt = (n) => Math.round(n).toLocaleString();
const ytSearch = (q) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' proper form tutorial')}`;

export { ageNumber, ACTIVITY_FACTOR, lbToKg, inToCm, calcBMR, calcBMI, calcWeeksToTarget, fmt, ytSearch };
