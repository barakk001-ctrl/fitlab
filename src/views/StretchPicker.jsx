import { Check, StretchHorizontal } from 'lucide-react';
import { SavedPlansSection } from '../components/SavedPlansSection.jsx';
import { MastHead, Pill } from '../components/shared.jsx';
import { STRETCH_AREAS, STRETCH_ROUTINES } from '../data/stretches.js';
import { t } from '../i18n.js';
import { PALETTE } from '../theme.js';
function BodyDiagram({ area, active, size = 26 }) {
  const baseColor = active ? PALETTE.cream : PALETTE.ink;
  const hiColor = active ? PALETTE.cream : PALETTE.rust;
  const base = { fill: baseColor, opacity: 0.3 };
  const hi = { fill: hiColor, opacity: 0.95 };

  const highlights = {
    neck: <rect x="17" y="12.5" width="6" height="5.5" rx="1.5" style={hi} />,
    shoulders: (
      <g style={hi}>
        <circle cx="11.5" cy="20.5" r="3.4" />
        <circle cx="28.5" cy="20.5" r="3.4" />
      </g>
    ),
    chest: <rect x="12.5" y="20" width="15" height="8" rx="2.5" style={hi} />,
    back: <rect x="18" y="19" width="4" height="22" rx="2" style={hi} />,
    hips: (
      <g style={hi}>
        <rect x="11.5" y="40" width="5.5" height="7" rx="2.5" />
        <rect x="23" y="40" width="5.5" height="7" rx="2.5" />
      </g>
    ),
    glutes: <rect x="13" y="42.5" width="14" height="8" rx="3.5" style={hi} />,
    hamstrings: (
      <g style={hi}>
        <rect x="13.6" y="50" width="5.8" height="12" rx="2.6" />
        <rect x="20.6" y="50" width="5.8" height="12" rx="2.6" />
      </g>
    ),
    quads: (
      <g style={hi}>
        <rect x="13.6" y="50" width="5.8" height="21" rx="2.6" />
        <rect x="20.6" y="50" width="5.8" height="21" rx="2.6" />
      </g>
    ),
    calves: (
      <g style={hi}>
        <rect x="14.1" y="71" width="5.1" height="22" rx="2.4" />
        <rect x="20.8" y="71" width="5.1" height="22" rx="2.4" />
      </g>
    ),
    wrists: (
      <g style={hi}>
        <circle cx="9.3" cy="41" r="2.9" />
        <circle cx="30.7" cy="41" r="2.9" />
      </g>
    ),
  };

  return (
    <svg
      width={size * 0.42}
      height={size}
      viewBox="0 0 40 100"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      {/* Shared humanoid silhouette */}
      <g style={base}>
        <circle cx="20" cy="8" r="6" />
        <rect x="17.5" y="13" width="5" height="5" />
        <rect x="9" y="18.5" width="22" height="5" rx="2.5" />
        <rect x="12" y="20" width="16" height="22" rx="3" />
        <rect x="8" y="20" width="4" height="20" rx="2" />
        <rect x="28" y="20" width="4" height="20" rx="2" />
        <circle cx="9.3" cy="41" r="2.5" />
        <circle cx="30.7" cy="41" r="2.5" />
        <rect x="13" y="41" width="14" height="9" rx="3" />
        <rect x="13.6" y="49" width="5.8" height="23" rx="2.8" />
        <rect x="20.6" y="49" width="5.8" height="23" rx="2.8" />
        <rect x="14.1" y="71" width="5.1" height="23" rx="2.4" />
        <rect x="20.8" y="71" width="5.1" height="23" rx="2.4" />
      </g>
      {/* Region highlight */}
      {highlights[area] || null}
    </svg>
  );
}

// ------------------------------------------------------------
// Stretch picker view
// ------------------------------------------------------------

