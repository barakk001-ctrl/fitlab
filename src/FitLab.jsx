import { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft, ArrowRight, Flame, Dumbbell, Activity, Heart, ExternalLink,
  Utensils, Sparkles, Ruler, Scale, Target, User, CalendarDays, Check, RefreshCw, Languages,
  Save, Trash2, X, Bookmark, FolderOpen,
  Shuffle, Printer, Timer, Play, Pause, RotateCcw, SkipForward, TrendingUp, Plus,
  CheckCircle2, Circle, ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, ResponsiveContainer
} from 'recharts';

// ============================================================
// FitLab v6 — completion tracking, exercise swap, week progression,
//              print, rest timer, bodyweight log
// ============================================================

const PALETTE = {
  cream: '#F2EBDD',
  ink: '#1B1B19',
  rust: '#C25A3F',
  forest: '#27392B',
  sage: '#8A9A82',
  paper: '#FBF7EF',
};

// ------------------------------------------------------------
// i18n helpers
// ------------------------------------------------------------

const STRINGS = {
  en: {
    edition: '/ 2026 edition',
    masthead_picker: 'No. 01 — Pick your track',
    masthead_plan: 'No. 02 — Your plan',
    field_guide: 'The Field Guide',
    hero_subtitle: "A program that meets you at your age, your numbers, and your ambition. Pick one or more outcomes, choose how you want your week structured, drop in your stats — get a plan tuned for all of it.",

    section_01: 'Choose your decade',
    section_02: 'Choose your outcomes',
    section_03: 'Choose your week',
    section_04: 'Your numbers',

    goals_pick_up_to: 'Pick up to 3',
    goals_selected: 'selected',
    goals_explainer: 'Combine outcomes for a hybrid plan. Weight Loss + Muscle becomes body recomposition. Muscle + Flexibility tunes for mobility-first strength.',
    splits_explainer: 'How you want training distributed. Full Body is most efficient, A/B/C lets you push hardest with focused sessions.',
    numbers_explainer: 'We use these to compute your daily calorie target, BMI, and a realistic timeline to your goal weight. Nothing is stored.',

    metric: 'Metric',
    imperial: 'Imperial',
    sex_label: 'Sex (for calorie math)',
    sex_female: 'Female',
    sex_male: 'Male',
    sex_neutral: 'Average',

    field_height: 'Height',
    field_current_weight: 'Current weight',
    field_goal_weight: 'Goal weight',

    cta_generate: 'Generate my plan',
    cta_back: 'Back to picker',
    cta_try_diff: 'Try a different combo',

    step_decade: 'Decade',
    step_goals: 'Goals',
    step_split: 'Split',
    step_numbers: 'Numbers',

    plan_issue: 'Issue 02 / Personalized programming',
    plan_h1_the: 'The',
    plan_h1_plan: 'plan.',
    plan_h1_hybrid: 'hybrid',

    plan_numbers_h2: 'Your numbers, run.',
    training_week_h2: 'The training week',
    training_week_explainer: "Each day shows the gym version (track 01) and the calisthenics version (track 02) — pick the one that matches where you're training.",
    fuel_h2: 'The fuel',

    stat_current_goal: 'Current → Goal',
    stat_bmi: 'Body Mass Index',
    stat_daily_calories: 'Daily calorie target',
    stat_maintenance: 'Maintenance',
    stat_time_to_goal: 'Time to goal',
    stat_sub_kcal_sessions: 'kcal · {n} sessions / week',
    stat_sub_stay: 'Stay where you are',
    stat_sub_weeks: 'weeks @ safe pace',

    bmi_below: 'Below range',
    bmi_healthy: 'Healthy',
    bmi_above: 'Above range',
    bmi_high: 'High',

    track01: 'Track 01 · Gym',
    track02: 'Track 02 · Calisthenics',
    watch_form: 'Watch form',
    tap_form_note: 'Tap any exercise → opens a YouTube tutorial search. Pick a creator you trust.',

    diet_label: 'Diet',
    diet_hybrid_label: 'Hybrid Diet',
    diet_three_rules: 'The three rules',
    diet_eat_h: 'Eat like you mean it.',
    diet_day_label: 'A day on the plate',
    diet_sample: 'Sample',
    diet_day: 'day',
    diet_your_target: 'Your daily target',
    diet_kcal_personal: 'kcal · personalized for your stats',
    tap_meal_note: 'Tap any meal to swap in another option.',

    meal_breakfast: 'Breakfast',
    meal_lunch: 'Lunch',
    meal_snack: 'Snack',
    meal_dinner: 'Dinner',

    footer_tag: 'FitLab · Editorial fitness · 2026',

    age_twenties: 'Twenties',
    age_thirties: 'Thirties',
    age_forties: 'Forties',

    goal_weight_loss: 'Weight Loss',
    goal_muscle: 'Muscle & Strength',
    goal_fitness: 'General Fitness',
    goal_flexibility: 'Flexibility & Mobility',
    goal_weight_loss_desc: 'Burn fat. Reveal a leaner frame.',
    goal_muscle_desc: 'Add lean mass. Build raw power.',
    goal_fitness_desc: 'Endurance. Energy. Athletic baseline.',
    goal_flexibility_desc: 'Move freely. Prevent injury.',

    // Save / saved plans
    save_plan: 'Save plan',
    saved_plans: 'Saved plans',
    saved_plans_explainer: 'Tap to open one again. Plans persist between sessions.',
    save_modal_title: 'Save your plan',
    save_modal_explainer: 'Give it a name so you can find it later.',
    save_field_label: 'Plan name',
    save_btn: 'Save',
    cancel_btn: 'Cancel',
    saving: 'Saving…',
    saved_toast: 'Saved.',
    save_failed: 'Save failed. Try again.',
    delete_plan: 'Delete',
    saved_at: 'Saved {date}',
    confirm_delete: 'Delete this plan?',

    // Week progression
    week_label: 'Week {n}',
    week_deload: 'Deload',
    week_explainer: 'Each week ramps. Week 4 is a planned deload — lighter to recover. Then you start a new cycle.',
    progression: 'Progression',

    // Print / export
    print_plan: 'Print / PDF',

    // Exercise swap + completion
    swap_exercise: 'Swap',
    swap_count: '{n} alternatives',
    mark_complete: 'Mark complete',
    completed: 'Completed',
    day_complete: 'Day complete',
    exercises_done: '{done} / {total} done',
    workouts_this_week: 'Done this week',

    // Rest timer
    rest_timer: 'Rest',
    timer_paused: 'Paused',
    timer_done: 'Time!',
    skip_rest: 'Skip',
    set_duration: 'Set duration',

    // Bodyweight log
    bodyweight_h: 'Bodyweight log',
    bodyweight_explainer: 'Log your weight weekly. Watching the trend matters more than any single number.',
    log_weight: 'Log weight',
    no_entries_yet: 'No entries yet — log your first one to start tracking.',
    log_modal_title: 'Log your weight',
    weight_label: 'Weight',
    date_label: 'Date',
    delete_entry: 'Delete entry',
    progress_to_goal: 'Progress',
    chart_goal: 'Goal',
    chart_current: 'Current',
  },
  he: {
    edition: '/ מהדורת 2026',
    masthead_picker: 'גליון 01 — בחירת מסלול',
    masthead_plan: 'גליון 02 — התוכנית שלך',
    field_guide: 'מדריך השטח',
    hero_subtitle: 'תוכנית שמתאימה לגיל, למספרים ולשאיפות שלך. בחרו מטרה אחת או יותר, החליטו איך לבנות את השבוע, הזינו את הנתונים — וקבלו תוכנית מכוונת לכל זה.',

    section_01: 'בחרו את העשור',
    section_02: 'בחרו את המטרות',
    section_03: 'בחרו את השבוע',
    section_04: 'הנתונים שלכם',

    goals_pick_up_to: 'עד 3 מטרות',
    goals_selected: 'נבחרו',
    goals_explainer: 'שלבו מטרות לתוכנית היברידית. הרזיה + שריר = רי-קומפוזיציה. שריר + גמישות = כוח עם ניידות.',
    splits_explainer: 'איך תרצו לחלק את האימונים. גוף מלא הוא היעיל ביותר, A/B/C מאפשר אימונים ממוקדים ועוצמתיים.',
    numbers_explainer: 'נשתמש בנתונים לחישוב קלוריות יומי, BMI, ולוח זמנים ריאלי למשקל היעד. שום דבר לא נשמר.',

    metric: 'מטרי',
    imperial: 'אימפריאלי',
    sex_label: 'מין (לחישוב קלוריות)',
    sex_female: 'נקבה',
    sex_male: 'זכר',
    sex_neutral: 'ממוצע',

    field_height: 'גובה',
    field_current_weight: 'משקל נוכחי',
    field_goal_weight: 'משקל יעד',

    cta_generate: 'צרו לי תוכנית',
    cta_back: 'חזרה לבחירה',
    cta_try_diff: 'לנסות שילוב אחר',

    step_decade: 'עשור',
    step_goals: 'מטרות',
    step_split: 'חלוקה',
    step_numbers: 'נתונים',

    plan_issue: 'גליון 02 / תוכנית מותאמת אישית',
    plan_h1_the: 'תוכנית',
    plan_h1_plan: '.',
    plan_h1_hybrid: 'היברידית',

    plan_numbers_h2: 'המספרים שלכם, מחושבים.',
    training_week_h2: 'השבוע',
    training_week_explainer: 'כל יום מציג את גרסת חדר הכושר (מסלול 01) ואת גרסת הקליסטניקס (מסלול 02) — בחרו לפי המקום בו אתם מתאמנים.',
    fuel_h2: 'הדלק',

    stat_current_goal: 'נוכחי ← יעד',
    stat_bmi: 'BMI · מסת גוף',
    stat_daily_calories: 'יעד קלוריות יומי',
    stat_maintenance: 'אחזקה',
    stat_time_to_goal: 'זמן ליעד',
    stat_sub_kcal_sessions: 'קק"ל · {n} אימונים בשבוע',
    stat_sub_stay: 'תישארו במקום',
    stat_sub_weeks: 'שבועות בקצב בטוח',

    bmi_below: 'מתחת לטווח',
    bmi_healthy: 'תקין',
    bmi_above: 'מעל הטווח',
    bmi_high: 'גבוה',

    track01: 'מסלול 01 · חדר כושר',
    track02: 'מסלול 02 · קליסטניקס',
    watch_form: 'צפו בטכניקה',
    tap_form_note: 'הקישו על תרגיל ← ייפתח חיפוש מדריכים ביוטיוב. בחרו יוצר שאתם סומכים עליו.',

    diet_label: 'תזונה',
    diet_hybrid_label: 'תזונה היברידית',
    diet_three_rules: 'שלושת הכללים',
    diet_eat_h: 'אכלו ברצינות.',
    diet_day_label: 'יום על הצלחת',
    diet_sample: 'יום',
    diet_day: 'לדוגמה',
    diet_your_target: 'היעד היומי שלכם',
    diet_kcal_personal: 'קק"ל · מותאם לנתונים שלכם',
    tap_meal_note: 'הקישו על ארוחה כדי להחליף לאפשרות אחרת.',

    meal_breakfast: 'ארוחת בוקר',
    meal_lunch: 'ארוחת צהריים',
    meal_snack: 'ארוחת ביניים',
    meal_dinner: 'ארוחת ערב',

    footer_tag: 'FitLab · כושר עריכתי · 2026',

    age_twenties: 'שנות העשרים',
    age_thirties: 'שנות השלושים',
    age_forties: 'שנות הארבעים',

    goal_weight_loss: 'הרזיה',
    goal_muscle: 'שריר וכוח',
    goal_fitness: 'כושר כללי',
    goal_flexibility: 'גמישות וניידות',
    goal_weight_loss_desc: 'לשרוף שומן. לחשוף גוף רזה יותר.',
    goal_muscle_desc: 'להוסיף מסת שריר. לבנות כוח גולמי.',
    goal_fitness_desc: 'סיבולת. אנרגיה. בסיס ספורטיבי.',
    goal_flexibility_desc: 'לזוז בחופשיות. למנוע פציעות.',

    // Save / saved plans
    save_plan: 'שמירת תוכנית',
    saved_plans: 'תוכניות שמורות',
    saved_plans_explainer: 'הקישו על תוכנית כדי לפתוח אותה שוב. התוכניות נשמרות בין סשנים.',
    save_modal_title: 'שמירת התוכנית שלכם',
    save_modal_explainer: 'תנו שם כדי שתוכלו למצוא אותה אחר כך.',
    save_field_label: 'שם התוכנית',
    save_btn: 'שמירה',
    cancel_btn: 'ביטול',
    saving: 'שומר…',
    saved_toast: 'נשמר.',
    save_failed: 'השמירה נכשלה. נסו שוב.',
    delete_plan: 'מחק',
    saved_at: 'נשמר {date}',
    confirm_delete: 'למחוק את התוכנית?',

    // Week progression
    week_label: 'שבוע {n}',
    week_deload: 'דה-לוד',
    week_explainer: 'כל שבוע מתקדם. שבוע 4 הוא דה-לוד מתוכנן — קל יותר להתאוששות. אחרי זה מתחילים מחזור חדש.',
    progression: 'התקדמות',

    // Print / export
    print_plan: 'הדפסה / PDF',

    // Exercise swap + completion
    swap_exercise: 'החלפה',
    swap_count: '{n} חלופות',
    mark_complete: 'סימון כהושלם',
    completed: 'הושלם',
    day_complete: 'יום הושלם',
    exercises_done: '{done} / {total} בוצעו',
    workouts_this_week: 'הושלמו השבוע',

    // Rest timer
    rest_timer: 'מנוחה',
    timer_paused: 'מושהה',
    timer_done: 'זמן!',
    skip_rest: 'דלג',
    set_duration: 'בחירת משך',

    // Bodyweight log
    bodyweight_h: 'יומן משקל',
    bodyweight_explainer: 'תעדו משקל בכל שבוע. המגמה חשובה יותר מכל מספר בודד.',
    log_weight: 'תיעוד משקל',
    no_entries_yet: 'אין רישומים — תעדו את הראשון כדי להתחיל.',
    log_modal_title: 'תיעוד המשקל שלכם',
    weight_label: 'משקל',
    date_label: 'תאריך',
    delete_entry: 'מחיקת רישום',
    progress_to_goal: 'התקדמות',
    chart_goal: 'יעד',
    chart_current: 'נוכחי',
  },
};

const t = (key, lang, params = {}) => {
  let s = STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
  Object.entries(params).forEach(([k, v]) => { s = s.replace(`{${k}}`, v); });
  return s;
};

const isRTL = (lang) => lang === 'he';

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

const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Web Audio beep for the rest timer
function playBeep(durationMs = 200, frequency = 800) {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
    osc.start();
    setTimeout(() => { osc.stop(); ctx.close(); }, durationMs + 50);
  } catch (e) { /* ignore */ }
}

// ------------------------------------------------------------
// Static data — age / goals / splits
// ------------------------------------------------------------

const AGE_GROUPS = [
  {
    id: '20s', digit: '20', range: '20 – 29', labelKey: 'age_twenties',
    tagline: { en: 'Peak adaptation. Recovery is forgiving — push intensity, master compounds, build the foundation everything else stands on.',
               he: 'שיא ההסתגלות. ההתאוששות סלחנית — דחפו בעוצמה, שלטו בתרגילי בסיס, בנו את היסוד שעליו הכל יישען.' },
  },
  {
    id: '30s', digit: '30', range: '30 – 39', labelKey: 'age_thirties',
    tagline: { en: 'Strength still climbs, but recovery sharpens its pencil. Train smart, prioritize technique, protect joints early.',
               he: 'הכוח עוד עולה, אבל ההתאוששות מקפידה יותר. תאמנו חכם, תעדפו טכניקה, שמרו על המפרקים מוקדם.' },
  },
  {
    id: '40s', digit: '40', range: '40 – 50', labelKey: 'age_forties',
    tagline: { en: 'Mobility and intention take the lead. Lift with control, move every day, train to stay athletic for decades.',
               he: 'ניידות וכוונה עומדות בראש. הרימו בשליטה, התנועעו כל יום, התאמנו כדי להישאר ספורטיבים לעשורים.' },
  },
];

const GOALS = [
  { id: 'weight-loss', labelKey: 'goal_weight_loss', descKey: 'goal_weight_loss_desc', icon: Flame },
  { id: 'muscle',      labelKey: 'goal_muscle',      descKey: 'goal_muscle_desc',      icon: Dumbbell },
  { id: 'fitness',     labelKey: 'goal_fitness',     descKey: 'goal_fitness_desc',     icon: Activity },
  { id: 'flexibility', labelKey: 'goal_flexibility', descKey: 'goal_flexibility_desc', icon: Heart },
];

const SPLITS = {
  fullbody: {
    id: 'fullbody',
    label: { en: 'Full Body × 3', he: 'גוף מלא × 3' },
    short: { en: 'Full Body', he: 'גוף מלא' },
    tagline: { en: 'Same goal each session: hit everything. Three days a week.',
               he: 'אותה מטרה בכל אימון: לעבוד על הכל. שלושה ימים בשבוע.' },
    blurb: { en: 'The most efficient way to train if you have less than 4 days a week. Each session covers all major movement patterns with slight rotation.',
             he: 'הדרך היעילה ביותר להתאמן אם יש פחות מ-4 ימים בשבוע. כל אימון מכסה את כל דפוסי התנועה העיקריים עם רוטציה קלה.' },
    days: [
      { code: 'A', name: { en: 'Day A', he: 'יום A' }, focus: { en: 'Squat-dominant', he: 'דומיננטיות סקוואט' }, slots: ['squat','h-push','h-pull','core','cardio'] },
      { code: 'B', name: { en: 'Day B', he: 'יום B' }, focus: { en: 'Hinge-dominant', he: 'דומיננטיות צירים' }, slots: ['hinge','v-push','v-pull','core','mobility'] },
      { code: 'C', name: { en: 'Day C', he: 'יום C' }, focus: { en: 'Mixed full-body', he: 'גוף מלא מעורב' }, slots: ['squat','h-push','v-pull','leg-acc','core'] },
    ],
  },
  ul: {
    id: 'ul',
    label: { en: 'Upper / Lower × 4', he: 'עליון / תחתון × 4' },
    short: { en: 'A / B', he: 'A / B' },
    tagline: { en: 'Two upper days, two lower days. Classic A/B alternation.',
               he: 'שני ימי עליון, שני ימי תחתון. החלפה קלאסית A/B.' },
    blurb: { en: 'Four days per week. Better for adding volume than full body — you train each region twice with focused energy.',
             he: 'ארבעה ימים בשבוע. עדיף להוספת נפח מאשר גוף מלא — מאמנים כל אזור פעמיים באנרגיה ממוקדת.' },
    days: [
      { code: 'A1', name: { en: 'Upper A', he: 'עליון A' }, focus: { en: 'Push emphasis', he: 'דגש דחיפה' }, slots: ['h-push','v-pull','v-push','h-pull','core'] },
      { code: 'B1', name: { en: 'Lower A', he: 'תחתון A' }, focus: { en: 'Squat emphasis', he: 'דגש סקוואט' }, slots: ['squat','hinge','leg-acc','core'] },
      { code: 'A2', name: { en: 'Upper B', he: 'עליון B' }, focus: { en: 'Pull emphasis', he: 'דגש משיכה' }, slots: ['v-pull','h-push','h-pull','v-push','core'] },
      { code: 'B2', name: { en: 'Lower B', he: 'תחתון B' }, focus: { en: 'Hinge emphasis', he: 'דגש צירים' }, slots: ['hinge','squat','leg-acc','cardio'] },
    ],
  },
  ppl: {
    id: 'ppl',
    label: { en: 'Push / Pull / Legs × 3', he: 'דחיפה / משיכה / רגליים × 3' },
    short: { en: 'A / B / C', he: 'A / B / C' },
    tagline: { en: 'Train chest+shoulders+triceps, then back+biceps, then legs.',
               he: 'אימון חזה+כתפיים+טרייספס, אז גב+בייספס, ואז רגליים.' },
    blurb: { en: 'Three days per week (or six for advanced lifters). Each session has tight focus, which makes it satisfying and easy to push hard.',
             he: 'שלושה ימים בשבוע (או שישה למתקדמים). לכל אימון מיקוד הדוק, מה שעושה אותו מספק וקל לדחוף בו חזק.' },
    days: [
      { code: 'A', name: { en: 'Push', he: 'דחיפה' },  focus: { en: 'Chest, shoulders, triceps', he: 'חזה, כתפיים, טרייספס' },         slots: ['h-push','v-push','h-push','core'] },
      { code: 'B', name: { en: 'Pull', he: 'משיכה' },  focus: { en: 'Back, biceps, rear delts', he: 'גב, בייספס, דלתואיד אחורי' },     slots: ['v-pull','h-pull','v-pull','core'] },
      { code: 'C', name: { en: 'Legs', he: 'רגליים' }, focus: { en: 'Quads, hamstrings, glutes, calves', he: 'ארבע ראשי, ירך אחורית, ישבן, שוקיים' }, slots: ['squat','hinge','leg-acc','cardio','core'] },
    ],
  },
};

