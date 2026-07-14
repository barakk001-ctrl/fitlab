import { CalendarDays, Check, ListChecks, Ruler, Scale, Sparkles, Target, Timer, User } from 'lucide-react';
import { SavedPlansSection } from '../components/SavedPlansSection.jsx';
import { MastHead, Pill, StatField } from '../components/shared.jsx';
import { AGE_GROUPS, GOALS, SPLITS } from '../data/plans.js';
import { t } from '../i18n.js';
import { PALETTE } from '../theme.js';
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
    mode, setMode, onBuildOwn, onOpenTimer,
  } = props;
  const goalsValid = goals.length >= 1 && goals.length <= 3;
  const ready = age && goalsValid && split && statsValid;

  return (
    <div className="rise">
      <MastHead subtitle={t('masthead_picker', lang)} lang={lang} setLang={setLang} mode={mode} setMode={setMode} />

      <section className="px-6 md:px-12 pt-12 pb-10 relative">
        <Pill>{t('field_guide', lang)}</Pill>
        <h1 className="f-display mt-6 leading-[0.92]"
          style={{ color: PALETTE.ink, fontSize: 'clamp(42px, 7.5vw, 110px)', fontWeight: 800 }}>
          {lang === 'he' ? (
            <>אימון לעשור<br /><span className="f-accent" style={{ color: PALETTE.rust }}>בו אתם</span> <span className="f-accent" style={{ color: PALETTE.forest }}>באמת</span> נמצאים.</>
          ) : (
            <>Train for the <span className="f-accent" style={{ color: PALETTE.rust }}>decade</span><br />you're <span className="f-accent" style={{ color: PALETTE.forest }}>actually</span> in.</>
          )}
        </h1>
        <p className="f-body mt-8 max-w-xl text-base md:text-lg leading-relaxed" style={{ color: PALETTE.ink, opacity: 0.78 }}>
          {t('hero_subtitle', lang)}
        </p>
        <div className="mt-7 flex items-center gap-3 flex-wrap no-print">
          <button onClick={onBuildOwn}
            className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 px-5 py-3"
            style={{ background: 'transparent', color: PALETTE.ink, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
            <ListChecks size={13} strokeWidth={2} /> {t('build_own', lang)}
          </button>
          {onOpenTimer && (
            <button onClick={onOpenTimer}
              className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 px-5 py-3"
              style={{ background: 'transparent', color: PALETTE.ink, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
              <Timer size={13} strokeWidth={2} /> {t('open_timer', lang)}
            </button>
          )}
        </div>
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


export { NumbersSection, PickerView };
