import { EX, EX_VIDEOS } from './data/exercises.js';
import { GOALS, SPLITS } from './data/plans.js';
import { t } from './i18n.js';
// ------------------------------------------------------------

function getAllCandidates(movement, equip, age) {
  let candidates = Object.entries(EX).filter(([, e]) =>
    e.movement === movement && e.equip === equip && e.ages.includes(age)
  );
  if (candidates.length === 0) {
    candidates = Object.entries(EX).filter(([, e]) =>
      e.movement === movement && e.equip === equip
    );
  }
  return candidates;
}

// Default rest seconds per slot, modulated by goals
function getRestSeconds(slot, goals) {
  const hasMuscle = goals.includes('muscle');
  const hasLoss = goals.includes('weight-loss');
  const compound = ['squat','hinge','h-push','v-push','h-pull','v-pull'].includes(slot);
  if (slot === 'cardio') return 30;
  if (slot === 'mobility') return 0;
  if (slot === 'core') return 45;
  if (slot === 'leg-acc') return 60;
  if (compound) {
    if (hasMuscle && !hasLoss) return 60;
    if (hasMuscle && hasLoss) return 120;
    if (hasLoss) return 60;
    return 90;
  }
  return 90;
}

// Apply 4-week mesocycle progression to a base scheme.
// w1 = baseline, w2 = +1 rep / +2 min, w3 = +2 reps / +5 min, w4 = deload.
function applyWeekProgression(scheme, weekNum, slot) {
  if (!scheme || weekNum === 1) return scheme;
  const isDeload = weekNum === 4;

  // "X × Y" pattern (rep schemes) — works for "5 × 5", "3 × 12 / leg", etc.
  const repsMatch = scheme.match(/^(\d+)\s*×\s*(\d+)(.*)$/);
  if (repsMatch) {
    const [, sets, reps, tail] = repsMatch;
    const s = parseInt(sets, 10);
    const r = parseInt(reps, 10);
    if (isDeload) return `${Math.max(s - 1, 2)} × ${r}${tail}`;
    return `${s} × ${r + (weekNum - 1)}${tail}`;
  }

  // "Z min ..." / "Z דק׳ ..." pattern (cardio, mobility) and "Z sec" (core hold)
  const timeMatch = scheme.match(/^(\d+)\s*(min|דק׳|sec|שנ׳)(.*)$/);
  if (timeMatch) {
    const [, num, unit, tail] = timeMatch;
    const n = parseInt(num, 10);
    if (isDeload) return `${Math.max(n - (unit === 'sec' || unit === 'שנ׳' ? 10 : 5), 5)} ${unit}${tail}`;
    const bump = (unit === 'sec' || unit === 'שנ׳') ? 5 : 2;
    return `${n + (weekNum - 1) * bump} ${unit}${tail}`;
  }

  return scheme;
}

function getBasePrescription(slot, goals, age, lang) {
  const hasMuscle = goals.includes('muscle');
  const hasLoss = goals.includes('weight-loss');
  const hasFlex = goals.includes('flexibility');
  const hasFit = goals.includes('fitness');
  const he = lang === 'he';

  const min = he ? 'דק\'' : 'min';
  const sec = he ? 'שנ\'' : 'sec';
  const perLeg = he ? '/ רגל' : '/ leg';

  if (slot === 'cardio') {
    if (hasLoss && hasFit) return `25 ${min} HIIT`;
    if (hasLoss) return `20 ${min} HIIT`;
    if (hasFit) return `25 ${min} ${he ? 'זון 2' : 'Zone 2'}`;
    if (hasFlex) return `15 ${min} ${he ? 'קל' : 'easy'}`;
    return `20 ${min} ${he ? 'יציב' : 'steady'}`;
  }
  if (slot === 'mobility') return `10 ${min} ${he ? 'זרימה' : 'flow'}`;
  if (slot === 'core') return age === '40s' ? `3 × 30 ${sec}` : `3 × 45 ${sec}`;

  const compound = ['squat','hinge','h-push','v-push','h-pull','v-pull'].includes(slot);
  if (compound) {
    if (hasMuscle && !hasLoss) {
      if (age === '20s') return '5 × 5';
      if (age === '30s') return '4 × 6';
      return '3 × 8';
    }
    if (hasMuscle && hasLoss) return age === '40s' ? '3 × 8' : '4 × 8';
    if (hasLoss) return age === '40s' ? '3 × 12' : '3 × 10';
    if (hasFlex && !hasMuscle) return `3 × 10 ${he ? 'טמפו' : 'tempo'}`;
    return '3 × 10';
  }
  if (slot === 'leg-acc') {
    if (hasMuscle && !hasLoss) return `3 × 10 ${perLeg}`;
    if (hasLoss) return `3 × 12 ${perLeg}`;
    return `3 × 10 ${perLeg}`;
  }
  return '3 × 10';
}

