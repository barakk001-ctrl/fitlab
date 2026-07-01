import { ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, Flame, Play, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { MastHead, Pill } from '../components/shared.jsx';
import { CHALLENGE_DAYS } from '../data/challenge.js';
import { isRTL, t } from '../i18n.js';
import { challengeDayNumber } from '../storage.js';
import { PALETTE } from '../theme.js';
function ChallengeView({ lang, setLang, mode, setMode, challenge, onStart, onToggleDay, onStartDay, onRestart, onSetDay }) {
  const [editDay, setEditDay] = useState(null); // number being edited, or null
  const started = !!challenge?.start;
  const rawDay = started ? challengeDayNumber(challenge.start) : 0;
  const currentDay = Math.min(Math.max(rawDay, 1), 30);
  const finishedAll = started && rawDay > 30;
  const doneSet = useMemo(() => new Set(challenge?.done || []), [challenge]);
  const doneCount = (challenge?.done || []).filter((d) => d >= 1 && d <= 30).length;

  const [selectedDay, setSelectedDay] = useState(currentDay);
  useEffect(() => { setSelectedDay(Math.min(Math.max(currentDay, 1), 30)); }, [challenge?.start]);

  const ArrowBack = isRTL(lang) ? ArrowRight : ArrowLeft;
  const unlocked = (d) => started && d <= currentDay;
  const dayData = CHALLENGE_DAYS[selectedDay - 1];

  if (!started) {
    return (
      <div className="rise">
        <MastHead subtitle={t('ch_title', lang)} lang={lang} setLang={setLang} mode={mode} setMode={setMode} />
        <section className="px-6 md:px-12 pt-12 pb-10 relative">
          <Pill color={PALETTE.rust}><Flame size={11} strokeWidth={2.4} /> {t('ch_badge', lang)}</Pill>
          <h1 className="f-display mt-6 leading-[0.92] font-bold"
            style={{ color: PALETTE.ink, fontSize: 'clamp(40px, 7vw, 100px)' }}>
            {t('ch_title', lang)}
          </h1>
          <p className="f-body mt-7 max-w-xl text-base md:text-lg leading-relaxed" style={{ color: PALETTE.ink, opacity: 0.78 }}>
            {t('ch_hero_sub', lang)}
          </p>

          <div className="mt-10 max-w-2xl" style={{ borderTop: `1px solid ${PALETTE.ink}` }}>
            <div className="f-mono text-[10px] uppercase tracking-[0.3em] mt-5 mb-4" style={{ color: PALETTE.rust }}>
              {t('ch_how_title', lang)}
            </div>
            {['ch_how_1', 'ch_how_2', 'ch_how_3'].map((k, i) => (
              <div key={k} className="flex items-start gap-3 mb-3">
                <span className="f-mono text-xs mt-0.5" style={{ color: PALETTE.rust }} dir="ltr">{String(i + 1).padStart(2, '0')}</span>
                <p className="f-body text-sm md:text-base leading-relaxed" style={{ opacity: 0.85 }}>{t(k, lang)}</p>
              </div>
            ))}
          </div>

          <button onClick={onStart}
            className="mt-9 f-mono uppercase tracking-[0.2em] px-8 py-4 text-xs flex items-center gap-2"
            style={{ background: PALETTE.ink, color: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
            <Flame size={14} strokeWidth={2} /> {t('ch_start', lang)}
          </button>
          <p className="f-mono text-[10px] uppercase tracking-[0.2em] mt-5" style={{ opacity: 0.55 }}>
            {t('ch_safety', lang)}
          </p>
        </section>
      </div>
    );
  }

  const isRest = dayData.type === 'rest';
  const selDone = doneSet.has(selectedDay);
  const selUnlocked = unlocked(selectedDay);

  return (
    <div className="rise">
      <MastHead subtitle={t('ch_title', lang)} lang={lang} setLang={setLang} mode={mode} setMode={setMode} />

      <section className="px-6 md:px-12 pt-10 pb-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <Pill color={PALETTE.rust}><Flame size={11} strokeWidth={2.4} /> {t('ch_title', lang)}</Pill>
            <h1 className="f-display font-bold mt-4" style={{ color: PALETTE.ink, fontSize: 'clamp(38px, 6vw, 76px)', letterSpacing: '-0.03em', lineHeight: 1 }} dir="ltr">
              {finishedAll ? t('ch_finished_badge', lang) : t('ch_day_of', lang, { i: currentDay, n: 30 })}
            </h1>
            <div className="f-mono text-[10px] uppercase tracking-[0.25em] mt-3" style={{ color: PALETTE.rust }}>
              {t('ch_progress', lang, { done: doneCount, total: 30 })}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setEditDay(currentDay)}
              className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-4 py-2"
              style={{ background: 'transparent', color: PALETTE.ink, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
              <CalendarDays size={12} strokeWidth={2} /> {t('ch_edit_day', lang)}
            </button>
            <button onClick={onRestart}
              className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-4 py-2"
              style={{ background: 'transparent', color: PALETTE.ink, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
              <RotateCcw size={12} strokeWidth={2} /> {t('ch_restart', lang)}
            </button>
          </div>
        </div>

        {editDay !== null && (
          <div className="mt-5 p-4 flex items-center gap-3 flex-wrap" style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '8px' }}>
            <span className="f-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: PALETTE.rust }}>{t('ch_edit_day', lang)}</span>
            <div className="flex items-center gap-2" dir="ltr">
              <button onClick={() => setEditDay((d) => Math.max(1, d - 1))} className="flex items-center justify-center" style={{ width: 30, height: 30, borderRadius: '999px', border: `1px solid ${PALETTE.ink}`, color: PALETTE.ink }}>–</button>
              <span className="f-display font-bold text-center" style={{ minWidth: 64, color: PALETTE.ink }}>{lang === 'he' ? 'יום' : 'Day'} {editDay}</span>
              <button onClick={() => setEditDay((d) => Math.min(30, d + 1))} className="flex items-center justify-center" style={{ width: 30, height: 30, borderRadius: '999px', border: `1px solid ${PALETTE.ink}`, color: PALETTE.ink }}>+</button>
            </div>
            <button onClick={() => { onSetDay(editDay); setEditDay(null); }}
              className="f-mono text-[10px] uppercase tracking-[0.2em] px-5 py-2.5 flex items-center gap-1.5"
              style={{ background: PALETTE.ink, color: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
              <Check size={12} strokeWidth={2.5} /> {t('ch_set', lang)}
            </button>
            <button onClick={() => setEditDay(null)}
              className="f-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2.5"
              style={{ background: 'transparent', color: PALETTE.ink, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
              {t('ch_cancel', lang)}
            </button>
          </div>
        )}

        {finishedAll && (
          <div className="mt-6 p-5 flex items-center gap-3" style={{ background: PALETTE.forest, color: PALETTE.cream, borderRadius: '6px' }}>
            <CheckCircle2 size={22} strokeWidth={2} color={PALETTE.sage} />
            <div>
              <div className="f-display font-bold" style={{ fontSize: '20px' }}>{t('ch_complete_title', lang)}</div>
              <div className="f-body text-sm" style={{ opacity: 0.85 }}>{t('ch_complete_sub', lang)}</div>
            </div>
          </div>
        )}

        {/* Day grid */}
        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 mt-7" dir="ltr">
          {CHALLENGE_DAYS.map((d) => {
            const isToday = d.day === currentDay && !finishedAll;
            const isSelected = d.day === selectedDay;
            const isDone = doneSet.has(d.day);
            const isLocked = !unlocked(d.day);
            return (
              <button key={d.day} disabled={isLocked}
                onClick={() => setSelectedDay(d.day)}
                title={isLocked ? t('ch_locked', lang, { i: d.day }) : `Day ${d.day} · ${d.title}`}
                className="f-mono text-xs flex items-center justify-center"
                style={{
                  aspectRatio: '1 / 1',
                  background: isDone ? PALETTE.sage : (isToday ? PALETTE.rust : PALETTE.paper),
                  color: isDone ? PALETTE.ink : (isToday ? PALETTE.cream : PALETTE.ink),
                  border: `1px solid ${isSelected ? PALETTE.ink : 'rgba(27,27,25,0.2)'}`,
                  outline: isSelected ? `2px solid ${PALETTE.ink}` : 'none',
                  outlineOffset: '1px',
                  borderRadius: '6px',
                  opacity: isLocked ? 0.3 : 1,
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  position: 'relative',
                }}>
                {isDone ? <Check size={13} strokeWidth={3} /> : d.day}
                {d.type === 'rest' && !isDone && (
                  <span style={{ position: 'absolute', bottom: 3, width: 4, height: 4, borderRadius: '50%', background: isToday ? PALETTE.cream : PALETTE.rust, opacity: 0.7 }} />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected day detail */}
      <section className="px-6 md:px-12 pb-16">
        <div className="p-6 md:p-8" style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '6px' }}>
          <div className="flex items-baseline justify-between flex-wrap gap-3">
            <div className="flex items-baseline gap-3">
              <span className="f-display font-bold" style={{ fontSize: 'clamp(34px,5vw,56px)', color: PALETTE.rust, lineHeight: 1 }} dir="ltr">
                {String(selectedDay).padStart(2, '0')}
              </span>
              <div>
                <h3 className="f-display font-bold" style={{ fontSize: 'clamp(20px,2.4vw,26px)', lineHeight: 1 }} dir="ltr">{dayData.title}</h3>
                <div className="f-italic text-sm mt-1" style={{ opacity: 0.7 }} dir="ltr">{dayData.focus}</div>
              </div>
            </div>
            <Pill color={isRest ? PALETTE.forest : PALETTE.ink}>
              {isRest ? t('ch_rest_day', lang) : t('ch_workout_day', lang)}
            </Pill>
          </div>

          {dayData.exercises.length > 0 && (
            <div className="mt-6" style={{ borderTop: `1px solid rgba(27,27,25,0.15)` }}>
              {dayData.exercises.map((ex, i) => (
                <div key={i} className="flex items-baseline justify-between gap-3 py-3 border-b last:border-b-0" style={{ borderColor: 'rgba(27,27,25,0.12)' }}>
                  <span className="f-display font-semibold text-base md:text-lg" style={{ color: PALETTE.ink }} dir="ltr">{ex.name}</span>
                  <span className="f-mono text-xs tracking-wider" style={{ opacity: 0.75 }} dir="ltr">{ex.scheme}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mt-7 flex-wrap no-print">
            {selUnlocked && dayData.exercises.length > 0 && (
              <button onClick={() => onStartDay(dayData)}
                className="f-mono uppercase tracking-[0.2em] px-7 py-3.5 text-xs flex items-center gap-2"
                style={{ background: PALETTE.ink, color: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
                <Play size={13} strokeWidth={2.5} /> {t('start_session', lang)}
              </button>
            )}
            {selUnlocked && (
              <button onClick={() => onToggleDay(selectedDay)}
                className="f-mono uppercase tracking-[0.2em] px-6 py-3.5 text-xs flex items-center gap-2"
                style={{
                  background: selDone ? PALETTE.sage : 'transparent',
                  color: selDone ? PALETTE.ink : PALETTE.ink,
                  border: `1px solid ${selDone ? PALETTE.sage : PALETTE.ink}`, borderRadius: '999px',
                }}>
                <Check size={13} strokeWidth={2.5} /> {selDone ? t('ch_undo', lang) : t('ch_mark_done', lang)}
              </button>
            )}
            {!selUnlocked && (
              <div className="f-mono text-[10px] uppercase tracking-[0.2em]" style={{ opacity: 0.55 }}>
                {t('ch_locked', lang, { i: selectedDay })}
              </div>
            )}
            {selectedDay !== currentDay && (
              <button onClick={() => setSelectedDay(currentDay)}
                className="f-mono uppercase tracking-[0.2em] px-5 py-3 text-xs flex items-center gap-2 underline-hover"
                style={{ background: 'transparent', color: PALETTE.ink }}>
                <ArrowBack size={13} strokeWidth={2} /> {t('ch_back_today', lang)}
              </button>
            )}
          </div>
        </div>

        <p className="f-mono text-[10px] uppercase tracking-[0.2em] mt-6" style={{ opacity: 0.55 }}>
          {t('ch_safety', lang)}
        </p>
      </section>
    </div>
  );
}

// ------------------------------------------------------------
// Progress dashboard
// ------------------------------------------------------------


export { ChallengeView };
