import { Activity, Bookmark, CheckCircle2, Flame, RotateCcw, Save, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BodyweightSection } from '../components/Bodyweight.jsx';
import { MastHead, Pill, StatCard } from '../components/shared.jsx';
import { t } from '../i18n.js';
import { computeStreak } from '../storage.js';
import { PALETTE } from '../theme.js';
function BackupRestore({ onExport, onImport, lang }) {
  const [code, setCode] = useState('');
  const [importText, setImportText] = useState('');
  const [status, setStatus] = useState(''); // '' | 'copied' | 'restored' | 'error'

  const revealAndCopy = async () => {
    const c = onExport();
    setCode(c);
    try { await navigator.clipboard.writeText(c); setStatus('copied'); setTimeout(() => setStatus(''), 1800); } catch { setStatus(''); }
  };
  const download = () => {
    const c = code || onExport(); setCode(c);
    try {
      const blob = new Blob([c], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'fitlab-backup.txt'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {}
  };
  const restore = async () => {
    if (!importText.trim()) return;
    const ok = await onImport(importText.trim());
    if (ok) { setStatus('restored'); setTimeout(() => window.location.reload(), 900); }
    else setStatus('error');
  };

  const inputStyle = { width: '100%', background: 'transparent', color: PALETTE.ink, border: `1px solid ${PALETTE.ink}`, borderRadius: '8px', padding: '10px', fontSize: 12 };

  return (
    <section className="px-6 md:px-12 pb-16">
      <h2 className="f-display font-bold text-2xl md:text-3xl flex items-center gap-3" style={{ color: PALETTE.ink }}>
        <Save size={20} strokeWidth={1.7} color={PALETTE.rust} /> {t('backup_title', lang)}
      </h2>
      <p className="f-body text-sm mt-2 mb-5 max-w-2xl" style={{ opacity: 0.75 }}>{t('backup_sub', lang)}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Export */}
        <div className="p-5" style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '8px' }}>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={revealAndCopy}
              className="f-mono uppercase tracking-[0.2em] px-5 py-3 text-xs flex items-center gap-2"
              style={{ background: PALETTE.ink, color: PALETTE.cream, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
              <Bookmark size={12} strokeWidth={2} /> {status === 'copied' ? t('backup_copied', lang) : t('backup_copy', lang)}
            </button>
            <button onClick={download}
              className="f-mono uppercase tracking-[0.2em] px-4 py-3 text-xs flex items-center gap-2"
              style={{ background: 'transparent', color: PALETTE.ink, border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }}>
              {t('backup_download', lang)}
            </button>
          </div>
          {code && <textarea readOnly value={code} onFocus={(e) => e.target.select()} rows={4} className="f-mono mt-3" style={inputStyle} dir="ltr" />}
          <p className="f-mono text-[10px] uppercase tracking-[0.15em] mt-3" style={{ opacity: 0.55 }}>{t('backup_hint', lang)}</p>
        </div>

        {/* Import */}
        <div className="p-5" style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '8px' }}>
          <div className="f-mono text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: PALETTE.rust }}>{t('backup_restore_h', lang)}</div>
          <textarea value={importText} onChange={(e) => setImportText(e.target.value)} placeholder={t('backup_paste', lang)} rows={4} className="f-mono" style={inputStyle} dir="ltr" />
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <button onClick={restore} disabled={!importText.trim()}
              className="f-mono uppercase tracking-[0.2em] px-5 py-3 text-xs flex items-center gap-2"
              style={{ background: PALETTE.rust, color: PALETTE.cream, border: `1px solid ${PALETTE.rust}`, borderRadius: '999px', opacity: importText.trim() ? 1 : 0.4, cursor: importText.trim() ? 'pointer' : 'not-allowed' }}>
              <RotateCcw size={12} strokeWidth={2} /> {t('backup_restore_btn', lang)}
            </button>
            {status === 'restored' && <span className="f-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: PALETTE.forest }}>{t('backup_restored', lang)}</span>}
            {status === 'error' && <span className="f-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: PALETTE.rust }}>{t('backup_error', lang)}</span>}
          </div>
          <p className="f-mono text-[10px] uppercase tracking-[0.15em] mt-3" style={{ opacity: 0.55 }}>{t('backup_warn', lang)}</p>
        </div>
      </div>
    </section>
  );
}

function ProgressDashboard({ lang, setLang, mode, setMode, activityLog, perfLog, setLog = [], bodyweightLog, currentWeightKg, targetKg, units, onOpenWeightLog, onDeleteWeightEntry, challenge, onExport, onImport }) {
  const dayMs = 86400000;
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const activityDates = useMemo(() => new Set(activityLog.map((a) => a.date)), [activityLog]);
  const streak = useMemo(() => computeStreak([...activityDates]), [activityDates]);
  const totalSessions = activityLog.length;
  const weekAgo = iso(new Date(today - 6 * dayMs));
  const thisWeek = activityLog.filter((a) => a.date >= weekAgo).length;

  const challengeDone = challenge?.start ? (challenge.done || []).filter((d) => d >= 1 && d <= 30).length : null;

  // Personal records: best value per (name) — keep the unit of the best entry.
  const records = useMemo(() => {
    const byName = {};
    perfLog.forEach((p) => {
      const cur = byName[p.name];
      if (!cur || p.value > cur.value) byName[p.name] = { value: p.value, unit: p.unit, date: p.date };
    });
    return Object.entries(byName).map(([name, r]) => ({ name, ...r })).sort((a, b) => b.date.localeCompare(a.date));
  }, [perfLog]);

  // Top lifts: heaviest logged set per exercise (weighted sets only; ties go to more reps).
  const topLifts = useMemo(() => {
    const byName = {};
    setLog.forEach((s) => {
      if (!(s.weightKg > 0)) return;
      const cur = byName[s.name];
      if (!cur || s.weightKg > cur.weightKg || (s.weightKg === cur.weightKg && s.reps > cur.reps)) byName[s.name] = s;
    });
    return Object.values(byName).sort((a, b) => b.date.localeCompare(a.date));
  }, [setLog]);
  const liftDisplay = (s) => {
    const w = units === 'metric' ? s.weightKg : s.weightKg * 2.20462;
    return `${Math.round(w * 10) / 10} ${units === 'metric' ? 'kg' : 'lb'} × ${s.reps}`;
  };

  // Activity heatmap — last ~12 weeks aligned to weeks.
  const weeks = useMemo(() => {
    const start = new Date(today - 83 * dayMs);
    start.setDate(start.getDate() - start.getDay()); // back to Sunday
    const out = [];
    let cur = new Date(start);
    while (cur <= today) {
      const wk = [];
      for (let i = 0; i < 7; i++) { wk.push(new Date(cur)); cur = new Date(cur.getTime() + dayMs); }
      out.push(wk);
    }
    return out;
  }, [activityLog]);

  const unitLabel = (u) => t(u === 'sec' ? 'unit_sec' : u === 'min' ? 'unit_min' : 'unit_reps', lang);
  const hasAny = activityLog.length > 0 || perfLog.length > 0 || setLog.length > 0 || bodyweightLog.length > 0;

  return (
    <div className="rise">
      <MastHead subtitle={t('prog_title', lang)} lang={lang} setLang={setLang} mode={mode} setMode={setMode} />

      <section className="px-6 md:px-12 pt-10 pb-6">
        <Pill color={PALETTE.rust}><TrendingUp size={11} strokeWidth={2.4} /> {t('mode_progress', lang)}</Pill>
        <h1 className="f-display font-bold mt-4" style={{ color: PALETTE.ink, fontSize: 'clamp(38px,6vw,76px)', letterSpacing: '-0.03em', lineHeight: 1 }}>
          {t('prog_title', lang)}
        </h1>
        <p className="f-body mt-4 max-w-xl text-sm md:text-base" style={{ opacity: 0.78 }}>{t('prog_sub', lang)}</p>
      </section>

      {!hasAny ? (
        <>
          <section className="px-6 md:px-12 pb-6">
            <div className="p-8 text-center" style={{ background: PALETTE.paper, border: `1px dashed ${PALETTE.ink}`, borderRadius: '6px' }}>
              <div className="f-display font-bold" style={{ fontSize: '22px', color: PALETTE.ink }}>{t('prog_empty_title', lang)}</div>
              <p className="f-body text-sm mt-2" style={{ opacity: 0.7 }}>{t('prog_empty_sub', lang)}</p>
            </div>
          </section>
          <BackupRestore onExport={onExport} onImport={onImport} lang={lang} />
        </>
      ) : (
        <>
          <section className="px-6 md:px-12 pb-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <StatCard icon={Flame} accent={PALETTE.rust} value={streak} label={t('prog_streak', lang)} />
              <StatCard icon={Activity} accent={PALETTE.rust} value={totalSessions} label={t('prog_sessions', lang)} />
              <StatCard icon={TrendingUp} accent={PALETTE.rust} value={thisWeek} label={t('prog_week', lang)} />
              <StatCard icon={CheckCircle2} accent={PALETTE.forest} value={challengeDone === null ? '—' : `${challengeDone}/30`} label={t('prog_challenge', lang)} />
            </div>
          </section>

          {/* Activity heatmap */}
          <section className="px-6 md:px-12 pt-8 pb-2">
            <div className="f-mono text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: PALETTE.rust }}>{t('prog_activity', lang)}</div>
            <div className="flex gap-1 overflow-x-auto pb-2" dir="ltr">
              {weeks.map((wk, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {wk.map((d, di) => {
                    const future = d > today;
                    const active = activityDates.has(iso(d));
                    return (
                      <div key={di} title={iso(d)}
                        style={{
                          width: 13, height: 13, borderRadius: 3,
                          background: future ? 'transparent' : (active ? PALETTE.sage : 'rgba(27,27,25,0.08)'),
                          border: future ? 'none' : `1px solid ${active ? PALETTE.sage : 'rgba(27,27,25,0.12)'}`,
                        }} />
                    );
                  })}
                </div>
              ))}
            </div>
          </section>

          {/* Bodyweight trend (reuses the existing section) */}
          <BodyweightSection
            entries={bodyweightLog}
            currentWeightKg={currentWeightKg}
            targetKg={targetKg}
            units={units}
            lang={lang}
            onOpenLog={onOpenWeightLog}
            onDelete={onDeleteWeightEntry}
          />

          {/* Top lifts — heaviest logged set per exercise */}
          {topLifts.length > 0 && (
            <section className="px-6 md:px-12 pb-10">
              <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                <h2 className="f-display font-bold text-2xl md:text-3xl" style={{ color: PALETTE.ink }}>{t('prog_lifts', lang)}</h2>
              </div>
              <p className="f-body text-sm mb-5" style={{ opacity: 0.7 }}>{t('prog_lifts_sub', lang)}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {topLifts.map((s) => (
                  <div key={s.name} className="flex items-baseline justify-between gap-3 p-4" style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '6px' }}>
                    <span className="f-display font-semibold" style={{ color: PALETTE.ink }} dir="ltr">{s.name}</span>
                    <span className="f-mono text-sm whitespace-nowrap" style={{ color: PALETTE.forest }} dir="ltr">
                      {liftDisplay(s)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Personal records */}
          <section className="px-6 md:px-12 pb-16">
            <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
              <h2 className="f-display font-bold text-2xl md:text-3xl" style={{ color: PALETTE.ink }}>{t('prog_records', lang)}</h2>
            </div>
            <p className="f-body text-sm mb-5" style={{ opacity: 0.7 }}>{t('prog_records_sub', lang)}</p>
            {records.length === 0 ? (
              <div className="p-6 f-italic text-center" style={{ background: PALETTE.paper, border: `1px dashed ${PALETTE.ink}`, borderRadius: '6px', opacity: 0.7 }}>
                {t('prog_no_records', lang)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {records.map((r) => (
                  <div key={r.name} className="flex items-baseline justify-between gap-3 p-4" style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '6px' }}>
                    <span className="f-display font-semibold" style={{ color: PALETTE.ink }} dir="ltr">{r.name}</span>
                    <span className="f-mono text-sm whitespace-nowrap" style={{ color: PALETTE.rust }} dir="ltr">
                      {r.value} {unitLabel(r.unit)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <BackupRestore onExport={onExport} onImport={onImport} lang={lang} />
        </>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// Custom workout builder
// ------------------------------------------------------------


export { BackupRestore, ProgressDashboard };
