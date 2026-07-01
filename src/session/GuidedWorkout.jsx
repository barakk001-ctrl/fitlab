import { ArrowLeft, Check, Clock, Dumbbell, RotateCcw, SkipForward, Timer, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StretchVideo } from '../components/video.jsx';
import { useWakeLock } from '../hooks/useWakeLock.js';
import { isRTL, t } from '../i18n.js';
import { IS_IOS, buzz, playBeep, startPhoneTimer } from '../media.js';
import { PALETTE } from '../theme.js';
function parseSets(prescription) {
  const m = (prescription || '').match(/^(\d+)\s*[×x]\s*(.+)$/);
  if (m) return { sets: parseInt(m[1], 10), target: m[2].trim() };
  return { sets: 1, target: (prescription || '').trim() };
}

function buildWorkoutSteps(exercises) {
  const steps = [];
  exercises.forEach((ex, exIdx) => {
    const { sets, target } = parseSets(ex.prescription);
    for (let s = 1; s <= sets; s++) {
      steps.push({ ex, exIdx, setNum: s, totalSets: sets, target });
    }
  });
  return steps;
}

// Unit a quick-logged result is measured in, inferred from the prescription text.
function logUnitForScheme(scheme) {
  if (/sec|שנ/.test(scheme || '')) return 'sec';
  if (/min|דק/.test(scheme || '')) return 'min';
  return 'reps';
}

