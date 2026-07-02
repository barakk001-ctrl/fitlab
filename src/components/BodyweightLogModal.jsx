import { Save, TrendingUp, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useEscapeClose } from '../hooks/useEscapeClose.js';
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
  useEscapeClose(open, onClose);
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
        dir={isRTL(lang) ? 'rtl' : 'ltr'}
        role="dialog" aria-modal="true" aria-label={t('log_weight', lang)}>
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

export { BodyweightLogModal };
