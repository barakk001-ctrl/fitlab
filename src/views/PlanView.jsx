import { ArrowLeft, ArrowRight, Bookmark, CalendarDays, Printer, RefreshCw, Sparkles, Utensils } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fmt } from '../calc.js';
import { BodyweightSection } from '../components/Bodyweight.jsx';
import { DayCard, MacroBar } from '../components/DayCard.jsx';
import { MastHead, Pill, StatBox } from '../components/shared.jsx';
import { AGE_GROUPS, GOALS, SPLITS } from '../data/plans.js';
import { getPlanNote } from '../generate.js';
import { isRTL, t } from '../i18n.js';
import { PALETTE } from '../theme.js';
function PlanView({
  lang, setLang, age, goals, split, computed, week, diet, weightUnit, onBack, onOpenSave,
  weekNum, setWeekNum,
  completions, onToggleComplete,
  onSwap,
  onRemoveExercise, onMoveExercise, onAddExercise,
  onPrint,
  bodyweightLog, currentWeightKg, targetKg, units, onOpenWeightLog, onDeleteWeightEntry,
  onStartTimer, onStartWorkout,
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
              onRemoveExercise={onRemoveExercise}
              onMoveExercise={onMoveExercise}
              onAddExercise={onAddExercise}
              onStartTimer={onStartTimer}
              onStartWorkout={onStartWorkout}
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


export { PlanView };