// ------------------------------------------------------------
// Exercise library — names stay English (universal in gym culture, matches YT)
// ------------------------------------------------------------

const EX = {
  'bb-squat':     { name: 'Barbell Back Squat',  movement: 'squat',  equip: 'gym',  ages: ['20s','30s'],       query: 'barbell back squat' },
  'goblet-squat': { name: 'Goblet Squat',        movement: 'squat',  equip: 'gym',  ages: ['20s','30s','40s'], query: 'goblet squat' },
  'leg-press':    { name: 'Leg Press',           movement: 'squat',  equip: 'gym',  ages: ['30s','40s'],       query: 'leg press machine' },
  'hack-squat':   { name: 'Hack Squat',          movement: 'squat',  equip: 'gym',  ages: ['30s','40s'],       query: 'hack squat machine' },
  'bw-squat':     { name: 'Bodyweight Squat',    movement: 'squat',  equip: 'cali', ages: ['20s','30s','40s'], query: 'bodyweight squat' },
  'jump-squat':   { name: 'Jump Squat',          movement: 'squat',  equip: 'cali', ages: ['20s','30s'],       query: 'jump squat' },
  'pistol-squat': { name: 'Pistol Squat',        movement: 'squat',  equip: 'cali', ages: ['20s','30s'],       query: 'pistol squat' },
  'split-squat':  { name: 'Bulgarian Split Squat', movement: 'squat', equip: 'cali', ages: ['20s','30s','40s'], query: 'bulgarian split squat' },

  'deadlift':     { name: 'Conventional Deadlift', movement: 'hinge', equip: 'gym',  ages: ['20s','30s'],       query: 'conventional deadlift' },
  'rdl':          { name: 'Romanian Deadlift',     movement: 'hinge', equip: 'gym',  ages: ['20s','30s','40s'], query: 'romanian deadlift' },
  'trap-bar-dl':  { name: 'Trap Bar Deadlift',     movement: 'hinge', equip: 'gym',  ages: ['20s','30s','40s'], query: 'trap bar deadlift' },
  'kb-swing':     { name: 'Kettlebell Swing',      movement: 'hinge', equip: 'gym',  ages: ['20s','30s','40s'], query: 'kettlebell swing' },
  'glute-bridge': { name: 'Glute Bridge',          movement: 'hinge', equip: 'cali', ages: ['20s','30s','40s'], query: 'glute bridge' },
  'sl-glute':     { name: 'Single-Leg Glute Bridge', movement: 'hinge', equip: 'cali', ages: ['20s','30s','40s'], query: 'single leg glute bridge' },
  'good-morning': { name: 'Bodyweight Good Morning', movement: 'hinge', equip: 'cali', ages: ['20s','30s','40s'], query: 'bodyweight good morning' },

  'bench':        { name: 'Bench Press',         movement: 'h-push', equip: 'gym',  ages: ['20s','30s','40s'], query: 'bench press' },
  'db-bench':     { name: 'DB Bench Press',      movement: 'h-push', equip: 'gym',  ages: ['20s','30s','40s'], query: 'dumbbell bench press' },
  'incline-db':   { name: 'Incline DB Press',    movement: 'h-push', equip: 'gym',  ages: ['20s','30s','40s'], query: 'incline dumbbell press' },
  'machine-press':{ name: 'Chest Press Machine', movement: 'h-push', equip: 'gym',  ages: ['30s','40s'],       query: 'chest press machine' },
  'push-up':      { name: 'Push-Up',             movement: 'h-push', equip: 'cali', ages: ['20s','30s','40s'], query: 'push up' },
  'decline-pu':   { name: 'Decline Push-Up',     movement: 'h-push', equip: 'cali', ages: ['20s','30s'],       query: 'decline push up' },
  'incline-pu':   { name: 'Incline Push-Up',     movement: 'h-push', equip: 'cali', ages: ['30s','40s'],       query: 'incline push up' },
  'diamond-pu':   { name: 'Diamond Push-Up',     movement: 'h-push', equip: 'cali', ages: ['20s','30s'],       query: 'diamond push up' },

  'ohp':          { name: 'Overhead Press',      movement: 'v-push', equip: 'gym',  ages: ['20s','30s'],       query: 'overhead press barbell' },
  'db-shoulder':  { name: 'DB Shoulder Press',   movement: 'v-push', equip: 'gym',  ages: ['20s','30s','40s'], query: 'dumbbell shoulder press' },
  'machine-shoulder': { name: 'Shoulder Press Machine', movement: 'v-push', equip: 'gym', ages: ['30s','40s'], query: 'shoulder press machine' },
  'pike-pu':      { name: 'Pike Push-Up',        movement: 'v-push', equip: 'cali', ages: ['20s','30s','40s'], query: 'pike push up' },
  'handstand-pu': { name: 'Handstand Push-Up',   movement: 'v-push', equip: 'cali', ages: ['20s'],             query: 'handstand push up' },
  'wall-walks':   { name: 'Wall Walks',          movement: 'v-push', equip: 'cali', ages: ['20s','30s'],       query: 'wall walk exercise' },

  'lat-pulldown': { name: 'Lat Pulldown',        movement: 'v-pull', equip: 'gym',  ages: ['20s','30s','40s'], query: 'lat pulldown' },
  'weighted-pull':{ name: 'Weighted Pull-Up',    movement: 'v-pull', equip: 'gym',  ages: ['20s','30s'],       query: 'weighted pull up' },
  'cable-pullover':{ name: 'Cable Pullover',     movement: 'v-pull', equip: 'gym',  ages: ['20s','30s','40s'], query: 'cable pullover' },
  'pull-up':      { name: 'Pull-Up',             movement: 'v-pull', equip: 'cali', ages: ['20s','30s'],       query: 'pull up' },
  'assisted-pull':{ name: 'Assisted Pull-Up',    movement: 'v-pull', equip: 'cali', ages: ['20s','30s','40s'], query: 'assisted pull up band' },
  'chin-up':      { name: 'Chin-Up',             movement: 'v-pull', equip: 'cali', ages: ['20s','30s'],       query: 'chin up' },

  'bb-row':       { name: 'Barbell Row',         movement: 'h-pull', equip: 'gym',  ages: ['20s','30s'],       query: 'barbell row' },
  'db-row':       { name: 'Single-Arm DB Row',   movement: 'h-pull', equip: 'gym',  ages: ['20s','30s','40s'], query: 'single arm dumbbell row' },
  'cable-row':    { name: 'Seated Cable Row',    movement: 'h-pull', equip: 'gym',  ages: ['20s','30s','40s'], query: 'seated cable row' },
  'chest-row':    { name: 'Chest-Supported Row', movement: 'h-pull', equip: 'gym',  ages: ['20s','30s','40s'], query: 'chest supported row' },
  'inverted-row': { name: 'Inverted Row',        movement: 'h-pull', equip: 'cali', ages: ['20s','30s','40s'], query: 'inverted row' },
  'tabletop-row': { name: 'Tabletop Row',        movement: 'h-pull', equip: 'cali', ages: ['30s','40s'],       query: 'tabletop bodyweight row' },

  'plank':        { name: 'Plank',               movement: 'core',   equip: 'cali', ages: ['20s','30s','40s'], query: 'forearm plank' },
  'side-plank':   { name: 'Side Plank',          movement: 'core',   equip: 'cali', ages: ['20s','30s','40s'], query: 'side plank' },
  'bird-dog':     { name: 'Bird-Dog',            movement: 'core',   equip: 'cali', ages: ['20s','30s','40s'], query: 'bird dog exercise' },
  'dead-bug':     { name: 'Dead Bug',            movement: 'core',   equip: 'cali', ages: ['20s','30s','40s'], query: 'dead bug exercise' },
  'hanging-lr':   { name: 'Hanging Leg Raise',   movement: 'core',   equip: 'gym',  ages: ['20s','30s'],       query: 'hanging leg raise' },
  'hanging-kr':   { name: 'Hanging Knee Raise',  movement: 'core',   equip: 'gym',  ages: ['20s','30s','40s'], query: 'hanging knee raise' },
  'cable-chop':   { name: 'Cable Wood Chop',     movement: 'core',   equip: 'gym',  ages: ['20s','30s','40s'], query: 'cable wood chop' },
  'pallof-press': { name: 'Pallof Press',        movement: 'core',   equip: 'gym',  ages: ['20s','30s','40s'], query: 'pallof press' },

  'burpee':       { name: 'Burpees',             movement: 'cardio', equip: 'cali', ages: ['20s','30s'],       query: 'burpee' },
  'mtn-climber':  { name: 'Mountain Climbers',   movement: 'cardio', equip: 'cali', ages: ['20s','30s','40s'], query: 'mountain climber' },
  'jumping-jack': { name: 'Jumping Jacks',       movement: 'cardio', equip: 'cali', ages: ['20s','30s','40s'], query: 'jumping jacks' },
  'shadow-box':   { name: 'Shadow Boxing',       movement: 'cardio', equip: 'cali', ages: ['20s','30s','40s'], query: 'shadow boxing workout' },
  'hi-knees':     { name: 'High Knees',          movement: 'cardio', equip: 'cali', ages: ['20s','30s'],       query: 'high knees workout' },
  'brisk-walk':   { name: 'Brisk Walk',          movement: 'cardio', equip: 'cali', ages: ['20s','30s','40s'], query: 'brisk walking workout' },
  'treadmill-hiit':{ name: 'Treadmill HIIT',     movement: 'cardio', equip: 'gym',  ages: ['20s','30s'],       query: 'treadmill hiit sprint' },
  'zone2':        { name: 'Zone-2 Cardio',       movement: 'cardio', equip: 'gym',  ages: ['20s','30s','40s'], query: 'zone 2 cardio training' },
  'incline-walk': { name: 'Incline Treadmill Walk', movement: 'cardio', equip: 'gym', ages: ['20s','30s','40s'], query: 'incline treadmill walk' },
  'bike':         { name: 'Stationary Bike',    movement: 'cardio', equip: 'gym',  ages: ['20s','30s','40s'], query: 'stationary bike workout' },
  'rower':        { name: 'Rowing Machine',     movement: 'cardio', equip: 'gym',  ages: ['20s','30s','40s'], query: 'rowing machine technique' },

  'walk-lunge':   { name: 'Walking Lunges',      movement: 'leg-acc', equip: 'cali', ages: ['20s','30s','40s'], query: 'walking lunge' },
  'reverse-lunge':{ name: 'Reverse Lunges',      movement: 'leg-acc', equip: 'cali', ages: ['20s','30s','40s'], query: 'reverse lunge' },
  'step-up':      { name: 'Step-Ups',            movement: 'leg-acc', equip: 'cali', ages: ['20s','30s','40s'], query: 'step up exercise' },
  'cossack':      { name: 'Cossack Squats',      movement: 'leg-acc', equip: 'cali', ages: ['20s','30s','40s'], query: 'cossack squat' },
  'db-lunge':     { name: 'Dumbbell Lunge',      movement: 'leg-acc', equip: 'gym',  ages: ['20s','30s','40s'], query: 'dumbbell walking lunge' },
  'db-step-up':   { name: 'Dumbbell Step-Up',    movement: 'leg-acc', equip: 'gym',  ages: ['20s','30s','40s'], query: 'dumbbell step up' },
  'leg-curl':     { name: 'Leg Curl',            movement: 'leg-acc', equip: 'gym',  ages: ['20s','30s','40s'], query: 'lying leg curl machine' },
  'leg-extension':{ name: 'Leg Extension',       movement: 'leg-acc', equip: 'gym',  ages: ['20s','30s','40s'], query: 'leg extension machine' },

  'yoga':         { name: 'Yoga Flow',           movement: 'mobility', equip: 'cali', ages: ['20s','30s','40s'], query: 'yoga flow' },
  'sun-salutation':{ name: 'Sun Salutation',     movement: 'mobility', equip: 'cali', ages: ['20s','30s','40s'], query: 'sun salutation yoga' },
  'cat-cow':      { name: 'Cat-Cow + Thoracic Mobility', movement: 'mobility', equip: 'cali', ages: ['20s','30s','40s'], query: 'cat cow thoracic mobility' },
  '90-90':        { name: '90/90 Hip Switches',  movement: 'mobility', equip: 'cali', ages: ['20s','30s','40s'], query: '90 90 hip mobility' },
  'foam-roll':    { name: 'Foam Roll Full Body', movement: 'mobility', equip: 'gym',  ages: ['20s','30s','40s'], query: 'foam roll full body' },
  'shoulder-disl':{ name: 'Shoulder Dislocates', movement: 'mobility', equip: 'gym',  ages: ['20s','30s','40s'], query: 'shoulder dislocates band' },
  'banded-stretch':{ name: 'Banded Stretch Circuit', movement: 'mobility', equip: 'gym', ages: ['20s','30s','40s'], query: 'banded stretching routine' },
};

// ------------------------------------------------------------
// Diet templates — each meal is { key, options: { en: [...], he: [...] } }
// ------------------------------------------------------------

const buildMeals = (data) => Object.entries(data).map(([key, options]) => ({ key, options }));

