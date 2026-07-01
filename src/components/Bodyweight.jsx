import { Plus, Save, Trash2, TrendingUp, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { isRTL, t } from '../i18n.js';
import { todayISO } from '../storage.js';
import { PALETTE } from '../theme.js';
function BodyweightLogModal({ open, onClose, onSave, defaultWeight, lang, units }) {
  const [date, setDate] = useState(todayISO());
  const [weight, setWeight] = useState(defaultWeight ?? '');
  useEffect(() => {
    if (open) {
      setDate(todayISO());
      setWeight(defaultWeight ?? '');
    }
  }, [open, defaultWeight]);
  if (!open) return null;
  const valid = !isNaN(parseFloat(weight)) && parseFloat(weight) > 0 && date;
  const unit = units === 'metric' ? 'kg' : 'lb';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 no-print"
      style={{ background: 'rgba(27,27,25,0.55)' }}
      onClick={onClose}>
      <div className="w-full max-w-md p-6 md:p-8 relative"
        style={{ background: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px' }}
        onClick={(e) => e.stopPropagation()}
        dir={isRTL(lang) ? 'rtl' : 'ltr'}>
        <button onClick={onClose} className="absolute top-3"
          style={{ insetInlineEnd: '0.75rem', color: PALETTE.ink }} aria-label="Close">
          <X size={18} strokeWidth={2} />
        </button>
        <div className="f-mono text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: PALETTE.rust }}>
          <TrendingUp size={11} strokeWidth={2} className="inline-block" style={{ marginInlineEnd: '0.4rem', verticalAlign: '-2px' }} />
          {t('log_weight', lang)}
        </div>
        <h3 className="f-display font-bold text-2xl md:text-3xl" style={{ letterSpacing: '-0.02em', lineHeight: 1.05 }}>
          {t('log_modal_title', lang)}
        </h3>

        <label className="f-mono text-[10px] uppercase tracking-[0.25em] block mt-5 mb-2" style={{ opacity: 0.7 }}>
          {t('date_label', lang)}
        </label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="f-body w-full px-3 py-2.5 text-base" dir="ltr"
          style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '3px', color: PALETTE.ink, outline: 'none' }} />

        <label className="f-mono text-[10px] uppercase tracking-[0.25em] block mt-4 mb-2" style={{ opacity: 0.7 }}>
          {t('weight_label', lang)} ({unit})
        </label>
        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
          step="0.1" min="20" max="400" autoFocus
          className="f-body w-full px-3 py-2.5 text-base" dir="ltr"
          style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '3px', color: PALETTE.ink, outline: 'none' }}
          onKeyDown={(e) => { if (e.key === 'Enter' && valid) onSave({ date, weight: parseFloat(weight), unit }); }} />

        <div className="flex gap-3 mt-6 justify-end flex-row-reverse">
          <button onClick={() => valid && onSave({ date, weight: parseFloat(weight), unit })}
            disabled={!valid}
            className="f-mono uppercase tracking-[0.2em] px-5 py-2.5 text-xs flex items-center gap-2"
            style={{ background: PALETTE.ink, color: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px', opacity: valid ? 1 : 0.5, cursor: valid ? 'pointer' : 'not-allowed' }}>
            <Save size={12} strokeWidth={2} />
            {t('save_btn', lang)}
          </button>
          <button onClick={onClose}
            className="f-mono uppercase tracking-[0.2em] px-5 py-2.5 text-xs"
            style={{ background: 'transparent', color: PALETTE.ink, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
            {t('cancel_btn', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

function BodyweightSection({ entries, currentWeightKg, targetKg, units, lang, onOpenLog, onDelete }) {
  // Convert all entries to display unit
  const isMetric = units === 'metric';
  const toDisplay = (kg) => isMetric ? kg : kg * 2.20462;

  // Normalize entries — older entries may be lb, newer kg; we store as kg internally.
  // entries: [{date, weightKg}]
  const sorted = useMemo(() =>
    [...entries].sort((a, b) => a.date.localeCompare(b.date))
  , [entries]);

  const chartData = sorted.map(e => ({
    date: e.date,
    weight: parseFloat(toDisplay(e.weightKg).toFixed(1)),
  }));

  const goalDisplay = targetKg ? parseFloat(toDisplay(targetKg).toFixed(1)) : null;
  const last = sorted[sorted.length - 1];
  const lastDisplay = last ? parseFloat(toDisplay(last.weightKg).toFixed(1)) : null;
  const unit = isMetric ? 'kg' : 'lb';

  return (
    <section className="px-6 md:px-12 pt-12 pb-12">
      <div className="flex items-baseline justify-between mb-3 flex-wrap gap-3">
        <h2 className="f-display font-bold text-3xl md:text-4xl flex items-center gap-3" style={{ color: PALETTE.ink }}>
          <span className="f-mono text-xs align-middle" style={{ opacity: 0.5, marginInlineEnd: '0.5rem' }}>C /</span>
          <TrendingUp size={22} strokeWidth={1.6} color={PALETTE.rust} />
          {t('bodyweight_h', lang)}
        </h2>
        <button onClick={onOpenLog}
          className="f-mono text-xs uppercase tracking-[0.2em] flex items-center gap-2 px-4 py-2 no-print"
          style={{ background: PALETTE.ink, color: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
          <Plus size={12} strokeWidth={2} />
          {t('log_weight', lang)}
        </button>
      </div>
      <p className="f-body text-sm max-w-2xl mb-7" style={{ opacity: 0.75 }}>
        {t('bodyweight_explainer', lang)}
      </p>

      {entries.length === 0 ? (
        <div className="p-6 text-center f-italic" style={{ background: PALETTE.paper, border: `1px dashed ${PALETTE.ink}`, borderRadius: '4px', opacity: 0.65 }}>
          {t('no_entries_yet', lang)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 p-5 md:p-6"
            style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px' }}>
            <div className="f-mono text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: PALETTE.rust }}>
              {t('progress_to_goal', lang)} · {unit}
            </div>
            <div style={{ width: '100%', height: 240 }} dir="ltr">
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 16, bottom: 5, left: -10 }}>
                  <CartesianGrid stroke="rgba(27,27,25,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: 'Manrope', fill: PALETTE.ink }} stroke={PALETTE.ink} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fontSize: 10, fontFamily: 'Manrope', fill: PALETTE.ink }} stroke={PALETTE.ink} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip
                    contentStyle={{ background: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: 4, fontFamily: 'Manrope', fontSize: 12 }}
                    formatter={(value) => [`${value} ${unit}`, t('weight_label', lang)]}
                  />
                  {goalDisplay && (
                    <ReferenceLine y={goalDisplay} stroke={PALETTE.forest} strokeDasharray="4 4"
                      label={{ value: `${t('chart_goal', lang)} ${goalDisplay}`, position: 'right', fill: PALETTE.forest, fontSize: 10, fontFamily: 'Manrope' }} />
                  )}
                  <Line type="monotone" dataKey="weight" stroke={PALETTE.rust} strokeWidth={2.5} dot={{ r: 4, fill: PALETTE.rust }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Entries list */}
          <div className="p-5 md:p-6"
            style={{ background: PALETTE.ink, color: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px' }}>
            <div className="f-mono text-[10px] uppercase tracking-[0.25em] mb-4" style={{ color: PALETTE.sage }}>
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </div>
            <div className="space-y-3 max-h-72 overflow-auto">
              {[...sorted].reverse().map((e) => (
                <div key={e.date + e.weightKg} className="flex items-center justify-between gap-2 pb-2"
                  style={{ borderBottom: '1px solid rgba(242,235,221,0.18)' }}>
                  <div>
                    <div className="f-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: PALETTE.sage }} dir="ltr">
                      {e.date}
                    </div>
                    <div className="f-display font-semibold text-lg" dir="ltr">
                      {toDisplay(e.weightKg).toFixed(1)} <span className="f-mono text-xs" style={{ opacity: 0.6 }}>{unit}</span>
                    </div>
                  </div>
                  <button onClick={() => onDelete(e.date)}
                    style={{ color: PALETTE.cream, opacity: 0.4 }}
                    onMouseEnter={(ev) => ev.currentTarget.style.opacity = 1}
                    onMouseLeave={(ev) => ev.currentTarget.style.opacity = 0.4}
                    aria-label={t('delete_entry', lang)}>
                    <Trash2 size={14} strokeWidth={1.8} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ------------------------------------------------------------
// Printable HTML generator (opens in a new tab for PDF export)
// ------------------------------------------------------------


export { BodyweightLogModal, BodyweightSection };
