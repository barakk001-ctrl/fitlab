import { Bookmark, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useEscapeClose } from '../hooks/useEscapeClose.js';
import { isRTL, t } from '../i18n.js';
import { PALETTE } from '../theme.js';
function SaveModal({ open, onClose, defaultName, onSave, lang, status }) {
  const [name, setName] = useState(defaultName);
  useEffect(() => { if (open) setName(defaultName); }, [open, defaultName]);
  useEscapeClose(open, onClose);
  if (!open) return null;
  const saving = status === 'saving';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(27,27,25,0.55)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md p-6 md:p-8 relative"
        style={{ background: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px' }}
        onClick={(e) => e.stopPropagation()}
        dir={isRTL(lang) ? 'rtl' : 'ltr'}
        role="dialog" aria-modal="true" aria-label={t('save_plan', lang)}
      >
        <button
          onClick={onClose}
          className="absolute top-3"
          style={{ insetInlineEnd: '0.75rem', color: PALETTE.ink }}
          aria-label="Close"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <div className="f-mono text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: PALETTE.rust }}>
          <Bookmark size={11} strokeWidth={2} className="inline-block" style={{ marginInlineEnd: '0.4rem', verticalAlign: '-2px' }} />
          {t('save_plan', lang)}
        </div>
        <h3 className="f-display font-bold text-2xl md:text-3xl" style={{ letterSpacing: '-0.02em', lineHeight: 1.05 }}>
          {t('save_modal_title', lang)}
        </h3>
        <p className="f-body text-sm mt-2" style={{ opacity: 0.7 }}>
          {t('save_modal_explainer', lang)}
        </p>

        <label className="f-mono text-[10px] uppercase tracking-[0.25em] block mt-5 mb-2" style={{ color: PALETTE.ink, opacity: 0.7 }}>
          {t('save_field_label', lang)}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          maxLength={80}
          className="f-body w-full px-3 py-2.5 text-base"
          style={{
            background: PALETTE.paper,
            border: `1px solid ${PALETTE.ink}`,
            borderRadius: '3px',
            color: PALETTE.ink,
            outline: 'none',
          }}
          onKeyDown={(e) => { if (e.key === 'Enter' && name.trim() && !saving) onSave(name.trim()); }}
        />

        {status === 'error' && (
          <div className="f-mono text-[10px] uppercase tracking-[0.2em] mt-3" style={{ color: PALETTE.rust }}>
            {t('save_failed', lang)}
          </div>
        )}

        <div className="flex gap-3 mt-6 justify-end flex-row-reverse">
          <button
            onClick={() => name.trim() && onSave(name.trim())}
            disabled={!name.trim() || saving}
            className="f-mono uppercase tracking-[0.2em] px-5 py-2.5 text-xs flex items-center gap-2"
            style={{
              background: PALETTE.ink,
              color: PALETTE.cream,
              border: `1px solid ${PALETTE.ink}`,
              borderRadius: '999px',
              opacity: !name.trim() || saving ? 0.5 : 1,
              cursor: !name.trim() || saving ? 'not-allowed' : 'pointer',
            }}
          >
            <Save size={12} strokeWidth={2} />
            {saving ? t('saving', lang) : t('save_btn', lang)}
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            className="f-mono uppercase tracking-[0.2em] px-5 py-2.5 text-xs"
            style={{
              background: 'transparent',
              color: PALETTE.ink,
              border: `1px solid ${PALETTE.ink}`,
              borderRadius: '999px',
              opacity: saving ? 0.5 : 1,
            }}
          >
            {t('cancel_btn', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}


export { SaveModal };