function getPrescription(slot, goals, age, lang, weekNum = 1) {
  const base = getBasePrescription(slot, goals, age, lang);
  return applyWeekProgression(base, weekNum, slot);
}

// swaps shape: { [`${dayCode}_${slotIdx}_${equip}`]: offset }
function buildWeek(splitId, age, goals, lang, swaps = {}, weekNum = 1) {
  const split = SPLITS[splitId];
  return split.days.map(day => {
    const fillTrack = (equip) => {
      const used = new Set();
      return day.slots.map((slot, slotIdx) => {
        const swapKey = `${day.code}_${slotIdx}_${equip}`;
        const offset = swaps[swapKey] || 0;
        const candidates = getAllCandidates(slot, equip, age);
        if (candidates.length === 0) return null;
        // Try not to pick a duplicate within the same day+track
        let pick = null;
        for (let i = 0; i < candidates.length; i++) {
          const idx = (offset + i) % candidates.length;
          const [id] = candidates[idx];
          if (!used.has(id)) { pick = candidates[idx]; break; }
        }
        if (!pick) pick = candidates[offset % candidates.length];
        const [id, ex] = pick;
        used.add(id);
        return {
          ...ex,
          id,
          video: EX_VIDEOS[id] || null,
          prescription: getPrescription(slot, goals, age, lang, weekNum),
          slot,
          slotIdx,
          equip,
          dayCode: day.code,
          totalAlternatives: candidates.length,
          restSeconds: getRestSeconds(slot, goals),
        };
      }).filter(Boolean);
    };
    return { ...day, gym: fillTrack('gym'), cali: fillTrack('cali') };
  });
}

// ------------------------------------------------------------
// Plan note text
// ------------------------------------------------------------

function getPlanNote(goals, age, splitId, lang) {
  const labels = goals.map(g => t(GOALS.find(x => x.id === g).labelKey, lang)).join(' + ');
  const splitName = SPLITS[splitId].short[lang];
  const ageNote = lang === 'he'
    ? { '20s': 'ההתאוששות לצד שלכם — דחפו עוצמה, שלטו בתרגילי בסיס.',
        '30s': 'עקבו אחר הרמות, תעדפו טכניקה, דה-לוד כל 5–6 שבועות.',
        '40s': 'חימום ארוך יותר, קפדנות בטכניקה, ניידות כל יום.' }[age]
    : { '20s': 'Recovery is on your side — push intensity, master compounds.',
        '30s': 'Track lifts, prioritize technique, deload every 5–6 weeks.',
        '40s': 'Longer warm-ups, ruthless about form, mobility every day.' }[age];
  if (goals.length === 1) {
    return lang === 'he'
      ? `${labels} על מבנה ${splitName}. ${ageNote}`
      : `${labels} on a ${splitName} structure. ${ageNote}`;
  }
  return lang === 'he'
    ? `${labels} — בו זמנית. התוכנית מאזנת בין השניים: מספיק נפח לבנייה, מספיק גירעון (או אחזקה) לראות שינוי. ${ageNote}`
    : `${labels} — running both at once. The plan splits the difference: enough volume to build, enough deficit (or maintenance) to see change. ${ageNote}`;
}

// ------------------------------------------------------------
// Stretch / flexibility data layer
// ------------------------------------------------------------

export { getAllCandidates, getRestSeconds, applyWeekProgression, getBasePrescription, getPrescription, buildWeek, getPlanNote };
