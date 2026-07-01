import { Dumbbell, Flame, Languages, Moon, StretchHorizontal, Sun, TrendingUp } from 'lucide-react';
import { useContext } from 'react';
import { t } from '../i18n.js';
import { PALETTE, ThemeContext } from '../theme.js';

function Pill({ children, color = PALETTE.ink, bg = 'transparent' }) {
  return (
    <span
      className="f-mono inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-widest"
      style={{ color, border: `1px solid ${color}`, background: bg, borderRadius: '999px' }}
    >
      {children}
    </span>
  );
}

function MastHead({ subtitle, lang, setLang, mode, setMode }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <header className="flex items-center justify-between px-6 md:px-12 py-5 gap-3 flex-wrap"
      style={{ borderBottom: `1px solid ${PALETTE.ink}` }}>
      <div className="flex items-center gap-3">
        <div className="f-display text-2xl md:text-3xl font-bold" style={{ color: PALETTE.ink, letterSpacing: '-0.04em' }}>
          Fit<span className="f-italic" style={{ color: PALETTE.rust }}>Lab</span>
        </div>
        <div className="f-mono text-[10px] uppercase tracking-[0.25em] hidden sm:block" style={{ color: PALETTE.ink }}>
          {t('edition', lang)}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Mode toggle — only shown when setMode is provided */}
        {setMode && (
          <div className="inline-flex p-1 no-print" style={{ border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
            {[
              { id: 'workout', key: 'mode_workout', icon: Dumbbell },
              { id: 'stretch', key: 'mode_stretch', icon: StretchHorizontal },
              { id: 'challenge', key: 'mode_challenge', icon: Flame },
              { id: 'progress', key: 'mode_progress', icon: TrendingUp },
            ].map((m) => {
              const MIcon = m.icon;
              const active = mode === m.id;
              return (
                <button key={m.id} onClick={() => setMode(m.id)}
                  className="f-mono text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 flex items-center gap-1.5"
                  style={{
                    background: active ? PALETTE.ink : 'transparent',
                    color: active ? PALETTE.cream : PALETTE.ink,
                    borderRadius: '999px',
                  }}>
                  <MIcon size={11} strokeWidth={1.8} />
                  <span className="hidden sm:inline">{t(m.key, lang)}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="f-mono text-[10px] uppercase tracking-[0.25em] hidden lg:block" style={{ color: PALETTE.ink }}>
          {subtitle}
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'he' : 'en')}
          className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1.5 no-print"
          style={{ border: `1px solid ${PALETTE.ink}`, borderRadius: '999px', color: PALETTE.ink }}
        >
          <Languages size={12} strokeWidth={1.8} />
          {lang === 'en' ? 'עברית' : 'English'}
        </button>
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Light' : 'Dark'}
          className="flex items-center justify-center no-print"
          style={{ border: `1px solid ${PALETTE.ink}`, borderRadius: '999px', color: PALETTE.ink, width: 30, height: 30 }}
        >
          {theme === 'dark' ? <Sun size={14} strokeWidth={1.8} /> : <Moon size={14} strokeWidth={1.8} />}
        </button>
      </div>
    </header>
  );
}

// ------------------------------------------------------------
// Numbers section
// ------------------------------------------------------------

function StatField({ label, icon: Icon, suffix, children }) {
  return (
    <div className="p-5 md:p-6 relative"
      style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px', minHeight: '128px' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="f-mono text-[10px] uppercase tracking-[0.25em] flex items-center gap-2" style={{ color: PALETTE.rust }}>
          <Icon size={12} strokeWidth={1.8} /> {label}
        </div>
        <span className="f-mono text-[10px] uppercase tracking-[0.2em]" style={{ opacity: 0.5 }}>{suffix}</span>
      </div>
      <div className="flex items-end gap-2">{children}</div>
    </div>
  );
}


function StatBox({ label, value, sub, accent = PALETTE.ink, dark = false }) {
  return (
    <div className="p-5 md:p-6 flex flex-col justify-between"
      style={{
        background: dark ? PALETTE.ink : PALETTE.paper,
        color: dark ? PALETTE.cream : PALETTE.ink,
        border: `1px solid ${PALETTE.ink}`, borderRadius: '4px', minHeight: '140px',
      }}>
      <div className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: accent }}>
        {label}
      </div>
      <div>
        <div className="f-display font-bold mt-2"
          style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', lineHeight: 1, letterSpacing: '-0.03em' }}>
          {value}
        </div>
        {sub && (
          <div className="f-mono text-[10px] uppercase tracking-[0.2em] mt-2" style={{ opacity: 0.7 }}>{sub}</div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Body diagram — self-contained SVG silhouette with a highlighted region
// ------------------------------------------------------------


function StatCard({ icon: Icon, value, label, accent }) {
  return (
    <div className="p-5" style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '6px' }}>
      <Icon size={18} strokeWidth={1.8} color={accent} />
      <div className="f-display font-bold mt-3" style={{ fontSize: 'clamp(28px,4vw,40px)', lineHeight: 1, color: PALETTE.ink }} dir="ltr">{value}</div>
      <div className="f-mono text-[10px] uppercase tracking-[0.2em] mt-2" style={{ opacity: 0.6 }}>{label}</div>
    </div>
  );
}


export { Pill, MastHead, StatField, StatBox, StatCard };
