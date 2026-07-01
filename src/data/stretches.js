import { Armchair, Moon, PersonStanding, StretchHorizontal, Sunrise, Wind } from 'lucide-react';

// Target areas — the body-part picker
const STRETCH_AREAS = [
  { id: 'neck',       label: { en: 'Neck',        he: 'צוואר' },        icon: PersonStanding },
  { id: 'shoulders',  label: { en: 'Shoulders',   he: 'כתפיים' },       icon: PersonStanding },
  { id: 'chest',      label: { en: 'Chest',       he: 'חזה' },          icon: PersonStanding },
  { id: 'back',       label: { en: 'Back & Spine',he: 'גב ועמוד שדרה' },icon: PersonStanding },
  { id: 'hips',       label: { en: 'Hips',        he: 'ירכיים' },       icon: PersonStanding },
  { id: 'glutes',     label: { en: 'Glutes',      he: 'ישבן' },         icon: PersonStanding },
  { id: 'hamstrings', label: { en: 'Hamstrings',  he: 'ירך אחורית' },   icon: PersonStanding },
  { id: 'quads',      label: { en: 'Quads',       he: 'ארבע ראשי' },    icon: PersonStanding },
  { id: 'calves',     label: { en: 'Calves',      he: 'שוקיים' },       icon: PersonStanding },
  { id: 'wrists',     label: { en: 'Wrists',      he: 'מפרקי כף יד' },  icon: PersonStanding },
];

// Routine types — preset structures.
// Hold durations follow mainstream flexibility guidance: a single static stretch
// of ~30s is the canonical recommendation for general flexibility (ACSM 2011
// position stand: 10–30s; Mayo Clinic: ~30s; AHA: 10–30s), and holds beyond 30s
// give no extra range-of-motion benefit for general flexibility (Konrad et al.,
// 2023 meta-analysis). 30–60s is reserved for deeper / restorative work. All
// stretches should be taken only to mild tension, never pain.
const STRETCH_ROUTINES = {
  morning: {
    id: 'morning',
    label: { en: 'Morning Mobility', he: 'ניידות בוקר' },
    icon: Sunrise,
    tagline: { en: 'Wake the body up. Gentle, full-range, energizing.',
               he: 'להעיר את הגוף. עדין, טווח מלא, ממריץ.' },
    blurb: { en: 'A flowing sequence to loosen everything after sleep. Short holds, no deep stretching cold.',
             he: 'רצף זורם לשחרור הכל אחרי השינה. החזקות קצרות, בלי מתיחות עמוקות בקור.' },
    defaultHold: 30,
    areas: ['neck', 'shoulders', 'back', 'hips', 'hamstrings'],
  },
  cooldown: {
    id: 'cooldown',
    label: { en: 'Post-Workout Cool-Down', he: 'שחרור אחרי אימון' },
    icon: Wind,
    tagline: { en: 'Bring the heart rate down. Lengthen what you just worked.',
               he: 'להוריד את הדופק. להאריך את מה שעבדתם.' },
    blurb: { en: 'Static stretches to aid recovery and flexibility after training.',
             he: 'מתיחות סטטיות לשיפור התאוששות וגמישות אחרי אימון.' },
    defaultHold: 30,
    areas: ['quads', 'hamstrings', 'glutes', 'chest', 'shoulders'],
  },
  full: {
    id: 'full',
    label: { en: 'Full Flexibility Session', he: 'מפגש גמישות מלא' },
    icon: StretchHorizontal,
    tagline: { en: 'Dedicated practice. Build real range over time.',
               he: 'תרגול ייעודי. לבנות טווח אמיתי לאורך זמן.' },
    blurb: { en: 'A complete session targeting deep flexibility — splits, backbends, deep hip and hamstring work.',
             he: 'מפגש מלא לגמישות עמוקה — שפגטים, גישור, עבודה עמוקה על ירכיים וירך אחורית.' },
    defaultHold: 45,
    areas: ['hips', 'hamstrings', 'quads', 'glutes', 'back', 'shoulders'],
  },
  desk: {
    id: 'desk',
    label: { en: 'Desk Recovery', he: 'שחרור מהשולחן' },
    icon: Armchair,
    tagline: { en: 'For stiff days at a screen. Undo the slouch.',
               he: 'לימים נוקשים מול מסך. לבטל את הכיפוף.' },
    blurb: { en: 'Counters the effects of sitting — opens hips, chest, neck and wrists. Can be done at your desk.',
             he: 'מנטרל את השפעות הישיבה — פותח ירכיים, חזה, צוואר ומפרקי יד. אפשר לבצע ליד השולחן.' },
    defaultHold: 30,
    areas: ['neck', 'shoulders', 'chest', 'back', 'hips', 'wrists'],
  },
  evening: {
    id: 'evening',
    label: { en: 'Evening Wind-Down', he: 'הרגעה לפני שינה' },
    icon: Moon,
    tagline: { en: 'Slow and restorative. Calm the nervous system.',
               he: 'איטי ומשקם. להרגיע את מערכת העצבים.' },
    blurb: { en: 'Gentle, longer holds to release tension before bed and improve sleep quality.',
             he: 'החזקות עדינות וארוכות לשחרור מתח לפני השינה ולשיפור איכות השינה.' },
    defaultHold: 45,
    areas: ['neck', 'back', 'hips', 'glutes', 'hamstrings'],
  },
};

