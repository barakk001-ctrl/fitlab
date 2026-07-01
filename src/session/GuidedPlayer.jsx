import { Check, Pause, Play, RefreshCw, RotateCcw, SkipForward, StretchHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { StretchVideo } from '../components/video.jsx';
import { useWakeLock } from '../hooks/useWakeLock.js';
import { isRTL, t } from '../i18n.js';
import { playBeep } from '../media.js';
import { PALETTE } from '../theme.js';
function buildPhases(items, lang) {
  const phases = [];
  items.forEach((item) => {
    if (item.perSide) {
      phases.push({ item, side: lang === 'he' ? '\u05e6\u05d3 \u05d0' : 'Side 1', seconds: item.hold });
      phases.push({ item, side: lang === 'he' ? '\u05e6\u05d3 \u05d1' : 'Side 2', seconds: item.hold, isSwitch: true });
    } else {
      phases.push({ item, side: null, seconds: item.hold });
    }
  });
  return phases;
}

// Keep the screen awake while `active` (e.g. during a guided session) so the
// phone doesn't auto-lock mid-workout. Uses the Screen Wake Lock API
// (iOS 16.4+ Safari/PWA, Android Chrome); a no-op where unsupported. Re-acquires
// the lock when returning to the tab, since the OS drops it when backgrounded.

function GuidedPlayer({ items, lang, onClose, onComplete }) {
  const phases = useMemo(() => buildPhases(items, lang), [items, lang]);

  // A phase is the first of its stretch when the item id differs from the previous phase.
  // The first phase of each stretch waits for a manual Start; later sides auto-continue.
  const isStretchStart = (idx) => idx === 0 || phases[idx].item.id !== phases[idx - 1].item.id;

  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(() => phases[0]?.seconds ?? 0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => { if (finished) onComplete?.(); }, [finished]);
  useWakeLock(!finished); // keep the screen on during the session

  const currentPhase = phases[phaseIdx] || null;
  // Waiting on the user to begin this stretch (first side not yet started).
  const awaitingStart = !running && !finished;

  // Enter a phase: reset its timer and auto-run only if it's a continuation (e.g. Side 2).
  // secondsLeft is set together with phaseIdx so the ticking effect never sees a stale 0.
  const enterPhase = (idx) => {
    setPhaseIdx(idx);
    setSecondsLeft(phases[idx].seconds);
    setRunning(!isStretchStart(idx));
  };

  const advance = (withBeep) => {
    if (phaseIdx < phases.length - 1) {
      if (withBeep) playBeep(180, 760);
      enterPhase(phaseIdx + 1);
    } else {
      if (withBeep) { playBeep(300, 880); setTimeout(() => playBeep(300, 1040), 300); }
      setRunning(false);
      setFinished(true);
    }
  };

  useEffect(() => {
    if (!running || paused || finished) return;
    if (secondsLeft <= 0) { advance(true); return; }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [running, paused, finished, secondsLeft, phaseIdx]);

  const start = () => { setPaused(false); setRunning(true); };
  const skip = () => advance(false);

  const restart = () => {
    setFinished(false);
    setPaused(false);
    setRunning(false);
    setPhaseIdx(0);
    setSecondsLeft(phases[0]?.seconds ?? 0);
  };

  const progressPct = phases.length > 0
    ? Math.round((phaseIdx / phases.length) * 100)
    : 0;

  const nextPhase = phaseIdx < phases.length - 1 ? phases[phaseIdx + 1] : null;

  // Count which stretch (not phase) we're on, for "Stretch i of n"
  const stretchNumber = (() => {
    if (!currentPhase) return 1;
    let count = 0;
    let lastItemId = null;
    for (let k = 0; k <= phaseIdx; k++) {
      if (phases[k].item.id !== lastItemId) { count++; lastItemId = phases[k].item.id; }
    }
    return count;
  })();

  return (
    <div className="fixed inset-0 z-[70] flex flex-col no-print"
      style={{ background: PALETTE.ink, color: PALETTE.cream }}
      dir={isRTL(lang) ? 'rtl' : 'ltr'}>

      <div className="flex items-center justify-between px-6 py-5">
        <div className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: PALETTE.sage }}>
          <StretchHorizontal size={12} strokeWidth={2} className="inline-block" style={{ marginInlineEnd: '0.4rem', verticalAlign: '-2px' }} />
          {t('guided_title', lang)}
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
              {t('guided_complete', lang)}
            </h2>
            <p className="f-italic text-lg md:text-xl mt-3" style={{ opacity: 0.8 }}>
              {t('guided_complete_sub', lang)}
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
        ) : (
          <div className="rise" style={{ width: '100%', maxWidth: 560 }}>
            <div className="f-mono text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: PALETTE.sage }}>
              {t('guided_stretch_of', lang, { i: stretchNumber, n: items.length })}
            </div>

            <h2 className="f-display font-bold" style={{ fontSize: 'clamp(32px,6vw,60px)', letterSpacing: '-0.03em', lineHeight: 1.02 }} dir="ltr">
              {currentPhase.item.name[lang]}
            </h2>

            {currentPhase.side && (
              <div className="f-mono text-xs uppercase tracking-[0.25em] mt-3 inline-flex items-center gap-2 px-3 py-1.5"
                style={{ border: `1px solid ${currentPhase.isSwitch ? PALETTE.rust : 'rgba(242,235,221,0.4)'}`, borderRadius: '999px', color: currentPhase.isSwitch ? PALETTE.rust : PALETTE.cream }}>
                {currentPhase.isSwitch && <RefreshCw size={12} strokeWidth={2} />}
                {currentPhase.isSwitch ? t('guided_switch_side', lang) : currentPhase.side}
              </div>
            )}

            {currentPhase.item.video && (
              <div className="mt-7 mx-auto" style={{ width: '100%', maxWidth: 480 }}>
                <StretchVideo
                  key={currentPhase.item.id}
                  video={currentPhase.item.video}
                  title={currentPhase.item.name.en}
                  autoplay
                />
              </div>
            )}

            <div className="relative mx-auto mt-7" style={{ width: currentPhase.item.video ? 168 : 220, height: currentPhase.item.video ? 168 : 220 }}>
              <svg width="100%" height="100%" viewBox="0 0 220 220" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(242,235,221,0.15)" strokeWidth="8" />
                <circle cx="110" cy="110" r="100" fill="none" stroke={PALETTE.sage} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 100}
                  strokeDashoffset={2 * Math.PI * 100 * (1 - secondsLeft / currentPhase.seconds)}
                  style={{ transition: 'stroke-dashoffset 1s linear' }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="f-display font-bold" style={{ fontSize: currentPhase.item.video ? '54px' : '72px', lineHeight: 1 }} dir="ltr">
                  {secondsLeft}
                </span>
              </div>
            </div>

            {awaitingStart ? (
              <div className="f-mono text-[10px] uppercase tracking-[0.25em] mt-6" style={{ color: PALETTE.sage }}>
                {t('guided_watch_first', lang)}
              </div>
            ) : nextPhase && (
              <div className="f-mono text-[10px] uppercase tracking-[0.25em] mt-8" style={{ opacity: 0.55 }} dir="ltr">
                {t('guided_next_up', lang)}: {nextPhase.item.name[lang]}
              </div>
            )}
          </div>
        )}
      </div>

      {!finished && (
        <div className="flex items-center justify-center gap-3 px-6 py-8 flex-wrap">
          {awaitingStart ? (
            <button onClick={start}
              className="f-mono uppercase tracking-[0.2em] px-8 py-3.5 text-xs flex items-center gap-2"
              style={{ background: PALETTE.sage, color: PALETTE.ink, border: `1px solid ${PALETTE.sage}`, borderRadius: '999px', minWidth: 160, justifyContent: 'center' }}>
              <Play size={14} strokeWidth={2.5} /> {t('guided_start', lang)}
            </button>
          ) : (
            <button onClick={() => setPaused(p => !p)}
              className="f-mono uppercase tracking-[0.2em] px-6 py-3 text-xs flex items-center gap-2"
              style={{ background: PALETTE.cream, color: PALETTE.ink, border: `1px solid ${PALETTE.cream}`, borderRadius: '999px', minWidth: 120, justifyContent: 'center' }}>
              {paused ? <Play size={13} strokeWidth={2} /> : <Pause size={13} strokeWidth={2} />}
              {paused ? t('guided_resume', lang) : t('guided_pause', lang)}
            </button>
          )}
          <button onClick={skip}
            className="f-mono uppercase tracking-[0.2em] px-6 py-3 text-xs flex items-center gap-2"
            style={{ background: 'transparent', color: PALETTE.cream, border: `1px solid rgba(242,235,221,0.4)`, borderRadius: '999px' }}>
            <SkipForward size={13} strokeWidth={2} /> {t('guided_skip', lang)}
          </button>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// Guided workout session (full-screen, manual set-by-set advance)
// ------------------------------------------------------------

// Parse "N × M…" prescriptions into a set count + per-set target text.
// Cardio/mobility ("20 min HIIT", "10 min flow") become a single timed block.

export { buildPhases, GuidedPlayer };