const SINGLE_DIETS = {
  'weight-loss': {
    title: { en: 'Lean Cut Protocol', he: 'פרוטוקול חיתוך רזה' },
    macros: { protein: 40, carbs: 30, fat: 30 },
    calorieAdj: -500,
    principles: {
      en: [
        'Protein at every meal — aim for ~1g per pound of body weight.',
        'Remove liquid calories. Water, black coffee, tea, sparkling water.',
        'Volume over density: leafy greens, berries, lean proteins keep hunger off.',
      ],
      he: [
        'חלבון בכל ארוחה — שאפו ל-2 גרם לכל ק"ג משקל גוף.',
        'בלי קלוריות נוזליות. מים, קפה שחור, תה, סודה.',
        'נפח על פני צפיפות: ירוקים, פירות יער וחלבון רזה משאירים אתכם שובעים.',
      ],
    },
    sampleDay: buildMeals({
      breakfast: { en: ['Greek yogurt, berries, scoop of whey, drizzle of honey',
                        'Egg-white omelet with spinach, tomato, feta + slice of toast',
                        'Overnight oats with chia, almond milk, berries, scoop of whey'],
                   he: ['יוגורט יווני, פירות יער, מנת אבקת חלבון, טפטוף דבש',
                        'חביתת חלבונים עם תרד, עגבניה, פטה + פרוסת טוסט',
                        'שיבולת שועל לילה עם צ\'יה, חלב שקדים, פירות יער ואבקת חלבון'] },
      lunch:     { en: ['Grilled chicken, quinoa, mixed greens, lemon-tahini',
                        'Tuna salad, lettuce wraps, white beans, olives, lemon',
                        'Turkey lettuce cups, brown rice, salsa, avocado (¼)'],
                   he: ['חזה עוף בגריל, קינואה, ירקות עלים, לימון-טחינה',
                        'סלט טונה, עלי חסה, שעועית לבנה, זיתים, לימון',
                        'גלילי חסה עם הודו, אורז חום, סלסה, אבוקדו (¼)'] },
      snack:     { en: ['Apple + 30g almonds',
                        "Cottage cheese + cucumber slices",
                        'Protein shake + small banana'],
                   he: ['תפוח + 30 גרם שקדים',
                        'גבינת קוטג\' + פרוסות מלפפון',
                        'שייק חלבון + בננה קטנה'] },
      dinner:    { en: ['Baked salmon, roasted broccoli, sweet potato (small)',
                        'Chicken breast, ratatouille, side salad',
                        'Lean steak, asparagus, cauliflower mash'],
                   he: ['סלמון בתנור, ברוקולי קלוי, בטטה (קטנה)',
                        'חזה עוף, רטטוי, סלט קטן',
                        'סטייק רזה, אספרגוס, פירה כרובית'] },
    }),
  },
  muscle: {
    title: { en: 'Lean Bulk Protocol', he: 'פרוטוקול עליה רזה' },
    macros: { protein: 30, carbs: 45, fat: 25 },
    calorieAdj: 300,
    principles: {
      en: [
        'Eat in a 250–400 cal surplus. Slow gain beats fast regret.',
        'Carbs around training — fuel the work, replenish glycogen after.',
        '4–5 meals, 30–45g protein each. Creatine 5g daily is well-supported.',
      ],
      he: [
        'אכלו בעודף של 250–400 קלוריות. עליה איטית עדיפה על חרטה מהירה.',
        'פחמימות סביב האימון — תדלוק לפני, מילוי גליקוגן אחרי.',
        '4–5 ארוחות, 30–45 גרם חלבון בכל אחת. קריאטין 5 גרם ביום מומלץ ומגובה במחקרים.',
      ],
    },
    sampleDay: buildMeals({
      breakfast: { en: ['4 eggs, oats with banana + peanut butter, milk',
                        'Greek yogurt parfait with granola, honey, berries, walnuts',
                        '3 eggs + 4 whites, sweet potato hash, avocado toast'],
                   he: ['4 ביצים, שיבולת שועל עם בננה וחמאת בוטנים, חלב',
                        'יוגורט יווני עם גרנולה, דבש, פירות יער ואגוזי מלך',
                        '3 ביצים + 4 חלבונים, בטטה מטוגנת, טוסט אבוקדו'] },
      lunch:     { en: ['Steak, white rice, kimchi, avocado',
                        'Chicken thighs, jasmine rice, roasted veg, tahini',
                        'Beef + bean burrito bowl, rice, salsa, sour cream'],
                   he: ['סטייק, אורז לבן, קימצ\'י, אבוקדו',
                        'שוקיים של עוף, אורז יסמין, ירקות קלויים, טחינה',
                        'קערת בוריטו עם בקר ושעועית, אורז, סלסה, שמנת חמוצה'] },
      snack:     { en: ['Protein shake + bagel before training',
                        'Greek yogurt, granola, honey, banana',
                        'Trail mix + protein bar'],
                   he: ['שייק חלבון + בייגלה לפני אימון',
                        'יוגורט יווני, גרנולה, דבש, בננה',
                        'תערובת אגוזים + חטיף חלבון'] },
      dinner:    { en: ['Chicken thighs, jasmine rice, roasted veg, olive oil',
                        'Beef stir-fry, white rice, broccoli, sesame oil',
                        'Salmon, sweet potato, sautéed greens, butter'],
                   he: ['שוקיים של עוף, אורז יסמין, ירקות קלויים, שמן זית',
                        'בקר מוקפץ, אורז לבן, ברוקולי, שמן שומשום',
                        'סלמון, בטטה, ירקות מוקפצים, חמאה'] },
    }),
  },
  fitness: {
    title: { en: 'Maintenance & Performance', he: 'אחזקה וביצועים' },
    macros: { protein: 30, carbs: 40, fat: 30 },
    calorieAdj: 0,
    principles: {
      en: [
        'Eat the rainbow — fiber, micronutrients, and color across meals.',
        'Whole foods over packaged 80% of the time. Enjoy the other 20%.',
        'Hydrate: bodyweight (lb) ÷ 2 = ounces per day, more on training days.',
      ],
      he: [
        'אכלו את הקשת — סיבים, מינרלים וצבע בכל ארוחה.',
        'מזון מלא על פני מעובד ב-80% מהזמן. תיהנו מה-20% הנותרים.',
        'שתייה: משקל (ק"ג) × 35 = מ"ל ליום, יותר בימי אימון.',
      ],
    },
    sampleDay: buildMeals({
      breakfast: { en: ['Oats, walnuts, blueberries, two boiled eggs',
                        'Avocado toast (sourdough), poached egg, microgreens',
                        'Smoothie: spinach, banana, protein, almond butter, oats'],
                   he: ['שיבולת שועל, אגוזי מלך, אוכמניות, שתי ביצים קשות',
                        'טוסט אבוקדו (מחמצת), ביצה עלומה, נבטים',
                        'שייק: תרד, בננה, חלבון, חמאת שקדים, שיבולת שועל'] },
      lunch:     { en: ['Salmon poke bowl, brown rice, edamame, cucumber',
                        'Quinoa salad with chickpeas, feta, cucumber, olives, herbs',
                        'Whole-grain wrap with hummus, turkey, veg, sprouts'],
                   he: ['קערת פוקה סלמון, אורז חום, אדממה, מלפפון',
                        'סלט קינואה עם חומוס, פטה, מלפפון, זיתים ועשבי תיבול',
                        'לאפה מקמח מלא עם חומוס, הודו, ירקות ונבטים'] },
      snack:     { en: ['Carrots + hummus, handful of trail mix',
                        'Greek yogurt + berries + chia seeds',
                        'Apple + cheese cubes + walnuts'],
                   he: ['גזר + חומוס, חופן תערובת אגוזים',
                        'יוגורט יווני + פירות יער + זרעי צ\'יה',
                        'תפוח + קוביות גבינה + אגוזי מלך'] },
      dinner:    { en: ['Chicken stir-fry, brown rice, broccoli, sesame oil',
                        'Mediterranean fish, couscous, roasted veg',
                        'Tofu curry, brown rice, spinach, naan'],
                   he: ['עוף מוקפץ, אורז חום, ברוקולי, שמן שומשום',
                        'דג ים תיכוני, קוסקוס, ירקות קלויים',
                        'קארי טופו, אורז חום, תרד, נאן'] },
    }),
  },
  flexibility: {
    title: { en: 'Anti-Inflammatory Protocol', he: 'פרוטוקול אנטי-דלקתי' },
    macros: { protein: 30, carbs: 40, fat: 30 },
    calorieAdj: 0,
    principles: {
      en: [
        'Omega-3 daily — fatty fish 2–3x/week or supplement.',
        'Anti-inflammatory base: berries, leafy greens, turmeric, ginger, olive oil.',
        'Limit ultra-processed seed oils and added sugars — they aggravate joints.',
      ],
      he: [
        'אומגה 3 כל יום — דגים שמנים 2–3 פעמים בשבוע או תוסף.',
        'בסיס אנטי-דלקתי: פירות יער, ירוקים, כורכום, זנגביל, שמן זית.',
        'הגבילו שמני זרעים מעובדים וסוכר מוסף — הם מחמירים מפרקים.',
      ],
    },
    sampleDay: buildMeals({
      breakfast: { en: ['Chia pudding with berries, almonds, cinnamon',
                        'Oatmeal with walnuts, berries, ground flax, cinnamon',
                        'Smoothie: turmeric, ginger, mango, spinach, coconut milk'],
                   he: ['פודינג צ\'יה עם פירות יער, שקדים וקינמון',
                        'שיבולת שועל עם אגוזי מלך, פירות יער, פשתן וקינמון',
                        'שייק: כורכום, זנגביל, מנגו, תרד, חלב קוקוס'] },
      lunch:     { en: ['Salmon, kale salad, olive oil, lemon, walnuts',
                        'Sardine + roasted veg salad, lentils, herbs',
                        'Mediterranean grain bowl with hummus, olives, feta'],
                   he: ['סלמון, סלט קייל, שמן זית, לימון, אגוזי מלך',
                        'סלט סרדינים + ירקות קלויים, עדשים, עשבי תיבול',
                        'קערה ים תיכונית עם חומוס, זיתים ופטה'] },
      snack:     { en: ['Turmeric ginger tea + dark chocolate (85%)',
                        'Walnuts + dried tart cherries',
                        'Berries + Greek yogurt + flaxseed'],
                   he: ['תה כורכום-זנגביל + שוקולד מריר (85%)',
                        'אגוזי מלך + דובדבנים מיובשים',
                        'פירות יער + יוגורט יווני + פשתן'] },
      dinner:    { en: ['Lentil + sweet potato curry, spinach, brown rice',
                        'Baked salmon, miso veg, brown rice',
                        'Chickpea + spinach stew, quinoa, lemon'],
                   he: ['קארי עדשים ובטטה, תרד, אורז חום',
                        'סלמון בתנור, ירקות במיסו, אורז חום',
                        'תבשיל חומוס ותרד, קינואה, לימון'] },
    }),
  },
};

const HYBRID_DIETS = {
  'muscle+weight-loss': {
    title: { en: 'Body Recomposition', he: 'רי-קומפוזיציה' },
    macros: { protein: 40, carbs: 35, fat: 25 },
    calorieAdj: -200,
    principles: {
      en: [
        'Stay in a small deficit (~200 kcal). Patience > aggression.',
        'Hit 1g protein per pound — every day, no exceptions.',
        'Lift heavy. The deficit is for fat, not muscle.',
      ],
      he: [
        'הישארו בגירעון קטן (~200 קק"ל). סבלנות > אגרסיביות.',
        '2 גרם חלבון לק"ג — כל יום, בלי יוצא דופן.',
        'הרימו כבד. הגירעון הוא לשומן, לא לשריר.',
      ],
    },
    sampleDay: buildMeals({
      breakfast: { en: ['Greek yogurt, whey scoop, blueberries, hemp seeds',
                        'Egg-white omelet with cottage cheese, spinach, tomato'],
                   he: ['יוגורט יווני, מנת אבקת חלבון, אוכמניות, זרעי קנבוס',
                        'חביתת חלבונים עם קוטג\', תרד ועגבניה'] },
      lunch:     { en: ['Chicken thighs, jasmine rice, kimchi, avocado',
                        'Lean beef, rice, mixed greens, salsa'],
                   he: ['שוקיים של עוף, אורז יסמין, קימצ\'י, אבוקדו',
                        'בקר רזה, אורז, ירקות עלים, סלסה'] },
      snack:     { en: ['Protein shake + banana pre-workout',
                        'Cottage cheese + berries + almonds'],
                   he: ['שייק חלבון + בננה לפני אימון',
                        'גבינת קוטג\' + פירות יער + שקדים'] },
      dinner:    { en: ['Salmon, sweet potato, big green salad, olive oil',
                        'Lean turkey, quinoa, roasted veg, tahini'],
                   he: ['סלמון, בטטה, סלט ירוק גדול, שמן זית',
                        'הודו רזה, קינואה, ירקות קלויים, טחינה'] },
    }),
  },
  'fitness+weight-loss': {
    title: { en: 'Conditioning Cut', he: 'חיתוך מכוון כושר' },
    macros: { protein: 35, carbs: 40, fat: 25 },
    calorieAdj: -350,
    principles: {
      en: [
        'Moderate deficit — enough to lose, not enough to bonk in workouts.',
        'Carbs around your hardest sessions; protein every meal.',
        'Sleep is the secret weapon. Cardio is easier when rested.',
      ],
      he: [
        'גירעון מתון — מספיק לרדת, לא מספיק להתרסק באימון.',
        'פחמימות סביב האימונים הקשים; חלבון בכל ארוחה.',
        'שינה היא הנשק הסודי. אירובי קל יותר כשנחים.',
      ],
    },
    sampleDay: buildMeals({
      breakfast: { en: ['Oats, whey, banana, almond butter',
                        'Egg-white scramble, sourdough, avocado, berries'],
                   he: ['שיבולת שועל, חלבון, בננה, חמאת שקדים',
                        'חלבונים מקושקשים, מחמצת, אבוקדו, פירות יער'] },
      lunch:     { en: ['Chicken wrap, hummus, big salad, apple',
                        'Tuna + mixed grains bowl, veg, lemon dressing'],
                   he: ['לאפה עוף, חומוס, סלט גדול, תפוח',
                        'קערת טונה ודגנים מעורבים, ירקות, לימון'] },
      snack:     { en: ["Cottage cheese + pineapple",
                        'Protein bar + green tea'],
                   he: ['גבינת קוטג\' + אננס',
                        'חטיף חלבון + תה ירוק'] },
      dinner:    { en: ['Turkey chili, brown rice, avocado, hot sauce',
                        'Grilled chicken, sweet potato, green beans'],
                   he: ['צ\'ילי הודו, אורז חום, אבוקדו, רוטב חריף',
                        'עוף בגריל, בטטה, שעועית ירוקה'] },
    }),
  },
  'flexibility+weight-loss': {
    title: { en: 'Mindful Cut', he: 'חיתוך מודע' },
    macros: { protein: 35, carbs: 35, fat: 30 },
    calorieAdj: -400,
    principles: {
      en: [
        'Anti-inflammatory cut — omega-3s and color on every plate.',
        'Eat slowly. Mobility takes time; so does building hunger awareness.',
        'Protein with each meal protects muscle while you lose weight.',
      ],
      he: [
        'חיתוך אנטי-דלקתי — אומגה 3 וצבע בכל צלחת.',
        'אכלו לאט. ניידות לוקחת זמן; כך גם פיתוח מודעות לרעב.',
        'חלבון בכל ארוחה שומר על השריר תוך כדי הרזיה.',
      ],
    },
    sampleDay: buildMeals({
      breakfast: { en: ['Chia pudding, berries, walnuts, scoop of whey',
                        'Smoked salmon, sourdough, avocado, lemon'],
                   he: ['פודינג צ\'יה, פירות יער, אגוזי מלך, אבקת חלבון',
                        'סלמון מעושן, מחמצת, אבוקדו, לימון'] },
      lunch:     { en: ['Salmon, kale, quinoa, olive oil + lemon',
                        'Sardine salad, white beans, olives, herbs'],
                   he: ['סלמון, קייל, קינואה, שמן זית + לימון',
                        'סלט סרדינים, שעועית לבנה, זיתים, עשבי תיבול'] },
      snack:     { en: ['Turmeric tea, almonds, dark chocolate',
                        'Greek yogurt + berries + flaxseed'],
                   he: ['תה כורכום, שקדים, שוקולד מריר',
                        'יוגורט יווני + פירות יער + פשתן'] },
      dinner:    { en: ['Tofu + veg curry, brown rice (small), spinach',
                        'White fish, roasted root veg, herb salsa'],
                   he: ['קארי טופו וירקות, אורז חום (קטן), תרד',
                        'דג לבן, ירקות שורש קלויים, סלסת עשבי תיבול'] },
    }),
  },
  'fitness+muscle': {
    title: { en: 'Athletic Performance', he: 'ביצועים ספורטיביים' },
    macros: { protein: 30, carbs: 45, fat: 25 },
    calorieAdj: 250,
    principles: {
      en: [
        'Slight surplus — enough to build, light enough to keep conditioning sharp.',
        "Carbs fuel speed and recovery; don't fear them on training days.",
        'Hydrate aggressively. Performance drops fast at 2% dehydration.',
      ],
      he: [
        'עודף קל — מספיק לבנות, קל מספיק לשמור על כושר חד.',
        'פחמימות דלק למהירות והתאוששות; אל תפחדו מהן בימי אימון.',
        'שתו הרבה. הביצועים יורדים במהירות בהתייבשות של 2%.',
      ],
    },
    sampleDay: buildMeals({
      breakfast: { en: ['Oats, eggs, berries, peanut butter, milk',
                        'Greek yogurt, granola, honey, banana, walnuts'],
                   he: ['שיבולת שועל, ביצים, פירות יער, חמאת בוטנים, חלב',
                        'יוגורט יווני, גרנולה, דבש, בננה, אגוזי מלך'] },
      lunch:     { en: ['Steak burrito bowl, rice, beans, salsa, avocado',
                        'Chicken pasta, vegetables, parmesan, olive oil'],
                   he: ['קערת בוריטו סטייק, אורז, שעועית, סלסה, אבוקדו',
                        'פסטה עוף, ירקות, פרמזן, שמן זית'] },
      snack:     { en: ['Protein shake + rice cakes pre-workout',
                        'Trail mix + dried fruit + protein bar'],
                   he: ['שייק חלבון + פריכיות אורז לפני אימון',
                        'תערובת אגוזים + פירות יבשים + חטיף חלבון'] },
      dinner:    { en: ['Salmon, sweet potato, asparagus, olive oil',
                        'Beef + rice bowl, kimchi, fried egg, sesame oil'],
                   he: ['סלמון, בטטה, אספרגוס, שמן זית',
                        'קערת בקר ואורז, קימצ\'י, ביצת עין, שמן שומשום'] },
    }),
  },
  'flexibility+muscle': {
    title: { en: 'Mobility-First Strength', he: 'כוח שמתחיל בניידות' },
    macros: { protein: 32, carbs: 40, fat: 28 },
    calorieAdj: 200,
    principles: {
      en: [
        'Slight surplus, anti-inflammatory base. Build strong AND supple tissue.',
        'Collagen + vitamin C help connective tissue. Bone broth or supplement.',
        "Don't skimp on fats — they keep joints lubricated and hormones happy.",
      ],
      he: [
        'עודף קל, בסיס אנטי-דלקתי. בנו רקמה חזקה וגמישה.',
        'קולגן + ויטמין C עוזרים לרקמת החיבור. ציר עצמות או תוסף.',
        'אל תקצצו בשומנים — הם משמנים את המפרקים ושומרים על הורמונים.',
      ],
    },
    sampleDay: buildMeals({
      breakfast: { en: ['Eggs, avocado toast (sourdough), blueberries',
                        'Smoothie: berries, protein, spinach, hemp seeds, almond milk'],
                   he: ['ביצים, טוסט אבוקדו (מחמצת), אוכמניות',
                        'שייק: פירות יער, חלבון, תרד, קנבוס, חלב שקדים'] },
      lunch:     { en: ['Salmon, quinoa, roasted veg, tahini',
                        'Lentil + chicken bowl, herbs, olive oil, lemon'],
                   he: ['סלמון, קינואה, ירקות קלויים, טחינה',
                        'קערת עדשים ועוף, עשבי תיבול, שמן זית, לימון'] },
      snack:     { en: ['Greek yogurt, walnuts, honey',
                        'Bone broth + crackers + cheese'],
                   he: ['יוגורט יווני, אגוזי מלך, דבש',
                        'ציר עצמות + קרקרים + גבינה'] },
      dinner:    { en: ['Lamb, sweet potato, sautéed greens, olive oil',
                        'Salmon, brown rice, miso eggplant, sesame'],
                   he: ['כבש, בטטה, ירקות מוקפצים, שמן זית',
                        'סלמון, אורז חום, חציל במיסו, שומשום'] },
    }),
  },
  'fitness+flexibility': {
    title: { en: 'Active Wellness', he: 'רווחה פעילה' },
    macros: { protein: 30, carbs: 40, fat: 30 },
    calorieAdj: 0,
    principles: {
      en: [
        'Maintain. Eat for energy, recovery, and steady mood.',
        'Plants, fish, whole grains. The Mediterranean blueprint works.',
        'Track water and sleep before tracking calories.',
      ],
      he: [
        'אחזקה. אכלו לאנרגיה, התאוששות ומצב רוח יציב.',
        'צמחים, דגים, דגנים מלאים. התבנית הים תיכונית עובדת.',
        'עקבו אחרי שתייה ושינה לפני שעוקבים אחרי קלוריות.',
      ],
    },
    sampleDay: buildMeals({
      breakfast: { en: ['Yogurt parfait with granola, berries, honey',
                        'Avocado toast, poached egg, microgreens'],
                   he: ['פרפה יוגורט עם גרנולה, פירות יער ודבש',
                        'טוסט אבוקדו, ביצה עלומה, נבטים'] },
      lunch:     { en: ['Mediterranean salad with chickpeas, feta, olive oil',
                        'Salmon poke bowl, brown rice, edamame, cucumber'],
                   he: ['סלט ים תיכוני עם חומוס, פטה, שמן זית',
                        'קערת פוקה סלמון, אורז חום, אדממה, מלפפון'] },
      snack:     { en: ['Hummus, veggies, whole grain crackers',
                        'Greek yogurt, granola, berries'],
                   he: ['חומוס, ירקות, קרקרים מקמח מלא',
                        'יוגורט יווני, גרנולה, פירות יער'] },
      dinner:    { en: ['Grilled fish, farro, roasted veg, lemon',
                        'Chickpea + spinach stew, quinoa, herbs'],
                   he: ['דג בגריל, פארו, ירקות קלויים, לימון',
                        'תבשיל חומוס ותרד, קינואה, עשבי תיבול'] },
    }),
  },
};

