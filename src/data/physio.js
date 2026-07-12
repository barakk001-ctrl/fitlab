import { EX_VIDEOS } from './exercises.js';
import { STRETCH_VIDEOS } from './stretches.js';

// ------------------------------------------------------------
// Physiotherapy sessions — gentle mobility + strengthening per body area.
// Content follows common physio/rehab protocols (NHS, AAOS and similar
// patient handouts): pain-free range, slow tempo, high frequency.
// Each item runs as a timed block in the guided player; the cue carries
// the rep guidance. Rep-based moves get ~40s blocks, holds get 30s.
// Every item has a demo video: ids either reuse ones verified elsewhere in
// the app, or come from physio channels (AskDoctorJo, Physiotutors, NHS,
// Michigan Medicine, OrthoIndy...) — each verified playable in the actual
// youtube-nocookie embed. The query powers the "watch form" fallback link.
// ------------------------------------------------------------

const PHYSIO_AREAS = [
  {
    id: 'shoulders',
    label: { en: 'Shoulders', he: 'כתפיים' },
    tagline: { en: 'Rotator cuff, impingement, post-stiffness', he: 'שרוול מסובב, צביטה, נוקשות' },
    session: [
      { id: 'ph-pendulum', name: { en: 'Pendulum Swing', he: 'מטוטלת כתף' }, perSide: true, hold: 30, video: 'QF_ubbr_RUE', query: 'pendulum swing shoulder rehab',
        cue: { en: 'Lean on a table, let the arm hang heavy, draw slow small circles.', he: 'הישענו על שולחן, שחררו את היד כבדה, וציירו עיגולים קטנים ואיטיים.' } },
      { id: 'ph-wall-slide', name: { en: 'Wall Slides', he: 'החלקות קיר' }, perSide: false, hold: 40, video: 'Eaj_NG5_hIo', query: 'wall slides shoulder exercise',
        cue: { en: 'Back and forearms on the wall, slide arms up slowly — about 10 reps.', he: 'גב ואמות צמודים לקיר, החליקו את הידיים למעלה לאט — כ־10 חזרות.' } },
      { id: 'ph-scap-squeeze', name: { en: 'Scapular Squeezes', he: 'כיווץ שכמות' }, perSide: false, hold: 40, video: 'ouRhQE2iOI8', query: 'scapular squeeze exercise',
        cue: { en: 'Squeeze the shoulder blades together, hold 5 seconds — about 8 reps.', he: 'כווצו את השכמות זו לזו, החזיקו 5 שניות — כ־8 חזרות.' } },
      { id: 'ph-band-er', name: { en: 'Band External Rotation', he: 'סיבוב חיצוני עם גומייה' }, perSide: true, hold: 40, video: '_UvmPNGtlPM', query: 'band external rotation shoulder',
        cue: { en: 'Elbow pinned to your side, rotate the band outward slowly — about 10 reps.', he: 'מרפק צמוד לגוף, סובבו את הגומייה החוצה לאט — כ־10 חזרות.' } },
      { id: 'ph-doorway-chest', name: { en: 'Doorway Chest Opener', he: 'פתיחת חזה במשקוף' }, perSide: false, hold: 30, video: STRETCH_VIDEOS['doorway-chest'], query: 'doorway pec stretch',
        cue: { en: 'Forearms on the frame, step gently through until you feel a front-shoulder stretch.', he: 'אמות על המשקוף, צעדו קדימה בעדינות עד מתיחה בקדמת הכתף.' } },
      { id: 'ph-cross-arm', name: { en: 'Cross-Body Stretch', he: 'מתיחת יד חוצה' }, perSide: true, hold: 30, video: STRETCH_VIDEOS['cross-arm'], query: 'cross body shoulder stretch',
        cue: { en: 'Pull the arm across the chest with the other hand — shoulder low and relaxed.', he: 'משכו את היד לרוחב החזה עם היד השנייה — הכתף נמוכה ורפויה.' } },
      { id: 'ph-shoulder-disl', name: { en: 'Towel Dislocates', he: 'סיבובי מגבת' }, perSide: false, hold: 40, video: EX_VIDEOS['shoulder-disl'], query: 'shoulder dislocates towel',
        cue: { en: 'Very wide grip on a towel, slow circles overhead and back — about 8 reps.', he: 'אחיזה רחבה מאוד במגבת, סיבובים איטיים מעל הראש ובחזרה — כ־8 חזרות.' } },
    ],
  },
  {
    id: 'neck',
    label: { en: 'Neck', he: 'צוואר' },
    tagline: { en: 'Tech neck, stiffness, tension headaches', he: 'צוואר מסכים, נוקשות, כאבי ראש מתח' },
    session: [
      { id: 'ph-chin-tuck', name: { en: 'Chin Tucks', he: 'הכנסת סנטר' }, perSide: false, hold: 40, video: STRETCH_VIDEOS['chin-tuck'], query: 'chin tuck exercise',
        cue: { en: 'Glide the chin straight back (double chin), hold 3 seconds — about 10 reps.', he: 'החליקו את הסנטר ישר אחורה (סנטר כפול), החזיקו 3 שניות — כ־10 חזרות.' } },
      { id: 'ph-neck-rot', name: { en: 'Neck Rotations', he: 'סיבובי צוואר' }, perSide: false, hold: 40, video: STRETCH_VIDEOS['neck-rotation'], query: 'neck rotation exercise',
        cue: { en: 'Turn slowly to each side to a comfortable end range — no forcing.', he: 'סובבו לאט לכל צד עד סוף טווח נוח — בלי לדחוף.' } },
      { id: 'ph-neck-tilt', name: { en: 'Side Tilt Stretch', he: 'הטיה צידית' }, perSide: true, hold: 30, video: STRETCH_VIDEOS['neck-tilt'], query: 'neck side tilt stretch',
        cue: { en: 'Ear toward shoulder; the opposite hand reaches gently toward the floor.', he: 'אוזן לכיוון הכתף; היד הנגדית נמתחת בעדינות לכיוון הרצפה.' } },
      { id: 'ph-upper-trap', name: { en: 'Upper Trap Stretch', he: 'מתיחת טרפז עליון' }, perSide: true, hold: 30, video: STRETCH_VIDEOS['upper-trap'], query: 'upper trapezius stretch',
        cue: { en: 'Tilt and slightly rotate the head down toward the armpit, light hand assist.', he: 'הטו וסובבו קלות את הראש לכיוון בית השחי, בסיוע יד עדין.' } },
      { id: 'ph-neck-iso', name: { en: 'Isometric Holds', he: 'לחיצות איזומטריות' }, perSide: false, hold: 40, video: 'jly4Mp1yLvE', query: 'isometric neck exercise',
        cue: { en: 'Press palm to forehead, then each side — resist without moving, 5s per direction.', he: 'לחצו כף יד למצח ואז לכל צד — התנגדו בלי לזוז, 5 שניות לכל כיוון.' } },
    ],
  },
  {
    id: 'lower-back',
    label: { en: 'Lower Back', he: 'גב תחתון' },
    tagline: { en: 'Everyday stiffness, desk-bound aches', he: 'נוקשות יומיומית, כאבי ישיבה' },
    session: [
      { id: 'ph-pelvic-tilt', name: { en: 'Pelvic Tilts', he: 'הטיות אגן' }, perSide: false, hold: 40, video: 'RZi6di5IjW8', query: 'pelvic tilt exercise lower back',
        cue: { en: 'On your back, knees bent — flatten the low back into the floor, ~10 slow reps.', he: 'בשכיבה על הגב, ברכיים כפופות — הצמידו את הגב התחתון לרצפה, כ־10 חזרות איטיות.' } },
      { id: 'ph-cat-cow', name: { en: 'Cat-Cow', he: 'חתול-פרה' }, perSide: false, hold: 45, video: STRETCH_VIDEOS['cat-cow'], query: 'cat cow exercise',
        cue: { en: 'Move slowly with your breath — round up, then arch down.', he: 'נעו לאט עם הנשימה — עיגול למעלה, קשת למטה.' } },
      { id: 'ph-bird-dog', name: { en: 'Bird Dog', he: 'ציפור-כלב' }, perSide: false, hold: 45, video: EX_VIDEOS['bird-dog'], query: 'bird dog exercise',
        cue: { en: 'Opposite arm and leg, slow and level hips — about 6 per side.', he: 'יד ורגל נגדיות, לאט ועם אגן יציב — כ־6 לכל צד.' } },
      { id: 'ph-dead-bug', name: { en: 'Dead Bug', he: 'חרק מת' }, perSide: false, hold: 45, video: EX_VIDEOS['dead-bug'], query: 'dead bug exercise',
        cue: { en: 'Low back stays glued down while opposite arm and leg lower away.', he: 'הגב התחתון נשאר צמוד בזמן שיד ורגל נגדיות יורדות.' } },
      { id: 'ph-glute-bridge-lb', name: { en: 'Glute Bridge', he: 'גשר ישבן' }, perSide: false, hold: 45, video: EX_VIDEOS['glute-bridge'], query: 'glute bridge exercise',
        cue: { en: 'Drive through the heels, squeeze at the top for 2 seconds — about 10 reps.', he: 'דחפו דרך העקבים, כווצו למעלה 2 שניות — כ־10 חזרות.' } },
      { id: 'ph-knees-chest', name: { en: 'Knees to Chest', he: 'ברכיים לחזה' }, perSide: false, hold: 30, video: STRETCH_VIDEOS['knees-chest'], query: 'knees to chest stretch',
        cue: { en: 'Hug both knees in and breathe slowly.', he: 'חבקו את שתי הברכיים ונשמו לאט.' } },
      { id: 'ph-child-pose', name: { en: "Child's Pose", he: 'תנוחת ילד' }, perSide: false, hold: 40, video: STRETCH_VIDEOS['child-pose'], query: 'childs pose',
        cue: { en: 'Sink the hips back to the heels, arms long, let the back release.', he: 'הורידו את האגן לעקבים, ידיים ארוכות, שחררו את הגב.' } },
    ],
  },
  {
    id: 'hips',
    label: { en: 'Hips', he: 'ירכיים' },
    tagline: { en: 'Tight hips, weak glutes, sitting all day', he: 'ירכיים תפוסות, ישיבה ממושכת' },
    session: [
      { id: 'ph-clamshell', name: { en: 'Clamshells', he: 'צדפות' }, perSide: true, hold: 40, video: 'O2KPabIoPPk', query: 'clamshell exercise glutes',
        cue: { en: 'Side-lying, knees bent, feet together — open the top knee slowly, ~12 reps.', he: 'שכיבה על הצד, ברכיים כפופות — פתחו את הברך העליונה לאט, כ־12 חזרות.' } },
      { id: 'ph-glute-bridge-hip', name: { en: 'Glute Bridge', he: 'גשר ישבן' }, perSide: false, hold: 45, video: EX_VIDEOS['glute-bridge'], query: 'glute bridge exercise',
        cue: { en: 'Slow up, 2-second squeeze, slow down — about 10 reps.', he: 'עלייה איטית, כיווץ 2 שניות, ירידה איטית — כ־10 חזרות.' } },
      { id: 'ph-side-leg-raise', name: { en: 'Side-Lying Leg Raise', he: 'הרמת רגל בצד' }, perSide: true, hold: 40, video: 'EwBJKBa4PKU', query: 'side lying leg raise hip',
        cue: { en: 'Top leg straight and slightly back, lift slowly without rolling — ~10 reps.', he: 'רגל עליונה ישרה ומעט אחורה, הרימו לאט בלי להתגלגל — כ־10 חזרות.' } },
      { id: 'ph-band-walk', name: { en: 'Lateral Band Walk', he: 'הליכה צידית עם גומייה' }, perSide: false, hold: 40, video: 'snbNxUIUQPc', query: 'lateral band walk monster walk',
        cue: { en: 'Band above the knees, quarter squat, small side-steps — a few each way.', he: 'גומייה מעל הברכיים, סקוואט חלקי, צעדים קטנים הצידה — כמה לכל כיוון.' } },
      { id: 'ph-hip-flexor', name: { en: 'Hip Flexor Stretch', he: 'מתיחת כופפי ירך' }, perSide: true, hold: 30, video: STRETCH_VIDEOS['hip-flexor'], query: 'kneeling hip flexor stretch',
        cue: { en: 'Half-kneel, tuck the tailbone, shift gently forward.', he: 'כריעה על ברך אחת, אגן אסוף, דחיפה עדינה קדימה.' } },
      { id: 'ph-fig-four', name: { en: 'Figure-Four Stretch', he: 'מתיחת ארבע' }, perSide: true, hold: 30, video: STRETCH_VIDEOS['fig-four'], query: 'figure four stretch',
        cue: { en: 'Ankle over the opposite knee, pull the thigh in until the glute stretches.', he: 'קרסול על הברך הנגדית, משכו את הירך עד מתיחה בישבן.' } },
      { id: 'ph-9090', name: { en: '90/90 Hip Switch', he: 'מעברי 90/90' }, perSide: false, hold: 45, video: EX_VIDEOS['90-90'], query: '90 90 hip mobility',
        cue: { en: 'Sit tall, rotate both knees side to side slowly, pausing at each end.', he: 'שבו זקוף, סובבו את שתי הברכיים מצד לצד לאט, עם עצירה בכל קצה.' } },
    ],
  },
  {
    id: 'knees',
    label: { en: 'Knees', he: 'ברכיים' },
    tagline: { en: "Runner's knee, post-strain rebuilding", he: 'ברך רצים, חיזוק אחרי מתיחה' },
    session: [
      { id: 'ph-quad-set', name: { en: 'Quad Sets', he: 'כיווצי ארבע-ראשי' }, perSide: false, hold: 40, video: 'au62CidApd0', query: 'quad sets knee rehab',
        cue: { en: 'Leg straight — tighten the thigh, press the knee down, hold 5s, ~8 reps.', he: 'רגל ישרה — כווצו את הירך, לחצו את הברך למטה, החזיקו 5 שניות, כ־8 חזרות.' } },
      { id: 'ph-slr', name: { en: 'Straight-Leg Raise', he: 'הרמת רגל ישרה' }, perSide: true, hold: 40, video: 'Ka19yzAlIGY', query: 'straight leg raise knee rehab',
        cue: { en: 'Lock the knee, lift to 45°, lower with control — about 10 reps.', he: 'נעלו את הברך, הרימו ל־45°, הורידו בשליטה — כ־10 חזרות.' } },
      { id: 'ph-heel-slide', name: { en: 'Heel Slides', he: 'החלקות עקב' }, perSide: true, hold: 40, video: 'Bz0wSFRjH2c', query: 'heel slides knee exercise',
        cue: { en: 'Slide the heel toward you as far as comfortable, then back — ~10 reps.', he: 'החליקו את העקב אליכם עד כמה שנוח, ואז חזרה — כ־10 חזרות.' } },
      { id: 'ph-glute-bridge-knee', name: { en: 'Glute Bridge', he: 'גשר ישבן' }, perSide: false, hold: 45, video: EX_VIDEOS['glute-bridge'], query: 'glute bridge exercise',
        cue: { en: 'Strong glutes protect knees — slow reps, squeeze at the top.', he: 'ישבן חזק מגן על הברכיים — חזרות איטיות, כיווץ למעלה.' } },
      { id: 'ph-band-tke', name: { en: 'Band Terminal Knee Extension', he: 'יישור ברך עם גומייה' }, perSide: true, hold: 40, video: 'nfJ5QCx_fSg', query: 'terminal knee extension band',
        cue: { en: 'Band behind the knee, straighten fully and squeeze the thigh — about 10 reps.', he: 'גומייה מאחורי הברך, יישרו עד הסוף וכווצו את הירך — כ־10 חזרות.' } },
      { id: 'ph-wall-sit', name: { en: 'Mini Wall Sit', he: 'ישיבת קיר חלקית' }, perSide: false, hold: 30, video: 'JaZNYM3zAP0', query: 'wall sit exercise',
        cue: { en: 'Slide down only ~30° — stay in a pain-free range and breathe.', he: 'רדו רק כ־30° — הישארו בטווח ללא כאב ונשמו.' } },
      { id: 'ph-step-up', name: { en: 'Low Step-Up', he: 'עליית מדרגה נמוכה' }, perSide: true, hold: 40, video: EX_VIDEOS['step-up'], query: 'step up exercise low box',
        cue: { en: 'Low step, push through the whole foot, lower down slowly — ~8 reps.', he: 'מדרגה נמוכה, דחפו דרך כל כף הרגל, רדו לאט — כ־8 חזרות.' } },
      { id: 'ph-quad-stretch', name: { en: 'Standing Quad Stretch', he: 'מתיחת ארבע-ראשי בעמידה' }, perSide: true, hold: 30, video: STRETCH_VIDEOS['standing-quad'], query: 'standing quad stretch',
        cue: { en: 'Heel to glute, knees together, tail tucked — hold something for balance.', he: 'עקב לישבן, ברכיים צמודות, אגן אסוף — היעזרו במשהו לשיווי משקל.' } },
    ],
  },
  {
    id: 'ankles',
    label: { en: 'Ankles', he: 'קרסוליים' },
    tagline: { en: 'Post-sprain stability, stiff ankles', he: 'יציבות אחרי נקע, קרסול נוקשה' },
    session: [
      { id: 'ph-ankle-circle', name: { en: 'Ankle Circles', he: 'סיבובי קרסול' }, perSide: true, hold: 30, video: 'mzTQGYGI0Ng', query: 'ankle circles exercise',
        cue: { en: 'Slow full circles, both directions — move through the whole range.', he: 'עיגולים מלאים ואיטיים, לשני הכיוונים — בכל הטווח.' } },
      { id: 'ph-ankle-abc', name: { en: 'Ankle Alphabet', he: 'אלפבית קרסול' }, perSide: true, hold: 40, video: 'YTVZUMuEKPA', query: 'ankle alphabet exercise',
        cue: { en: 'Draw letters in the air with the big toe — as far as comfortable.', he: 'ציירו אותיות באוויר עם הבוהן — עד כמה שנוח.' } },
      { id: 'ph-calf-raise', name: { en: 'Calf Raises', he: 'עליות עקבים' }, perSide: false, hold: 40, video: 'Uyg2QR1WAq8', query: 'calf raise exercise',
        cue: { en: 'Up fast-ish, 3 seconds down — about 12 reps. Hold a wall if needed.', he: 'עלייה מהירה, 3 שניות ירידה — כ־12 חזרות. היעזרו בקיר במידת הצורך.' } },
      { id: 'ph-band-eversion', name: { en: 'Band Ankle Eversion', he: 'הטיית קרסול החוצה עם גומייה' }, perSide: true, hold: 40, video: 'xfrncpP5ONQ', query: 'resisted ankle eversion band',
        cue: { en: 'Band around the forefoot, turn the sole outward against it — about 10 slow reps.', he: 'גומייה סביב קדמת כף הרגל, סובבו את הסוליה החוצה כנגדה — כ־10 חזרות איטיות.' } },
      { id: 'ph-heel-toe-walk', name: { en: 'Heel & Toe Walks', he: 'הליכה על עקבים ובהונות' }, perSide: false, hold: 40, video: 'f1Jt0xVqvtI', query: 'heel walk toe walk exercise',
        cue: { en: 'A few meters on the heels, then a few on the toes — repeat.', he: 'כמה מטרים על העקבים, ואז כמה על הבהונות — וחוזר חלילה.' } },
      { id: 'ph-sl-balance', name: { en: 'Single-Leg Balance', he: 'עמידה על רגל אחת' }, perSide: true, hold: 30, video: 'Wb68ze1oH5c', query: 'single leg balance ankle rehab',
        cue: { en: 'Eyes forward, soft knee. Too easy? Close your eyes.', he: 'מבט קדימה, ברך רכה. קל מדי? עצמו עיניים.' } },
      { id: 'ph-wall-calf', name: { en: 'Wall Calf Stretch', he: 'מתיחת תאומים בקיר' }, perSide: true, hold: 30, video: STRETCH_VIDEOS['wall-calf'], query: 'wall calf stretch',
        cue: { en: 'Back leg straight, heel down, lean into the wall.', he: 'רגל אחורית ישרה, עקב למטה, הישענו אל הקיר.' } },
    ],
  },
  {
    id: 'wrists',
    label: { en: 'Wrists & Elbows', he: 'שורשי כף יד ומרפקים' },
    tagline: { en: 'Desk wrists, tennis/golfer elbow', he: 'עומס מקלדת, מרפק טניס/גולף' },
    session: [
      { id: 'ph-wrist-circle', name: { en: 'Wrist Circles', he: 'סיבובי שורש כף יד' }, perSide: false, hold: 30, video: 'wRSk1_C6yOM', query: 'wrist circles exercise',
        cue: { en: 'Slow circles both directions, fingers relaxed.', he: 'עיגולים איטיים לשני הכיוונים, אצבעות רפויות.' } },
      { id: 'ph-wrist-flexor', name: { en: 'Wrist Flexor Stretch', he: 'מתיחת כופפי שורש' }, perSide: true, hold: 30, video: STRETCH_VIDEOS['wrist-flexor'], query: 'wrist flexor stretch',
        cue: { en: 'Arm straight, palm up — gently pull the fingers back and down.', he: 'יד ישרה, כף יד למעלה — משכו בעדינות את האצבעות אחורה ולמטה.' } },
      { id: 'ph-wrist-extensor', name: { en: 'Wrist Extensor Stretch', he: 'מתיחת פושטי שורש' }, perSide: true, hold: 30, video: STRETCH_VIDEOS['wrist-extensor'], query: 'wrist extensor stretch',
        cue: { en: 'Arm straight, palm down — press the back of the hand gently toward you.', he: 'יד ישרה, כף יד למטה — לחצו בעדינות את גב כף היד אליכם.' } },
      { id: 'ph-prayer', name: { en: 'Prayer Stretch', he: 'מתיחת תפילה' }, perSide: false, hold: 30, video: STRETCH_VIDEOS['prayer-stretch'], query: 'prayer stretch wrists',
        cue: { en: 'Palms together at the chest, lower the hands until the forearms stretch.', he: 'כפות ידיים צמודות מול החזה, הורידו את הידיים עד מתיחה באמות.' } },
      { id: 'ph-ecc-wrist', name: { en: 'Eccentric Wrist Curls', he: 'כפיפות שורש אקסצנטריות' }, perSide: true, hold: 40, video: 'QooK7w_zyLE', query: 'eccentric wrist curl tennis elbow',
        cue: { en: 'Light weight or a bottle — lift with help, lower alone over 3 seconds, ~10 reps.', he: 'משקל קל או בקבוק — הרימו בעזרה, הורידו לבד לאורך 3 שניות, כ־10 חזרות.' } },
      { id: 'ph-band-wrist-ext', name: { en: 'Band Wrist Extension', he: 'פשיטת שורש עם גומייה' }, perSide: true, hold: 40, video: '-cjtWEtilMc', query: 'wrist extension resistance band',
        cue: { en: 'Anchor the band under your foot, lift the back of the hand up slowly — about 10 reps.', he: 'עגנו את הגומייה מתחת לכף הרגל, הרימו את גב כף היד לאט — כ־10 חזרות.' } },
      { id: 'ph-forearm-rot', name: { en: 'Forearm Rotations', he: 'סיבובי אמה' }, perSide: false, hold: 40, video: '-LfyhlA9UNM', query: 'forearm pronation supination exercise',
        cue: { en: 'Elbows at your sides, turn palms up and down slowly — about 10 reps.', he: 'מרפקים צמודים לגוף, סובבו כפות ידיים למעלה ולמטה לאט — כ־10 חזרות.' } },
    ],
  },
];

export { PHYSIO_AREAS };
