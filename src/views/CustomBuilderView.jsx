import { ArrowLeft, ArrowRight, Bookmark, Check, ListChecks, Play, Plus, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { SavedPlansSection } from '../components/SavedPlansSection.jsx';
import { MastHead, Pill } from '../components/shared.jsx';
import { StretchVideo } from '../components/video.jsx';
import { EX, EX_VIDEOS } from '../data/exercises.js';
import { isRTL, t } from '../i18n.js';
import { PALETTE } from '../theme.js';
function CustomBuilderView({ lang, setLang, mode, setMode, onBack, onStart, items, setItems, onSaveOpen, savedCustoms, onLoadPlan, onDeletePlan }) {
  const [query, setQuery] = useState('');
  const [equip, setEquip] = useState('all'); // all | gym | cali
  const [preview, setPreview] = useState(null); // { video, name } or null
  const selected = items;
  const ArrowBack = isRTL(lang) ? ArrowRight : ArrowLeft;
  const selectedIds = new Set(selected.map((s) => s.id));

  const library = useMemo(() => {
    const q = query.trim().toLowerCase();
    return Object.entries(EX).filter(([, ex]) => {
      if (equip !== 'all' && ex.equip !== equip) return false;
      if (q && !ex.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, equip]);

  const add = (id) => setItems((prev) => prev.some((s) => s.id === id) ? prev : [...prev, { id, sets: 3, reps: 10 }]);
  const remove = (id) => setItems((prev) => prev.filter((s) => s.id !== id));
  const bump = (id, field, delta) => setItems((prev) => prev.map((s) => s.id === id ? { ...s, [field]: Math.max(1, s[field] + delta) } : s));

  const start = () => {
    if (!selected.length) return;
    const exercises = selected.map((s, i) => {
      const ex = EX[s.id];
      return { id: `cb-${i}-${s.id}`, name: ex.name, prescription: `${s.sets} × ${s.reps}`, video: EX_VIDEOS[s.id] || null, restSeconds: 60 };
    });
    onStart(exercises);
  };

  const filters = [
    { id: 'all', key: 'build_filter_all' },
    { id: 'gym', key: 'build_filter_gym' },
    { id: 'cali', key: 'build_filter_cali' },
  ];

  const Stepper = ({ value, onMinus, onPlus, label }) => (
    <div className="flex items-center gap-1.5" dir="ltr">
      <button onClick={onMinus} className="flex items-center justify-center" style={{ width: 24, height: 24, borderRadius: '999px', border: `1px solid ${PALETTE.ink}`, color: PALETTE.ink }}>–</button>
      <div className="text-center" style={{ minWidth: 38 }}>
        <div className="f-display font-bold" style={{ fontSize: 18, lineHeight: 1, color: PALETTE.ink }}>{value}</div>
        <div className="f-mono" style={{ fontSize: 8, opacity: 0.55, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
      </div>
      <button onClick={onPlus} className="flex items-center justify-center" style={{ width: 24, height: 24, borderRadius: '999px', border: `1px solid ${PALETTE.ink}`, color: PALETTE.ink }}>+</button>
    </div>
  );

  return (
    <div className="rise">
      <MastHead subtitle={t('build_title', lang)} lang={lang} setLang={setLang} mode={mode} setMode={setMode} />

      <section className="px-6 md:px-12 pt-8 pb-4">
        <button onClick={onBack}
          className="f-mono text-xs uppercase tracking-[0.2em] flex items-center gap-2 underline-hover mb-5" style={{ color: PALETTE.ink }}>
          <ArrowBack size={14} strokeWidth={2} /> {t('cta_back', lang)}
        </button>
        <Pill color={PALETTE.rust}><ListChecks size={11} strokeWidth={2.4} /> {t('build_own', lang)}</Pill>
        <h1 className="f-display font-bold mt-4" style={{ color: PALETTE.ink, fontSize: 'clamp(36px,6vw,72px)', letterSpacing: '-0.03em', lineHeight: 1 }}>
          {t('build_title', lang)}
        </h1>
        <p className="f-body mt-3 max-w-xl text-sm md:text-base" style={{ opacity: 0.78 }}>{t('build_sub', lang)}</p>
      </section>

      {/* Your session */}
      <section className="px-6 md:px-12 pb-6">
        <div className="p-5 md:p-6" style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '6px' }}>
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
            <h2 className="f-display font-bold text-xl md:text-2xl" style={{ color: PALETTE.ink }}>{t('build_your_session', lang)}</h2>
            <span className="f-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: PALETTE.rust }}>{t('build_count', lang, { n: selected.length })}</span>
          </div>
          {selected.length === 0 ? (
            <p className="f-italic text-sm" style={{ opacity: 0.65 }}>{t('build_empty', lang)}</p>
          ) : (
            <div>
              {selected.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 py-3 border-b last:border-b-0 flex-wrap" style={{ borderColor: 'rgba(27,27,25,0.12)' }}>
                  <span className="f-display font-semibold" style={{ color: PALETTE.ink }} dir="ltr">{EX[s.id].name}</span>
                  <div className="flex items-center gap-3">
                    <Stepper value={s.sets} label={t('build_sets', lang)} onMinus={() => bump(s.id, 'sets', -1)} onPlus={() => bump(s.id, 'sets', 1)} />
                    <span style={{ opacity: 0.4 }}>×</span>
                    <Stepper value={s.reps} label={t('build_reps', lang)} onMinus={() => bump(s.id, 'reps', -1)} onPlus={() => bump(s.id, 'reps', 1)} />
                    <button onClick={() => remove(s.id)} aria-label={t('build_remove', lang)} style={{ color: PALETTE.ink, opacity: 0.5 }}>
                      <X size={16} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3 mt-5 flex-wrap">
            <button onClick={start} disabled={selected.length === 0}
              className="f-mono uppercase tracking-[0.2em] px-7 py-3.5 text-xs flex items-center gap-2"
              style={{ background: selected.length ? PALETTE.ink : 'transparent', color: selected.length ? PALETTE.cream : PALETTE.ink, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px', opacity: selected.length ? 1 : 0.4, cursor: selected.length ? 'pointer' : 'not-allowed' }}>
              <Play size={13} strokeWidth={2.5} /> {t('start_session', lang)}
            </button>
            <button onClick={onSaveOpen} disabled={selected.length === 0}
              className="f-mono uppercase tracking-[0.2em] px-6 py-3.5 text-xs flex items-center gap-2"
              style={{ background: 'transparent', color: PALETTE.ink, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px', opacity: selected.length ? 1 : 0.4, cursor: selected.length ? 'pointer' : 'not-allowed' }}>
              <Bookmark size={12} strokeWidth={2} /> {t('build_save', lang)}
            </button>
          </div>
        </div>
      </section>

      {savedCustoms && savedCustoms.length > 0 && (
        <SavedPlansSection savedPlans={savedCustoms} onLoad={onLoadPlan} onDelete={onDeletePlan} lang={lang} />
      )}

      {/* Library */}
      <section className="px-6 md:px-12 pb-16">
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <div className="flex items-center gap-2 px-3 py-2" style={{ border: `1px solid ${PALETTE.ink}`, borderRadius: '999px', flex: '1 1 240px', maxWidth: 360 }}>
            <Search size={14} strokeWidth={2} style={{ opacity: 0.6 }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('build_search', lang)}
              className="f-body text-sm" style={{ background: 'transparent', color: PALETTE.ink, border: 'none', outline: 'none', width: '100%' }} />
          </div>
          <div className="inline-flex p-1" style={{ border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
            {filters.map((f) => {
              const active = equip === f.id;
              return (
                <button key={f.id} onClick={() => setEquip(f.id)}
                  className="f-mono text-[10px] uppercase tracking-[0.15em] px-3 py-1.5"
                  style={{ background: active ? PALETTE.ink : 'transparent', color: active ? PALETTE.cream : PALETTE.ink, borderRadius: '999px' }}>
                  {t(f.key, lang)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {library.map(([id, ex]) => {
            const added = selectedIds.has(id);
            const video = EX_VIDEOS[id];
            return (
              <div key={id} style={{ background: added ? PALETTE.forest : PALETTE.paper, color: added ? PALETTE.cream : PALETTE.ink, border: `1px solid ${PALETTE.ink}`, borderRadius: '6px', overflow: 'hidden' }}>
                {video && (
                  <button onClick={() => setPreview({ video, name: ex.name })}
                    title={ex.name}
                    style={{ position: 'relative', display: 'block', width: '100%', aspectRatio: '16 / 9', background: '#000' }}>
                    <img src={`https://i.ytimg.com/vi/${video}/mqdefault.jpg`} alt={ex.name} loading="lazy"
                      onError={(e) => { e.currentTarget.src = `https://i.ytimg.com/vi/${video}/hqdefault.jpg`; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <span className="flex items-center justify-center" style={{ position: 'absolute', inset: 0 }}>
                      <span className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: '999px', background: 'rgba(0,0,0,0.55)' }}>
                        <Play size={18} strokeWidth={2} color="#fff" style={{ marginInlineStart: 2 }} />
                      </span>
                    </span>
                  </button>
                )}
                <button onClick={() => added ? remove(id) : add(id)}
                  className="flex items-center justify-between gap-3 p-3 text-start w-full"
                  style={{ color: 'inherit' }}>
                  <div className="min-w-0">
                    <div className="f-display font-semibold truncate" dir="ltr">{ex.name}</div>
                    <div className="f-mono text-[9px] uppercase tracking-[0.15em] mt-0.5" style={{ opacity: 0.6 }}>{ex.equip === 'gym' ? t('build_filter_gym', lang) : t('build_filter_cali', lang)}</div>
                  </div>
                  {added ? <Check size={16} strokeWidth={2.5} color={PALETTE.sage} /> : <Plus size={16} strokeWidth={2} style={{ opacity: 0.7 }} />}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {preview && createPortal(
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-5 no-print" style={{ background: 'rgba(0,0,0,0.86)' }} onClick={() => setPreview(null)}>
          <div style={{ width: '100%', maxWidth: 760 }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="f-display font-bold text-lg" style={{ color: '#fff' }} dir="ltr">{preview.name}</span>
              <button onClick={() => setPreview(null)} className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1.5"
                style={{ border: '1px solid rgba(255,255,255,0.4)', borderRadius: '999px', color: '#fff' }}>
                <X size={12} strokeWidth={2} /> {t('guided_exit', lang)}
              </button>
            </div>
            <StretchVideo video={preview.video} title={preview.name} autoplay />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}


export { CustomBuilderView };
