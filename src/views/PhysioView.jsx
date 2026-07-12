import { ArrowLeft, Bell, BellOff, HeartPulse, Play } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { StretchVideo } from '../components/video.jsx';
import { MastHead, Pill } from '../components/shared.jsx';
import { PHYSIO_AREAS } from '../data/physio.js';
import { estimateRoutineDuration } from '../data/stretches.js';
import { isRTL, t } from '../i18n.js';
import { clearDailyReminder, ensureNotifyPermission, readReminderPref, setDailyReminder, writeReminderPref } from '../media.js';
import { PALETTE } from '../theme.js';
import { GuidedPlayer } from '../session/GuidedPlayer.jsx';

// Daily reminder card: pick a time, toggle on/off. The preference is stored
// locally and re-registered with the server on every app open.
function ReminderCard({ lang }) {
  const stored = readReminderPref();
  const [time, setTime] = useState(stored ? `${String(stored.hour).padStart(2, '0')}:${String(stored.minute).padStart(2, '0')}` : '18:00');
  const [enabled, setEnabled] = useState(Boolean(stored?.enabled));
  const [busy, setBusy] = useState(false);

  const apply = async (nextTime, nextEnabled) => {
    setBusy(true);
    const [h, m] = nextTime.split(':').map((x) => parseInt(x, 10));
    if (nextEnabled) {
      const ok = await ensureNotifyPermission();
      const title = t('notif_physio_title', lang);
      const body = t('notif_physio_body', lang);
      const set = ok && await setDailyReminder(h, m, title, body);
      if (set) {
        writeReminderPref({ enabled: true, hour: h, minute: m, title, body });
        setEnabled(true);
      } else {
        setEnabled(false);
      }
    } else {
      await clearDailyReminder();
      writeReminderPref(null);
      setEnabled(false);
    }
    setBusy(false);
  };

  return (
    <div className="p-5 md:p-6 mt-6 flex items-center justify-between gap-4 flex-wrap"
      style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px' }}>
      <div className="min-w-0">
        <div className="f-display font-bold text-lg md:text-xl" style={{ color: PALETTE.ink }}>
          {t('physio_reminder', lang)}
        </div>
        <p className="f-italic text-sm mt-1" style={{ opacity: 0.65 }}>
          {enabled ? t('reminder_active', lang, { t: time }) : t('physio_reminder_sub', lang)}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap no-print" dir="ltr">
        <input type="time" value={time}
          onChange={(e) => { const v = e.target.value || '18:00'; setTime(v); if (enabled) apply(v, true); }}
          aria-label={t('physio_reminder', lang)}
          className="f-mono text-sm px-3 py-2"
          style={{ background: 'transparent', color: PALETTE.ink, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }} />
        <button onClick={() => apply(time, !enabled)} disabled={busy}
          className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-4 py-2.5"
          style={{
            background: enabled ? PALETTE.forest : 'transparent',
            color: enabled ? PALETTE.cream : PALETTE.ink,
            border: `1px solid ${enabled ? PALETTE.forest : PALETTE.ink}`,
            borderRadius: '999px', opacity: busy ? 0.6 : 1, cursor: busy ? 'wait' : 'pointer',
          }}>
          {enabled ? <BellOff size={12} strokeWidth={2} /> : <Bell size={12} strokeWidth={2} />}
          {enabled ? t('reminder_disable', lang) : t('reminder_enable', lang)}
        </button>
      </div>
    </div>
  );
}

function PhysioRow({ idx, item, lang }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b last:border-b-0" style={{ borderColor: 'rgba(27,27,25,0.15)' }}>
      <div className="f-display font-bold text-xl md:text-2xl pt-0.5 w-8 shrink-0" style={{ color: PALETTE.rust }} dir="ltr">
        {String(idx + 1).padStart(2, '0')}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <span className="f-display font-semibold text-base md:text-lg leading-tight" style={{ color: PALETTE.ink }}>
            {item.name[lang]}
          </span>
          <span className="f-mono text-xs tracking-wider whitespace-nowrap" style={{ opacity: 0.75 }} dir="ltr">
            {item.hold}s{item.perSide ? ` × 2 (${t('physio_per_side', lang)})` : ''}
          </span>
        </div>
        <p className="f-italic text-sm mt-1" style={{ opacity: 0.7 }}>{item.cue[lang]}</p>
        {item.video && (
          <div className="mt-3 no-print">
            <StretchVideo video={item.video} title={item.name.en} lazy maxWidth={400} />
          </div>
        )}
      </div>
    </div>
  );
}

