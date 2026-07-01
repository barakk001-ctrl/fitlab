import { fmt } from './calc.js';
import { AGE_GROUPS, GOALS, SPLITS } from './data/plans.js';
import { getPlanNote } from './generate.js';
import { t } from './i18n.js';
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


export { escapeHTML, generatePrintHTML };
