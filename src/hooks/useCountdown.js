import { useEffect, useRef, useState } from 'react';

// Wall-clock countdown. secondsLeft is derived from an absolute deadline rather
// than decremented per tick, so it stays correct when the tab is backgrounded or
// the screen locks; visibilitychange forces an immediate recompute on return.
// (Same pattern as GuidedWorkout's rest/work timers.)
//
//   const timer = useCountdown(onExpire);
//   timer.start(seconds)  — begin or restart the countdown
//   timer.pause() / timer.resume() — freeze / continue with the remainder intact
//   timer.clear()         — stop without firing onExpire
//
// onExpire fires exactly once per started countdown, when it reaches 0.
function useCountdown(onExpire) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [runState, setRunState] = useState('idle'); // 'idle' | 'running' | 'paused'
  const [runId, setRunId] = useState(0);            // fresh interval + expire-once flag per start()
  const endRef = useRef(0);                         // deadline, ms since epoch
  const remainRef = useRef(0);                      // seconds remaining while paused
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;

  useEffect(() => {
    if (runState !== 'running') return;
    let ended = false;
    const tick = () => {
      const left = Math.max(0, Math.round((endRef.current - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0 && !ended) {
        ended = true;
        setRunState('idle');
        expireRef.current?.();
      }
    };
    const id = setInterval(tick, 250);
    document.addEventListener('visibilitychange', tick);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', tick); };
  }, [runState, runId]);

  const start = (seconds) => {
    endRef.current = Date.now() + seconds * 1000;
    setSecondsLeft(seconds);
    setRunState('running');
    setRunId((id) => id + 1);
  };
  const pause = () => {
    if (runState !== 'running') return;
    remainRef.current = Math.max(0, (endRef.current - Date.now()) / 1000);
    setRunState('paused');
  };
  const resume = () => {
    if (runState !== 'paused') return;
    endRef.current = Date.now() + remainRef.current * 1000;
    setRunState('running');
  };
  const clear = () => { setRunState('idle'); setSecondsLeft(0); };

  return {
    secondsLeft,
    running: runState === 'running',
    paused: runState === 'paused',
    start, pause, resume, clear,
  };
}

export { useCountdown };