function PhysioView({ lang, setLang, mode, setMode, onComplete }) {
  const [areaId, setAreaId] = useState(null);
  const [guidedOpen, setGuidedOpen] = useState(false);
  const area = PHYSIO_AREAS.find((a) => a.id === areaId) || null;
  const minutes = area ? Math.max(1, Math.round(estimateRoutineDuration(area.session) / 60)) : 0;

  return (
    <div className="rise">
      <MastHead subtitle={t('mode_physio', lang)} lang={lang} setLang={setLang} mode={mode} setMode={setMode} />

      <section className="px-6 md:px-12 pt-10 pb-6">
        <Pill color={PALETTE.forest}><HeartPulse size={11} strokeWidth={2.4} /> {t('mode_physio', lang)}</Pill>
        <h1 className="f-display font-bold mt-4" style={{ color: PALETTE.ink, fontSize: 'clamp(38px,6vw,76px)', letterSpacing: '-0.03em', lineHeight: 1 }}>
          {t('physio_title', lang)}
        </h1>
        <p className="f-body mt-3 max-w-xl text-sm md:text-base" style={{ opacity: 0.78 }}>{t('physio_sub', lang)}</p>
        <p className="f-italic text-xs mt-3 max-w-xl" style={{ color: PALETTE.rust, opacity: 0.9 }}>{t('physio_disclaimer', lang)}</p>
      </section>

      {!area ? (
        <section className="px-6 md:px-12 pb-16">
          <div className="f-mono text-[10px] uppercase tracking-[0.25em] mb-4" style={{ color: PALETTE.forest }}>
            {t('physio_pick', lang)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PHYSIO_AREAS.map((a, i) => {
              const mins = Math.max(1, Math.round(estimateRoutineDuration(a.session) / 60));
              return (
                <button key={a.id} onClick={() => setAreaId(a.id)}
                  className="card-tilt p-5 md:p-6 text-start"
                  style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px', cursor: 'pointer' }}>
                  <div className="f-display font-bold" style={{ fontSize: '34px', color: PALETTE.forest, letterSpacing: '-0.03em', lineHeight: 1 }} dir="ltr">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="f-display font-bold text-xl md:text-2xl mt-2" style={{ color: PALETTE.ink, letterSpacing: '-0.02em' }}>
                    {a.label[lang]}
                  </div>
                  <div className="f-italic text-sm mt-1" style={{ opacity: 0.65 }}>{a.tagline[lang]}</div>
                  <div className="f-mono text-[10px] uppercase tracking-[0.2em] mt-3" style={{ color: PALETTE.forest }}>
                    {t('physio_moves', lang, { n: a.session.length })} · {t('physio_min', lang, { m: mins })}
                  </div>
                </button>
              );
            })}
          </div>
          <ReminderCard lang={lang} />
        </section>
      ) : (
        <>
          <section className="px-6 md:px-12 pb-4 no-print">
            <button onClick={() => setAreaId(null)}
              className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-4 py-2"
              style={{ background: 'transparent', color: PALETTE.ink, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
              <ArrowLeft size={12} strokeWidth={2} style={{ transform: isRTL(lang) ? 'scaleX(-1)' : 'none' }} /> {t('physio_back', lang)}
            </button>
          </section>

          <section className="px-6 md:px-12 pb-6">
            <div className="p-6 md:p-8" style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px' }}>
              <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
                <h2 className="f-display font-bold" style={{ fontSize: 'clamp(26px,3.5vw,40px)', color: PALETTE.ink, letterSpacing: '-0.02em' }}>
                  {area.label[lang]}
                </h2>
                <Pill color={PALETTE.forest}>
                  {t('physio_moves', lang, { n: area.session.length })} · {t('physio_min', lang, { m: minutes })}
                </Pill>
              </div>
              <p className="f-italic text-sm md:text-base mb-4" style={{ opacity: 0.65 }}>{area.tagline[lang]}</p>
              <div>
                {area.session.map((item, i) => (
                  <PhysioRow key={item.id} idx={i} item={item} lang={lang} />
                ))}
              </div>
            </div>
          </section>

          <section className="px-6 md:px-12 pb-16 no-print">
            <button onClick={() => setGuidedOpen(true)}
              className="card-tilt w-full p-6 md:p-8 flex items-center justify-between gap-4 flex-wrap"
              style={{ background: PALETTE.ink, color: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '8px', textAlign: isRTL(lang) ? 'right' : 'left' }}>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: '50%', background: PALETTE.forest }}>
                  <Play size={24} strokeWidth={2} color={PALETTE.cream} style={{ marginInlineStart: '3px' }} />
                </div>
                <div>
                  <div className="f-display font-bold text-xl md:text-2xl" style={{ letterSpacing: '-0.02em' }}>
                    {t('physio_start', lang)}
                  </div>
                  <div className="f-mono text-[10px] uppercase tracking-[0.25em] mt-1" style={{ color: PALETTE.sage }}>
                    {t('physio_moves', lang, { n: area.session.length })} · {t('physio_min', lang, { m: minutes })}
                  </div>
                </div>
              </div>
            </button>
          </section>

          {/* Portal to body: the .rise wrapper's transform would otherwise become
              the containing block for the player's position:fixed overlay. */}
          {guidedOpen && createPortal(
            <GuidedPlayer
              items={area.session}
              lang={lang}
              ofKey="guided_move_of"
              onClose={() => setGuidedOpen(false)}
              onComplete={onComplete}
            />,
            document.body
          )}
        </>
      )}
    </div>
  );
}

export { PhysioView };