// Stretch library — names stay English (matches YouTube), with HE translations
// area: which body part · hold: default seconds · perSide: needs both sides
const STRETCHES = {
  // NECK
  'neck-tilt':       { area: 'neck',       name: { en: 'Neck Side Tilt',           he: 'הטיית צוואר לצד' },        perSide: true,  query: 'neck side tilt stretch' },
  'neck-rotation':   { area: 'neck',       name: { en: 'Neck Rotation',            he: 'סיבוב צוואר' },            perSide: true,  query: 'neck rotation stretch' },
  'chin-tuck':       { area: 'neck',       name: { en: 'Chin Tuck',                he: 'משיכת סנטר' },             perSide: false, query: 'chin tuck exercise' },
  'upper-trap':      { area: 'neck',       name: { en: 'Upper Trap Stretch',       he: 'מתיחת טרפז עליון' },       perSide: true,  query: 'upper trapezius stretch' },

  // SHOULDERS
  'cross-arm':       { area: 'shoulders',  name: { en: 'Cross-Body Shoulder',      he: 'מתיחת כתף חוצה גוף' },     perSide: true,  query: 'cross body shoulder stretch' },
  'shoulder-roll':   { area: 'shoulders',  name: { en: 'Shoulder Rolls',           he: 'גלגול כתפיים' },           perSide: false, query: 'shoulder rolls mobility' },
  'doorway-shoulder':{ area: 'shoulders',  name: { en: 'Doorway Shoulder Stretch', he: 'מתיחת כתף במשקוף' },       perSide: true,  query: 'doorway shoulder stretch' },
  'thread-needle':   { area: 'shoulders',  name: { en: 'Thread the Needle',        he: 'השחלת המחט' },             perSide: true,  query: 'thread the needle stretch' },

  // CHEST
  'doorway-chest':   { area: 'chest',      name: { en: 'Doorway Chest Stretch',    he: 'מתיחת חזה במשקוף' },       perSide: false, query: 'doorway chest stretch' },
  'chest-floor':     { area: 'chest',      name: { en: 'Floor Chest Opener',       he: 'פתיחת חזה ברצפה' },        perSide: true,  query: 'floor chest opener stretch' },
  'cobra':           { area: 'chest',      name: { en: 'Cobra Pose',               he: 'תנוחת הקוברה' },           perSide: false, query: 'cobra pose stretch' },

  // BACK & SPINE
  'cat-cow':         { area: 'back',       name: { en: 'Cat-Cow',                  he: 'חתול-פרה' },               perSide: false, query: 'cat cow stretch' },
  'child-pose':      { area: 'back',       name: { en: "Child's Pose",             he: 'תנוחת הילד' },             perSide: false, query: 'childs pose stretch' },
  'seated-twist':    { area: 'back',       name: { en: 'Seated Spinal Twist',      he: 'פיתול עמוד שדרה בישיבה' }, perSide: true,  query: 'seated spinal twist stretch' },
  'knees-chest':     { area: 'back',       name: { en: 'Knees to Chest',           he: 'ברכיים לחזה' },            perSide: false, query: 'knees to chest stretch' },
  'sphinx':          { area: 'back',       name: { en: 'Sphinx Pose',              he: 'תנוחת הספינקס' },          perSide: false, query: 'sphinx pose stretch' },

  // HIPS
  'pigeon':          { area: 'hips',       name: { en: 'Pigeon Pose',              he: 'תנוחת היונה' },            perSide: true,  query: 'pigeon pose hip stretch' },
  'butterfly':       { area: 'hips',       name: { en: 'Butterfly Stretch',        he: 'מתיחת הפרפר' },            perSide: false, query: 'butterfly stretch hips' },
  'lizard':          { area: 'hips',       name: { en: 'Lizard Lunge',             he: 'זינוק הלטאה' },            perSide: true,  query: 'lizard lunge hip stretch' },
  'frog':            { area: 'hips',       name: { en: 'Frog Stretch',             he: 'מתיחת הצפרדע' },           perSide: false, query: 'frog stretch hips' },
  'hip-flexor':      { area: 'hips',       name: { en: 'Kneeling Hip Flexor',      he: 'מכופף ירך בכריעה' },       perSide: true,  query: 'kneeling hip flexor stretch' },

  // GLUTES
  'fig-four':        { area: 'glutes',     name: { en: 'Figure-4 Stretch',         he: 'מתיחת ספרה 4' },           perSide: true,  query: 'figure 4 glute stretch' },
  'seated-glute':    { area: 'glutes',     name: { en: 'Seated Glute Stretch',     he: 'מתיחת ישבן בישיבה' },      perSide: true,  query: 'seated glute stretch' },
  'glute-bridge-hold':{ area: 'glutes',    name: { en: 'Glute Bridge Hold',        he: 'החזקת גשר ישבן' },         perSide: false, query: 'glute bridge hold' },

  // HAMSTRINGS
  'standing-ham':    { area: 'hamstrings', name: { en: 'Standing Hamstring',       he: 'ירך אחורית בעמידה' },      perSide: true,  query: 'standing hamstring stretch' },
  'seated-fwd':      { area: 'hamstrings', name: { en: 'Seated Forward Fold',      he: 'קיפול קדמי בישיבה' },      perSide: false, query: 'seated forward fold stretch' },
  'supine-ham':      { area: 'hamstrings', name: { en: 'Lying Hamstring (strap)',  he: 'ירך אחורית בשכיבה' },      perSide: true,  query: 'lying hamstring stretch strap' },

  // QUADS
  'standing-quad':   { area: 'quads',      name: { en: 'Standing Quad Stretch',    he: 'ארבע ראשי בעמידה' },       perSide: true,  query: 'standing quad stretch' },
  'couch-stretch':   { area: 'quads',      name: { en: 'Couch Stretch',            he: 'מתיחת הספה' },             perSide: true,  query: 'couch stretch quad' },
  'kneeling-quad':   { area: 'quads',      name: { en: 'Kneeling Quad Stretch',    he: 'ארבע ראשי בכריעה' },       perSide: true,  query: 'kneeling quad stretch' },

  // CALVES
  'wall-calf':       { area: 'calves',     name: { en: 'Wall Calf Stretch',        he: 'מתיחת שוק בקיר' },         perSide: true,  query: 'wall calf stretch' },
  'downward-dog':    { area: 'calves',     name: { en: 'Downward Dog',             he: 'כלב מביט מטה' },           perSide: false, query: 'downward dog stretch' },
  'step-calf':       { area: 'calves',     name: { en: 'Step Calf Drop',           he: 'הורדת שוק ממדרגה' },       perSide: true,  query: 'step calf stretch' },

  // WRISTS
  'wrist-flexor':    { area: 'wrists',     name: { en: 'Wrist Flexor Stretch',     he: 'מתיחת כופף שורש כף יד' },  perSide: true,  query: 'wrist flexor stretch' },
  'wrist-extensor':  { area: 'wrists',     name: { en: 'Wrist Extensor Stretch',   he: 'מתיחת יישר שורש כף יד' },  perSide: true,  query: 'wrist extensor stretch' },
  'prayer-stretch':  { area: 'wrists',     name: { en: 'Prayer Stretch',           he: 'מתיחת התפילה' },           perSide: false, query: 'prayer wrist stretch' },
};