const FALLBACK_HYBRID = {
  title: { en: 'Hybrid Plan', he: 'תוכנית היברידית' },
  principles: {
    en: [
      "You've picked multiple goals — your plan splits the difference.",
      'Anchor every meal in protein and color. The rest sorts itself out.',
      "Re-evaluate every 4 weeks. Keep what works, drop what doesn't.",
    ],
    he: [
      'בחרתם כמה מטרות — התוכנית מאזנת ביניהן.',
      'עגנו כל ארוחה בחלבון וצבע. השאר מסתדר לבד.',
      'הערכה מחדש כל 4 שבועות. שמרו על מה שעובד, השליכו את השאר.',
    ],
  },
  sampleDay: buildMeals({
    breakfast: { en: ['Eggs, oats, berries, walnuts',
                      'Greek yogurt, granola, banana, almonds'],
                 he: ['ביצים, שיבולת שועל, פירות יער, אגוזי מלך',
                      'יוגורט יווני, גרנולה, בננה, שקדים'] },
    lunch:     { en: ['Grilled protein, mixed grains, salad, olive oil',
                      'Salmon bowl, brown rice, veg, tahini'],
                 he: ['חלבון בגריל, דגנים מעורבים, סלט, שמן זית',
                      'קערת סלמון, אורז חום, ירקות, טחינה'] },
    snack:     { en: ['Greek yogurt, fruit, nuts',
                      'Cottage cheese + cucumber + crackers'],
                 he: ['יוגורט יווני, פרי, אגוזים',
                      'קוטג\' + מלפפון + קרקרים'] },
    dinner:    { en: ['Fish or lean meat, vegetables, sweet potato',
                      'Tofu or chicken, brown rice, sautéed greens'],
                 he: ['דג או בשר רזה, ירקות, בטטה',
                      'טופו או עוף, אורז חום, ירקות מוקפצים'] },
  }),
};

function getDiet(goals) {
  if (goals.length === 1) return { ...SINGLE_DIETS[goals[0]], hybrid: false };
  const key = [...goals].sort().join('+');
  if (HYBRID_DIETS[key]) return { ...HYBRID_DIETS[key], hybrid: true };
  // fallback: average macros + cal adj from singles, use FALLBACK_HYBRID structure
  const bases = goals.map(g => SINGLE_DIETS[g]);
  const avgMacros = {
    protein: Math.round(bases.reduce((s, d) => s + d.macros.protein, 0) / bases.length),
    carbs: Math.round(bases.reduce((s, d) => s + d.macros.carbs, 0) / bases.length),
    fat: Math.round(bases.reduce((s, d) => s + d.macros.fat, 0) / bases.length),
  };
  const total = avgMacros.protein + avgMacros.carbs + avgMacros.fat;
  Object.keys(avgMacros).forEach(k => avgMacros[k] = Math.round(avgMacros[k] * 100 / total));
  const avgCal = Math.round(bases.reduce((s, d) => s + d.calorieAdj, 0) / bases.length);
  return { ...FALLBACK_HYBRID, macros: avgMacros, calorieAdj: avgCal, hybrid: true };
}

// ------------------------------------------------------------
// Workout generation
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
    if (hasMuscle && !hasLoss) return 180;
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
// Shared UI bits
// ------------------------------------------------------------

function FontStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,400;1,9..144,600&family=Manrope:wght@300;400;500;600;700;800&family=Heebo:wght@300;400;500;600;700;800&family=Noto+Serif+Hebrew:wght@400;600;800&display=swap');

      .f-display { font-family: 'Fraunces', 'Noto Serif Hebrew', Georgia, serif; font-optical-sizing: auto; font-variation-settings: 'opsz' 144; letter-spacing: -0.02em; }
      .f-italic { font-family: 'Fraunces', 'Noto Serif Hebrew', Georgia, serif; font-style: italic; font-variation-settings: 'opsz' 144; letter-spacing: -0.01em; }
      .f-body { font-family: 'Manrope', 'Heebo', system-ui, sans-serif; }
      .f-mono { font-family: 'Manrope', 'Heebo', system-ui, sans-serif; font-feature-settings: 'tnum' 1; letter-spacing: 0.04em; }

      [dir="rtl"] .f-display, [dir="rtl"] .f-italic { font-family: 'Noto Serif Hebrew', 'Fraunces', Georgia, serif; }
      [dir="rtl"] .f-body, [dir="rtl"] .f-mono { font-family: 'Heebo', 'Manrope', system-ui, sans-serif; }

      .grain::before {
        content: '';
        position: absolute; inset: 0;
        background-image: radial-gradient(rgba(27,27,25,0.18) 1px, transparent 1px);
        background-size: 3px 3px;
        opacity: 0.18;
        pointer-events: none;
        mix-blend-mode: multiply;
      }

      .underline-hover { background-image: linear-gradient(currentColor, currentColor); background-size: 0 1px; background-repeat: no-repeat; background-position: 0 100%; transition: background-size .35s ease; }
      .underline-hover:hover { background-size: 100% 1px; }

      .card-tilt { transition: transform .4s cubic-bezier(.2,.8,.2,1), box-shadow .4s ease; }
      .card-tilt:hover { transform: translateY(-4px); }

      @keyframes rise {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .rise { animation: rise .7s cubic-bezier(.2,.8,.2,1) both; }

      @keyframes flash {
        0% { opacity: 0.3; }
        100% { opacity: 1; }
      }
      .meal-flash { animation: flash .35s ease-out; }

      .ticker-line { background: repeating-linear-gradient(90deg, ${PALETTE.ink} 0 6px, transparent 6px 12px); height: 1px; }

      .meal-row { transition: background-color .25s ease; cursor: pointer; }
      .meal-row:hover { background-color: rgba(242,235,221,0.06); }
      .meal-row .swap-icon { opacity: 0.3; transition: opacity .25s ease, transform .35s ease; }
      .meal-row:hover .swap-icon { opacity: 1; transform: rotate(-90deg); }

      .num-input {
        font-family: 'Fraunces', 'Noto Serif Hebrew', Georgia, serif;
        font-variation-settings: 'opsz' 144;
        letter-spacing: -0.03em;
        background: transparent; border: none; outline: none;
        width: 100%; font-weight: 700; line-height: 1;
        color: ${PALETTE.ink};
      }
      .num-input::placeholder { color: ${PALETTE.ink}; opacity: 0.25; }
      .num-input::-webkit-outer-spin-button, .num-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      .num-input[type=number] { -moz-appearance: textfield; }

      .icon-btn {
        display: inline-flex; align-items: center; justify-content: center;
        width: 28px; height: 28px;
        border-radius: 50%;
        border: 1px solid currentColor;
        opacity: 0.55;
        transition: opacity .2s ease, transform .2s ease, background-color .2s ease;
        flex-shrink: 0;
        cursor: pointer;
      }
      .icon-btn:hover { opacity: 1; transform: scale(1.05); }

      .complete-circle {
        display: inline-flex; align-items: center; justify-content: center;
        width: 22px; height: 22px;
        border-radius: 50%;
        border: 1.5px solid currentColor;
        opacity: 0.5;
        transition: opacity .2s ease, background-color .2s ease;
        flex-shrink: 0;
        cursor: pointer;
        background: transparent;
      }
      .complete-circle:hover { opacity: 1; }
      .complete-circle.is-done { opacity: 1; background: ${PALETTE.sage}; border-color: ${PALETTE.sage}; }

      .ex-done .ex-name { text-decoration: line-through; opacity: 0.55; }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      .timer-pulse { animation: pulse 1s ease-in-out infinite; }

      /* Rest timer duration slider */
      .rest-slider {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 4px;
        background: rgba(242,235,221,0.18);
        border-radius: 999px;
        outline: none;
        cursor: pointer;
        margin: 0;
      }
      .rest-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px; height: 18px;
        background: ${PALETTE.sage};
        border: 2px solid ${PALETTE.cream};
        border-radius: 50%;
        cursor: pointer;
        transition: transform .15s ease;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      }
      .rest-slider::-webkit-slider-thumb:hover { transform: scale(1.18); }
      .rest-slider::-moz-range-thumb {
        width: 18px; height: 18px;
        background: ${PALETTE.sage};
        border: 2px solid ${PALETTE.cream};
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      }

      /* Print: clean PDF-ready output */
      @media print {
        @page { margin: 16mm; }
        html, body { background: white !important; }
        body * { box-shadow: none !important; }
        .no-print { display: none !important; }
        .grain::before { display: none !important; }
        .card-tilt { transform: none !important; }
        .rise { animation: none !important; }
        section, header, footer { page-break-inside: avoid; }
        .day-card { page-break-inside: avoid; }
        .ticker-line { background: none !important; border-top: 1px solid #1B1B19; height: 0 !important; }
        a { color: inherit !important; text-decoration: none !important; }
      }
    `}</style>
  );
}

function Pill({ children, color = PALETTE.ink, bg = 'transparent' }) {
  return (
    <span
      className="f-mono inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-widest"
      style={{ color, border: `1px solid ${color}`, background: bg, borderRadius: '999px' }}
    >
      {children}
    </span>
  );
}

function MastHead({ subtitle, lang, setLang }) {
  return (
    <header className="flex items-center justify-between px-6 md:px-12 py-5"
      style={{ borderBottom: `1px solid ${PALETTE.ink}` }}>
      <div className="flex items-center gap-3">
        <div className="f-display text-2xl md:text-3xl font-bold" style={{ color: PALETTE.ink, letterSpacing: '-0.04em' }}>
          Fit<span className="f-italic" style={{ color: PALETTE.rust }}>Lab</span>
        </div>
        <div className="f-mono text-[10px] uppercase tracking-[0.25em] hidden sm:block" style={{ color: PALETTE.ink }}>
          {t('edition', lang)}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="f-mono text-[10px] uppercase tracking-[0.25em] hidden md:block" style={{ color: PALETTE.ink }}>
          {subtitle}
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'he' : 'en')}
          className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1.5 no-print"
          style={{ border: `1px solid ${PALETTE.ink}`, borderRadius: '999px', color: PALETTE.ink }}
        >
          <Languages size={12} strokeWidth={1.8} />
          {lang === 'en' ? 'עברית' : 'English'}
        </button>
      </div>
    </header>
  );
}

// ------------------------------------------------------------
// Numbers section
// ------------------------------------------------------------

function StatField({ label, icon: Icon, suffix, children }) {
  return (
    <div className="p-5 md:p-6 relative"
      style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px', minHeight: '128px' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="f-mono text-[10px] uppercase tracking-[0.25em] flex items-center gap-2" style={{ color: PALETTE.rust }}>
          <Icon size={12} strokeWidth={1.8} /> {label}
        </div>
        <span className="f-mono text-[10px] uppercase tracking-[0.2em]" style={{ opacity: 0.5 }}>{suffix}</span>
      </div>
      <div className="flex items-end gap-2">{children}</div>
    </div>
  );
}

function NumbersSection(props) {
  const {
    lang, units, setUnits, sex, setSex,
    heightCm, setHeightCm, heightFt, setHeightFt, heightIn, setHeightIn,
    weight, setWeight, targetWeight, setTargetWeight,
  } = props;
  const isMetric = units === 'metric';

  return (
    <section className="px-6 md:px-12 pt-12 pb-12">
      <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
        <h2 className="f-display text-3xl md:text-4xl font-bold" style={{ color: PALETTE.ink }}>
          <span className="f-mono text-xs align-middle" style={{ opacity: 0.5, marginInlineEnd: '0.75rem' }}>04 /</span>
          {t('section_04', lang)}
        </h2>
        <div className="inline-flex p-1" style={{ border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
          {['metric', 'imperial'].map((u) => (
            <button key={u} onClick={() => setUnits(u)}
              className="f-mono text-[10px] uppercase tracking-[0.2em] px-3.5 py-1.5"
              style={{
                background: units === u ? PALETTE.ink : 'transparent',
                color: units === u ? PALETTE.cream : PALETTE.ink,
                borderRadius: '999px',
              }}>
              {u === 'metric' ? t('metric', lang) : t('imperial', lang)}
            </button>
          ))}
        </div>
      </div>

      <p className="f-body text-sm max-w-2xl mb-7" style={{ opacity: 0.75 }}>
        {t('numbers_explainer', lang)}
      </p>

      <div className="mb-5 flex items-center flex-wrap gap-3">
        <div className="f-mono text-[10px] uppercase tracking-[0.25em] flex items-center gap-2" style={{ color: PALETTE.rust, marginInlineEnd: '0.5rem' }}>
          <User size={12} strokeWidth={1.8} />
          {t('sex_label', lang)}
        </div>
        <div className="inline-flex p-1" style={{ border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
          {[
            { id: 'female', key: 'sex_female' },
            { id: 'male', key: 'sex_male' },
            { id: 'neutral', key: 'sex_neutral' },
          ].map((s) => (
            <button key={s.id} onClick={() => setSex(s.id)}
              className="f-mono text-[10px] uppercase tracking-[0.2em] px-3.5 py-1.5"
              style={{
                background: sex === s.id ? PALETTE.ink : 'transparent',
                color: sex === s.id ? PALETTE.cream : PALETTE.ink,
                borderRadius: '999px',
              }}>
              {t(s.key, lang)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatField label={t('field_height', lang)} icon={Ruler} suffix={isMetric ? 'cm' : 'ft / in'}>
          {isMetric ? (
            <input type="number" className="num-input" dir="ltr"
              style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
              placeholder="170" min="120" max="230"
              value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
          ) : (
            <div className="flex items-end gap-3 w-full" dir="ltr">
              <input type="number" className="num-input"
                style={{ fontSize: 'clamp(40px, 5vw, 64px)', width: '50%' }}
                placeholder="5" min="3" max="7"
                value={heightFt} onChange={(e) => setHeightFt(e.target.value)} />
              <span className="f-display text-3xl pb-2" style={{ opacity: 0.4 }}>'</span>
              <input type="number" className="num-input"
                style={{ fontSize: 'clamp(40px, 5vw, 64px)', width: '50%' }}
                placeholder="9" min="0" max="11"
                value={heightIn} onChange={(e) => setHeightIn(e.target.value)} />
              <span className="f-display text-3xl pb-2" style={{ opacity: 0.4 }}>"</span>
            </div>
          )}
        </StatField>

        <StatField label={t('field_current_weight', lang)} icon={Scale} suffix={isMetric ? 'kg' : 'lb'}>
          <input type="number" className="num-input" dir="ltr"
            style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
            placeholder={isMetric ? '70' : '154'}
            min={isMetric ? 35 : 77} max={isMetric ? 200 : 440}
            value={weight} onChange={(e) => setWeight(e.target.value)} />
        </StatField>

        <StatField label={t('field_goal_weight', lang)} icon={Target} suffix={isMetric ? 'kg' : 'lb'}>
          <input type="number" className="num-input" dir="ltr"
            style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
            placeholder={isMetric ? '65' : '143'}
            min={isMetric ? 35 : 77} max={isMetric ? 200 : 440}
            value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} />
        </StatField>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// Picker view
// ------------------------------------------------------------

function PickerView(props) {
  const {
    lang,
    age, goals, split,
    onPickAge, onToggleGoal, onPickSplit, onSubmit,
    units, setUnits, sex, setSex,
    heightCm, setHeightCm, heightFt, setHeightFt, heightIn, setHeightIn,
    weight, setWeight, targetWeight, setTargetWeight,
    statsValid, setLang,
    savedPlans, onLoadPlan, onDeletePlan,
  } = props;
  const goalsValid = goals.length >= 1 && goals.length <= 3;
  const ready = age && goalsValid && split && statsValid;

  return (
    <div className="rise">
      <MastHead subtitle={t('masthead_picker', lang)} lang={lang} setLang={setLang} />

      <section className="px-6 md:px-12 pt-12 pb-10 relative">
        <Pill>{t('field_guide', lang)}</Pill>
        <h1 className="f-display mt-6 leading-[0.92]"
          style={{ color: PALETTE.ink, fontSize: 'clamp(42px, 7.5vw, 110px)', fontWeight: 800 }}>
          {lang === 'he' ? (
            <>אימון לעשור<br /><span className="f-italic" style={{ color: PALETTE.rust }}>בו אתם</span> <span className="f-italic" style={{ color: PALETTE.forest }}>באמת</span> נמצאים.</>
          ) : (
            <>Train for the <span className="f-italic" style={{ color: PALETTE.rust }}>decade</span><br />you're <span className="f-italic" style={{ color: PALETTE.forest }}>actually</span> in.</>
          )}
        </h1>
        <p className="f-body mt-8 max-w-xl text-base md:text-lg leading-relaxed" style={{ color: PALETTE.ink, opacity: 0.78 }}>
          {t('hero_subtitle', lang)}
        </p>
      </section>

      <SavedPlansSection
        savedPlans={savedPlans}
        onLoad={onLoadPlan}
        onDelete={onDeletePlan}
        lang={lang}
      />

      <div className="ticker-line mx-6 md:mx-12" />

      {/* 01 — DECADE */}
      <section className="px-6 md:px-12 pt-12 pb-6">
        <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
          <h2 className="f-display text-3xl md:text-4xl font-bold" style={{ color: PALETTE.ink }}>
            <span className="f-mono text-xs align-middle" style={{ opacity: 0.5, marginInlineEnd: '0.75rem' }}>01 /</span>
            {t('section_01', lang)}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {AGE_GROUPS.map((a, i) => {
            const active = age === a.id;
            return (
              <button key={a.id} onClick={() => onPickAge(a.id)}
                className="card-tilt p-6 md:p-7 relative overflow-hidden"
                style={{
                  textAlign: lang === 'he' ? 'right' : 'left',
                  background: active ? PALETTE.ink : PALETTE.paper,
                  color: active ? PALETTE.cream : PALETTE.ink,
                  border: `1px solid ${PALETTE.ink}`, borderRadius: '4px',
                  animationDelay: `${0.1 + i * 0.07}s`,
                }}>
                <div className="flex items-start justify-between" dir="ltr">
                  <span className="f-display font-bold leading-none" style={{ fontSize: 'clamp(80px, 9vw, 140px)', letterSpacing: '-0.05em' }}>
                    {a.digit}
                  </span>
                  <span className="f-mono text-[10px] uppercase tracking-[0.25em] mt-3" style={{ color: active ? PALETTE.cream : PALETTE.rust }}>
                    {a.range}
                  </span>
                </div>
                <div className="mt-4 f-italic text-xl md:text-2xl" style={{ letterSpacing: '-0.01em' }}>
                  {t(a.labelKey, lang)}
                </div>
                <p className="f-body mt-3 text-sm leading-relaxed opacity-85">{a.tagline[lang]}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 02 — GOALS */}
      <section className="px-6 md:px-12 pt-12 pb-6">
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-3">
          <h2 className="f-display text-3xl md:text-4xl font-bold" style={{ color: PALETTE.ink }}>
            <span className="f-mono text-xs align-middle" style={{ opacity: 0.5, marginInlineEnd: '0.75rem' }}>02 /</span>
            {t('section_02', lang)}
          </h2>
          <span className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ opacity: 0.6 }}>
            {t('goals_pick_up_to', lang)} · {goals.length} {t('goals_selected', lang)}
          </span>
        </div>
        <p className="f-body text-sm max-w-2xl mb-6" style={{ opacity: 0.75 }}>
          {t('goals_explainer', lang)}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {GOALS.map((g, i) => {
            const Icon = g.icon;
            const active = goals.includes(g.id);
            const disabled = !active && goals.length >= 3;
            return (
              <button key={g.id} onClick={() => !disabled && onToggleGoal(g.id)} disabled={disabled}
                className="card-tilt p-6 md:p-7 relative"
                style={{
                  textAlign: lang === 'he' ? 'right' : 'left',
                  background: active ? PALETTE.rust : PALETTE.paper,
                  color: active ? PALETTE.cream : PALETTE.ink,
                  border: `1px solid ${PALETTE.ink}`, borderRadius: '4px',
                  animationDelay: `${0.1 + i * 0.07}s`,
                  opacity: disabled ? 0.4 : 1,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                }}>
                <div className="flex items-start justify-between">
                  <Icon size={28} strokeWidth={1.5} />
                  <div className="flex items-center justify-center"
                    style={{
                      width: 26, height: 26, borderRadius: '50%',
                      border: `1px solid ${active ? PALETTE.cream : PALETTE.ink}`,
                      background: active ? PALETTE.cream : 'transparent',
                    }}>
                    {active && <Check size={14} strokeWidth={3} color={PALETTE.rust} />}
                  </div>
                </div>
                <div className="f-display mt-6 font-bold" style={{ fontSize: 'clamp(28px, 3.2vw, 40px)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {t(g.labelKey, lang)}
                </div>
                <p className="f-body mt-3 text-sm opacity-85">{t(g.descKey, lang)}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 03 — SPLIT */}
      <section className="px-6 md:px-12 pt-12 pb-6">
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-3">
          <h2 className="f-display text-3xl md:text-4xl font-bold" style={{ color: PALETTE.ink }}>
            <span className="f-mono text-xs align-middle" style={{ opacity: 0.5, marginInlineEnd: '0.75rem' }}>03 /</span>
            {t('section_03', lang)}
          </h2>
        </div>
        <p className="f-body text-sm max-w-2xl mb-6" style={{ opacity: 0.75 }}>
          {t('splits_explainer', lang)}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Object.values(SPLITS).map((s, i) => {
            const active = split === s.id;
            return (
              <button key={s.id} onClick={() => onPickSplit(s.id)}
                className="card-tilt p-6 md:p-7 relative overflow-hidden"
                style={{
                  textAlign: lang === 'he' ? 'right' : 'left',
                  background: active ? PALETTE.forest : PALETTE.paper,
                  color: active ? PALETTE.cream : PALETTE.ink,
                  border: `1px solid ${PALETTE.ink}`, borderRadius: '4px',
                  animationDelay: `${0.1 + i * 0.07}s`,
                }}>
                <div className="flex items-start justify-between">
                  <CalendarDays size={26} strokeWidth={1.5} />
                  <span className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: active ? PALETTE.sage : PALETTE.rust }}>
                    {s.short[lang]}
                  </span>
                </div>
                <div className="f-display mt-5 font-bold" style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
                  {s.label[lang]}
                </div>
                <p className="f-italic text-base mt-3" style={{ opacity: active ? 0.85 : 0.7 }}>
                  {s.tagline[lang]}
                </p>
                <p className="f-body mt-3 text-xs leading-relaxed opacity-80">
                  {s.blurb[lang]}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.days.map(d => (
                    <span key={d.code} className="f-mono text-[9px] uppercase tracking-widest px-2 py-0.5"
                      style={{ border: `1px solid ${active ? PALETTE.cream : PALETTE.ink}`, opacity: 0.85, borderRadius: '999px' }}>
                      {d.name[lang]}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 04 — NUMBERS */}
      <NumbersSection
        lang={lang}
        units={units} setUnits={setUnits} sex={sex} setSex={setSex}
        heightCm={heightCm} setHeightCm={setHeightCm}
        heightFt={heightFt} setHeightFt={setHeightFt}
        heightIn={heightIn} setHeightIn={setHeightIn}
        weight={weight} setWeight={setWeight}
        targetWeight={targetWeight} setTargetWeight={setTargetWeight}
      />

      {/* CTA */}
      <div className="sticky bottom-0 px-6 md:px-12 py-5 flex items-center justify-between gap-4 flex-wrap"
        style={{ background: PALETTE.cream, borderTop: `1px solid ${PALETTE.ink}` }}>
        <div className="f-mono text-xs uppercase tracking-[0.2em] flex items-center gap-3 flex-wrap" style={{ color: PALETTE.ink }}>
          <span>{age ? '✓' : '○'} {t('step_decade', lang)}</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>{goalsValid ? '✓' : '○'} {t('step_goals', lang)}</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>{split ? '✓' : '○'} {t('step_split', lang)}</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>{statsValid ? '✓' : '○'} {t('step_numbers', lang)}</span>
        </div>
        <button onClick={onSubmit} disabled={!ready}
          className="f-mono uppercase tracking-[0.2em] px-7 py-4 text-xs flex items-center gap-2"
          style={{
            background: ready ? PALETTE.ink : 'transparent',
            color: ready ? PALETTE.cream : PALETTE.ink,
            border: `1px solid ${PALETTE.ink}`,
            cursor: ready ? 'pointer' : 'not-allowed',
            opacity: ready ? 1 : 0.4, borderRadius: '999px',
          }}>
          <Sparkles size={14} strokeWidth={1.5} />
          {t('cta_generate', lang)}
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Plan view
// ------------------------------------------------------------

function ExerciseRow({ idx, ex, accent, dark, lang, isDone, onToggleComplete, onSwap, onStartTimer }) {
  const swapKey = `${ex.dayCode}_${ex.slotIdx}_${ex.equip}`;
  return (
    <div
      className={`flex items-start gap-3 py-3.5 border-b last:border-b-0 ${isDone ? 'ex-done' : ''}`}
      style={{ borderColor: dark ? 'rgba(242,235,221,0.18)' : 'rgba(27,27,25,0.15)' }}
    >
      {/* Completion circle */}
      <button
        onClick={() => onToggleComplete(swapKey)}
        className={`complete-circle mt-1 no-print ${isDone ? 'is-done' : ''}`}
        style={{ color: dark ? PALETTE.sage : PALETTE.rust }}
        aria-label={isDone ? t('completed', lang) : t('mark_complete', lang)}
        title={isDone ? t('completed', lang) : t('mark_complete', lang)}
      >
        {isDone && <Check size={12} strokeWidth={3} color={PALETTE.cream} />}
      </button>

      {/* Index — visible when print, hides completion circle */}
      <div className="f-mono text-[10px] uppercase tracking-[0.2em] pt-1 w-5 shrink-0 hidden print:block" style={{ color: accent }} dir="ltr">
        {String(idx + 1).padStart(2, '0')}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <a href={ytSearch(ex.query)} target="_blank" rel="noopener noreferrer"
            className="f-display font-semibold underline-hover text-base md:text-lg leading-tight ex-name"
            style={{ color: dark ? PALETTE.cream : PALETTE.ink }} dir="ltr">
            {ex.name}
          </a>
          <div className="f-mono text-xs tracking-wider" style={{ opacity: 0.75 }} dir="ltr">
            {ex.prescription}
          </div>
        </div>
        <div className="f-mono text-[10px] uppercase tracking-[0.2em] mt-1 flex items-center gap-3 flex-wrap" style={{ color: accent, opacity: 0.85 }}>
          <a href={ytSearch(ex.query)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 underline-hover">
            {t('watch_form', lang)} <ExternalLink size={11} strokeWidth={2} />
          </a>
          {ex.totalAlternatives > 1 && (
            <button onClick={() => onSwap(swapKey, ex.totalAlternatives)}
              className="no-print flex items-center gap-1.5 underline-hover"
              style={{ color: 'inherit' }}>
              <Shuffle size={11} strokeWidth={2} /> {t('swap_exercise', lang)}
            </button>
          )}
          {ex.restSeconds > 0 && (
            <button onClick={() => onStartTimer(ex)}
              className="no-print flex items-center gap-1.5 underline-hover"
              style={{ color: 'inherit' }}>
              <Timer size={11} strokeWidth={2} /> {ex.restSeconds}s
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DayCard({ day, idx, lang, completions, onToggleComplete, onSwap, onStartTimer }) {
  const dayDoneSet = completions[day.code] || new Set();
  const totalEx = day.gym.length + day.cali.length;
  const doneCount = dayDoneSet.size;
  const allDone = totalEx > 0 && doneCount === totalEx;

  return (
    <div className="rise day-card" style={{ animationDelay: `${0.05 + idx * 0.06}s` }}>
      <div className="p-6 md:p-8" style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px' }}>
        <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-baseline gap-3">
            <span className="f-display font-bold" style={{ fontSize: 'clamp(40px, 5vw, 64px)', color: PALETTE.rust, letterSpacing: '-0.04em', lineHeight: 1 }} dir="ltr">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="f-display font-bold" style={{ fontSize: 'clamp(22px, 2.5vw, 28px)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {day.name[lang]}
              </h3>
              <div className="f-italic text-sm md:text-base mt-1" style={{ opacity: 0.65 }}>
                {day.focus[lang]}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {totalEx > 0 && (
              <Pill color={allDone ? PALETTE.forest : PALETTE.ink}>
                {allDone ? <CheckCircle2 size={11} strokeWidth={2.4} /> : null}
                {allDone ? t('day_complete', lang) : t('exercises_done', lang, { done: doneCount, total: totalEx })}
              </Pill>
            )}
            <Pill color={PALETTE.ink}>{day.code}</Pill>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          {/* Gym */}
          <div className="pt-2" style={{ borderTop: `1px solid ${PALETTE.ink}` }}>
            <div className="flex items-center gap-2 my-3">
              <Dumbbell size={14} strokeWidth={2} color={PALETTE.rust} />
              <div className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: PALETTE.rust }}>
                {t('track01', lang)}
              </div>
            </div>
            <div>
              {day.gym.map((ex, i) => {
                const swapKey = `${ex.dayCode}_${ex.slotIdx}_${ex.equip}`;
                return (
                  <ExerciseRow key={swapKey} idx={i} ex={ex} accent={PALETTE.rust} lang={lang}
                    isDone={dayDoneSet.has(swapKey)}
                    onToggleComplete={(k) => onToggleComplete(day.code, k)}
                    onSwap={onSwap}
                    onStartTimer={onStartTimer}
                  />
                );
              })}
            </div>
          </div>

          {/* Calisthenics */}
          <div className="p-4 md:p-5" style={{ background: PALETTE.forest, color: PALETTE.cream, borderRadius: '3px' }}>
            <div className="flex items-center gap-2 mb-3">
              <Activity size={14} strokeWidth={2} color={PALETTE.sage} />
              <div className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: PALETTE.sage }}>
                {t('track02', lang)}
              </div>
            </div>
            <div>
              {day.cali.map((ex, i) => {
                const swapKey = `${ex.dayCode}_${ex.slotIdx}_${ex.equip}`;
                return (
                  <ExerciseRow key={swapKey} idx={i} ex={ex} accent={PALETTE.sage} dark lang={lang}
                    isDone={dayDoneSet.has(swapKey)}
                    onToggleComplete={(k) => onToggleComplete(day.code, k)}
                    onSwap={onSwap}
                    onStartTimer={onStartTimer}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MacroBar({ macros, lang }) {
  return (
    <div className="mt-4">
      <div className="flex h-3 overflow-hidden" style={{ border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }} dir="ltr">
        <div style={{ width: `${macros.protein}%`, background: PALETTE.rust }} />
        <div style={{ width: `${macros.carbs}%`, background: PALETTE.forest }} />
        <div style={{ width: `${macros.fat}%`, background: PALETTE.sage }} />
      </div>
      <div className="flex justify-between mt-2 f-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: PALETTE.ink }}>
        <span><span style={{ color: PALETTE.rust }}>●</span> {lang === 'he' ? 'חלבון' : 'Protein'} {macros.protein}%</span>
        <span><span style={{ color: PALETTE.forest }}>●</span> {lang === 'he' ? 'פחמ׳' : 'Carbs'} {macros.carbs}%</span>
        <span><span style={{ color: PALETTE.sage }}>●</span> {lang === 'he' ? 'שומן' : 'Fat'} {macros.fat}%</span>
      </div>
    </div>
  );
}

function StatBox({ label, value, sub, accent = PALETTE.ink, dark = false }) {
  return (
    <div className="p-5 md:p-6 flex flex-col justify-between"
      style={{
        background: dark ? PALETTE.ink : PALETTE.paper,
        color: dark ? PALETTE.cream : PALETTE.ink,
        border: `1px solid ${PALETTE.ink}`, borderRadius: '4px', minHeight: '140px',
      }}>
      <div className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: accent }}>
        {label}
      </div>
      <div>
        <div className="f-display font-bold mt-2"
          style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', lineHeight: 1, letterSpacing: '-0.03em' }}>
          {value}
        </div>
        {sub && (
          <div className="f-mono text-[10px] uppercase tracking-[0.2em] mt-2" style={{ opacity: 0.7 }}>{sub}</div>
        )}
      </div>
    </div>
  );
}

function PlanView({
  lang, setLang, age, goals, split, computed, week, diet, weightUnit, onBack, onOpenSave,
  weekNum, setWeekNum,
  completions, onToggleComplete,
  onSwap,
  onPrint,
  bodyweightLog, currentWeightKg, targetKg, units, onOpenWeightLog, onDeleteWeightEntry,
  onStartTimer,
}) {
  const ageObj = AGE_GROUPS.find((a) => a.id === age);
  const splitObj = SPLITS[split];

  const {
    weightDisplay, targetDisplay, deltaDisplay,
    bmi, dailyCals, weeksToGoal, isMaintenance,
  } = computed;

  // Meal regeneration state — index per meal key
  const [mealIdx, setMealIdx] = useState({});
  const [flashKey, setFlashKey] = useState(null);

  useEffect(() => {
    setMealIdx({});
  }, [diet.title.en]);

  const cycleMeal = (mealKey, optionsLen) => {
    setMealIdx(prev => ({ ...prev, [mealKey]: ((prev[mealKey] ?? 0) + 1) % optionsLen }));
    setFlashKey(mealKey);
    setTimeout(() => setFlashKey(null), 350);
  };

  const ArrowBack = isRTL(lang) ? ArrowRight : ArrowLeft;
  const goalLabels = goals.map(g => t(GOALS.find(x => x.id === g).labelKey, lang));
  const headlineGoals = goalLabels.length === 1 ? goalLabels[0] : goalLabels.join(' + ');

  return (
    <div className="rise">
      <MastHead subtitle={t('masthead_plan', lang)} lang={lang} setLang={setLang} />

      <div className="px-6 md:px-12 py-5 flex items-center justify-between gap-4 flex-wrap no-print">
        <div className="flex items-center gap-4 flex-wrap">
          <button onClick={onBack}
            className="f-mono text-xs uppercase tracking-[0.2em] flex items-center gap-2 underline-hover"
            style={{ color: PALETTE.ink }}>
            <ArrowBack size={14} strokeWidth={2} />
            {t('cta_back', lang)}
          </button>
          <button onClick={onOpenSave}
            className="f-mono text-xs uppercase tracking-[0.2em] flex items-center gap-2 px-4 py-2"
            style={{
              background: PALETTE.rust, color: PALETTE.cream,
              border: `1px solid ${PALETTE.ink}`, borderRadius: '999px',
            }}>
            <Bookmark size={12} strokeWidth={2} />
            {t('save_plan', lang)}
          </button>
          <button onClick={onPrint}
            type="button"
            className="f-mono text-xs uppercase tracking-[0.2em] flex items-center gap-2 px-4 py-2"
            style={{
              background: 'transparent', color: PALETTE.ink,
              border: `1px solid ${PALETTE.ink}`, borderRadius: '999px',
              cursor: 'pointer',
            }}>
            <Printer size={12} strokeWidth={2} />
            {t('print_plan', lang)}
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Pill color={PALETTE.rust}>{lang === 'he' ? 'גיל' : 'Age'} · {ageObj.range}</Pill>
          {goals.map(g => {
            const obj = GOALS.find(x => x.id === g);
            return <Pill key={g} color={PALETTE.forest}>{t(obj.labelKey, lang)}</Pill>;
          })}
          <Pill color={PALETTE.ink}>{splitObj.short[lang]}</Pill>
          <Pill color={PALETTE.ink}>
            <span dir="ltr">{weightDisplay} {isRTL(lang) ? '←' : '→'} {targetDisplay} {weightUnit}</span>
          </Pill>
        </div>
      </div>

      <section className="px-6 md:px-12 pt-6 pb-10 relative">
        <div className="f-mono text-[10px] uppercase tracking-[0.3em] mb-4" style={{ color: PALETTE.rust }}>
          {t('plan_issue', lang)}
        </div>
        <h1 className="f-display leading-[0.92] font-bold"
          style={{ fontSize: 'clamp(36px, 6vw, 80px)', color: PALETTE.ink, letterSpacing: '-0.04em' }}>
          {lang === 'he' ? (
            <>
              {t('plan_h1_the', lang)} <span className="f-italic" style={{ color: PALETTE.forest }}>{goals.length > 1 ? t('plan_h1_hybrid', lang) : headlineGoals}</span>
              {' '}<span className="f-italic" style={{ color: PALETTE.rust }}>ל{t(ageObj.labelKey, lang).replace('שנות ה', '')}</span>{t('plan_h1_plan', lang)}
            </>
          ) : (
            <>
              The <span className="f-italic" style={{ color: PALETTE.rust }}>{t(ageObj.labelKey, lang)}</span><br />
              {goals.length > 1 ? 'hybrid' : headlineGoals}{' '}
              <span className="f-italic" style={{ color: PALETTE.forest }}>plan</span>.
            </>
          )}
        </h1>

        <blockquote className="f-italic mt-8 max-w-3xl text-lg md:text-2xl leading-snug"
          style={{
            color: PALETTE.ink,
            paddingInlineStart: '1.5rem',
            borderInlineStart: `2px solid ${PALETTE.rust}`,
          }}>
          {getPlanNote(goals, age, split, lang)}
        </blockquote>
      </section>

      {/* Stats strip */}
      <section className="px-6 md:px-12 pb-10">
        <h2 className="f-display font-bold mb-5 text-2xl md:text-3xl" style={{ color: PALETTE.ink }}>
          <span className="f-mono text-xs align-middle" style={{ opacity: 0.5, marginInlineEnd: '0.75rem' }}>·</span>
          {t('plan_numbers_h2', lang)}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBox
            label={t('stat_current_goal', lang)}
            value={
              <span dir="ltr">
                {weightDisplay}
                <span className="f-italic mx-2" style={{ color: PALETTE.rust, fontSize: '0.6em' }}>
                  {isRTL(lang) ? '←' : '→'}
                </span>
                {targetDisplay}
              </span>
            }
            sub={`${weightUnit} · Δ ${deltaDisplay} ${weightUnit}`}
            accent={PALETTE.rust}
          />
          <StatBox label={t('stat_bmi', lang)} value={bmi.value.toFixed(1)} sub={t(bmi.categoryKey, lang)} accent={bmi.color} />
          <StatBox label={t('stat_daily_calories', lang)} value={fmt(dailyCals)} sub={t('stat_sub_kcal_sessions', lang, { n: week.length })} accent={PALETTE.cream} dark />
          <StatBox
            label={isMaintenance ? t('stat_maintenance', lang) : t('stat_time_to_goal', lang)}
            value={isMaintenance ? '—' : weeksToGoal}
            sub={isMaintenance ? t('stat_sub_stay', lang) : t('stat_sub_weeks', lang)}
            accent={PALETTE.forest}
          />
        </div>
      </section>

      <div className="ticker-line mx-6 md:mx-12" />

      {/* Training week */}
      <section className="px-6 md:px-12 pt-12 pb-12">
        <div className="flex items-baseline justify-between mb-5 flex-wrap gap-3">
          <h2 className="f-display font-bold text-3xl md:text-4xl" style={{ color: PALETTE.ink }}>
            <span className="f-mono text-xs align-middle" style={{ opacity: 0.5, marginInlineEnd: '0.75rem' }}>A /</span>
            {t('training_week_h2', lang)}
          </h2>
          <span className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ opacity: 0.6 }}>
            {splitObj.label[lang]}
          </span>
        </div>
        <p className="f-body text-sm max-w-2xl mb-5" style={{ opacity: 0.75 }}>
          {t('training_week_explainer', lang)}
        </p>

        {/* Week selector */}
        <div className="mb-7 flex items-center gap-3 flex-wrap no-print">
          <div className="f-mono text-[10px] uppercase tracking-[0.25em] flex items-center gap-2" style={{ color: PALETTE.rust, marginInlineEnd: '0.5rem' }}>
            <CalendarDays size={12} strokeWidth={1.8} />
            {t('progression', lang)}
          </div>
          <div className="inline-flex p-1" style={{ border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }} dir="ltr">
            {[1, 2, 3, 4].map((n) => {
              const isActive = weekNum === n;
              const isDeload = n === 4;
              return (
                <button key={n} onClick={() => setWeekNum(n)}
                  className="f-mono text-[10px] uppercase tracking-[0.2em] px-3.5 py-1.5 flex items-center gap-1.5"
                  style={{
                    background: isActive ? (isDeload ? PALETTE.forest : PALETTE.ink) : 'transparent',
                    color: isActive ? PALETTE.cream : PALETTE.ink,
                    borderRadius: '999px',
                  }}>
                  W{n}
                  {isDeload && isActive && <span className="text-[8px]" style={{ color: PALETTE.sage }}>↓</span>}
                </button>
              );
            })}
          </div>
          {weekNum === 4 && (
            <Pill color={PALETTE.forest}>{t('week_deload', lang)}</Pill>
          )}
          <span className="f-mono text-[10px] uppercase tracking-[0.2em] hidden md:inline" style={{ opacity: 0.55 }}>
            · {t('week_explainer', lang)}
          </span>
        </div>

        <div className="space-y-5">
          {week.map((day, i) => (
            <DayCard key={day.code} day={day} idx={i} lang={lang}
              completions={completions}
              onToggleComplete={onToggleComplete}
              onSwap={onSwap}
              onStartTimer={onStartTimer}
            />
          ))}
        </div>

        <p className="f-mono text-[10px] uppercase tracking-[0.2em] mt-6" style={{ opacity: 0.55 }}>
          {t('tap_form_note', lang)}
        </p>
      </section>

      {/* Bodyweight log */}
      <div className="ticker-line mx-6 md:mx-12" />
      <BodyweightSection
        entries={bodyweightLog}
        currentWeightKg={currentWeightKg}
        targetKg={targetKg}
        units={units}
        lang={lang}
        onOpenLog={onOpenWeightLog}
        onDelete={onDeleteWeightEntry}
      />

      <div className="ticker-line mx-6 md:mx-12" />

      {/* Diet section */}
      <section className="px-6 md:px-12 pt-12 pb-16">
        <h2 className="f-display font-bold mb-8 text-3xl md:text-4xl" style={{ color: PALETTE.ink }}>
          <span className="f-mono text-xs align-middle" style={{ opacity: 0.5, marginInlineEnd: '0.75rem' }}>B /</span>
          {t('fuel_h2', lang)}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Macros card */}
          <div className="p-6 md:p-8"
            style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px' }}>
            <Pill color={PALETTE.forest}>
              <Utensils size={11} strokeWidth={2} /> {diet.hybrid ? t('diet_hybrid_label', lang) : t('diet_label', lang)}
            </Pill>
            <h3 className="f-display font-bold mt-4"
              style={{ fontSize: 'clamp(26px, 3vw, 34px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
              {diet.title[lang]}
            </h3>
            <div className="mt-6">
              <div className="f-mono text-[10px] uppercase tracking-[0.2em]" style={{ opacity: 0.6 }}>
                {t('diet_your_target', lang)}
              </div>
              <div className="f-display font-bold mt-1"
                style={{ fontSize: 'clamp(40px, 5vw, 64px)', color: PALETTE.rust, letterSpacing: '-0.03em', lineHeight: 1 }} dir="ltr">
                {fmt(dailyCals)}
              </div>
              <div className="f-mono text-[10px] uppercase tracking-[0.2em] mt-1" style={{ opacity: 0.6 }}>
                {t('diet_kcal_personal', lang)}
              </div>
            </div>
            <MacroBar macros={diet.macros} lang={lang} />
            <div className="f-mono text-[10px] uppercase tracking-[0.2em] mt-5 pt-4"
              style={{ opacity: 0.55, borderTop: `1px solid rgba(27,27,25,0.15)` }} dir="ltr">
              ~ {fmt(dailyCals * diet.macros.protein / 100 / 4)}g {lang === 'he' ? 'חלבון' : 'protein'}
              {' · '}{fmt(dailyCals * diet.macros.carbs / 100 / 4)}g {lang === 'he' ? 'פחמ׳' : 'carbs'}
              {' · '}{fmt(dailyCals * diet.macros.fat / 100 / 9)}g {lang === 'he' ? 'שומן' : 'fat'}
            </div>
          </div>

          {/* Principles */}
          <div className="p-6 md:p-8"
            style={{ background: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px' }}>
            <div className="f-mono text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: PALETTE.rust }}>
              {t('diet_three_rules', lang)}
            </div>
            <h3 className="f-display font-bold text-2xl md:text-3xl" style={{ letterSpacing: '-0.02em' }}>
              {t('diet_eat_h', lang)}
            </h3>
            <ol className="mt-5 space-y-4">
              {diet.principles[lang].map((p, i) => (
                <li key={i} className="flex gap-3">
                  <span className="f-display font-bold leading-none pt-1" style={{ fontSize: '24px', color: PALETTE.rust }}>
                    {i + 1}
                  </span>
                  <span className="f-body text-sm leading-relaxed" style={{ color: PALETTE.ink }}>{p}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Sample day — clickable meals */}
          <div className="p-6 md:p-8"
            style={{ background: PALETTE.ink, color: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px' }}>
            <div className="f-mono text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: PALETTE.sage }}>
              {t('diet_day_label', lang)}
            </div>
            <h3 className="f-display font-bold text-2xl md:text-3xl" style={{ letterSpacing: '-0.02em' }}>
              <span className="f-italic" style={{ color: PALETTE.sage }}>{t('diet_sample', lang)}</span>{' '}{t('diet_day', lang)}
            </h3>
            <div className="mt-5 space-y-1">
              {diet.sampleDay.map((meal) => {
                const opts = meal.options[lang];
                const idx = mealIdx[meal.key] ?? 0;
                const current = opts[idx % opts.length];
                const isFlashing = flashKey === meal.key;
                return (
                  <button
                    key={meal.key}
                    onClick={() => cycleMeal(meal.key, opts.length)}
                    className="meal-row w-full pb-3 pt-1 px-2 -mx-2 rounded"
                    style={{
                      textAlign: lang === 'he' ? 'right' : 'left',
                      borderBottom: '1px solid rgba(242,235,221,0.18)',
                    }}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="f-mono text-[10px] uppercase tracking-[0.25em] flex items-center gap-2" style={{ color: PALETTE.sage }}>
                        {t('meal_' + meal.key, lang)}
                        <span className="f-mono text-[9px]" style={{ opacity: 0.5 }}>
                          {idx + 1}/{opts.length}
                        </span>
                      </div>
                      <RefreshCw size={12} className="swap-icon" strokeWidth={2} color={PALETTE.sage} />
                    </div>
                    <div
                      className={`f-body text-sm mt-1 leading-relaxed ${isFlashing ? 'meal-flash' : ''}`}
                      key={current}
                    >
                      {current}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="f-mono text-[10px] uppercase tracking-[0.25em] mt-4 pt-3" style={{ color: PALETTE.sage, opacity: 0.7, borderTop: '1px solid rgba(242,235,221,0.18)' }}>
              {t('tap_meal_note', lang)}
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 md:px-12 py-8 flex items-center justify-between flex-wrap gap-4"
        style={{ borderTop: `1px solid ${PALETTE.ink}` }}>
        <div className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ opacity: 0.6 }}>
          {t('footer_tag', lang)}
        </div>
        <button onClick={onBack}
          className="f-mono uppercase tracking-[0.2em] px-6 py-3 text-xs flex items-center gap-2 no-print"
          style={{ background: PALETTE.rust, color: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
          <Sparkles size={12} strokeWidth={2} />
          {t('cta_try_diff', lang)}
        </button>
      </footer>
    </div>
  );
}

// ------------------------------------------------------------
// Rest timer (floating widget)
// ------------------------------------------------------------

function RestTimer({ exercise, lang, onClose }) {
  const baseRest = exercise?.restSeconds ?? 90;
  const initial = Math.min(120, Math.max(30, baseRest));
  const [duration, setDuration] = useState(initial);
  const [secondsLeft, setSecondsLeft] = useState(initial);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const playedRef = useRef(false);

  // When a different exercise is opened, reset duration to that exercise's default
  useEffect(() => {
    const next = exercise?.restSeconds ?? 90;
    setDuration(Math.min(120, Math.max(30, next)));
  }, [exercise?.id]);

  // When duration changes (user moves slider, or new exercise), reset countdown
  useEffect(() => {
    setSecondsLeft(duration);
    setPaused(false);
    setDone(false);
    playedRef.current = false;
  }, [duration]);

  useEffect(() => {
    if (paused || done) return;
    if (secondsLeft <= 0) {
      if (!playedRef.current) {
        playedRef.current = true;
        playBeep(220, 880);
        setTimeout(() => playBeep(220, 880), 280);
      }
      setDone(true);
      return;
    }
    const id = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft, paused, done]);

  const reset = () => { setSecondsLeft(duration); setPaused(false); setDone(false); playedRef.current = false; };
  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const display = `${minutes}:${String(Math.max(secs, 0)).padStart(2, '0')}`;
  const pct = Math.max(0, Math.min(100, (secondsLeft / duration) * 100));

  return (
    <div
      className="fixed z-[55] no-print"
      style={{
        bottom: '20px', insetInlineEnd: '20px',
        background: PALETTE.ink, color: PALETTE.cream,
        border: `1px solid ${PALETTE.ink}`,
        borderRadius: '14px',
        padding: '14px 16px',
        minWidth: '260px',
        boxShadow: '0 12px 32px rgba(27,27,25,0.35)',
      }}
      dir={isRTL(lang) ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: PALETTE.sage }}>
          <Timer size={11} strokeWidth={2} className="inline-block" style={{ marginInlineEnd: '0.4rem', verticalAlign: '-2px' }} />
          {t('rest_timer', lang)}
        </div>
        <button onClick={onClose} style={{ color: PALETTE.cream, opacity: 0.6, cursor: 'pointer' }} aria-label="Close">
          <X size={14} strokeWidth={2} />
        </button>
      </div>
      <div className="f-display font-bold leading-none mb-1" dir="ltr">
        <span className={done ? 'timer-pulse inline-block' : ''} style={{ color: done ? PALETTE.rust : PALETTE.cream, fontSize: '40px' }}>
          {done ? t('timer_done', lang) : display}
        </span>
      </div>
      <div className="f-italic text-xs mb-3 ex-name" style={{ opacity: 0.7 }} dir="ltr">
        {exercise?.name}
      </div>
      <div className="h-1 mb-4 overflow-hidden" style={{ background: 'rgba(242,235,221,0.2)', borderRadius: '999px' }} dir="ltr">
        <div style={{ width: `${pct}%`, height: '100%', background: done ? PALETTE.rust : PALETTE.sage, transition: 'width 1s linear' }} />
      </div>

      {/* Duration slider — pick rest between 30 and 120 seconds */}
      <div className="mb-4" dir="ltr">
        <div className="flex items-center justify-between mb-1.5">
          <span className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ opacity: 0.55 }}>
            {t('set_duration', lang)}
          </span>
          <span className="f-mono text-xs" style={{ color: PALETTE.sage }}>
            {duration}s
          </span>
        </div>
        <input
          type="range"
          min={30}
          max={120}
          step={5}
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value, 10))}
          className="rest-slider"
        />
        <div className="flex justify-between mt-1 f-mono" style={{ fontSize: '9px', opacity: 0.45 }}>
          <span>30s</span><span>60s</span><span>90s</span><span>120s</span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {!done ? (
          <button onClick={() => setPaused(p => !p)}
            className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1.5"
            style={{ background: 'transparent', color: PALETTE.cream, border: `1px solid ${PALETTE.cream}`, borderRadius: '999px', cursor: 'pointer' }}>
            {paused ? <Play size={11} strokeWidth={2} /> : <Pause size={11} strokeWidth={2} />}
            {paused ? t('timer_paused', lang) : t('rest_timer', lang)}
          </button>
        ) : (
          <button onClick={reset}
            className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1.5"
            style={{ background: PALETTE.rust, color: PALETTE.cream, border: `1px solid ${PALETTE.rust}`, borderRadius: '999px', cursor: 'pointer' }}>
            <RotateCcw size={11} strokeWidth={2} />
            {duration}s
          </button>
        )}
        <button onClick={reset}
          className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1.5"
          style={{ background: 'transparent', color: PALETTE.cream, border: `1px solid rgba(242,235,221,0.4)`, borderRadius: '999px', cursor: 'pointer' }}
          aria-label="Reset">
          <RotateCcw size={11} strokeWidth={2} />
        </button>
        <button onClick={onClose}
          className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1.5"
          style={{ background: 'transparent', color: PALETTE.cream, border: `1px solid rgba(242,235,221,0.4)`, borderRadius: '999px', cursor: 'pointer' }}>
          <SkipForward size={11} strokeWidth={2} />
          {t('skip_rest', lang)}
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Bodyweight log
// ------------------------------------------------------------

function BodyweightLogModal({ open, onClose, onSave, defaultWeight, lang, units }) {
  const [date, setDate] = useState(todayISO());
  const [weight, setWeight] = useState(defaultWeight ?? '');
  useEffect(() => {
    if (open) {
      setDate(todayISO());
      setWeight(defaultWeight ?? '');
    }
  }, [open, defaultWeight]);
  if (!open) return null;
  const valid = !isNaN(parseFloat(weight)) && parseFloat(weight) > 0 && date;
  const unit = units === 'metric' ? 'kg' : 'lb';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 no-print"
      style={{ background: 'rgba(27,27,25,0.55)' }}
      onClick={onClose}>
      <div className="w-full max-w-md p-6 md:p-8 relative"
        style={{ background: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px' }}
        onClick={(e) => e.stopPropagation()}
        dir={isRTL(lang) ? 'rtl' : 'ltr'}>
        <button onClick={onClose} className="absolute top-3"
          style={{ insetInlineEnd: '0.75rem', color: PALETTE.ink }} aria-label="Close">
          <X size={18} strokeWidth={2} />
        </button>
        <div className="f-mono text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: PALETTE.rust }}>
          <TrendingUp size={11} strokeWidth={2} className="inline-block" style={{ marginInlineEnd: '0.4rem', verticalAlign: '-2px' }} />
          {t('log_weight', lang)}
        </div>
        <h3 className="f-display font-bold text-2xl md:text-3xl" style={{ letterSpacing: '-0.02em', lineHeight: 1.05 }}>
          {t('log_modal_title', lang)}
        </h3>

        <label className="f-mono text-[10px] uppercase tracking-[0.25em] block mt-5 mb-2" style={{ opacity: 0.7 }}>
          {t('date_label', lang)}
        </label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="f-body w-full px-3 py-2.5 text-base" dir="ltr"
          style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '3px', color: PALETTE.ink, outline: 'none' }} />

        <label className="f-mono text-[10px] uppercase tracking-[0.25em] block mt-4 mb-2" style={{ opacity: 0.7 }}>
          {t('weight_label', lang)} ({unit})
        </label>
        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
          step="0.1" min="20" max="400" autoFocus
          className="f-body w-full px-3 py-2.5 text-base" dir="ltr"
          style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '3px', color: PALETTE.ink, outline: 'none' }}
          onKeyDown={(e) => { if (e.key === 'Enter' && valid) onSave({ date, weight: parseFloat(weight), unit }); }} />

        <div className="flex gap-3 mt-6 justify-end flex-row-reverse">
          <button onClick={() => valid && onSave({ date, weight: parseFloat(weight), unit })}
            disabled={!valid}
            className="f-mono uppercase tracking-[0.2em] px-5 py-2.5 text-xs flex items-center gap-2"
            style={{ background: PALETTE.ink, color: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px', opacity: valid ? 1 : 0.5, cursor: valid ? 'pointer' : 'not-allowed' }}>
            <Save size={12} strokeWidth={2} />
            {t('save_btn', lang)}
          </button>
          <button onClick={onClose}
            className="f-mono uppercase tracking-[0.2em] px-5 py-2.5 text-xs"
            style={{ background: 'transparent', color: PALETTE.ink, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
            {t('cancel_btn', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

function BodyweightSection({ entries, currentWeightKg, targetKg, units, lang, onOpenLog, onDelete }) {
  // Convert all entries to display unit
  const isMetric = units === 'metric';
  const toDisplay = (kg) => isMetric ? kg : kg * 2.20462;

  // Normalize entries — older entries may be lb, newer kg; we store as kg internally.
  // entries: [{date, weightKg}]
  const sorted = useMemo(() =>
    [...entries].sort((a, b) => a.date.localeCompare(b.date))
  , [entries]);

  const chartData = sorted.map(e => ({
    date: e.date,
    weight: parseFloat(toDisplay(e.weightKg).toFixed(1)),
  }));

  const goalDisplay = targetKg ? parseFloat(toDisplay(targetKg).toFixed(1)) : null;
  const last = sorted[sorted.length - 1];
  const lastDisplay = last ? parseFloat(toDisplay(last.weightKg).toFixed(1)) : null;
  const unit = isMetric ? 'kg' : 'lb';

  return (
    <section className="px-6 md:px-12 pt-12 pb-12">
      <div className="flex items-baseline justify-between mb-3 flex-wrap gap-3">
        <h2 className="f-display font-bold text-3xl md:text-4xl flex items-center gap-3" style={{ color: PALETTE.ink }}>
          <span className="f-mono text-xs align-middle" style={{ opacity: 0.5, marginInlineEnd: '0.5rem' }}>C /</span>
          <TrendingUp size={22} strokeWidth={1.6} color={PALETTE.rust} />
          {t('bodyweight_h', lang)}
        </h2>
        <button onClick={onOpenLog}
          className="f-mono text-xs uppercase tracking-[0.2em] flex items-center gap-2 px-4 py-2 no-print"
          style={{ background: PALETTE.ink, color: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
          <Plus size={12} strokeWidth={2} />
          {t('log_weight', lang)}
        </button>
      </div>
      <p className="f-body text-sm max-w-2xl mb-7" style={{ opacity: 0.75 }}>
        {t('bodyweight_explainer', lang)}
      </p>

      {entries.length === 0 ? (
        <div className="p-6 text-center f-italic" style={{ background: PALETTE.paper, border: `1px dashed ${PALETTE.ink}`, borderRadius: '4px', opacity: 0.65 }}>
          {t('no_entries_yet', lang)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 p-5 md:p-6"
            style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px' }}>
            <div className="f-mono text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: PALETTE.rust }}>
              {t('progress_to_goal', lang)} · {unit}
            </div>
            <div style={{ width: '100%', height: 240 }} dir="ltr">
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 16, bottom: 5, left: -10 }}>
                  <CartesianGrid stroke="rgba(27,27,25,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: 'Manrope', fill: PALETTE.ink }} stroke={PALETTE.ink} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fontSize: 10, fontFamily: 'Manrope', fill: PALETTE.ink }} stroke={PALETTE.ink} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip
                    contentStyle={{ background: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: 4, fontFamily: 'Manrope', fontSize: 12 }}
                    formatter={(value) => [`${value} ${unit}`, t('weight_label', lang)]}
                  />
                  {goalDisplay && (
                    <ReferenceLine y={goalDisplay} stroke={PALETTE.forest} strokeDasharray="4 4"
                      label={{ value: `${t('chart_goal', lang)} ${goalDisplay}`, position: 'right', fill: PALETTE.forest, fontSize: 10, fontFamily: 'Manrope' }} />
                  )}
                  <Line type="monotone" dataKey="weight" stroke={PALETTE.rust} strokeWidth={2.5} dot={{ r: 4, fill: PALETTE.rust }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Entries list */}
          <div className="p-5 md:p-6"
            style={{ background: PALETTE.ink, color: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px' }}>
            <div className="f-mono text-[10px] uppercase tracking-[0.25em] mb-4" style={{ color: PALETTE.sage }}>
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </div>
            <div className="space-y-3 max-h-72 overflow-auto">
              {[...sorted].reverse().map((e) => (
                <div key={e.date + e.weightKg} className="flex items-center justify-between gap-2 pb-2"
                  style={{ borderBottom: '1px solid rgba(242,235,221,0.18)' }}>
                  <div>
                    <div className="f-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: PALETTE.sage }} dir="ltr">
                      {e.date}
                    </div>
                    <div className="f-display font-semibold text-lg" dir="ltr">
                      {toDisplay(e.weightKg).toFixed(1)} <span className="f-mono text-xs" style={{ opacity: 0.6 }}>{unit}</span>
                    </div>
                  </div>
                  <button onClick={() => onDelete(e.date)}
                    style={{ color: PALETTE.cream, opacity: 0.4 }}
                    onMouseEnter={(ev) => ev.currentTarget.style.opacity = 1}
                    onMouseLeave={(ev) => ev.currentTarget.style.opacity = 0.4}
                    aria-label={t('delete_entry', lang)}>
                    <Trash2 size={14} strokeWidth={1.8} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ------------------------------------------------------------
// Printable HTML generator (opens in a new tab for PDF export)
// ------------------------------------------------------------

function escapeHTML(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function generatePrintHTML({ lang, age, goals, split, weekNum, week, computed, diet, units, weight, targetWeight }) {
  const isHe = lang === 'he';
  const dir = isHe ? 'rtl' : 'ltr';
  const ageObj = AGE_GROUPS.find(a => a.id === age);
  const splitObj = SPLITS[split];
  const goalLabels = goals.map(g => t(GOALS.find(x => x.id === g).labelKey, lang));
  const goalLabelsStr = goalLabels.join(' + ');
  const headlineGoals = goals.length > 1 ? (isHe ? 'היברידית' : 'hybrid') : goalLabelsStr;
  const weightUnit = units === 'metric' ? 'kg' : 'lb';
  const { dailyCals, bmi, weeksToGoal, isMaintenance } = computed;
  const sideStart = isHe ? 'right' : 'left';

  // Pills
  const pills = [
    `<span class="pill">${escapeHTML(isHe ? 'גיל' : 'Age')} · ${escapeHTML(ageObj.range)}</span>`,
    ...goalLabels.map(g => `<span class="pill">${escapeHTML(g)}</span>`),
    `<span class="pill">${escapeHTML(splitObj.short[lang])}</span>`,
    `<span class="pill">${escapeHTML(weight)} → ${escapeHTML(targetWeight)} ${weightUnit}</span>`,
    `<span class="pill">${escapeHTML(t('week_label', lang, { n: weekNum }))}${weekNum === 4 ? ` · ${escapeHTML(t('week_deload', lang))}` : ''}</span>`,
  ].join('');

  // Hero
  const hero = isHe
    ? `${escapeHTML(t('plan_h1_the', lang))} <span class="accent2">${escapeHTML(headlineGoals)}</span> <span class="accent">ל${escapeHTML(t(ageObj.labelKey, lang).replace('שנות ה', ''))}</span>${escapeHTML(t('plan_h1_plan', lang))}`
    : `The <span class="accent">${escapeHTML(t(ageObj.labelKey, lang))}</span><br/>${escapeHTML(headlineGoals)} <span class="accent2">plan</span>.`;

  // Stats
  const statsHTML = `
    <div class="stat">
      <div class="stat-label">${escapeHTML(t('stat_current_goal', lang))}</div>
      <div class="stat-value" style="direction:ltr;">${escapeHTML(weight)} → ${escapeHTML(targetWeight)}</div>
      <div class="stat-sub">${weightUnit}</div>
    </div>
    <div class="stat">
      <div class="stat-label">${escapeHTML(t('stat_bmi', lang))}</div>
      <div class="stat-value" style="direction:ltr;">${bmi.value.toFixed(1)}</div>
      <div class="stat-sub">${escapeHTML(t(bmi.categoryKey, lang))}</div>
    </div>
    <div class="stat dark">
      <div class="stat-label">${escapeHTML(t('stat_daily_calories', lang))}</div>
      <div class="stat-value" style="direction:ltr;">${fmt(dailyCals)}</div>
      <div class="stat-sub">${escapeHTML(t('stat_sub_kcal_sessions', lang, { n: week.length }))}</div>
    </div>
    <div class="stat">
      <div class="stat-label">${escapeHTML(isMaintenance ? t('stat_maintenance', lang) : t('stat_time_to_goal', lang))}</div>
      <div class="stat-value">${isMaintenance ? '—' : weeksToGoal}</div>
      <div class="stat-sub">${escapeHTML(isMaintenance ? t('stat_sub_stay', lang) : t('stat_sub_weeks', lang))}</div>
    </div>
  `;

  // Day cards
  const dayCardsHTML = week.map((day, i) => {
    const renderTrack = (exercises, dark) => exercises.map((ex, j) => `
      <div class="ex">
        <span class="ex-num">${String(j + 1).padStart(2, '0')}</span>
        <span class="ex-name">${escapeHTML(ex.name)}</span>
        <span class="ex-rx">${escapeHTML(ex.prescription)}</span>
      </div>
    `).join('');
    return `
      <div class="day">
        <div class="day-header">
          <div class="day-num">${String(i + 1).padStart(2, '0')}</div>
          <div>
            <div class="day-title">${escapeHTML(day.name[lang])}</div>
            <div class="day-focus">${escapeHTML(day.focus[lang])}</div>
          </div>
          <div class="day-code">${escapeHTML(day.code)}</div>
        </div>
        <div class="tracks">
          <div class="track">
            <div class="track-label">${escapeHTML(t('track01', lang))}</div>
            ${renderTrack(day.gym, false)}
          </div>
          <div class="track cali-track">
            <div class="track-label">${escapeHTML(t('track02', lang))}</div>
            ${renderTrack(day.cali, true)}
          </div>
        </div>
      </div>`;
  }).join('');

  // Diet
  const principlesList = diet.principles[lang].map((p, i) =>
    `<li><span class="num">${i + 1}</span><span>${escapeHTML(p)}</span></li>`
  ).join('');

  const sampleDayHTML = diet.sampleDay.map(meal => {
    const opts = meal.options[lang];
    return `
      <div class="meal">
        <div class="meal-label">${escapeHTML(t('meal_' + meal.key, lang))}</div>
        ${opts.map(o => `<div class="meal-text">· ${escapeHTML(o)}</div>`).join('')}
      </div>`;
  }).join('');

  const proteinG = fmt(dailyCals * diet.macros.protein / 100 / 4);
  const carbsG = fmt(dailyCals * diet.macros.carbs / 100 / 4);
  const fatG = fmt(dailyCals * diet.macros.fat / 100 / 9);

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FitLab — ${escapeHTML(diet.title[lang])}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,400&family=Manrope:wght@400;500;700&family=Heebo:wght@400;500;700&family=Noto+Serif+Hebrew:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      padding: 32px 24px; max-width: 920px; margin: 0 auto;
      background: #F2EBDD; color: #1B1B19;
      font-family: 'Manrope', 'Heebo', system-ui, sans-serif;
      line-height: 1.5;
    }
    [dir="rtl"] body { font-family: 'Heebo', 'Manrope', system-ui, sans-serif; }
    .display, h1, h2, h3 { font-family: 'Fraunces', 'Noto Serif Hebrew', Georgia, serif; letter-spacing: -0.02em; font-weight: 800; }
    [dir="rtl"] .display, [dir="rtl"] h1, [dir="rtl"] h2, [dir="rtl"] h3 { font-family: 'Noto Serif Hebrew', 'Fraunces', Georgia, serif; }
    .italic { font-family: 'Fraunces', 'Noto Serif Hebrew', Georgia, serif; font-style: italic; }
    .mono { font-family: 'Manrope', 'Heebo', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.25em; }

    .toolbar { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
    .toolbar button {
      padding: 10px 20px; background: #1B1B19; color: #F2EBDD;
      border: 1px solid #1B1B19; border-radius: 999px; cursor: pointer;
      font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em;
      font-family: 'Manrope', 'Heebo', sans-serif; font-weight: 500;
    }
    .toolbar button.outline { background: transparent; color: #1B1B19; }

    .brand { font-size: 24px; font-weight: 800; font-family: 'Fraunces', serif; letter-spacing: -0.04em; }
    .brand .lab { font-style: italic; color: #C25A3F; }
    .issue-line { color: #C25A3F; margin: 12px 0 6px; }

    .hero { font-size: 48px; line-height: 0.95; letter-spacing: -0.03em; margin: 12px 0 18px; }
    .hero .accent { font-style: italic; color: #C25A3F; }
    .hero .accent2 { font-style: italic; color: #27392B; }

    .pills { margin-bottom: 24px; }
    .pill { display: inline-block; padding: 4px 10px; border: 1px solid #1B1B19; border-radius: 999px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.2em; margin: 0 4px 6px 0; font-family: 'Manrope', 'Heebo', sans-serif; }

    .blockquote {
      font-style: italic; padding-${sideStart === 'left' ? 'left' : 'right'}: 16px;
      border-${sideStart === 'left' ? 'left' : 'right'}: 2px solid #C25A3F;
      margin: 24px 0; font-size: 17px; line-height: 1.4; max-width: 640px;
      font-family: 'Fraunces', 'Noto Serif Hebrew', serif;
    }

    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 24px 0; }
    @media (max-width: 600px) { .stats { grid-template-columns: repeat(2, 1fr); } }
    .stat { padding: 14px; background: #FBF7EF; border: 1px solid #1B1B19; border-radius: 4px; }
    .stat.dark { background: #1B1B19; color: #F2EBDD; }
    .stat-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.25em; color: #C25A3F; margin-bottom: 8px; font-family: 'Manrope', 'Heebo', sans-serif; }
    .stat.dark .stat-label { color: #F2EBDD; }
    .stat-value { font-weight: 800; font-size: 26px; line-height: 1; letter-spacing: -0.03em; }
    .stat-sub { font-size: 9px; text-transform: uppercase; letter-spacing: 0.2em; opacity: 0.7; margin-top: 8px; font-family: 'Manrope', 'Heebo', sans-serif; }

    h2 { font-size: 28px; margin: 36px 0 14px; }
    h2 .num { color: #1B1B19; opacity: 0.5; font-size: 14px; font-weight: 400; margin-${sideStart === 'left' ? 'right' : 'left'}: 12px; vertical-align: middle; font-family: 'Manrope', 'Heebo', sans-serif; }

    .day { padding: 18px 20px; background: #FBF7EF; border: 1px solid #1B1B19; border-radius: 4px; margin-bottom: 14px; page-break-inside: avoid; break-inside: avoid; }
    .day-header { display: flex; align-items: baseline; gap: 14px; margin-bottom: 12px; flex-wrap: wrap; }
    .day-num { font-weight: 800; font-size: 44px; color: #C25A3F; line-height: 1; letter-spacing: -0.04em; font-family: 'Fraunces', serif; }
    .day-title { font-weight: 800; font-size: 18px; }
    .day-focus { font-style: italic; opacity: 0.7; font-size: 13px; }
    .day-code { padding: 2px 8px; border: 1px solid #1B1B19; border-radius: 999px; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; margin-${sideStart === 'left' ? 'left' : 'right'}: auto; font-family: 'Manrope', 'Heebo', sans-serif; }

    .tracks { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    @media (max-width: 600px) { .tracks { grid-template-columns: 1fr; } }
    .track { padding-top: 6px; border-top: 1px solid #1B1B19; }
    .track-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.25em; color: #C25A3F; margin: 8px 0; font-family: 'Manrope', 'Heebo', sans-serif; }
    .cali-track { background: #27392B; color: #F2EBDD; padding: 10px 12px; border-radius: 3px; border-top: none; }
    .cali-track .track-label { color: #8A9A82; margin-top: 4px; }

    .ex { padding: 7px 0; border-bottom: 1px solid rgba(27,27,25,0.15); display: flex; justify-content: space-between; gap: 10px; align-items: baseline; }
    .ex:last-child { border-bottom: none; }
    .cali-track .ex { border-bottom: 1px solid rgba(242,235,221,0.18); }
    .ex-num { font-family: 'Manrope', 'Heebo', sans-serif; font-size: 9px; text-transform: uppercase; letter-spacing: 0.2em; color: #C25A3F; min-width: 22px; }
    .cali-track .ex-num { color: #8A9A82; }
    .ex-name { font-family: 'Fraunces', serif; font-weight: 600; font-size: 14px; flex: 1; direction: ltr; text-align: left; }
    .ex-rx { font-family: 'Manrope', sans-serif; font-size: 11px; opacity: 0.75; white-space: nowrap; direction: ltr; }

    .diet-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
    @media (max-width: 800px) { .diet-grid { grid-template-columns: 1fr; } }
    .diet-card { padding: 18px 20px; background: #FBF7EF; border: 1px solid #1B1B19; border-radius: 4px; page-break-inside: avoid; break-inside: avoid; }
    .diet-card.cream { background: #F2EBDD; }
    .diet-card.dark { background: #1B1B19; color: #F2EBDD; }
    .diet-card h3 { font-size: 22px; margin: 8px 0 12px; line-height: 1.05; }
    .diet-card .label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.25em; color: #C25A3F; font-family: 'Manrope', 'Heebo', sans-serif; }
    .diet-card.dark .label { color: #8A9A82; }
    .calories-big { font-family: 'Fraunces', serif; font-weight: 800; font-size: 44px; color: #C25A3F; line-height: 1; letter-spacing: -0.03em; margin-top: 4px; direction: ltr; }
    .principles { padding: 0; list-style: none; margin: 12px 0 0; }
    .principles li { display: flex; gap: 10px; margin-bottom: 12px; }
    .principles .num { font-family: 'Fraunces', serif; font-weight: 800; font-size: 22px; color: #C25A3F; line-height: 1; flex-shrink: 0; }
    .principles span:last-child { font-size: 13px; line-height: 1.5; flex: 1; }

    .meal { padding-bottom: 10px; border-bottom: 1px solid rgba(242,235,221,0.18); margin-bottom: 10px; }
    .meal:last-child { border-bottom: none; margin-bottom: 0; }
    .meal-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.25em; color: #8A9A82; margin-bottom: 6px; font-family: 'Manrope', 'Heebo', sans-serif; }
    .meal-text { font-size: 13px; line-height: 1.5; margin-bottom: 4px; }

    footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #1B1B19; font-size: 10px; text-transform: uppercase; letter-spacing: 0.25em; opacity: 0.6; font-family: 'Manrope', 'Heebo', sans-serif; }

    @media print {
      @page { margin: 12mm; size: auto; }
      body { background: white; padding: 0; max-width: none; }
      .toolbar, .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="toolbar no-print">
    <button onclick="window.print()">🖨 ${escapeHTML(t('print_plan', lang))}</button>
    <button class="outline" onclick="window.close()">✕ ${escapeHTML(t('cancel_btn', lang))}</button>
  </div>

  <div class="brand">Fit<span class="lab">Lab</span></div>
  <div class="mono issue-line">${escapeHTML(t('plan_issue', lang))}</div>

  <h1 class="hero">${hero}</h1>

  <div class="pills">${pills}</div>

  <div class="blockquote">${escapeHTML(getPlanNote(goals, age, split, lang))}</div>

  <h2><span class="num">·</span>${escapeHTML(t('plan_numbers_h2', lang))}</h2>
  <div class="stats">${statsHTML}</div>

  <h2><span class="num">A /</span>${escapeHTML(t('training_week_h2', lang))}</h2>
  ${dayCardsHTML}

  <h2><span class="num">B /</span>${escapeHTML(t('fuel_h2', lang))}</h2>
  <div class="diet-grid">
    <div class="diet-card">
      <div class="label">${escapeHTML(diet.hybrid ? t('diet_hybrid_label', lang) : t('diet_label', lang))}</div>
      <h3>${escapeHTML(diet.title[lang])}</h3>
      <div class="label" style="margin-top:16px;">${escapeHTML(t('diet_your_target', lang))}</div>
      <div class="calories-big">${fmt(dailyCals)}</div>
      <div class="mono" style="margin-top:14px;opacity:0.6;direction:ltr;">${proteinG}g · ${carbsG}g · ${fatG}g</div>
    </div>
    <div class="diet-card cream">
      <div class="label">${escapeHTML(t('diet_three_rules', lang))}</div>
      <h3>${escapeHTML(t('diet_eat_h', lang))}</h3>
      <ol class="principles">${principlesList}</ol>
    </div>
    <div class="diet-card dark">
      <div class="label">${escapeHTML(t('diet_day_label', lang))}</div>
      <h3>${escapeHTML(t('diet_sample', lang))} ${escapeHTML(t('diet_day', lang))}</h3>
      <div style="margin-top:12px;">${sampleDayHTML}</div>
    </div>
  </div>

  <footer>${escapeHTML(t('footer_tag', lang))}</footer>

  <script>
    // Wait for fonts before triggering print
    function tryPrint() { try { window.print(); } catch (e) {} }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(tryPrint, 250));
    } else {
      setTimeout(tryPrint, 700);
    }
  </script>
</body>
</html>`;
}

