import { AGE_GROUPS, GOALS, SPLITS } from './data/plans.js';
import { t } from './i18n.js';

// ------------------------------------------------------------
// Persistent storage helpers (window.storage)
// ------------------------------------------------------------

const STORAGE_KEY = 'fitlab:plans';

async function loadAllPlans() {
  try {
    if (!window.storage) return [];
    const result = await window.storage.get(STORAGE_KEY);
    if (!result?.value) return [];
    const parsed = JSON.parse(result.value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return []; // not-found throws; treat as empty
  }
}

async function persistAllPlans(plans) {
  try {
    if (!window.storage) return false;
    await window.storage.set(STORAGE_KEY, JSON.stringify(plans));
    return true;
  } catch (e) {
    console.error('Storage save failed:', e);
    return false;
  }
}

const buildAutoName = (age, goals, splitId, lang) => {
  const ageObj = AGE_GROUPS.find(a => a.id === age);
  const ageLabel = ageObj ? t(ageObj.labelKey, lang) : '';
  const goalLabels = goals.map(g => t(GOALS.find(x => x.id === g).labelKey, lang)).join(' + ');
  const splitShort = SPLITS[splitId]?.short[lang] ?? '';
  return [ageLabel, goalLabels, splitShort].filter(Boolean).join(' · ');
};

const formatSavedDate = (ts, lang) => {
  try {
    return new Date(ts).toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US',
      { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return ''; }
};

// Bodyweight log
const BODYWEIGHT_KEY = 'fitlab:bodyweight';

async function loadBodyweightLog() {
  try {
    if (!window.storage) return [];
    const result = await window.storage.get(BODYWEIGHT_KEY);
    if (!result?.value) return [];
    const parsed = JSON.parse(result.value);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

async function persistBodyweightLog(entries) {
  try {
    if (!window.storage) return false;
    await window.storage.set(BODYWEIGHT_KEY, JSON.stringify(entries));
    return true;
  } catch (e) {
    console.error('Bodyweight save failed:', e);
    return false;
  }
}

// 30-day challenge progress: { start: 'YYYY-MM-DD', done: number[] }
const CHALLENGE_KEY = 'fitlab:challenge';

async function loadChallenge() {
  try {
    if (!window.storage) return null;
    const result = await window.storage.get(CHALLENGE_KEY);
    if (!result?.value) return null;
    const parsed = JSON.parse(result.value);
    return parsed && parsed.start ? { start: parsed.start, done: Array.isArray(parsed.done) ? parsed.done : [] } : null;
  } catch { return null; }
}

async function persistChallenge(data) {
  try {
    if (!window.storage) return false;
    await window.storage.set(CHALLENGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Challenge save failed:', e);
    return false;
  }
}

// Day number since the challenge started (1-based, by calendar day; can exceed 30 when finished)
function challengeDayNumber(startISO) {
  const start = new Date(startISO + 'T00:00:00');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today - start) / 86400000) + 1;
}

// Activity log — one entry per (date, kind) marking a completed session. [{date, kind}]
const ACTIVITY_KEY = 'fitlab:activity';
async function loadActivityLog() {
  try {
    if (!window.storage) return [];
    const result = await window.storage.get(ACTIVITY_KEY);
    if (!result?.value) return [];
    const parsed = JSON.parse(result.value);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}
async function persistActivityLog(entries) {
  try {
    if (!window.storage) return false;
    await window.storage.set(ACTIVITY_KEY, JSON.stringify(entries));
    return true;
  } catch (e) { console.error('Activity save failed:', e); return false; }
}

// Performance log — quick-logged results for PRs. [{date, name, value, unit}]
const PERF_KEY = 'fitlab:perflog';
async function loadPerfLog() {
  try {
    if (!window.storage) return [];
    const result = await window.storage.get(PERF_KEY);
    if (!result?.value) return [];
    const parsed = JSON.parse(result.value);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}
async function persistPerfLog(entries) {
  try {
    if (!window.storage) return false;
    await window.storage.set(PERF_KEY, JSON.stringify(entries));
    return true;
  } catch (e) { console.error('Perf save failed:', e); return false; }
}

// Streak: consecutive days (ending today or yesterday) with any activity.
function computeStreak(dates) {
  const set = new Set(dates);
  const dayMs = 86400000;
  const now = new Date();
  let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  // If nothing today, allow the streak to still be "current" through yesterday.
  if (!set.has(iso(cursor))) cursor = new Date(cursor - dayMs);
  let streak = 0;
  while (set.has(iso(cursor))) { streak++; cursor = new Date(cursor - dayMs); }
  return streak;
}

const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export { STORAGE_KEY, loadAllPlans, persistAllPlans, buildAutoName, formatSavedDate, BODYWEIGHT_KEY, loadBodyweightLog, persistBodyweightLog, CHALLENGE_KEY, loadChallenge, persistChallenge, challengeDayNumber, ACTIVITY_KEY, loadActivityLog, persistActivityLog, PERF_KEY, loadPerfLog, persistPerfLog, computeStreak, todayISO };