// Seconds for a timed target ("45 sec", "20 min HIIT"), or null for rep-based sets.
function parseTimedSeconds(text) {
  const s = text || '';
  let m = s.match(/(\d+)\s*(?:sec|שנ)/);
  if (m) return parseInt(m[1], 10);
  m = s.match(/(\d+)\s*(?:min|דק)/);
  if (m) return parseInt(m[1], 10) * 60;
  return null;
}
const fmtMMSS = (sec) => {
  const m = Math.floor(sec / 60), s = sec % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}`;
};

// Compact inline "log your result" control shown on each exercise in the guided workout.
function QuickLog({ name, unit, lang, onLog }) {
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState(false);
  const submit = () => {
    const v = parseFloat(value);
    if (isNaN(v) || v <= 0) return;
    onLog(name, v, unit);
    setSaved(true); setValue('');
    setTimeout(() => setSaved(false), 1600);
  };
  const unitLabel = t(unit === 'sec' ? 'unit_sec' : unit === 'min' ? 'unit_min' : 'unit_reps', lang);
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap mt-6" dir="ltr">
      <span className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ opacity: 0.5 }}>{t('log_result', lang)}</span>
      <input type="number" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        placeholder="0"
        className="f-mono text-sm text-center"
        style={{ width: 64, background: 'transparent', color: PALETTE.cream, border: `1px solid rgba(242,235,221,0.4)`, borderRadius: '999px', padding: '6px 10px' }} />
      <span className="f-mono text-[10px] uppercase tracking-[0.2em]" style={{ opacity: 0.6 }}>{unitLabel}</span>
      <button onClick={submit}
        className="f-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 flex items-center gap-1.5"
        style={{ background: saved ? PALETTE.sage : 'transparent', color: saved ? PALETTE.ink : PALETTE.cream, border: `1px solid ${saved ? PALETTE.sage : 'rgba(242,235,221,0.4)'}`, borderRadius: '999px' }}>
        <Check size={11} strokeWidth={2.5} /> {saved ? t('logged', lang) : (lang === 'he' ? 'שמור' : 'Save')}
      </button>
    </div>
  );
}

// Per-set logger for rep-based sets: reps done + weight used (blank/0 = bodyweight).
// When the set was already logged today, its values prefill and Save replaces them.
function SetLog({ name, setNum, target, weightUnit, lang, onLogSet, initialReps = '', initialWeight = '' }) {
  const [reps, setReps] = useState(initialReps);
  const [weight, setWeight] = useState(initialWeight);
  const [saved, setSaved] = useState(initialReps !== '');
  const inputStyle = {
    width: 64, background: 'transparent', color: PALETTE.cream,
    border: `1px solid rgba(242,235,221,0.4)`, borderRadius: '999px', padding: '6px 10px',
  };
  const submit = () => {
    const r = parseFloat(reps);
    if (isNaN(r) || r <= 0) return;
    const w = parseFloat(weight);
    onLogSet(name, setNum, r, isNaN(w) || w < 0 ? 0 : w);
    setSaved(true); // stays ✓ until the values change again
  };
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap mt-6" dir="ltr">
      <span className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ opacity: 0.5 }}>{t('log_set', lang)}</span>
      <input type="number" inputMode="numeric" value={reps} onChange={(e) => { setReps(e.target.value); setSaved(false); }}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        placeholder={target} aria-label={t('unit_reps', lang)}
        className="f-mono text-sm text-center" style={inputStyle} />
      <span className="f-mono text-[10px] uppercase tracking-[0.2em]" style={{ opacity: 0.6 }}>{t('unit_reps', lang)}</span>
      <span className="f-mono text-[10px]" style={{ opacity: 0.4 }}>×</span>
      <input type="number" inputMode="decimal" value={weight} onChange={(e) => { setWeight(e.target.value); setSaved(false); }}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        placeholder="0" aria-label={t('ws_weight', lang)}
        className="f-mono text-sm text-center" style={inputStyle} />
      <span className="f-mono text-[10px] uppercase tracking-[0.2em]" style={{ opacity: 0.6 }}>{weightUnit}</span>
      <button onClick={submit}
        className="f-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 flex items-center gap-1.5"
        style={{ background: saved ? PALETTE.sage : 'transparent', color: saved ? PALETTE.ink : PALETTE.cream, border: `1px solid ${saved ? PALETTE.sage : 'rgba(242,235,221,0.4)'}`, borderRadius: '999px' }}>
        <Check size={11} strokeWidth={2.5} /> {saved ? t('logged', lang) : (lang === 'he' ? 'שמור' : 'Save')}
      </button>
    </div>
  );
}

function GuidedWorkout({ exercises, trackLabel, dayName, lang, onClose, onComplete, onLog, onLogSet, loggedSets = [], weightUnit = 'kg' }) {
  const kgToDisplay = (kg) => (weightUnit === 'lb' ? Math.round(kg * 2.20462 * 10) / 10 : kg);
  const steps = useMemo(() => buildWorkoutSteps(exercises), [exercises]);

  const [stepIdx, setStepIdx] = useState(0);
  const [finished, setFinished] = useState(false);
  const [restLeft, setRestLeft] = useState(0);
  const [restDuration, setRestDuration] = useState(60); // chosen rest length, default 60s
  // Timed-set timer (for "45 sec" / "20 min" targets): 3-2-1 count-in then countdown.
  const [workLeft, setWorkLeft] = useState(0);
  const [workTotal, setWorkTotal] = useState(0);
  const [countIn, setCountIn] = useState(0);
  // Absolute deadlines (wall-clock ms) so timers stay correct across screen-lock
  // / app-switch — when you return, remaining is recomputed from real time.
  const restEndRef = useRef(0);
  const workEndRef = useRef(0);

  useEffect(() => { if (finished) onComplete?.(); }, [finished]);
  useWakeLock(!finished); // keep the screen on during the session

  const resting = restLeft > 0;
  const working = countIn > 0 || workLeft > 0;
  const step = steps[stepIdx] || null;
  const isLast = stepIdx >= steps.length - 1;
  const timedSec = step ? parseTimedSeconds(step.target) : null;

  // Rest countdown — driven by an absolute deadline; recomputes on return.
  useEffect(() => {
    if (!resting) return;
    let ended = false;
    const tick = () => {
      const left = Math.max(0, Math.round((restEndRef.current - Date.now()) / 1000));
      if (left <= 0) { if (!ended) { ended = true; playBeep(220, 760); buzz(); } setRestLeft(0); }
      else setRestLeft(left);
    };
    const id = setInterval(tick, 500);
    const onVis = () => { if (document.visibilityState === 'visible') tick(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis); };
  }, [resting]);

  // Count-in 3-2-1, then arm the work deadline.
  useEffect(() => {
    if (countIn <= 0) return;
    const id = setTimeout(() => {
      if (countIn === 1) { setCountIn(0); workEndRef.current = Date.now() + workTotal * 1000; setWorkLeft(workTotal); playBeep(260, 880); }
      else { setCountIn((c) => c - 1); playBeep(110, 640); }
    }, 1000);
    return () => clearTimeout(id);
  }, [countIn, workTotal]);

  // Work countdown (timed sets) — absolute deadline; recomputes on return.
  const workActive = workLeft > 0;
  useEffect(() => {
    if (!workActive) return;
    let ended = false;
    const tick = () => {
      const left = Math.max(0, Math.round((workEndRef.current - Date.now()) / 1000));
      if (left <= 0) { if (!ended) { ended = true; playBeep(320, 880); setTimeout(() => playBeep(320, 1040), 300); buzz([200, 80, 200]); } setWorkLeft(0); }
      else setWorkLeft(left);
    };
    const id = setInterval(tick, 500);
    const onVis = () => { if (document.visibilityState === 'visible') tick(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis); };
  }, [workActive]);

  const stopTimers = () => { setRestLeft(0); setWorkLeft(0); setCountIn(0); };
  const next = () => {
    stopTimers();
    if (isLast) {
      playBeep(300, 880); setTimeout(() => playBeep(300, 1040), 300);
      setFinished(true);
    } else {
      setStepIdx((i) => i + 1);
    }
  };
  const prev = () => { stopTimers(); setStepIdx((i) => Math.max(0, i - 1)); };
  const startRest = () => { restEndRef.current = Date.now() + restDuration * 1000; setRestLeft(restDuration); };
  const setRest = (v) => { setRestDuration(v); if (resting) { restEndRef.current = Date.now() + v * 1000; setRestLeft(v); } };
  const startWork = () => { if (timedSec) { setWorkTotal(timedSec); setCountIn(3); } };
  const restart = () => { setFinished(false); setStepIdx(0); stopTimers(); };

  const totalExercises = exercises.length;
  const progressPct = steps.length ? Math.round((stepIdx / steps.length) * 100) : 0;
  const restTotal = restDuration || 1;
  const numericTarget = step && /^[\d]+([–-][\d]+)?$/.test(step.target);

  // Rest-duration picker — adjustable mid-session
  const restChips = () => (
    <div className="flex items-center justify-center gap-2 flex-wrap mt-6">
      <span className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ opacity: 0.5 }} dir="ltr">{t('ws_rest', lang)}</span>
      {[30, 45, 60, 90, 120, 180].map((v) => {
        const active = restDuration === v;
        return (
          <button key={v} onClick={() => setRest(v)}
            className="f-mono text-[10px] tracking-wider px-3 py-1.5"
            style={{ background: active ? PALETTE.sage : 'transparent', color: active ? PALETTE.ink : PALETTE.cream, border: `1px solid ${active ? PALETTE.sage : 'rgba(242,235,221,0.4)'}`, borderRadius: '999px' }}
            dir="ltr">
            {v}s
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[70] flex flex-col no-print"
      style={{ background: PALETTE.ink, color: PALETTE.cream }}
      dir={isRTL(lang) ? 'rtl' : 'ltr'}>

      <div className="flex items-center justify-between px-6 py-5">
        <div className="f-mono text-[10px] uppercase tracking-[0.25em] flex items-center gap-2" style={{ color: PALETTE.sage }}>
          <Dumbbell size={12} strokeWidth={2} style={{ verticalAlign: '-2px' }} />
          {trackLabel}{dayName ? ` · ${dayName}` : ''}
        </div>
        <button onClick={onClose}
          className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1.5"
          style={{ border: `1px solid rgba(242,235,221,0.4)`, borderRadius: '999px', color: PALETTE.cream }}>
          <X size={12} strokeWidth={2} /> {t('guided_exit', lang)}
        </button>
      </div>

      {!finished && (
        <div className="px-6">
          <div className="h-1 overflow-hidden" style={{ background: 'rgba(242,235,221,0.18)', borderRadius: '999px' }} dir="ltr">
            <div style={{ width: `${progressPct}%`, height: '100%', background: PALETTE.sage, transition: 'width 0.5s ease' }} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 text-center overflow-y-auto">
        {finished ? (
          <div className="rise">
            <div className="flex items-center justify-center mx-auto mb-6" style={{ width: 80, height: 80, borderRadius: '50%', background: PALETTE.sage }}>
              <Check size={40} strokeWidth={2.5} color={PALETTE.ink} />
            </div>
            <h2 className="f-display font-bold" style={{ fontSize: 'clamp(36px,6vw,64px)', letterSpacing: '-0.03em' }}>
              {t('ws_complete', lang)}
            </h2>
            <p className="f-italic text-lg md:text-xl mt-3" style={{ opacity: 0.8 }}>
              {t('ws_complete_sub', lang)}
            </p>
            <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
              <button onClick={restart}
                className="f-mono uppercase tracking-[0.2em] px-6 py-3 text-xs flex items-center gap-2"
                style={{ background: 'transparent', color: PALETTE.cream, border: `1px solid ${PALETTE.cream}`, borderRadius: '999px' }}>
                <RotateCcw size={12} strokeWidth={2} /> {t('guided_restart', lang)}
              </button>
              <button onClick={onClose}
                className="f-mono uppercase tracking-[0.2em] px-6 py-3 text-xs flex items-center gap-2"
                style={{ background: PALETTE.rust, color: PALETTE.cream, border: `1px solid ${PALETTE.rust}`, borderRadius: '999px' }}>
                <Check size={12} strokeWidth={2} /> {t('guided_exit', lang)}
              </button>
            </div>
          </div>
        ) : working ? (
          <div className="rise" style={{ width: '100%', maxWidth: 560 }}>
            <div className="f-mono text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: PALETTE.sage }} dir="ltr">
              {step ? step.ex.name : ''}
            </div>
            <div className="relative mx-auto" style={{ width: 220, height: 220 }}>
              <svg width="100%" height="100%" viewBox="0 0 220 220" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(242,235,221,0.15)" strokeWidth="8" />
                <circle cx="110" cy="110" r="100" fill="none" stroke={PALETTE.rust} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 100}
                  strokeDashoffset={2 * Math.PI * 100 * (1 - (countIn > 0 ? 1 : workLeft / (workTotal || 1)))}
                  style={{ transition: 'stroke-dashoffset 1s linear' }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="f-display font-bold" style={{ fontSize: countIn > 0 ? '88px' : '64px', lineHeight: 1, color: countIn > 0 ? PALETTE.rust : PALETTE.cream }} dir="ltr">
                  {countIn > 0 ? countIn : fmtMMSS(workLeft)}
                </span>
              </div>
            </div>
            {countIn > 0 && (
              <div className="f-mono text-[10px] uppercase tracking-[0.3em] mt-6" style={{ color: PALETTE.sage }}>
                {t('guided_get_ready', lang)}
              </div>
            )}
          </div>
        ) : resting ? (
          <div className="rise" style={{ width: '100%', maxWidth: 560 }}>
            <div className="f-mono text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: PALETTE.sage }}>
              {t('ws_resting', lang)}
            </div>
            <div className="relative mx-auto" style={{ width: 220, height: 220 }}>
              <svg width="100%" height="100%" viewBox="0 0 220 220" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(242,235,221,0.15)" strokeWidth="8" />
                <circle cx="110" cy="110" r="100" fill="none" stroke={PALETTE.sage} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 100}
                  strokeDashoffset={2 * Math.PI * 100 * (1 - restLeft / restTotal)}
                  style={{ transition: 'stroke-dashoffset 1s linear' }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="f-display font-bold" style={{ fontSize: '72px', lineHeight: 1 }} dir="ltr">{restLeft}</span>
              </div>
            </div>
            {step && (
              <div className="f-mono text-[10px] uppercase tracking-[0.25em] mt-8" style={{ opacity: 0.55 }} dir="ltr">
                {t('guided_next_up', lang)}: {step.ex.name}
              </div>
            )}
            {restChips()}
          </div>
        ) : step ? (
          <div className="rise" style={{ width: '100%', maxWidth: 560 }}>
            <div className="f-mono text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: PALETTE.sage }}>
              {t('ws_exercise_of', lang, { i: step.exIdx + 1, n: totalExercises })}
            </div>

            <h2 className="f-display font-bold" style={{ fontSize: 'clamp(28px,5vw,52px)', letterSpacing: '-0.03em', lineHeight: 1.02 }} dir="ltr">
              {step.ex.name}
            </h2>

            {step.totalSets > 1 && (
              <div className="f-mono text-xs uppercase tracking-[0.25em] mt-3 inline-flex items-center gap-2 px-3 py-1.5"
                style={{ border: `1px solid rgba(242,235,221,0.4)`, borderRadius: '999px', color: PALETTE.cream }}>
                {t('ws_set_of', lang, { i: step.setNum, n: step.totalSets })}
              </div>
            )}

            <div className="f-display font-bold mt-4" style={{ fontSize: 'clamp(34px,7vw,68px)', lineHeight: 1, color: PALETTE.sage }} dir="ltr">
              {step.target}{numericTarget ? <span className="f-body" style={{ fontSize: '0.32em', opacity: 0.7, marginInlineStart: '0.5rem' }}>{lang === 'he' ? 'חזרות' : 'reps'}</span> : null}
            </div>

            {step.ex.video && (
              <div className="mt-7 mx-auto" style={{ width: '100%', maxWidth: 480 }}>
                <StretchVideo key={step.ex.id} video={step.ex.video} title={step.ex.name} autoplay />
              </div>
            )}

            {/* Rep-based sets get per-set reps × weight logging; timed sets keep the single quick-log. */}
            {onLogSet && !timedSec ? (() => {
              const prevLogged = loggedSets.find((s) => s.name === step.ex.name && s.set === step.setNum);
              return (
                <SetLog key={`${step.ex.id}-${step.setNum}`} name={step.ex.name} setNum={step.setNum}
                  target={step.target} weightUnit={weightUnit} lang={lang} onLogSet={onLogSet}
                  initialReps={prevLogged ? String(prevLogged.reps) : ''}
                  initialWeight={prevLogged && prevLogged.weightKg > 0 ? String(kgToDisplay(prevLogged.weightKg)) : ''} />
              );
            })() : onLog ? (
              <QuickLog key={step.ex.id} name={step.ex.name} unit={logUnitForScheme(step.target)} lang={lang} onLog={onLog} />
            ) : null}

            {restChips()}
          </div>
        ) : null}
      </div>

      {!finished && (
        <div className="flex items-center justify-center gap-3 px-6 py-8 flex-wrap">
          {working ? (
            <button onClick={stopTimers}
              className="f-mono uppercase tracking-[0.2em] px-8 py-3.5 text-xs flex items-center gap-2"
              style={{ background: PALETTE.cream, color: PALETTE.ink, border: `1px solid ${PALETTE.cream}`, borderRadius: '999px', minWidth: 160, justifyContent: 'center' }}>
              <SkipForward size={14} strokeWidth={2.5} /> {t('ws_skip_rest', lang)}
            </button>
          ) : resting ? (
            <button onClick={() => setRestLeft(0)}
              className="f-mono uppercase tracking-[0.2em] px-8 py-3.5 text-xs flex items-center gap-2"
              style={{ background: PALETTE.cream, color: PALETTE.ink, border: `1px solid ${PALETTE.cream}`, borderRadius: '999px', minWidth: 160, justifyContent: 'center' }}>
              <SkipForward size={14} strokeWidth={2.5} /> {t('ws_skip_rest', lang)}
            </button>
          ) : (
            <>
              <button onClick={prev} disabled={stepIdx === 0}
                className="f-mono uppercase tracking-[0.2em] px-5 py-3 text-xs flex items-center gap-2"
                style={{ background: 'transparent', color: PALETTE.cream, border: `1px solid rgba(242,235,221,0.4)`, borderRadius: '999px', opacity: stepIdx === 0 ? 0.35 : 1, cursor: stepIdx === 0 ? 'not-allowed' : 'pointer' }}>
                <ArrowLeft size={13} strokeWidth={2} /> {t('ws_back', lang)}
              </button>
              {timedSec && (
                <button onClick={startWork}
                  className="f-mono uppercase tracking-[0.2em] px-5 py-3 text-xs flex items-center gap-2"
                  style={{ background: PALETTE.rust, color: PALETTE.cream, border: `1px solid ${PALETTE.rust}`, borderRadius: '999px' }}>
                  <Timer size={13} strokeWidth={2} /> {t('ws_start_timer', lang)} {fmtMMSS(timedSec)}
                </button>
              )}
              <button onClick={startRest}
                className="f-mono uppercase tracking-[0.2em] px-5 py-3 text-xs flex items-center gap-2"
                style={{ background: 'transparent', color: PALETTE.cream, border: `1px solid rgba(242,235,221,0.4)`, borderRadius: '999px' }}>
                <Timer size={13} strokeWidth={2} /> {t('ws_rest', lang)} {restDuration}s
              </button>
              {IS_IOS && (
                <button onClick={() => startPhoneTimer(restDuration)}
                  title="Starts the iPhone Clock timer (shows in Dynamic Island; alerts in silent mode). Needs the one-time 'FitLab Timer' shortcut."
                  className="f-mono uppercase tracking-[0.2em] px-5 py-3 text-xs flex items-center gap-2"
                  style={{ background: 'transparent', color: PALETTE.cream, border: `1px solid rgba(242,235,221,0.4)`, borderRadius: '999px' }}>
                  <Clock size={13} strokeWidth={2} /> {t('ws_phone_timer', lang)}
                </button>
              )}
              <button onClick={next}
                className="f-mono uppercase tracking-[0.2em] px-7 py-3.5 text-xs flex items-center gap-2"
                style={{ background: PALETTE.sage, color: PALETTE.ink, border: `1px solid ${PALETTE.sage}`, borderRadius: '999px', minWidth: 150, justifyContent: 'center' }}>
                {isLast ? <Check size={14} strokeWidth={2.5} /> : <SkipForward size={14} strokeWidth={2.5} />}
                {isLast ? t('ws_finish', lang) : t('ws_done_set', lang)}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// 30-Day Calisthenics Challenge view
// ------------------------------------------------------------


export { parseSets, buildWorkoutSteps, logUnitForScheme, parseTimedSeconds, fmtMMSS, QuickLog, SetLog, GuidedWorkout };