// Curated, validated YouTube demonstration videos per stretch (oEmbed-checked, public + embeddable).
// Falls back to the YouTube search link when an id has no entry here.
const STRETCH_VIDEOS = {
  'neck-tilt': '54y0JAT46vE',
  'neck-rotation': 'ubQjw0p_WDA',
  'chin-tuck': 'u8C5LgpK3r4',
  'upper-trap': 'YVeNysiuHz0',
  'cross-arm': 'aIq0fLi8iak',
  'shoulder-roll': 'IKJZL4hvppw',
  'doorway-shoulder': 'Dmm8_S23I74',
  'thread-needle': 'UomKzkyp6kQ',
  'doorway-chest': 'M850sCj9LHQ',
  'chest-floor': 'ajyYXAERp3k',
  'cobra': 'YYudWYM5Q9g',
  'cat-cow': 'jGR2LTqGI2Y',
  'child-pose': 'kH12QrSGedM',
  'seated-twist': 'ciGK6HyYqV4',
  'knees-chest': 'LugNxxfIdvo',
  'sphinx': 'beQs5ChCZ0U',
  'pigeon': '46phRH_09yM',
  'butterfly': 'd0GxYvs3j0M',
  'lizard': 'Abtm3CF_cVE',
  'frog': 'E3hA2p1d57g',
  'hip-flexor': 'Q4Ko275cluo',
  'fig-four': '5BqMsUYg_Q8',
  'seated-glute': 'e3DZzHcwk3o',
  'glute-bridge-hold': 'FFLNpa2CN_Q',
  'standing-ham': '2s2t3mEYZNo',
  'seated-fwd': 'oJX8EKF3TqM',
  'supine-ham': 'Il1L75v6gq0',
  'standing-quad': 'kia2OzZiwqw',
  'couch-stretch': 'nTJaGnjUkTY',
  'kneeling-quad': 'dLnIM3KDReo',
  'wall-calf': 'YTYQo4WvJHA',
  'downward-dog': 'ZnM3u0rU6ws',
  'step-calf': 'drJYhTQWcAk',
  'wrist-flexor': 'i-JV2PsFzWA',
  'wrist-extensor': '_uINTR_7X-g',
  'prayer-stretch': 'vjhQCfF5Y-g',
};

