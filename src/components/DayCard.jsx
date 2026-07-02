import { Activity, Check, CheckCircle2, ChevronDown, ChevronUp, Dumbbell, ExternalLink, Pencil, Play, Plus, Shuffle, Timer, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ytSearch } from '../calc.js';
import { EX } from '../data/exercises.js';
import { t } from '../i18n.js';
import { PALETTE } from '../theme.js';
import { Pill } from './shared.jsx';
import { StretchVideo } from './video.jsx';
function ExerciseRow({ idx, ex, accent, dark, lang, isDone, onToggleComplete, onSwap, onStartTimer, editing, onRemove, onMove, isFirst, isLast }) {
  const swapKey = `${ex.dayCode}_${ex.slotIdx}_${ex.equip}`;
  return (
    <div
      className={`flex items-start gap-3 py-3.5 border-b last:border-b-0 ${isDone ? 'ex-done' : ''}`}
      style={{ borderColor: dark ? 'rgba(242,235,221,0.18)' : 'rgba(27,27,25,0.15)' }}
    >
      {/* Completion circle */}
      <button
        onClick={() => onToggleComplete(swapKey)}
        className={`complete-circle mt-1 no-print ${isDone ? 'is-done' : ''}`}
        style={{ color: dark ? PALETTE.sage : PALETTE.rust }}
        aria-pressed={isDone}
        aria-label={isDone ? t('completed', lang) : t('mark_complete', lang)}
        title={isDone ? t('completed', lang) : t('mark_complete', lang)}
      >
        {isDone && <Check size={12} strokeWidth={3} color={PALETTE.cream} />}
      </button>

      {/* Index — visible when print, hides completion circle */}
      <div className="f-mono text-[10px] uppercase tracking-[0.2em] pt-1 w-5 shrink-0 hidden print:block" style={{ color: accent }} dir="ltr">
        {String(idx + 1).padStart(2, '0')}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <a href={ytSearch(ex.query)} target="_blank" rel="noopener noreferrer"
            className="f-display font-semibold underline-hover text-base md:text-lg leading-tight ex-name"
            style={{ color: dark ? PALETTE.cream : PALETTE.ink }} dir="ltr">
            {ex.name}
          </a>
          <div className="f-mono text-xs tracking-wider" style={{ opacity: 0.75 }} dir="ltr">
            {ex.prescription}
          </div>
        </div>
        <div className="f-mono text-[10px] uppercase tracking-[0.2em] mt-1 flex items-center gap-3 flex-wrap" style={{ color: accent, opacity: 0.85 }}>
          {editing && (
            <span className="no-print inline-flex items-center gap-1.5">
              <button onClick={() => onMove(-1)} disabled={isFirst} aria-label={t('ed_move_up', lang)}
                style={{ color: 'inherit', opacity: isFirst ? 0.3 : 1, cursor: isFirst ? 'not-allowed' : 'pointer' }}>
                <ChevronUp size={14} strokeWidth={2} />
              </button>
              <button onClick={() => onMove(1)} disabled={isLast} aria-label={t('ed_move_down', lang)}
                style={{ color: 'inherit', opacity: isLast ? 0.3 : 1, cursor: isLast ? 'not-allowed' : 'pointer' }}>
                <ChevronDown size={14} strokeWidth={2} />
              </button>
              <button onClick={onRemove} aria-label={t('ed_remove', lang)} style={{ color: 'inherit' }}>
                <Trash2 size={12} strokeWidth={2} />
              </button>
            </span>
          )}
          <a href={ytSearch(ex.query)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 underline-hover">
            {t('watch_form', lang)} <ExternalLink size={11} strokeWidth={2} />
          </a>
          {ex.totalAlternatives > 1 && (
            <button onClick={() => onSwap(swapKey, ex.totalAlternatives)}
              className="no-print flex items-center gap-1.5 underline-hover"
              style={{ color: 'inherit' }}>
              <Shuffle size={11} strokeWidth={2} /> {t('swap_exercise', lang)}
            </button>
          )}
          {ex.restSeconds > 0 && (
            <button onClick={() => onStartTimer(ex)}
              className="no-print flex items-center gap-1.5 underline-hover"
              style={{ color: 'inherit' }}>
              <Timer size={11} strokeWidth={2} /> {ex.restSeconds}s
            </button>
          )}
        </div>
        {ex.video && (
          <div className="mt-3 no-print">
            <StretchVideo video={ex.video} title={ex.name} lazy maxWidth={400} />
          </div>
        )}
      </div>
    </div>
  );
}

// Inline "add exercise" form shown in edit mode at the bottom of a track.
function AddExerciseRow({ equip, lang, dark, onAdd }) {
  const [exId, setExId] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const options = Object.entries(EX)
    .filter(([, e]) => e.equip === equip)
    .sort((a, b) => a[1].name.localeCompare(b[1].name));
  const fieldStyle = {
    background: 'transparent',
    color: dark ? PALETTE.cream : PALETTE.ink,
    border: `1px solid ${dark ? 'rgba(242,235,221,0.4)' : 'rgba(27,27,25,0.4)'}`,
    borderRadius: '999px', padding: '5px 10px',
  };
  return (
    <div className="no-print flex items-center gap-2 flex-wrap pt-3 mt-1" dir="ltr"
      style={{ borderTop: `1px dashed ${dark ? 'rgba(242,235,221,0.25)' : 'rgba(27,27,25,0.25)'}` }}>
      <select value={exId} onChange={(e) => setExId(e.target.value)} aria-label={t('ed_pick', lang)}
        className="f-mono text-[11px]" style={{ ...fieldStyle, maxWidth: 180 }}>
        <option value="">{t('ed_pick', lang)}</option>
        {options.map(([id, e]) => <option key={id} value={id}>{e.name}</option>)}
      </select>
      <input type="number" min={1} max={10} value={sets} onChange={(e) => setSets(parseInt(e.target.value, 10) || 1)}
        aria-label={t('build_sets', lang)} className="f-mono text-[11px] text-center" style={{ ...fieldStyle, width: 48 }} />
      <span className="f-mono text-[10px]" style={{ opacity: 0.5 }}>×</span>
      <input type="number" min={1} max={50} value={reps} onChange={(e) => setReps(parseInt(e.target.value, 10) || 1)}
        aria-label={t('build_reps', lang)} className="f-mono text-[11px] text-center" style={{ ...fieldStyle, width: 48 }} />
      <button onClick={() => { if (exId) { onAdd(exId, sets, reps); setExId(''); } }}
        disabled={!exId}
        className="f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1.5"
        style={{ ...fieldStyle, opacity: exId ? 1 : 0.45, cursor: exId ? 'pointer' : 'not-allowed' }}>
        <Plus size={11} strokeWidth={2.5} /> {t('ed_add', lang)}
      </button>
    </div>
  );
}

function DayCard({ day, idx, lang, completions, onToggleComplete, onSwap, onRemoveExercise, onMoveExercise, onAddExercise, onStartTimer, onStartWorkout }) {
  const [editing, setEditing] = useState(false);
  const canEdit = Boolean(onRemoveExercise && onMoveExercise && onAddExercise);
  const dayDoneSet = completions[day.code] || new Set();
  const totalEx = day.gym.length + day.cali.length;
  const doneCount = dayDoneSet.size;
  const allDone = totalEx > 0 && doneCount === totalEx;

  return (
    <div className="rise day-card" style={{ animationDelay: `${0.05 + idx * 0.06}s` }}>
      <div className="p-6 md:p-8" style={{ background: PALETTE.paper, border: `1px solid ${PALETTE.ink}`, borderRadius: '4px' }}>
        <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-baseline gap-3">
            <span className="f-display font-bold" style={{ fontSize: 'clamp(40px, 5vw, 64px)', color: PALETTE.rust, letterSpacing: '-0.04em', lineHeight: 1 }} dir="ltr">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="f-display font-bold" style={{ fontSize: 'clamp(22px, 2.5vw, 28px)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {day.name[lang]}
              </h3>
              <div className="f-italic text-sm md:text-base mt-1" style={{ opacity: 0.65 }}>
                {day.focus[lang]}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {totalEx > 0 && (
              <Pill color={allDone ? PALETTE.forest : PALETTE.ink}>
                {allDone ? <CheckCircle2 size={11} strokeWidth={2.4} /> : null}
                {allDone ? t('day_complete', lang) : t('exercises_done', lang, { done: doneCount, total: totalEx })}
              </Pill>
            )}
            <Pill color={PALETTE.ink}>{day.code}</Pill>
            {canEdit && (
              <button onClick={() => setEditing((e) => !e)}
                className="no-print f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1.5"
                aria-pressed={editing}
                style={{
                  background: editing ? PALETTE.ink : 'transparent',
                  color: editing ? PALETTE.cream : PALETTE.ink,
                  border: `1px solid ${PALETTE.ink}`, borderRadius: '999px',
                }}>
                {editing ? <Check size={11} strokeWidth={2.5} /> : <Pencil size={11} strokeWidth={2} />}
                {editing ? t('ed_done', lang) : t('ed_edit_day', lang)}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          {/* Gym */}
          <div className="pt-2" style={{ borderTop: `1px solid ${PALETTE.ink}` }}>
            <div className="flex items-center justify-between gap-2 my-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Dumbbell size={14} strokeWidth={2} color={PALETTE.rust} />
                <div className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: PALETTE.rust }}>
                  {t('track01', lang)}
                </div>
              </div>
              {day.gym.length > 0 && (
                <button onClick={() => onStartWorkout(day.gym, t('track01', lang), day.name[lang])}
                  className="no-print f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1.5"
                  style={{ background: PALETTE.rust, color: PALETTE.cream, border: `1px solid ${PALETTE.rust}`, borderRadius: '999px' }}>
                  <Play size={11} strokeWidth={2.5} /> {t('start_session', lang)}
                </button>
              )}
            </div>
            <div>
              {day.gym.map((ex, i) => {
                const swapKey = `${ex.dayCode}_${ex.slotIdx}_${ex.equip}`;
                return (
                  <ExerciseRow key={swapKey} idx={i} ex={ex} accent={PALETTE.rust} lang={lang}
                    isDone={dayDoneSet.has(swapKey)}
                    onToggleComplete={(k) => onToggleComplete(day.code, k)}
                    onSwap={onSwap}
                    onStartTimer={onStartTimer}
                    editing={editing}
                    isFirst={i === 0} isLast={i === day.gym.length - 1}
                    onRemove={() => onRemoveExercise(day.code, 'gym', ex.slotIdx)}
                    onMove={(dir) => onMoveExercise(day.code, 'gym', ex.slotIdx, dir)}
                  />
                );
              })}
              {editing && <AddExerciseRow equip="gym" lang={lang} onAdd={(exId, sets, reps) => onAddExercise(day.code, 'gym', exId, sets, reps)} />}
            </div>
          </div>

          {/* Calisthenics */}
          <div className="p-4 md:p-5" style={{ background: PALETTE.forest, color: PALETTE.cream, borderRadius: '3px' }}>
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Activity size={14} strokeWidth={2} color={PALETTE.sage} />
                <div className="f-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: PALETTE.sage }}>
                  {t('track02', lang)}
                </div>
              </div>
              {day.cali.length > 0 && (
                <button onClick={() => onStartWorkout(day.cali, t('track02', lang), day.name[lang])}
                  className="no-print f-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 px-3 py-1.5"
                  style={{ background: PALETTE.sage, color: PALETTE.ink, border: `1px solid ${PALETTE.sage}`, borderRadius: '999px' }}>
                  <Play size={11} strokeWidth={2.5} /> {t('start_session', lang)}
                </button>
              )}
            </div>
            <div>
              {day.cali.map((ex, i) => {
                const swapKey = `${ex.dayCode}_${ex.slotIdx}_${ex.equip}`;
                return (
                  <ExerciseRow key={swapKey} idx={i} ex={ex} accent={PALETTE.sage} dark lang={lang}
                    isDone={dayDoneSet.has(swapKey)}
                    onToggleComplete={(k) => onToggleComplete(day.code, k)}
                    onSwap={onSwap}
                    onStartTimer={onStartTimer}
                    editing={editing}
                    isFirst={i === 0} isLast={i === day.cali.length - 1}
                    onRemove={() => onRemoveExercise(day.code, 'cali', ex.slotIdx)}
                    onMove={(dir) => onMoveExercise(day.code, 'cali', ex.slotIdx, dir)}
                  />
                );
              })}
              {editing && <AddExerciseRow equip="cali" dark lang={lang} onAdd={(exId, sets, reps) => onAddExercise(day.code, 'cali', exId, sets, reps)} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MacroBar({ macros, lang }) {
  return (
    <div className="mt-4">
      <div className="flex h-3 overflow-hidden" style={{ border: `1px solid ${PALETTE.ink}`, borderRadius: '999px' }} dir="ltr">
        <div style={{ width: `${macros.protein}%`, background: PALETTE.rust }} />
        <div style={{ width: `${macros.carbs}%`, background: PALETTE.forest }} />
        <div style={{ width: `${macros.fat}%`, background: PALETTE.sage }} />
      </div>
      <div className="flex justify-between mt-2 f-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: PALETTE.ink }}>
        <span><span style={{ color: PALETTE.rust }}>●</span> {lang === 'he' ? 'חלבון' : 'Protein'} {macros.protein}%</span>
        <span><span style={{ color: PALETTE.forest }}>●</span> {lang === 'he' ? 'פחמ׳' : 'Carbs'} {macros.carbs}%</span>
        <span><span style={{ color: PALETTE.sage }}>●</span> {lang === 'he' ? 'שומן' : 'Fat'} {macros.fat}%</span>
      </div>
    </div>
  );
}


export { ExerciseRow, DayCard, MacroBar };
