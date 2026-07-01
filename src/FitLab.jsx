import { Check } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ACTIVITY_FACTOR, ageNumber, calcBMI, calcBMR, calcWeeksToTarget, inToCm, lbToKg } from './calc.js';
import { BodyweightLogModal } from './components/Bodyweight.jsx';
import { FontStyles } from './components/FontStyles.jsx';
import { SaveModal } from './components/SaveModal.jsx';
import { challengeSessionExercises } from './data/challenge.js';
import { getDiet } from './data/diets.js';
import { STRETCH_ROUTINES, buildStretchRoutine } from './data/stretches.js';
import { buildWeek } from './generate.js';
import { isRTL, t } from './i18n.js';
import { generatePrintHTML } from './print.js';
import { GuidedPlayer } from './session/GuidedPlayer.jsx';
import { GuidedWorkout } from './session/GuidedWorkout.jsx';
import { RestTimer } from './session/RestTimer.jsx';
import { buildAutoName, loadActivityLog, loadAllPlans, loadBodyweightLog, loadChallenge, loadPerfLog, persistActivityLog, persistAllPlans, persistBodyweightLog, persistChallenge, persistPerfLog, todayISO } from './storage.js';
import { DARK, LIGHT, PALETTE, ThemeContext, applyTheme, readStoredTheme } from './theme.js';
import { ChallengeView } from './views/ChallengeView.jsx';
import { CustomBuilderView } from './views/CustomBuilderView.jsx';
import { PickerView } from './views/PickerView.jsx';
import { PlanView } from './views/PlanView.jsx';
import { ProgressDashboard } from './views/ProgressDashboard.jsx';
import { StretchPicker } from './views/StretchPicker.jsx';
import { StretchPlanView } from './views/StretchPlanView.jsx';
export default function FitLab() {
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState(readStoredTheme);
  applyTheme(theme); // keep the shared PALETTE in sync on every render
  const toggleTheme = () => setTheme((tprev) => {
    const next = tprev === 'dark' ? 'light' : 'dark';
    try { window.localStorage.setItem('fitlab:theme', next); } catch {}
    return next;
  });
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? DARK.cream : LIGHT.cream);
  }, [theme]);

  const [mode, setMode] = useState('workout');     // 'workout' | 'stretch'
  const [age, setAge] = useState(null);
  const [goals, setGoals] = useState([]);
  const [split, setSplit] = useState(null);
  const [view, setView] = useState('picker');

  const [units, setUnits] = useState('metric');
  const [sex, setSex] = useState('neutral');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weight, setWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');

  // Per-plan progression state
  const [weekNum, setWeekNum] = useState(1);
  const [swaps, setSwaps] = useState({});                     // { swapKey: offset }
  const [completions, setCompletions] = useState({});         // { dayCode: Set<swapKey> }
  const [currentPlanId, setCurrentPlanId] = useState(null);   // null when ephemeral

  // Stretch state
  const [stretchRoutine, setStretchRoutine] = useState(null);  // routine id
  const [stretchAreas, setStretchAreas] = useState([]);        // selected area ids
  const [stretchHold, setStretchHold] = useState(30);          // seconds per hold
  const [guidedOpen, setGuidedOpen] = useState(false);

  // Guided workout session: { exercises, label, dayName } or null
  const [workoutSession, setWorkoutSession] = useState(null);

  // Custom workout builder
  const [customItems, setCustomItems] = useState([]); // [{id, sets, reps}]
  const [customSaveOpen, setCustomSaveOpen] = useState(false);

  // 30-day challenge: { start, done } or null
  const [challenge, setChallenge] = useState(null);

  // Progress tracking
  const [activityLog, setActivityLog] = useState([]);   // [{date, kind}]
  const [perfLog, setPerfLog] = useState([]);           // [{date, name, value, unit}]

  // Saved plans (both workout + stretch live here, distinguished by .type)
  const [savedPlans, setSavedPlans] = useState([]);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [toast, setToast] = useState(null);

  // Bodyweight log
  const [bodyweightLog, setBodyweightLog] = useState([]);
  const [logModalOpen, setLogModalOpen] = useState(false);

  // Rest timer
  const [activeTimer, setActiveTimer] = useState(null);

  // Load on mount
  useEffect(() => {
    let cancelled = false;
    loadAllPlans().then(plans => { if (!cancelled) setSavedPlans(plans); });
    loadBodyweightLog().then(entries => { if (!cancelled) setBodyweightLog(entries); });
    loadChallenge().then(c => { if (!cancelled) setChallenge(c); });
    loadActivityLog().then(a => { if (!cancelled) setActivityLog(a); });
    loadPerfLog().then(p => { if (!cancelled) setPerfLog(p); });
    return () => { cancelled = true; };
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  // ---- Save / load plan helpers ----

  const serializeCompletions = (c) => {
    const obj = {};
    Object.entries(c).forEach(([day, set]) => { obj[day] = Array.from(set); });
    return obj;
  };
  const deserializeCompletions = (obj) => {
    const c = {};
    Object.entries(obj || {}).forEach(([day, arr]) => { c[day] = new Set(arr); });
    return c;
  };

  const handleSavePlan = async (name) => {
    setSaveStatus('saving');
    const id = currentPlanId || (Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
    let plan;
    if (mode === 'stretch') {
      plan = {
        id,
        type: 'stretch',
        name,
        savedAt: Date.now(),
        stretch: { routine: stretchRoutine, areas: stretchAreas, hold: stretchHold },
      };
    } else {
      plan = {
        id,
        type: 'workout',
        name,
        savedAt: Date.now(),
        inputs: { age, goals, split, units, sex, heightCm, heightFt, heightIn, weight, targetWeight },
        progress: { weekNum, swaps, completions: serializeCompletions(completions) },
      };
    }
    const newList = currentPlanId
      ? savedPlans.map(p => p.id === id ? plan : p)
      : [plan, ...savedPlans];
    const ok = await persistAllPlans(newList);
    if (ok) {
      setSavedPlans(newList);
      setCurrentPlanId(id);
      setSaveStatus('saved');
      setSaveModalOpen(false);
      showToast(t('saved_toast', lang));
      setTimeout(() => setSaveStatus('idle'), 200);
    } else {
      setSaveStatus('error');
    }
  };

  const handleSaveCustom = async (name) => {
    setSaveStatus('saving');
    const existing = savedPlans.find(p => p.id === currentPlanId && p.type === 'custom');
    const id = existing ? currentPlanId : (Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
    const plan = { id, type: 'custom', name, savedAt: Date.now(), custom: { items: customItems } };
    const newList = existing ? savedPlans.map(p => p.id === id ? plan : p) : [plan, ...savedPlans];
    const ok = await persistAllPlans(newList);
    if (ok) {
      setSavedPlans(newList);
      setCurrentPlanId(id);
      setSaveStatus('saved');
      setCustomSaveOpen(false);
      showToast(t('saved_toast', lang));
      setTimeout(() => setSaveStatus('idle'), 200);
    } else {
      setSaveStatus('error');
    }
  };

  const handleDeletePlan = async (id) => {
    const newList = savedPlans.filter(p => p.id !== id);
    const ok = await persistAllPlans(newList);
    if (ok) {
      setSavedPlans(newList);
      if (currentPlanId === id) setCurrentPlanId(null);
    }
  };

  const handleLoadPlan = (plan) => {
    if (plan.type === 'custom') {
      setCustomItems(plan.custom?.items ?? []);
      setMode('workout');
      setCurrentPlanId(plan.id);
      setView('custom');
      return;
    }
    if (plan.type === 'stretch') {
      const s = plan.stretch || {};
      setMode('stretch');
      setStretchRoutine(s.routine ?? null);
      setStretchAreas(s.areas ?? []);
      setStretchHold(s.hold ?? 30);
      setCurrentPlanId(plan.id);
      setView('plan');
      return;
    }
    // workout
    const i = plan.inputs || {};
    setMode('workout');
    setAge(i.age ?? null);
    setGoals(i.goals ?? []);
    setSplit(i.split ?? null);
    setUnits(i.units ?? 'metric');
    setSex(i.sex ?? 'neutral');
    setHeightCm(i.heightCm ?? '');
    setHeightFt(i.heightFt ?? '');
    setHeightIn(i.heightIn ?? '');
    setWeight(i.weight ?? '');
    setTargetWeight(i.targetWeight ?? '');
    const p = plan.progress || {};
    setWeekNum(p.weekNum ?? 1);
    setSwaps(p.swaps ?? {});
    setCompletions(deserializeCompletions(p.completions));
    setCurrentPlanId(plan.id);
    setView('plan');
  };

  // Auto-persist progress when editing a saved WORKOUT plan
  useEffect(() => {
    if (!currentPlanId) return;
    const idx = savedPlans.findIndex(p => p.id === currentPlanId);
    if (idx === -1) return;
    if (savedPlans[idx].type !== 'workout') return; // only generated workout plans have live progress
    const updated = {
      ...savedPlans[idx],
      progress: { weekNum, swaps, completions: serializeCompletions(completions) },
    };
    const newList = [...savedPlans];
    newList[idx] = updated;
    setSavedPlans(newList);
    persistAllPlans(newList); // fire-and-forget
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekNum, swaps, completions, currentPlanId]);

  // ---- Completion / swap handlers ----

  const handleToggleComplete = (dayCode, swapKey) => {
    setCompletions(prev => {
      const next = { ...prev };
      const existing = new Set(next[dayCode] || new Set());
      if (existing.has(swapKey)) existing.delete(swapKey);
      else existing.add(swapKey);
      next[dayCode] = existing;
      return next;
    });
  };

  const handleSwap = (swapKey) => {
    setSwaps(prev => ({ ...prev, [swapKey]: (prev[swapKey] || 0) + 1 }));
    // Clear completion for that exercise (it's a new exercise now)
    const [dayCode] = swapKey.split('_');
    setCompletions(prev => {
      if (!prev[dayCode]) return prev;
      const next = { ...prev };
      const set = new Set(next[dayCode]);
      set.delete(swapKey);
      next[dayCode] = set;
      return next;
    });
  };

  // ---- Bodyweight log handlers ----

  const handleSaveWeightEntry = async ({ date, weight: w, unit }) => {
    const weightKg = unit === 'kg' ? w : w / 2.20462;
    // Replace if entry for same date exists
    const filtered = bodyweightLog.filter(e => e.date !== date);
    const newList = [...filtered, { date, weightKg }];
    const ok = await persistBodyweightLog(newList);
    if (ok) {
      setBodyweightLog(newList);
      setLogModalOpen(false);
      showToast(t('saved_toast', lang));
    }
  };

  const handleDeleteWeightEntry = async (date) => {
    const newList = bodyweightLog.filter(e => e.date !== date);
    const ok = await persistBodyweightLog(newList);
    if (ok) setBodyweightLog(newList);
  };

  // ---- Other helpers ----

  const handlePrint = () => {
    if (!computed || !week) return;
    const html = generatePrintHTML({
      lang, age, goals, split, weekNum, week, computed,
      diet: computed.diet, units, weight, targetWeight,
    });
    try {
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const w = window.open(url, '_blank');
      if (!w || w.closed || typeof w.closed === 'undefined') {
        // Popup blocked — fall back to download
        const a = document.createElement('a');
        a.href = url;
        a.download = `fitlab-plan.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      // Cleanup the URL after a minute (gives the new tab time to load)
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) {
      console.error('Print failed:', e);
      // Last-resort fallback: data URI
      const dataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
      window.open(dataUri, '_blank');
    }
  };

  const toggleGoal = (id) => {
    setGoals(prev => prev.includes(id) ? prev.filter(x => x !== id) : (prev.length >= 3 ? prev : [...prev, id]));
  };

  const startNewPlanFlow = () => {
    // When user goes back to picker, we keep their inputs but clear plan binding
    setCurrentPlanId(null);
    setWeekNum(1);
    setSwaps({});
    setCompletions({});
    setView('picker');
  };

  // ---- Stretch handlers ----

  const toggleArea = (id) => {
    setStretchAreas(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handlePickRoutine = (id) => {
    setStretchRoutine(id);
    // Adopt the routine's default hold so the slider starts somewhere sensible
    const r = STRETCH_ROUTINES[id];
    if (r) setStretchHold(r.defaultHold);
  };

  const startStretchFlow = () => {
    setCurrentPlanId(null);
    setGuidedOpen(false);
    setView('picker');
  };

  // When switching modes, reset the view to the picker
  const handleSetMode = (m) => {
    setMode(m);
    setView('picker');
    setCurrentPlanId(null);
    setGuidedOpen(false);
  };

  // ---- 30-day challenge handlers ----
  const handleStartChallenge = () => {
    const data = { start: todayISO(), done: [] };
    setChallenge(data);
    persistChallenge(data);
  };
  const handleToggleChallengeDay = (day) => {
    const base = challenge || { start: todayISO(), done: [] };
    const marking = !(base.done || []).includes(day);
    const set = new Set(base.done || []);
    marking ? set.add(day) : set.delete(day);
    const next = { ...base, done: [...set].sort((a, b) => a - b) };
    setChallenge(next);
    persistChallenge(next);
    if (marking) recordActivity('challenge'); // completing a day counts toward the streak
  };
  const handleRestartChallenge = () => {
    if (!window.confirm(t('ch_restart_confirm', lang))) return;
    const data = { start: todayISO(), done: [] };
    setChallenge(data);
    persistChallenge(data);
  };
  // Reposition the challenge so that TODAY is the chosen day (shifts the start date).
  const handleSetChallengeDay = (day) => {
    const d = Math.min(Math.max(parseInt(day, 10) || 1, 1), 30);
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (d - 1));
    const startISO = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
    const base = challenge || { start: startISO, done: [] };
    const next = { ...base, start: startISO };
    setChallenge(next);
    persistChallenge(next);
  };
  const handleStartChallengeDay = (dayData) => {
    setWorkoutSession({
      exercises: challengeSessionExercises(dayData.exercises),
      label: t('mode_challenge', lang),
      dayName: `Day ${dayData.day} · ${dayData.title}`,
      kind: 'challenge',
    });
  };

  // ---- Progress tracking ----
  const recordActivity = (kind) => {
    const date = todayISO();
    setActivityLog((prev) => {
      if (prev.some((a) => a.date === date && a.kind === kind)) return prev; // one per (date, kind)
      const next = [...prev, { date, kind }];
      persistActivityLog(next);
      return next;
    });
  };
  const recordPerf = (name, value, unit) => {
    setPerfLog((prev) => {
      const next = [...prev, { date: todayISO(), name, value, unit }];
      persistPerfLog(next);
      return next;
    });
  };

  // ---- Backup / restore (device-local data → portable code) ----
  const buildBackupCode = () => {
    const data = { v: 1, plans: savedPlans, bodyweight: bodyweightLog, challenge, activity: activityLog, perf: perfLog };
    try { return btoa(unescape(encodeURIComponent(JSON.stringify(data)))); } catch { return ''; }
  };
  const applyBackupCode = async (code) => {
    try {
      const data = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
      if (!data || typeof data !== 'object') return false;
      if (Array.isArray(data.plans)) { await persistAllPlans(data.plans); setSavedPlans(data.plans); }
      if (Array.isArray(data.bodyweight)) { await persistBodyweightLog(data.bodyweight); setBodyweightLog(data.bodyweight); }
      if (data.challenge && data.challenge.start) { await persistChallenge(data.challenge); setChallenge(data.challenge); }
      else if (data.challenge === null) { await persistChallenge(null); }
      if (Array.isArray(data.activity)) { await persistActivityLog(data.activity); setActivityLog(data.activity); }
      if (Array.isArray(data.perf)) { await persistPerfLog(data.perf); setPerfLog(data.perf); }
      return true;
    } catch { return false; }
  };

  const statsValid = useMemo(() => {
    const w = parseFloat(weight);
    const tw = parseFloat(targetWeight);
    if (isNaN(w) || isNaN(tw) || w <= 0 || tw <= 0) return false;
    if (units === 'metric') {
      const h = parseFloat(heightCm);
      return !isNaN(h) && h >= 120 && h <= 230;
    } else {
      const f = parseFloat(heightFt);
      const i = parseFloat(heightIn);
      return !isNaN(f) && f >= 3 && f <= 8 && !isNaN(i) && i >= 0 && i < 12;
    }
  }, [units, heightCm, heightFt, heightIn, weight, targetWeight]);

  const computed = useMemo(() => {
    if (!statsValid || !age || goals.length === 0 || !split) return null;
    const heightCmNum = units === 'metric'
      ? parseFloat(heightCm)
      : inToCm(parseFloat(heightFt) * 12 + parseFloat(heightIn));
    const weightKg = units === 'metric' ? parseFloat(weight) : lbToKg(parseFloat(weight));
    const targetKg = units === 'metric' ? parseFloat(targetWeight) : lbToKg(parseFloat(targetWeight));
    const ageNum = ageNumber[age];

    const bmr = calcBMR(sex, weightKg, heightCmNum, ageNum);
    const tdee = bmr * ACTIVITY_FACTOR;
    const diet = getDiet(goals);
    const dailyCals = tdee + diet.calorieAdj;
    const bmi = calcBMI(weightKg, heightCmNum);
    const weeksToGoal = calcWeeksToTarget(weightKg, targetKg, goals);
    const isMaintenance = weeksToGoal === 0;

    const weightDisplay = parseFloat(weight).toFixed(0);
    const targetDisplay = parseFloat(targetWeight).toFixed(0);
    const delta = parseFloat(targetWeight) - parseFloat(weight);
    const deltaDisplay = (delta > 0 ? '+' : '') + delta.toFixed(0);

    return { weightDisplay, targetDisplay, deltaDisplay, bmi, dailyCals, weeksToGoal, isMaintenance, diet, weightKg, targetKg };
  }, [statsValid, age, goals, split, units, heightCm, heightFt, heightIn, weight, targetWeight, sex]);

  const week = useMemo(() => {
    if (!age || goals.length === 0 || !split) return null;
    return buildWeek(split, age, goals, lang, swaps, weekNum);
  }, [age, goals, split, lang, swaps, weekNum]);

  const stretchItems = useMemo(() => {
    if (!stretchRoutine) return [];
    return buildStretchRoutine(stretchRoutine, stretchAreas, stretchHold);
  }, [stretchRoutine, stretchAreas, stretchHold]);

  useEffect(() => {
    if (view === 'plan') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  return (
   <ThemeContext.Provider value={{ theme, toggleTheme }}>
    <div
      className="min-h-screen relative grain f-body"
      dir={isRTL(lang) ? 'rtl' : 'ltr'}
      style={{ background: PALETTE.cream, color: PALETTE.ink }}
    >
      <FontStyles />

      {mode === 'progress' ? (
        <ProgressDashboard
          lang={lang} setLang={setLang}
          mode={mode} setMode={handleSetMode}
          activityLog={activityLog}
          perfLog={perfLog}
          bodyweightLog={bodyweightLog}
          currentWeightKg={computed?.weightKg}
          targetKg={computed?.targetKg}
          units={units}
          onOpenWeightLog={() => setLogModalOpen(true)}
          onDeleteWeightEntry={handleDeleteWeightEntry}
          challenge={challenge}
          onExport={buildBackupCode}
          onImport={applyBackupCode}
        />
      ) : mode === 'challenge' ? (
        <ChallengeView
          lang={lang} setLang={setLang}
          mode={mode} setMode={handleSetMode}
          challenge={challenge}
          onStart={handleStartChallenge}
          onToggleDay={handleToggleChallengeDay}
          onStartDay={handleStartChallengeDay}
          onSetDay={handleSetChallengeDay}
          onRestart={handleRestartChallenge}
        />
      ) : mode === 'stretch' ? (
        view === 'picker' ? (
          <StretchPicker
            lang={lang} setLang={setLang}
            mode={mode} setMode={handleSetMode}
            routine={stretchRoutine}
            onPickRoutine={handlePickRoutine}
            selectedAreas={stretchAreas}
            onToggleArea={toggleArea}
            onSubmit={() => stretchRoutine && setView('plan')}
            savedPlans={savedPlans}
            onLoadPlan={handleLoadPlan}
            onDeletePlan={handleDeletePlan}
          />
        ) : (
          <StretchPlanView
            lang={lang} setLang={setLang}
            mode={mode} setMode={handleSetMode}
            routineId={stretchRoutine}
            items={stretchItems}
            hold={stretchHold}
            selectedAreas={stretchAreas}
            onBack={startStretchFlow}
            onOpenSave={() => { setSaveStatus('idle'); setSaveModalOpen(true); }}
            onStartGuided={() => setGuidedOpen(true)}
          />
        )
      ) : view === 'custom' ? (
        <CustomBuilderView
          lang={lang} setLang={setLang}
          mode={mode} setMode={handleSetMode}
          onBack={() => setView('picker')}
          onStart={(exercises) => setWorkoutSession({ exercises, label: t('build_own', lang), dayName: '', kind: 'workout' })}
          items={customItems}
          setItems={setCustomItems}
          onSaveOpen={() => { setSaveStatus('idle'); setCustomSaveOpen(true); }}
          savedCustoms={savedPlans.filter(p => p.type === 'custom')}
          onLoadPlan={handleLoadPlan}
          onDeletePlan={handleDeletePlan}
        />
      ) : view === 'picker' ? (
        <PickerView
          lang={lang} setLang={setLang}
          mode={mode} setMode={handleSetMode}
          age={age} goals={goals} split={split}
          onPickAge={setAge} onToggleGoal={toggleGoal} onPickSplit={setSplit}
          onSubmit={() => age && goals.length && split && statsValid && setView('plan')}
          onBuildOwn={() => setView('custom')}
          units={units} setUnits={setUnits}
          sex={sex} setSex={setSex}
          heightCm={heightCm} setHeightCm={setHeightCm}
          heightFt={heightFt} setHeightFt={setHeightFt}
          heightIn={heightIn} setHeightIn={setHeightIn}
          weight={weight} setWeight={setWeight}
          targetWeight={targetWeight} setTargetWeight={setTargetWeight}
          statsValid={statsValid}
          savedPlans={savedPlans}
          onLoadPlan={handleLoadPlan}
          onDeletePlan={handleDeletePlan}
        />
      ) : (
        <PlanView
          lang={lang} setLang={setLang}
          age={age} goals={goals} split={split}
          computed={computed} week={week} diet={computed.diet}
          weightUnit={units === 'metric' ? 'kg' : 'lb'}
          onBack={startNewPlanFlow}
          onOpenSave={() => { setSaveStatus('idle'); setSaveModalOpen(true); }}
          weekNum={weekNum} setWeekNum={setWeekNum}
          completions={completions} onToggleComplete={handleToggleComplete}
          onSwap={handleSwap}
          onPrint={handlePrint}
          bodyweightLog={bodyweightLog}
          currentWeightKg={computed?.weightKg}
          targetKg={computed?.targetKg}
          units={units}
          onOpenWeightLog={() => setLogModalOpen(true)}
          onDeleteWeightEntry={handleDeleteWeightEntry}
          onStartTimer={(ex) => setActiveTimer(ex)}
          onStartWorkout={(exercises, label, dayName) => setWorkoutSession({ exercises, label, dayName, kind: 'workout' })}
        />
      )}

      <SaveModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        defaultName={
          mode === 'stretch'
            ? (currentPlanId
                ? (savedPlans.find(p => p.id === currentPlanId)?.name || (stretchRoutine ? STRETCH_ROUTINES[stretchRoutine].label[lang] : t('save_routine', lang)))
                : (stretchRoutine ? STRETCH_ROUTINES[stretchRoutine].label[lang] : t('save_routine', lang)))
            : (currentPlanId
                ? (savedPlans.find(p => p.id === currentPlanId)?.name || buildAutoName(age, goals, split, lang))
                : buildAutoName(age, goals, split, lang))
        }
        onSave={handleSavePlan}
        lang={lang}
        status={saveStatus}
      />

      <SaveModal
        open={customSaveOpen}
        onClose={() => setCustomSaveOpen(false)}
        defaultName={
          (currentPlanId && savedPlans.find(p => p.id === currentPlanId && p.type === 'custom')?.name)
          || t('build_default_name', lang)
        }
        onSave={handleSaveCustom}
        lang={lang}
        status={saveStatus}
      />

      {guidedOpen && (
        <GuidedPlayer
          items={stretchItems}
          lang={lang}
          onClose={() => setGuidedOpen(false)}
          onComplete={() => recordActivity('stretch')}
        />
      )}

      {workoutSession && (
        <GuidedWorkout
          exercises={workoutSession.exercises}
          trackLabel={workoutSession.label}
          dayName={workoutSession.dayName}
          lang={lang}
          onClose={() => setWorkoutSession(null)}
          onComplete={() => recordActivity(workoutSession.kind || 'workout')}
          onLog={recordPerf}
        />
      )}

      <BodyweightLogModal
        open={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        onSave={handleSaveWeightEntry}
        defaultWeight={weight}
        units={units}
        lang={lang}
      />

      {activeTimer && (
        <RestTimer
          exercise={activeTimer}
          lang={lang}
          onClose={() => setActiveTimer(null)}
        />
      )}

      {toast && (
        <div
          className="fixed bottom-6 z-[60] f-mono uppercase tracking-[0.2em] text-xs px-4 py-3 flex items-center gap-2 no-print"
          style={{
            background: PALETTE.ink, color: PALETTE.cream,
            border: `1px solid ${PALETTE.ink}`, borderRadius: '999px',
            insetInlineStart: '50%', transform: 'translateX(-50%)',
            boxShadow: '0 8px 24px rgba(27,27,25,0.25)',
          }}
        >
          <Check size={12} strokeWidth={2.5} color={PALETTE.sage} />
          {toast}
        </div>
      )}
    </div>
   </ThemeContext.Provider>
  );
}