// Per-video start time (seconds) — skips intro/talking so the embed opens
// exactly when the exercise demonstration begins. Keyed by YouTube id.
// Populated from frame-by-frame analysis of each video. Videos that already
// open on the movement are omitted (start 0).
const VIDEO_START = {
  '54y0JAT46vE': 23, 'u8C5LgpK3r4': 11, 'YVeNysiuHz0': 23, 'aIq0fLi8iak': 5,
  'IKJZL4hvppw': 34, 'Dmm8_S23I74': 35, 'UomKzkyp6kQ': 12, 'M850sCj9LHQ': 14,
  'ajyYXAERp3k': 32, 'YYudWYM5Q9g': 6, 'kH12QrSGedM': 10, 'LugNxxfIdvo': 6,
  'beQs5ChCZ0U': 5, '46phRH_09yM': 28, 'E3hA2p1d57g': 12, 'Q4Ko275cluo': 11,
  '5BqMsUYg_Q8': 3, 'e3DZzHcwk3o': 35, '2s2t3mEYZNo': 4, 'oJX8EKF3TqM': 11,
  'Il1L75v6gq0': 4, 'kia2OzZiwqw': 7, 'dLnIM3KDReo': 14, 'YTYQo4WvJHA': 17,
  'drJYhTQWcAk': 14, 'i-JV2PsFzWA': 4, '_uINTR_7X-g': 5, 'S0H0JxLAOAY': 14,
  '6mf0oa2GGUc': 20, 'G4elY53UFOQ': 5, 'hglQExHCM9Q': 3, 'P-yaD24bUE8': 8,
  'hiLF_pF3EJM': 34, 'GxsLrTzyGUU': 22, 'PWJU5grrh4Y': 5, 'sSESeQAir2M': 12,
  'L9KZfxT654Y': 12, 'VUl8R0kn6v4': 4, '61zbhuRiwQg': 8, 'gRVjAtPip0Y': 5,
  'xhEhjF5ozuY': 11, 'sK4Rvug6ufo': 6, '5QFjmotLfW4': 10, '1jYq9QQEWqE': 14,
  '3R14MnZbcpw': 42, 'KEfazWGOUok': 20, 'VpuoE246W1Y': 5, 'j5PzQyhzk2I': 13,
  'XxV8q2Qxhrc': 48, 'G8l_8chR5BE': 30, 'nMFCMNKnLgQ': 14, '7BkgqzC6WsM': 88,
  '_b6ch2nIchk': 33, '11F_O_sZ1Z4': 26, 'dnpDUwqMX04': 102, 'mH5Sfb_KTGg': 26,
  'yPvAj_X_5NM': 12, 'G2hv_NYhM-A': 6, 'CQk4MHY2_Tc': 7, 'Q7VZf-2SwA0': 14,
  'D0GwAezTvtg': 21, 'nAWIl3ABckM': 26, 'Hbh_bMsSJzA': 8, '4zWu1yuJ0_g': 2,
  'Pbmj6xPo-Hw': 2, '94AXT7D3bKY': 16, 'dQqApCGd5Ss': 11, 'I34ysEkPK7w': 11,
  'vl5nUdE9mWM': 19, 'YyvSfVjQeL0': 54, '8e-xsVYFCVA': 44, '2tFpdTfIbKw': 2,
  'qTiqOyqQGs8': 11, '7p-Ma0eksaY': 4, 'aCcdDB_Y13g': 60, 'JaZNYM3zAP0': 6,
  'hhq86gJvrvo': 10, 'gKA5LBy7WAI': 5, 'jGR2LTqGI2Y': 16, '9ZknEYboBOQ': 7,
};