function StretchPicker({
  lang, setLang, mode, setMode,
  routine, onPickRoutine,
  selectedAreas, onToggleArea,
  onSubmit,
  savedPlans, onLoadPlan, onDeletePlan,
}) {
  const ready = !!routine;

  return (
    <div className="rise">
      <MastHead subtitle={t('masthead_stretch', lang)} lang={lang} setLang={setLang} mode={mode} setMode={setMode} />

      <section className="px-6 md:px-12 pt-12 pb-10 relative">
        <Pill color={PALETTE.forest}>{t('mode_stretch', lang)}</Pill>
        <h1 className="f-display mt-6 leading-[0.92]"
          style={{ color: PALETTE.ink, fontSize: 'clamp(42px, 7.5vw, 110px)', fontWeight: 800 }}>
          {lang === 'he' ? (
            <>למתוח <span className="f-accent" style={{ color: PALETTE.rust }}>בכוונה</span><br />לא במקרה.</>
          ) : (
            <>Stretch with <span className="f-accent" style={{ color: PALETTE.rust }}>intention</span><br />not by <span className="f-accent" style={{ color: PALETTE.forest }}>accident</span>.</>
          )}
        </h1>
        <p className="f-body mt-8 max-w-xl text-base md:text-lg leading-relaxed" style={{ color: PALETTE.ink, opacity: 0.78 }}>
          {t('stretch_hero_subtitle', lang)}
        </p>
      </section>

      <SavedPlansSection
        savedPlans={savedPlans}
        onLoad={onLoadPlan}
        onDelete={onDeletePlan}
        lang={lang}
      />

      <div className="ticker-line mx-6 md:mx-12" />

      {/* 01 — ROUTINE */}
      <section className="px-6 md:px-12 pt-12 pb-6">
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-3">
          <h2 className="f-display text-3xl md:text-4xl font-bold" style={{ color: PALETTE.ink }}>
            <span className="f-mono text-xs align-middle" style={{ opacity: 0.5, marginInlineEnd: '0.75rem' }}>01 /</span>
            {t('stretch_section_routine', lang)}
          </h2>
        </div>
        <p className="f-body text-sm max-w-2xl mb-6" style={{ opacity: 0.75 }}>
          {t('stretch_routine_explainer', lang)}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.values(STRETCH_ROUTINES).map((r, i) => {
            const Icon = r.icon;
            const active = routine === r.id;
            return (
              <button key={r.id} onClick={() => onPickRoutine(r.id)}
                className="card-tilt p-6 md:p-7 relative overflow-hidden"
                style={{
                  textAlign: lang === 'he' ? 'right' : 'left',
                  background: active ? PALETTE.forest : PALETTE.paper,
                  color: active ? PALETTE.cream : PALETTE.ink,
                  border: `1px solid ${PALETTE.ink}`, borderRadius: '4px',
                  animationDelay: `${0.1 + i * 0.06}s`,
                }}>
                <div className="flex items-start justify-between">
                  <Icon size={26} strokeWidth={1.5} />
                  <span className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: active ? PALETTE.sage : PALETTE.rust }}>
                    {r.defaultHold}s
                  </span>
                </div>
                <div className="f-display mt-5 font-bold" style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
                  {r.label[lang]}
                </div>
                <p className="f-italic text-base mt-3" style={{ opacity: active ? 0.85 : 0.7 }}>
                  {r.tagline[lang]}
                </p>
                <p className="f-body mt-3 text-xs leading-relaxed opacity-80">
                  {r.blurb[lang]}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 02 — TARGET AREAS */}
      <section className="px-6 md:px-12 pt-12 pb-6">
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-3">
          <h2 className="f-display text-3xl md:text-4xl font-bold" style={{ color: PALETTE.ink }}>
            <span className="f-mono text-xs align-middle" style={{ opacity: 0.5, marginInlineEnd: '0.75rem' }}>02 /</span>
            {t('stretch_section_areas', lang)}
          </h2>
          <span className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ opacity: 0.6 }}>
            {t('stretch_areas_optional', lang)}
          </span>
        </div>
        <p className="f-body text-sm max-w-2xl mb-6" style={{ opacity: 0.75 }}>
          {t('stretch_areas_explainer', lang)}
        </p>

        {/* Default-areas hint when a routine is chosen and no custom areas selected */}
        {routine && selectedAreas.length === 0 && (
          <div className="mb-5 f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 flex-wrap" style={{ opacity: 0.6 }}>
            <span style={{ color: PALETTE.rust }}>{t('stretch_default_areas', lang)}:</span>
            {STRETCH_ROUTINES[routine].areas.map((a, idx) => {
              const areaObj = STRETCH_AREAS.find(x => x.id === a);
              return (
                <span key={a} className="flex items-center gap-2">
                  {idx > 0 && <span style={{ opacity: 0.4 }}>·</span>}
                  {areaObj?.label[lang]}
                </span>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap gap-2.5">
          {STRETCH_AREAS.map((area) => {
            const active = selectedAreas.includes(area.id);
            return (
              <button key={area.id} onClick={() => onToggleArea(area.id)}
                className="f-mono uppercase tracking-[0.15em] px-4 py-2.5 text-xs transition-all"
                style={{
                  background: active ? PALETTE.rust : PALETTE.paper,
                  color: active ? PALETTE.cream : PALETTE.ink,
                  border: `1px solid ${PALETTE.ink}`,
                  borderRadius: '999px',
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                }}>
                <BodyDiagram area={area.id} active={active} />
                {area.label[lang]}
                {active && <Check size={12} strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <div className="sticky bottom-0 px-6 md:px-12 py-5 flex items-center justify-between gap-4 flex-wrap no-print"
        style={{ background: PALETTE.cream, borderTop: `1px solid ${PALETTE.ink}` }}>
        <div className="f-mono text-xs uppercase tracking-[0.2em] flex items-center gap-3 flex-wrap" style={{ color: PALETTE.ink }}>
          <span>{routine ? '✓' : '○'} {t('stretch_section_routine', lang)}</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span style={{ opacity: 0.7 }}>{selectedAreas.length > 0 ? `${selectedAreas.length} ${t('stretch_section_areas', lang)}` : t('stretch_default_areas', lang)}</span>
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
          <StretchHorizontal size={14} strokeWidth={1.5} />
          {t('stretch_generate', lang)}
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Embedded stretch demonstration video (responsive 16:9)
// ------------------------------------------------------------

// Lazily load the YouTube IFrame Player API once; resolves with window.YT.

export { BodyDiagram, StretchPicker };
