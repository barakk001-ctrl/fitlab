import { Activity, Dumbbell, Flame, Heart } from 'lucide-react';

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

export { AGE_GROUPS, GOALS, SPLITS };