// ------------------------------------------------------------
// Save modal + saved plans strip
// ------------------------------------------------------------

function SaveModal({ open, onClose, defaultName, onSave, lang, status }) {
  const [name, setName] = useState(defaultName);
  useEffect(() => { if (open) setName(defaultName); }, [open, defaultName]);
  if (!open) return null;
  const saving = status === 'saving';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(27,27,25,0.55)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md p-6 md:p-8 relative"
        style={{ background: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px' }}
        onClick={(e) => e.stopPropagation()}
        dir={isRTL(lang) ? 'rtl' : 'ltr'}
      >
        <button
          onClick={onClose}
          className="absolute top-3"
          style={{ insetInlineEnd: '0.75rem', color: PALETTE.ink }}
          aria-label="Close"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <div className="f-mono text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: PALETTE.rust }}>
          <Bookmark size={11} strokeWidth={2} className="inline-block" style={{ marginInlineEnd: '0.4rem', verticalAlign: '-2px' }} />
          {t('save_plan', lang)}
        </div>
        <h3 className="f-display font-bold text-2xl md:text-3xl" style={{ letterSpacing: '-0.02em', lineHeight: 1.05 }}>
          {t('save_modal_title', lang)}
        </h3>
        <p className="f-body text-sm mt-2" style={{ opacity: 0.7 }}>
          {t('save_modal_explainer', lang)}
        </p>

        <label className="f-mono text-[10px] uppercase tracking-[0.25em] block mt-5 mb-2" style={{ color: PALETTE.ink, opacity: 0.7 }}>
          {t('save_field_label', lang)}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          maxLength={80}
          className="f-body w-full px-3 py-2.5 text-base"
          style={{
            background: PALETTE.paper,
            border: `1px solid ${PALETTE.ink}`,
            borderRadius: '3px',
            color: PALETTE.ink,
            outline: 'none',
          }}
          onKeyDown={(e) => { if (e.key === 'Enter' && name.trim() && !saving) onSave(name.trim()); }}
        />

        {status === 'error' && (
          <div className="f-mono text-[10px] uppercase tracking-[0.2em] mt-3" style={{ color: PALETTE.rust }}>
            {t('save_failed', lang)}
          </div>
        )}

        <div className="flex gap-3 mt-6 justify-end flex-row-reverse">
          <button
            onClick={() => name.trim() && onSave(name.trim())}
            disabled={!name.trim() || saving}
            className="f-mono uppercase tracking-[0.2em] px-5 py-2.5 text-xs flex items-center gap-2"
            style={{
              background: PALETTE.ink,
              color: PALETTE.cream,
              border: `1px solid ${PALETTE.ink}`,
              borderRadius: '999px',
              opacity: !name.trim() || saving ? 0.5 : 1,
              cursor: !name.trim() || saving ? 'not-allowed' : 'pointer',
            }}
          >
            <Save size={12} strokeWidth={2} />
            {saving ? t('saving', lang) : t('save_btn', lang)}
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            className="f-mono uppercase tracking-[0.2em] px-5 py-2.5 text-xs"
            style={{
              background: 'transparent',
              color: PALETTE.ink,
              border: `1px solid ${PALETTE.ink}`,
              borderRadius: '999px',
              opacity: saving ? 0.5 : 1,
            }}
          >
            {t('cancel_btn', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

function SavedPlansSection({ savedPlans, onLoad, onDelete, lang }) {
  if (!savedPlans || savedPlans.length === 0) return null;
  return (
    <section className="px-6 md:px-12 pt-10 pb-2">
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-3">
        <h2 className="f-display text-2xl md:text-3xl font-bold flex items-center gap-3" style={{ color: PALETTE.ink }}>
          <FolderOpen size={20} strokeWidth={1.6} color={PALETTE.rust} />
          {t('saved_plans', lang)}
        </h2>
        <span className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ opacity: 0.5 }}>
          {savedPlans.length}
        </span>
      </div>
      <p className="f-body text-sm max-w-2xl mb-5" style={{ opacity: 0.7 }}>
        {t('saved_plans_explainer', lang)}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedPlans.map((plan) => {
          const ageObj = AGE_GROUPS.find(a => a.id === plan.inputs.age);
          const goalLabels = (plan.inputs.goals || []).map(g => t(GOALS.find(x => x.id === g)?.labelKey, lang)).join(' + ');
          const splitShort = SPLITS[plan.inputs.split]?.short[lang] ?? '';
          return (
            <div
              key={plan.id}
              className="card-tilt p-5 relative group"
              style={{
                background: PALETTE.paper,
                border: `1px solid ${PALETTE.ink}`,
                borderRadius: '4px',
                textAlign: lang === 'he' ? 'right' : 'left',
              }}
            >
              <button
                onClick={() => onLoad(plan)}
                className="block w-full"
                style={{ textAlign: 'inherit' }}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: PALETTE.rust }}>
                    {ageObj?.range ?? ''}
                  </div>
                  <span className="f-mono text-[9px] uppercase tracking-widest px-2 py-0.5"
                    style={{ border: `1px solid ${PALETTE.ink}`, borderRadius: '999px', opacity: 0.7 }}>
                    {splitShort}
                  </span>
                </div>
                <div className="f-display font-bold text-lg md:text-xl leading-tight underline-hover"
                  style={{ letterSpacing: '-0.02em', color: PALETTE.ink }}>
                  {plan.name}
                </div>
                {goalLabels && (
                  <div className="f-italic text-sm mt-2" style={{ opacity: 0.7 }}>
                    {goalLabels}
                  </div>
                )}
                <div className="f-mono text-[10px] uppercase tracking-[0.2em] mt-3 pt-3"
                  style={{ borderTop: `1px solid rgba(27,27,25,0.15)`, opacity: 0.55 }}>
                  {t('saved_at', lang, { date: formatSavedDate(plan.savedAt, lang) })}
                </div>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); if (window.confirm(t('confirm_delete', lang))) onDelete(plan.id); }}
                className="absolute top-3"
                style={{ insetInlineEnd: '0.75rem', color: PALETTE.ink, opacity: 0.4 }}
                aria-label={t('delete_plan', lang)}
                title={t('delete_plan', lang)}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.4}
              >
                <Trash2 size={14} strokeWidth={1.8} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// Root
// ------------------------------------------------------------

export default function FitLab() {
  const [lang, setLang] = useState('en');
  const [age, setAge] = useState(null);
  const [goals, setGoals] = useState([]);
  const [split, setSplit] = useState(null);
  const [view, setView] = useState('picker');

  const [units, setUnits] = useState('metric');
  const [sex, setSex] = useState('neutral');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weight, setWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');

  // Per-plan progression state
  const [weekNum, setWeekNum] = useState(1);
  const [swaps, setSwaps] = useState({});                     // { swapKey: offset }
  const [completions, setCompletions] = useState({});         // { dayCode: Set<swapKey> }
  const [currentPlanId, setCurrentPlanId] = useState(null);   // null when ephemeral

  // Saved plans
  const [savedPlans, setSavedPlans] = useState([]);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [toast, setToast] = useState(null);

  // Bodyweight log
  const [bodyweightLog, setBodyweightLog] = useState([]);
  const [logModalOpen, setLogModalOpen] = useState(false);

  // Rest timer
  const [activeTimer, setActiveTimer] = useState(null);

  // Load on mount
  useEffect(() => {
    let cancelled = false;
    loadAllPlans().then(plans => { if (!cancelled) setSavedPlans(plans); });
    loadBodyweightLog().then(entries => { if (!cancelled) setBodyweightLog(entries); });
    return () => { cancelled = true; };
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  // ---- Save / load plan helpers ----

  const serializeCompletions = (c) => {
    const obj = {};
    Object.entries(c).forEach(([day, set]) => { obj[day] = Array.from(set); });
    return obj;
  };
  const deserializeCompletions = (obj) => {
    const c = {};
    Object.entries(obj || {}).forEach(([day, arr]) => { c[day] = new Set(arr); });
    return c;
  };

  const handleSavePlan = async (name) => {
    setSaveStatus('saving');
    const id = currentPlanId || (Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
    const plan = {
      id,
      name,
      savedAt: Date.now(),
      inputs: { age, goals, split, units, sex, heightCm, heightFt, heightIn, weight, targetWeight },
      progress: { weekNum, swaps, completions: serializeCompletions(completions) },
    };
    const newList = currentPlanId
      ? savedPlans.map(p => p.id === id ? plan : p)
      : [plan, ...savedPlans];
    const ok = await persistAllPlans(newList);
    if (ok) {
      setSavedPlans(newList);
      setCurrentPlanId(id);
      setSaveStatus('saved');
      setSaveModalOpen(false);
      showToast(t('saved_toast', lang));
      setTimeout(() => setSaveStatus('idle'), 200);
    } else {
      setSaveStatus('error');
    }
  };

  const handleDeletePlan = async (id) => {
    const newList = savedPlans.filter(p => p.id !== id);
    const ok = await persistAllPlans(newList);
    if (ok) {
      setSavedPlans(newList);
      if (currentPlanId === id) setCurrentPlanId(null);
    }
  };

  const handleLoadPlan = (plan) => {
    const i = plan.inputs || {};
    setAge(i.age ?? null);
    setGoals(i.goals ?? []);
    setSplit(i.split ?? null);
    setUnits(i.units ?? 'metric');
    setSex(i.sex ?? 'neutral');
    setHeightCm(i.heightCm ?? '');
    setHeightFt(i.heightFt ?? '');
    setHeightIn(i.heightIn ?? '');
    setWeight(i.weight ?? '');
    setTargetWeight(i.targetWeight ?? '');
    const p = plan.progress || {};
    setWeekNum(p.weekNum ?? 1);
    setSwaps(p.swaps ?? {});
    setCompletions(deserializeCompletions(p.completions));
    setCurrentPlanId(plan.id);
    setView('plan');
  };

  // Auto-persist progress when editing a saved plan
  useEffect(() => {
    if (!currentPlanId) return;
    const idx = savedPlans.findIndex(p => p.id === currentPlanId);
    if (idx === -1) return;
    const updated = {
      ...savedPlans[idx],
      progress: { weekNum, swaps, completions: serializeCompletions(completions) },
    };
    const newList = [...savedPlans];
    newList[idx] = updated;
    setSavedPlans(newList);
    persistAllPlans(newList); // fire-and-forget
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekNum, swaps, completions, currentPlanId]);

  // ---- Completion / swap handlers ----

  const handleToggleComplete = (dayCode, swapKey) => {
    setCompletions(prev => {
      const next = { ...prev };
      const existing = new Set(next[dayCode] || new Set());
      if (existing.has(swapKey)) existing.delete(swapKey);
      else existing.add(swapKey);
      next[dayCode] = existing;
      return next;
    });
  };

  const handleSwap = (swapKey) => {
    setSwaps(prev => ({ ...prev, [swapKey]: (prev[swapKey] || 0) + 1 }));
    // Clear completion for that exercise (it's a new exercise now)
    const [dayCode] = swapKey.split('_');
    setCompletions(prev => {
      if (!prev[dayCode]) return prev;
      const next = { ...prev };
      const set = new Set(next[dayCode]);
      set.delete(swapKey);
      next[dayCode] = set;
      return next;
    });
  };

  // ---- Bodyweight log handlers ----

  const handleSaveWeightEntry = async ({ date, weight: w, unit }) => {
    const weightKg = unit === 'kg' ? w : w / 2.20462;
    // Replace if entry for same date exists
    const filtered = bodyweightLog.filter(e => e.date !== date);
    const newList = [...filtered, { date, weightKg }];
    const ok = await persistBodyweightLog(newList);
    if (ok) {
      setBodyweightLog(newList);
      setLogModalOpen(false);
      showToast(t('saved_toast', lang));
    }
  };

  const handleDeleteWeightEntry = async (date) => {
    const newList = bodyweightLog.filter(e => e.date !== date);
    const ok = await persistBodyweightLog(newList);
    if (ok) setBodyweightLog(newList);
  };

  // ---- Other helpers ----

  const handlePrint = () => {
    if (!computed || !week) return;
    const html = generatePrintHTML({
      lang, age, goals, split, weekNum, week, computed,
      diet: computed.diet, units, weight, targetWeight,
    });
    try {
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const w = window.open(url, '_blank');
      if (!w || w.closed || typeof w.closed === 'undefined') {
        // Popup blocked — fall back to download
        const a = document.createElement('a');
        a.href = url;
        a.download = `fitlab-plan.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      // Cleanup the URL after a minute (gives the new tab time to load)
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) {
      console.error('Print failed:', e);
      // Last-resort fallback: data URI
      const dataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
      window.open(dataUri, '_blank');
    }
  };

  const toggleGoal = (id) => {
    setGoals(prev => prev.includes(id) ? prev.filter(x => x !== id) : (prev.length >= 3 ? prev : [...prev, id]));
  };

  const startNewPlanFlow = () => {
    // When user goes back to picker, we keep their inputs but clear plan binding
    setCurrentPlanId(null);
    setWeekNum(1);
    setSwaps({});
    setCompletions({});
    setView('picker');
  };

  const statsValid = useMemo(() => {
    const w = parseFloat(weight);
    const tw = parseFloat(targetWeight);
    if (isNaN(w) || isNaN(tw) || w <= 0 || tw <= 0) return false;
    if (units === 'metric') {
      const h = parseFloat(heightCm);
      return !isNaN(h) && h >= 120 && h <= 230;
    } else {
      const f = parseFloat(heightFt);
      const i = parseFloat(heightIn);
      return !isNaN(f) && f >= 3 && f <= 8 && !isNaN(i) && i >= 0 && i < 12;
    }
  }, [units, heightCm, heightFt, heightIn, weight, targetWeight]);

  const computed = useMemo(() => {
    if (!statsValid || !age || goals.length === 0 || !split) return null;
    const heightCmNum = units === 'metric'
      ? parseFloat(heightCm)
      : inToCm(parseFloat(heightFt) * 12 + parseFloat(heightIn));
    const weightKg = units === 'metric' ? parseFloat(weight) : lbToKg(parseFloat(weight));
    const targetKg = units === 'metric' ? parseFloat(targetWeight) : lbToKg(parseFloat(targetWeight));
    const ageNum = ageNumber[age];

    const bmr = calcBMR(sex, weightKg, heightCmNum, ageNum);
    const tdee = bmr * ACTIVITY_FACTOR;
    const diet = getDiet(goals);
    const dailyCals = tdee + diet.calorieAdj;
    const bmi = calcBMI(weightKg, heightCmNum);
    const weeksToGoal = calcWeeksToTarget(weightKg, targetKg, goals);
    const isMaintenance = weeksToGoal === 0;

    const weightDisplay = parseFloat(weight).toFixed(0);
    const targetDisplay = parseFloat(targetWeight).toFixed(0);
    const delta = parseFloat(targetWeight) - parseFloat(weight);
    const deltaDisplay = (delta > 0 ? '+' : '') + delta.toFixed(0);

    return { weightDisplay, targetDisplay, deltaDisplay, bmi, dailyCals, weeksToGoal, isMaintenance, diet, weightKg, targetKg };
  }, [statsValid, age, goals, split, units, heightCm, heightFt, heightIn, weight, targetWeight, sex]);

  const week = useMemo(() => {
    if (!age || goals.length === 0 || !split) return null;
    return buildWeek(split, age, goals, lang, swaps, weekNum);
  }, [age, goals, split, lang, swaps, weekNum]);

  useEffect(() => {
    if (view === 'plan') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  return (
    <div
      className="min-h-screen relative grain f-body"
      dir={isRTL(lang) ? 'rtl' : 'ltr'}
      style={{ background: PALETTE.cream, color: PALETTE.ink }}
    >
      <FontStyles />
      {view === 'picker' ? (
        <PickerView
          lang={lang} setLang={setLang}
          age={age} goals={goals} split={split}
          onPickAge={setAge} onToggleGoal={toggleGoal} onPickSplit={setSplit}
          onSubmit={() => age && goals.length && split && statsValid && setView('plan')}
          units={units} setUnits={setUnits}
          sex={sex} setSex={setSex}
          heightCm={heightCm} setHeightCm={setHeightCm}
          heightFt={heightFt} setHeightFt={setHeightFt}
          heightIn={heightIn} setHeightIn={setHeightIn}
          weight={weight} setWeight={setWeight}
          targetWeight={targetWeight} setTargetWeight={setTargetWeight}
          statsValid={statsValid}
          savedPlans={savedPlans}
          onLoadPlan={handleLoadPlan}
          onDeletePlan={handleDeletePlan}
        />
      ) : (
        <PlanView
          lang={lang} setLang={setLang}
          age={age} goals={goals} split={split}
          computed={computed} week={week} diet={computed.diet}
          weightUnit={units === 'metric' ? 'kg' : 'lb'}
          onBack={startNewPlanFlow}
          onOpenSave={() => { setSaveStatus('idle'); setSaveModalOpen(true); }}
          weekNum={weekNum} setWeekNum={setWeekNum}
          completions={completions} onToggleComplete={handleToggleComplete}
          onSwap={handleSwap}
          onPrint={handlePrint}
          bodyweightLog={bodyweightLog}
          currentWeightKg={computed?.weightKg}
          targetKg={computed?.targetKg}
          units={units}
          onOpenWeightLog={() => setLogModalOpen(true)}
          onDeleteWeightEntry={handleDeleteWeightEntry}
          onStartTimer={(ex) => setActiveTimer(ex)}
        />
      )}

      <SaveModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        defaultName={
          currentPlanId
            ? (savedPlans.find(p => p.id === currentPlanId)?.name || buildAutoName(age, goals, split, lang))
            : buildAutoName(age, goals, split, lang)
        }
        onSave={handleSavePlan}
        lang={lang}
        status={saveStatus}
      />

      <BodyweightLogModal
        open={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        onSave={handleSaveWeightEntry}
        defaultWeight={weight}
        units={units}
        lang={lang}
      />

      {activeTimer && (
        <RestTimer
          exercise={activeTimer}
          lang={lang}
          onClose={() => setActiveTimer(null)}
        />
      )}

      {toast && (
        <div
          className="fixed bottom-6 z-[60] f-mono uppercase tracking-[0.2em] text-xs px-4 py-3 flex items-center gap-2 no-print"
          style={{
            background: PALETTE.ink, color: PALETTE.cream,
            border: `1px solid ${PALETTE.ink}`, borderRadius: '999px',
            insetInlineStart: '50%', transform: 'translateX(-50%)',
            boxShadow: '0 8px 24px rgba(27,27,25,0.25)',
          }}
        >
          <Check size={12} strokeWidth={2.5} color={PALETTE.sage} />
          {toast}
        </div>
      )}
    </div>
  );
}
