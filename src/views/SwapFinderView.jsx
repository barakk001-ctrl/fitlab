import { ArrowLeft, ExternalLink, Search, Shuffle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ytSearch } from '../calc.js';
import { MastHead, Pill } from '../components/shared.jsx';
import { StretchVideo } from '../components/video.jsx';
import { EX, EX_VIDEOS, MOVEMENT_LABELS } from '../data/exercises.js';
import { isRTL, t } from '../i18n.js';
import { PALETTE } from '../theme.js';

// Substitute finder: pick the exercise you can't do, say where you're
// training, get every same-movement-pattern alternative from the library.
function SwapFinderView({ lang, setLang, mode, setMode, onBack }) {
  const [query, setQuery] = useState('');
  const [pickedId, setPickedId] = useState(null);
  const [where, setWhere] = useState('any'); // 'any' | 'gym' | 'cali'

  const options = useMemo(() =>
    Object.entries(EX).sort((a, b) => a[1].name.localeCompare(b[1].name)), []);
  const q = query.trim().toLowerCase();
  const matches = !pickedId && q
    ? options.filter(([, e]) => e.name.toLowerCase().includes(q)).slice(0, 8)
    : [];
  const picked = pickedId ? EX[pickedId] : null;

  const alternatives = useMemo(() => {
    if (!picked) return [];
    return options
      .filter(([id, e]) => id !== pickedId && e.movement === picked.movement &&
        (where === 'any' || e.equip === where))
      .map(([id, e]) => ({ id, ...e, video: EX_VIDEOS[id] || null }));
  }, [pickedId, where, options, picked]);

  const pick = ([id, e]) => { setPickedId(id); setQuery(e.name); };
  const fieldStyle = {
    background: 'transparent', color: PALETTE.ink,
    border: `1px solid ${PALETTE.ink}`, borderRadius: '999px', padding: '10px 14px',
  };

  return (
    <div className="rise">
      <MastHead subtitle={t('find_swap', lang)} lang={lang} setLang={setLang} mode={mode} setMode={setMode} />

      <section className="px-6 md:px-12 pt-10 pb-6">
        <button onClick={onBack}
          className="no-print f-mono text-xs uppercase tracking-[0.2em] flex items-center gap-2 underline-hover mb-6"
          style={{ color: PALETTE.ink }}>
          <ArrowLeft size={14} strokeWidth={2} style={{ transform: isRTL(lang) ? 'scaleX(-1)' : 'none' }} />
          {t('cta_back', lang)}
        </button>
        <Pill color={PALETTE.rust}><Shuffle size={11} strokeWidth={2.4} /> {t('find_swap', lang)}</Pill>
        <h1 className="f-display font-bold mt-4" style={{ color: PALETTE.ink, fontSize: 'clamp(38px,6vw,76px)', letterSpacing: '-0.03em', lineHeight: 1 }}>
          {t('swap_title', lang)}
        </h1>
        <p className="f-body mt-3 max-w-xl text-sm md:text-base" style={{ opacity: 0.78 }}>{t('swap_sub', lang)}</p>
      </section>

      <section className="px-6 md:px-12 pb-6">
        <div className="f-mono text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: PALETTE.rust }}>
          {t('swap_pick_label', lang)}
        </div>
        <span className="relative inline-flex items-center w-full" style={{ maxWidth: 420 }} dir="ltr">
          <Search size={14} strokeWidth={2} className="absolute" style={{ insetInlineStart: 14, opacity: 0.5, pointerEvents: 'none' }} />
          <input value={query} role="combobox" aria-expanded={matches.length > 0}
            onChange={(e) => { setQuery(e.target.value); setPickedId(null); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && matches.length) pick(matches[0]);
              if (e.key === 'Escape') { setQuery(''); setPickedId(null); }
            }}
            placeholder={t('build_search', lang)} aria-label={t('swap_pick_label', lang)}
            className="f-body text-base w-full" style={{ ...fieldStyle, paddingInlineStart: 38 }} />
          {matches.length > 0 && (
            <div className="absolute z-20 top-full mt-1 w-full overflow-hidden" role="listbox"
              style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '10px', boxShadow: '0 10px 24px rgba(27,27,25,0.25)' }}>
              {matches.map(([id, e]) => (
                <button key={id} role="option" onClick={() => pick([id, e])}
                  className="flex items-center justify-between gap-3 w-full text-start f-body text-sm px-4 py-2.5"
                  style={{ color: PALETTE.ink, borderBottom: `1px solid rgba(27,27,25,0.12)` }}>
                  <span>{e.name}</span>
                  <span className="f-mono text-[9px] uppercase tracking-[0.15em]" style={{ opacity: 0.55 }}>
                    {e.equip === 'gym' ? t('swap_gym', lang) : t('swap_home', lang)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </span>

        <div className="flex items-center gap-2 flex-wrap mt-5">
          <span className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: PALETTE.rust }}>
            {t('swap_where', lang)}
          </span>
          {[['any', 'swap_any'], ['gym', 'swap_gym'], ['cali', 'swap_home']].map(([id, key]) => {
            const active = where === id;
            return (
              <button key={id} onClick={() => setWhere(id)} aria-pressed={active}
                className="f-mono text-[10px] uppercase tracking-[0.15em] px-3.5 py-1.5"
                style={{
                  background: active ? PALETTE.ink : 'transparent',
                  color: active ? PALETTE.cream : PALETTE.ink,
                  border: `1px solid ${PALETTE.ink}`, borderRadius: '999px', cursor: 'pointer',
                }}>
                {t(key, lang)}
              </button>
            );
          })}
        </div>
      </section>

      {picked && (
        <section className="px-6 md:px-12 pb-16">
          <div className="p-5 md:p-6 mb-6 flex items-center justify-between gap-4 flex-wrap"
            style={{ background: PALETTE.ink, color: PALETTE.cream, borderRadius: '6px' }}>
            <div>
              <div className="f-display font-bold text-xl md:text-2xl" dir="ltr">{picked.name}</div>
              <div className="f-mono text-[10px] uppercase tracking-[0.25em] mt-1" style={{ color: PALETTE.sage }}>
                {MOVEMENT_LABELS[picked.movement][lang]} · {picked.equip === 'gym' ? t('swap_gym', lang) : t('swap_home', lang)}
              </div>
            </div>
            <Pill color={PALETTE.sage}>{t('swap_alts', lang, { n: alternatives.length })}</Pill>
          </div>

          {alternatives.length === 0 ? (
            <div className="p-6 f-italic text-center" style={{ background: PALETTE.paper, border: `1px dashed ${PALETTE.ink}`, borderRadius: '6px', opacity: 0.75 }}>
              {t('swap_none', lang)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {alternatives.map((alt) => (
                <div key={alt.id} className="p-5" style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '6px' }}>
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <span className="f-display font-semibold text-lg leading-tight" style={{ color: PALETTE.ink }} dir="ltr">{alt.name}</span>
                    <span className="f-mono text-[9px] uppercase tracking-[0.15em] px-2 py-0.5"
                      style={{ color: alt.equip === 'gym' ? PALETTE.rust : PALETTE.forest, border: `1px solid currentColor`, borderRadius: '999px' }}>
                      {alt.equip === 'gym' ? t('swap_gym', lang) : t('swap_home', lang)}
                    </span>
                  </div>
                  <a href={ytSearch(alt.query)} target="_blank" rel="noopener noreferrer"
                    className="f-mono text-[10px] uppercase tracking-[0.2em] mt-2 inline-flex items-center gap-1.5 underline-hover no-print"
                    style={{ color: PALETTE.rust }}>
                    {t('watch_form', lang)} <ExternalLink size={11} strokeWidth={2} />
                  </a>
                  {alt.video && (
                    <div className="mt-3 no-print">
                      <StretchVideo video={alt.video} title={alt.name} lazy />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export { SwapFinderView };
