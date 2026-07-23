
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
  'towel-row':    { name: 'Doorway Towel Row',   movement: 'h-pull', equip: 'cali', ages: ['20s','30s','40s'], query: 'towel row door bodyweight' },
  'band-row':     { name: 'Band Row',            movement: 'h-pull', equip: 'cali', ages: ['20s','30s','40s'], query: 'resistance band bent over row' },
  'band-pulldown':{ name: 'Band Lat Pulldown',   movement: 'v-pull', equip: 'cali', ages: ['20s','30s','40s'], query: 'resistance band lat pulldown' },

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

// Curated, validated YouTube demonstration videos per exercise (each checked for
// public availability via oEmbed AND playableInEmbed:true). Falls back to the
// YouTube search link when an id has no entry here.
const EX_VIDEOS = {
  'bb-squat': 'S0H0JxLAOAY', 'goblet-squat': '6mf0oa2GGUc', 'leg-press': 'G4elY53UFOQ',
  'hack-squat': 'hglQExHCM9Q', 'bw-squat': 'P-yaD24bUE8', 'jump-squat': 'tZSYZdtbONc',
  'pistol-squat': 'NTf8YRWfOHY', 'split-squat': 'hiLF_pF3EJM', 'deadlift': 'GxsLrTzyGUU',
  'rdl': 'uhghy9pFIPY', 'trap-bar-dl': 'PWJU5grrh4Y', 'kb-swing': 'sSESeQAir2M',
  'glute-bridge': 'L9KZfxT654Y', 'sl-glute': 'VUl8R0kn6v4', 'good-morning': '61zbhuRiwQg',
  'bench': 'gRVjAtPip0Y', 'db-bench': 'xhEhjF5ozuY', 'incline-db': 'sK4Rvug6ufo',
  'machine-press': 'rY0B8UFdne0', 'push-up': 'WDIpL0pjun0', 'decline-pu': '5QFjmotLfW4',
  'incline-pu': '0JUrOH--Kdk', 'diamond-pu': '_6AvEX9-k8E', 'ohp': 'a81SaIpjGlA',
  'db-shoulder': '1jYq9QQEWqE', 'machine-shoulder': '3R14MnZbcpw', 'pike-pu': 'pHR5yG6xBps',
  'handstand-pu': 'KEfazWGOUok', 'wall-walks': 'VpuoE246W1Y', 'lat-pulldown': 'EfvPfLOuC3Y',
  'weighted-pull': 'j5PzQyhzk2I', 'cable-pullover': 'wNG6XUrwM6U', 'pull-up': 'MhokcbRLP5w',
  'assisted-pull': 'XxV8q2Qxhrc', 'chin-up': 'e1YSApl-QcM', 'bb-row': 'G8l_8chR5BE',
  'db-row': 'nMFCMNKnLgQ', 'cable-row': '7BkgqzC6WsM', 'chest-row': '_b6ch2nIchk',
  'inverted-row': '11F_O_sZ1Z4', 'tabletop-row': 'dnpDUwqMX04', 'plank': 'mH5Sfb_KTGg',
  'towel-row': '62NT4yA4igM', 'band-row': 'tcMmJ3c5P8c', 'band-pulldown': 'SkT4rqrmH-M',
  'side-plank': '44ND4bOB-T0', 'bird-dog': 'ZdAHe9_HeEw', 'dead-bug': 'bxn9FBrt4-A',
  'hanging-lr': 'vwl68EF9M2Q', 'hanging-kr': 'G6a5267YpHM', 'cable-chop': 'yPvAj_X_5NM',
  'pallof-press': 'P16SQlmWj1o', 'burpee': 'G2hv_NYhM-A', 'mtn-climber': 'CQk4MHY2_Tc',
  'jumping-jack': 'uLVt6u15L98', 'shadow-box': 'Q7VZf-2SwA0', 'hi-knees': 'D0GwAezTvtg',
  'brisk-walk': 'tVpUCkMLgms', 'treadmill-hiit': 'nAWIl3ABckM', 'zone2': 'YU3INA7KPXI',
  'incline-walk': 'NAsObfFJXvE', 'bike': 'Hbh_bMsSJzA', 'rower': '4zWu1yuJ0_g',
  'walk-lunge': 'Pbmj6xPo-Hw', 'reverse-lunge': '94AXT7D3bKY', 'step-up': 'dQqApCGd5Ss',
  'cossack': 'JaCbmoDqUc4', 'db-lunge': 'I34ysEkPK7w', 'db-step-up': '9ZknEYboBOQ',
  'leg-curl': 'vl5nUdE9mWM', 'leg-extension': 'YyvSfVjQeL0', 'yoga': '8e-xsVYFCVA',
  'sun-salutation': 'UPszTB6UzaA', 'cat-cow': '2tFpdTfIbKw', '90-90': 'wnFTIPhNySI',
  'foam-roll': 'qTiqOyqQGs8', 'shoulder-disl': '7p-Ma0eksaY', 'banded-stretch': 'aCcdDB_Y13g',
};

// ------------------------------------------------------------
// 30-Day Calisthenics Challenge
// Bodyweight only. 21 workout days + 9 recovery days across 4 weeks
// (Foundations → Volume → Intensity → Peak → Day-30 test). Structure and
// progression follow common bodyweight-challenge guidance (r/bodyweightfitness
// Recommended Routine, Odin Fitness 30-day roadmap, Darebee 30-day programs):
// ~5 sessions/week, spaced recovery, week-over-week progressive overload.
// ------------------------------------------------------------

// Map a challenge exercise name to a demo video (reuses the EX library by name).
const EX_NAME_VIDEO = Object.fromEntries(
  Object.entries(EX).map(([id, ex]) => [ex.name, EX_VIDEOS[id] || null])
);

// Human-readable movement-pattern labels for the substitute finder.
const MOVEMENT_LABELS = {
  squat: { en: 'Squat pattern', he: 'תבנית סקוואט' },
  hinge: { en: 'Hip hinge', he: 'ציר ירך' },
  'h-push': { en: 'Horizontal push', he: 'דחיקה אופקית' },
  'v-push': { en: 'Vertical push', he: 'דחיקה אנכית' },
  'h-pull': { en: 'Row (horizontal pull)', he: 'חתירה (משיכה אופקית)' },
  'v-pull': { en: 'Vertical pull', he: 'משיכה אנכית' },
  core: { en: 'Core', he: 'ליבה' },
  'leg-acc': { en: 'Single-leg / legs accessory', he: 'רגל אחת / אביזרי רגליים' },
  cardio: { en: 'Cardio', he: 'אירובי' },
  mobility: { en: 'Mobility', he: 'ניידות' },
};

export { EX, EX_VIDEOS, EX_NAME_VIDEO, MOVEMENT_LABELS };
