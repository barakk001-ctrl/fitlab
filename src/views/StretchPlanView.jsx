import { ArrowLeft, ArrowRight, Bookmark, Clock, ExternalLink, Play, Sparkles } from 'lucide-react';
import { ytSearch } from '../calc.js';
import { MastHead, Pill } from '../components/shared.jsx';
import { StretchVideo } from '../components/video.jsx';
import { STRETCH_AREAS, STRETCH_ROUTINES, estimateRoutineDuration } from '../data/stretches.js';
import { isRTL, t } from '../i18n.js';
import { PALETTE } from '../theme.js';
function StretchRow({ idx, item, lang }) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b last:border-b-0"
      style={{ borderColor: 'rgba(27,27,25,0.15)' }}>
      <div className="f-mono text-[10px] uppercase tracking-[0.2em] pt-1 w-6 shrink-0" style={{ color: PALETTE.rust }} dir="ltr">
        {String(idx + 1).padStart(2, '0')}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <a href={ytSearch(item.query)} target="_blank" rel="noopener noreferrer"
            className="f-display font-semibold underline-hover text-base md:text-lg leading-tight"
            style={{ color: PALETTE.ink }} dir="ltr">
            {item.name[lang]}
          </a>
          <div className="f-mono text-xs tracking-wider flex items-center gap-2" style={{ opacity: 0.75 }} dir="ltr">
            <Clock size={12} strokeWidth={2} style={{ verticalAlign: '-2px' }} />
            {item.hold}s{item.perSide ? ` · ${t('per_side', lang)}` : ''}
          </div>
        </div>
        <a href={ytSearch(item.query)} target="_blank" rel="noopener noreferrer"
          className="f-mono text-[10px] uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5 underline-hover"
          style={{ color: PALETTE.rust, opacity: 0.85, width: 'fit-content' }}>
          {t('watch_form', lang)} <ExternalLink size={11} strokeWidth={2} />
        </a>
        {item.video && (
          <div className="mt-3">
            <StretchVideo video={item.video} title={item.name.en} lazy maxWidth={420} />
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Stretch plan view
// ------------------------------------------------------------

function StretchPlanView({
  lang, setLang, mode, setMode,
  routineId, items, hold, selectedAreas,
  onBack, onOpenSave, onStartGuided,
}) {
  const routine = STRETCH_ROUTINES[routineId];
  const ArrowBack = isRTL(lang) ? ArrowRight : ArrowLeft;
  const totalSeconds = estimateRoutineDuration(items);
  const estMin = Math.max(1, Math.round(totalSeconds / 60));
  const Icon = routine.icon;

  const areasShown = (selectedAreas && selectedAreas.length > 0) ? selectedAreas : routine.areas;

  return (
    <div className="rise">
      <MastHead subtitle={t('masthead_stretch_plan', lang)} lang={lang} setLang={setLang} mode={mode} setMode={setMode} />

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
            style={{ background: PALETTE.rust, color: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
            <Bookmark size={12} strokeWidth={2} />
            {t('save_routine', lang)}
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Pill color={PALETTE.forest}>{routine.label[lang]}</Pill>
          <Pill color={PALETTE.ink}>{t('stretches_count', lang, { n: items.length })}</Pill>
          <Pill color={PALETTE.ink}>{t('est_duration', lang, { n: estMin })}</Pill>
        </div>
      </div>

      <section className="px-6 md:px-12 pt-6 pb-8 relative">
        <div className="f-mono text-[10px] uppercase tracking-[0.3em] mb-4" style={{ color: PALETTE.rust }}>
          {t('stretch_plan_issue', lang)}
        </div>
        <h1 className="f-display leading-[0.92] font-bold"
          style={{ fontSize: 'clamp(36px, 6vw, 80px)', color: PALETTE.ink, letterSpacing: '-0.04em' }}>
          {lang === 'he' ? (
            <>{t('stretch_the', lang)} <span className="f-accent" style={{ color: PALETTE.rust }}>{routine.label[lang]}</span></>
          ) : (
            <>The <span className="f-accent" style={{ color: PALETTE.rust }}>{routine.label[lang]}</span> <span className="f-accent" style={{ color: PALETTE.forest }}>routine</span>.</>
          )}
        </h1>
        <blockquote className="f-italic mt-6 max-w-3xl text-lg md:text-2xl leading-snug"
          style={{ color: PALETTE.ink, paddingInlineStart: '1.5rem', borderInlineStart: `2px solid ${PALETTE.rust}` }}>
          {routine.blurb[lang]}
        </blockquote>

        <div className="mt-6 flex flex-wrap gap-2">
          {areasShown.map(a => {
            const areaObj = STRETCH_AREAS.find(x => x.id === a);
            if (!areaObj) return null;
            return (
              <span key={a} className="f-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5"
                style={{ border: `1px solid ${PALETTE.ink}`, borderRadius: '999px', opacity: 0.8 }}>
                {areaObj.label[lang]}
              </span>
            );
          })}
        </div>
      </section>

      {/* Big guided-start CTA */}
      <section className="px-6 md:px-12 pb-10 no-print">
        <button onClick={onStartGuided}
          className="card-tilt w-full p-6 md:p-8 flex items-center justify-between gap-4 flex-wrap"
          style={{ background: PALETTE.ink, color: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '8px', textAlign: lang === 'he' ? 'right' : 'left' }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: '50%', background: PALETTE.rust }}>
              <Play size={24} strokeWidth={2} color={PALETTE.cream} style={{ marginInlineStart: '3px' }} />
            </div>
            <div>
              <div className="f-display font-bold text-2xl md:text-3xl" style={{ letterSpacing: '-0.02em' }}>
                {t('start_guided', lang)}
              </div>
              <div className="f-mono text-[10px] uppercase tracking-[0.25em] mt-1" style={{ color: PALETTE.sage }}>
                {t('stretches_count', lang, { n: items.length })} · {t('est_duration', lang, { n: estMin })}
              </div>
            </div>
          </div>
          <Icon size={40} strokeWidth={1.2} style={{ opacity: 0.5 }} />
        </button>
      </section>

      <div className="ticker-line mx-6 md:mx-12" />

      {/* The sequence */}
      <section className="px-6 md:px-12 pt-12 pb-16">
        <div className="flex items-baseline justify-between mb-5 flex-wrap gap-3">
          <h2 className="f-display font-bold text-3xl md:text-4xl" style={{ color: PALETTE.ink }}>
            <span className="f-mono text-xs align-middle" style={{ opacity: 0.5, marginInlineEnd: '0.75rem' }}>A /</span>
            {t('stretch_sequence', lang)}
          </h2>
          <span className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ opacity: 0.6 }}>
            {t('hold_for', lang, { n: hold })}
          </span>
        </div>
        <p className="f-body text-sm max-w-2xl mb-7" style={{ opacity: 0.75 }}>
          {t('stretch_sequence_explainer', lang)}
        </p>

        <div className="p-6 md:p-8" style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px' }}>
          {items.map((item, i) => (
            <StretchRow key={`${item.id}-${i}`} idx={i} item={item} lang={lang} />
          ))}
        </div>

        <p className="f-mono text-[10px] uppercase tracking-[0.2em] mt-6" style={{ opacity: 0.55 }}>
          {t('tap_form_note', lang)}
        </p>
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
          {t('try_diff_routine', lang)}
        </button>
      </footer>
    </div>
  );
}

// ------------------------------------------------------------
// Guided session player (full-screen, auto-advancing)
// ------------------------------------------------------------


export { StretchRow, StretchPlanView };
