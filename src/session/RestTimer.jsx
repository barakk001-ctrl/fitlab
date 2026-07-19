import { Pause, Play, RotateCcw, SkipForward, Timer, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useCountdown } from '../hooks/useCountdown.js';
import { isRTL, t } from '../i18n.js';
import { cancelPush, ensureNotifyPermission, notify, playBeep, schedulePush } from '../media.js';
import { PALETTE } from '../theme.js';
function RestTimer({ exercise, lang, onClose }) {
  const baseRest = exercise?.restSeconds ?? 90;
  const initial = Math.min(120, Math.max(30, baseRest));
  const [duration, setDuration] = useState(initial);
  const [done, setDone] = useState(false);

  const pushIdRef = useRef('rt-' + Math.random().toString(36).slice(2, 10));
  const pushArmedRef = useRef(false); // a server push is scheduled for this timer
  const timer = useCountdown((overdueMs) => {
    setDone(true);
    const hidden = typeof document !== 'undefined' && document.visibilityState === 'hidden';
    if (!hidden) {
      // Visible ending: the beep covers it; make sure no push follows.
      cancelPush(pushIdRef.current);
      pushArmedRef.current = false;
      if (overdueMs < 3000) { // stale expiry = we were suspended; the push already alerted
        playBeep(220, 880);
        setTimeout(() => playBeep(220, 880), 280);
      }
    } else if (!pushArmedRef.current && overdueMs < 3000) {
      // Backgrounded with no push armed — the local notification is the fallback.
      // With a push armed we post NOTHING here: cancelling from a backgrounded
      // page can lose the race and the user would get both notifications.
      notify(t('notif_rest_done', lang), exercise?.name || '');
    }
  });
  const { secondsLeft, paused } = timer;
  const schedule = (seconds) =>
    schedulePush(pushIdRef.current, seconds, t('notif_rest_done', lang), exercise?.name || '',
      { label: t('notif_run_again', lang), confirm: t('notif_rest_running', lang, { s: seconds }) })
      .then((ok) => { pushArmedRef.current = ok; });

  // The timer opens from a click, so the transient activation usually still
  // covers this request; where it doesn't (iOS), the guided workout's rest
  // button asks again from a direct gesture.
  useEffect(() => { ensureNotifyPermission(); }, []);
  useEffect(() => () => cancelPush(pushIdRef.current), []); // never fire after close

  // When a different exercise is opened, reset duration to that exercise's default
  useEffect(() => {
    const next = exercise?.restSeconds ?? 90;
    setDuration(Math.min(120, Math.max(30, next)));
  }, [exercise?.id]);

  // When duration changes (user moves slider, or new exercise), restart the countdown
  useEffect(() => {
    setDone(false);
    timer.start(duration);
    schedule(duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const reset = () => { setDone(false); timer.start(duration); schedule(duration); };
  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const display = `${minutes}:${String(Math.max(secs, 0)).padStart(2, '0')}`;
  const pct = Math.max(0, Math.min(100, (secondsLeft / duration) * 100));

  return (
    <div
      className="fixed z-[55] no-print"
      style={{
        bottom: '20px', insetInlineEnd: '20px',
        background: PALETTE.ink, color: PALETTE.cream,
        border: `1px solid ${PALETTE.ink}`,
        borderRadius: '14px',
        padding: '14px 16px',
        minWidth: '260px',
        boxShadow: '0 12px 32px rgba(27,27,25,0.35)',
      }}
      dir={isRTL(lang) ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: PALETTE.sage }}>
          <Timer size={11} strokeWidth={2} className="inline-block" style={{ marginInlineEnd: '0.4rem', verticalAlign: '-2px' }} />
          {t('rest_timer', lang)}
        </div>
        <button onClick={onClose} style={{ color: PALETTE.cream, opacity: 0.6, cursor: 'pointer' }} aria-label="Close">
          <X size={14} strokeWidth={2} />
        </button>
      </div>
      <div className="f-display font-bold leading-none mb-1" dir="ltr">
        <span className={done ? 'timer-pulse inline-block' : ''} style={{ color: done ? PALETTE.rust : PALETTE.cream, fontSize: '40px' }}>
          {done ? t('timer_done', lang) : display}
        </span>
      </div>
      <div className="f-italic text-xs mb-3 ex-name" style={{ opacity: 0.7 }} dir="ltr">
        {exercise?.name}
      </div>
      <div className="h-1 mb-4 overflow-hidden" style={{ background: 'rgba(242,235,221,0.2)', borderRadius: '999px' }} dir="ltr">
        <div style={{ width: `${pct}%`, height: '100%', background: done ? PALETTE.rust : PALETTE.sage, transition: 'width 1s linear' }} />
      </div>

      {/* Duration slider — pick rest between 30 and 120 seconds */}
      <div className="mb-4" dir="ltr">
        <div className="flex items-center justify-between mb-1.5">
          <span className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ opacity: 0.55 }}>
            {t('set_duration', lang)}
          </span>
          <span className="f-mono text-xs" style={{ color: PALETTE.sage }}>
            {duration}s
          </span>
        </div>
        <input
          type="range"
          min={30}
          max={120}
          step={5}
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value, 10))}
          className="rest-slider"
        />
        <div className="flex justify-between mt-1 f-mono" style={{ fontSize: '9px', opacity: 0.45 }}>
          <span>30s</span><span>60s</span><span>90s</span><span>120s</span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {!done ? (
          <button onClick={() => {
            if (paused) { timer.resume(); schedule(Math.max(1, timer.secondsLeft)); }
            else { timer.pause(); cancelPush(pushIdRef.current); pushArmedRef.current = false; }
          }}
            className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1.5"
            style={{ background: 'transparent', color: PALETTE.cream, border: `1px solid ${PALETTE.cream}`, borderRadius: '999px', cursor: 'pointer' }}>
            {paused ? <Play size={11} strokeWidth={2} /> : <Pause size={11} strokeWidth={2} />}
            {paused ? t('timer_paused', lang) : t('rest_timer', lang)}
          </button>
        ) : (
          <button onClick={reset}
            className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1.5"
            style={{ background: PALETTE.rust, color: PALETTE.cream, border: `1px solid ${PALETTE.rust}`, borderRadius: '999px', cursor: 'pointer' }}>
            <RotateCcw size={11} strokeWidth={2} />
            {duration}s
          </button>
        )}
        <button onClick={reset}
          className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1.5"
          style={{ background: 'transparent', color: PALETTE.cream, border: `1px solid rgba(242,235,221,0.4)`, borderRadius: '999px', cursor: 'pointer' }}
          aria-label="Reset">
          <RotateCcw size={11} strokeWidth={2} />
        </button>
        <button onClick={onClose}
          className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1.5"
          style={{ background: 'transparent', color: PALETTE.cream, border: `1px solid rgba(242,235,221,0.4)`, borderRadius: '999px', cursor: 'pointer' }}>
          <SkipForward size={11} strokeWidth={2} />
          {t('skip_rest', lang)}
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Bodyweight log
// ------------------------------------------------------------


export { RestTimer };
