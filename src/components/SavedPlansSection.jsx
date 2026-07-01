import { Dumbbell, FolderOpen, ListChecks, StretchHorizontal, Trash2 } from 'lucide-react';
import { EX } from '../data/exercises.js';
import { AGE_GROUPS, GOALS, SPLITS } from '../data/plans.js';
import { STRETCH_AREAS, STRETCH_ROUTINES } from '../data/stretches.js';
import { t } from '../i18n.js';
import { formatSavedDate } from '../storage.js';
import { PALETTE } from '../theme.js';
function SavedPlansSection({ savedPlans, onLoad, onDelete, lang }) {
  if (!savedPlans || savedPlans.length === 0) return null;
  return (
    <section className="px-6 md:px-12 pt-10 pb-2">
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-3">
        <h2 className="f-display text-2xl md:text-3xl font-bold flex items-center gap-3" style={{ color: PALETTE.ink }}>
          <FolderOpen size={20} strokeWidth={1.6} color={PALETTE.rust} />
          {t('saved_plans', lang)}
        </h2>
        <span className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ opacity: 0.5 }}>
          {savedPlans.length}
        </span>
      </div>
      <p className="f-body text-sm max-w-2xl mb-5" style={{ opacity: 0.7 }}>
        {t('saved_plans_explainer', lang)}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedPlans.map((plan) => {
          const isStretch = plan.type === 'stretch';
          const isCustom = plan.type === 'custom';

          // Derive display fields per type
          let topLabel = '';
          let subLabel = '';
          let badge = '';
          if (isCustom) {
            const cItems = plan.custom?.items || [];
            topLabel = t('build_moves', lang, { n: cItems.length });
            subLabel = cItems.slice(0, 3).map(s => EX[s.id]?.name).filter(Boolean).join(' · ') + (cItems.length > 3 ? ' …' : '');
            badge = t('custom_badge', lang);
          } else if (isStretch) {
            const r = STRETCH_ROUTINES[plan.stretch?.routine];
            topLabel = r ? `${plan.stretch?.hold ?? r.defaultHold}s` : '';
            const areas = (plan.stretch?.areas && plan.stretch.areas.length > 0)
              ? plan.stretch.areas
              : (r?.areas ?? []);
            subLabel = areas.map(a => STRETCH_AREAS.find(x => x.id === a)?.label[lang]).filter(Boolean).join(' · ');
            badge = t('stretch_plan_badge', lang);
          } else {
            const ageObj = AGE_GROUPS.find(a => a.id === plan.inputs?.age);
            topLabel = ageObj?.range ?? '';
            subLabel = (plan.inputs?.goals || []).map(g => t(GOALS.find(x => x.id === g)?.labelKey, lang)).join(' + ');
            badge = SPLITS[plan.inputs?.split]?.short[lang] ?? t('workout_plan_badge', lang);
          }

          return (
            <div
              key={plan.id}
              className="card-tilt p-5 relative group"
              style={{
                background: PALETTE.paper,
                border: `1px solid ${PALETTE.ink}`,
                borderRadius: '4px',
                textAlign: lang === 'he' ? 'right' : 'left',
              }}
            >
              <button
                onClick={() => onLoad(plan)}
                className="block w-full"
                style={{ textAlign: 'inherit' }}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="f-mono text-[10px] uppercase tracking-[0.25em] flex items-center gap-1.5" style={{ color: isStretch ? PALETTE.forest : PALETTE.rust }}>
                    {isStretch ? <StretchHorizontal size={11} strokeWidth={2} /> : isCustom ? <ListChecks size={11} strokeWidth={2} /> : <Dumbbell size={11} strokeWidth={2} />}
                    {topLabel}
                  </div>
                  <span className="f-mono text-[9px] uppercase tracking-widest px-2 py-0.5"
                    style={{ border: `1px solid ${PALETTE.ink}`, borderRadius: '999px', opacity: 0.7 }}>
                    {badge}
                  </span>
                </div>
                <div className="f-display font-bold text-lg md:text-xl leading-tight underline-hover"
                  style={{ letterSpacing: '-0.02em', color: PALETTE.ink }}>
                  {plan.name}
                </div>
                {subLabel && (
                  <div className="f-italic text-sm mt-2" style={{ opacity: 0.7 }}>
                    {subLabel}
                  </div>
                )}
                <div className="f-mono text-[10px] uppercase tracking-[0.2em] mt-3 pt-3"
                  style={{ borderTop: `1px solid rgba(27,27,25,0.15)`, opacity: 0.55 }}>
                  {t('saved_at', lang, { date: formatSavedDate(plan.savedAt, lang) })}
                </div>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); if (window.confirm(t('confirm_delete', lang))) onDelete(plan.id); }}
                className="absolute top-3"
                style={{ insetInlineEnd: '0.75rem', color: PALETTE.ink, opacity: 0.4 }}
                aria-label={t('delete_plan', lang)}
                title={t('delete_plan', lang)}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.4}
              >
                <Trash2 size={14} strokeWidth={1.8} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// Root
// ------------------------------------------------------------


export { SavedPlansSection };