// Build a YouTube embed URL for a video id. autoplay → muted looping ambient demo.
// Starts at VIDEO_START[video] when known.
function stretchEmbedSrc(video, { autoplay = false } = {}) {
  const params = ['rel=0', 'modestbranding=1', 'playsinline=1'];
  const start = VIDEO_START[video];
  if (start > 0) params.push(`start=${start}`);
  if (autoplay) params.push('autoplay=1', 'mute=1', 'loop=1', `playlist=${video}`);
  return `https://www.youtube-nocookie.com/embed/${video}?${params.join('&')}`;
}

// Build a stretch routine from a routine type + chosen areas + hold override.
// If areas are chosen, they filter/extend the routine's default areas.
function buildStretchRoutine(routineId, chosenAreas, holdOverride) {
  const routine = STRETCH_ROUTINES[routineId];
  if (!routine) return [];
  // Effective areas: if user chose specific areas, use those; otherwise routine defaults
  const areas = (chosenAreas && chosenAreas.length > 0) ? chosenAreas : routine.areas;
  const hold = holdOverride || routine.defaultHold;

  const items = [];
  areas.forEach(area => {
    // Pick up to 2 stretches per area for a focused routine
    const inArea = Object.entries(STRETCHES).filter(([, s]) => s.area === area);
    const picks = inArea.slice(0, 2);
    picks.forEach(([id, s]) => {
      items.push({
        id,
        ...s,
        video: STRETCH_VIDEOS[id] || null,
        hold,
        // Per-side stretches get listed once but timer doubles via perSide flag
      });
    });
  });
  return items;
}

// Estimate total routine duration in seconds (accounting for per-side doubling)
function estimateRoutineDuration(items) {
  return items.reduce((sum, it) => sum + (it.perSide ? it.hold * 2 : it.hold), 0);
}

export { STRETCH_AREAS, STRETCH_ROUTINES, STRETCHES, STRETCH_VIDEOS, VIDEO_START, stretchEmbedSrc, buildStretchRoutine, estimateRoutineDuration };
