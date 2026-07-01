import { EX_NAME_VIDEO, EX_VIDEOS } from './exercises.js';
const CHALLENGE_VIDEO_OVERRIDE = {
  'Pistol Squat (advanced)': EX_VIDEOS['pistol-squat'],
  'Wall Sit': 'JaZNYM3zAP0',
  'Superman': 'hhq86gJvrvo',
  'Calf Raise': 'Uyg2QR1WAq8',
  'Plank Shoulder Taps': 'gKA5LBy7WAI',
  'Walking': 'tVpUCkMLgms',
};
const challengeVideo = (name) => CHALLENGE_VIDEO_OVERRIDE[name] || EX_NAME_VIDEO[name] || null;

// Convert a challenge day's exercises into the shape GuidedWorkout expects.
function challengeSessionExercises(dayExercises) {
  return (dayExercises || []).map((e, i) => ({
    id: `ch-${i}-${e.name}`,
    name: e.name,
    prescription: e.scheme,
    video: challengeVideo(e.name),
    restSeconds: 60,
  }));
}

const CHALLENGE_DAYS = [
  { day: 1, type: 'workout', title: 'Full Body', focus: 'Learn the movement patterns with light volume', exercises: [ { name: 'Bodyweight Squat', scheme: '3 × 10' }, { name: 'Incline Push-Up', scheme: '3 × 8' }, { name: 'Glute Bridge', scheme: '3 × 12' }, { name: 'Plank', scheme: '3 × 20 sec' }, { name: 'Bird-Dog', scheme: '3 × 8 / side' } ] },
  { day: 2, type: 'workout', title: 'Push & Core', focus: 'Pressing strength and anti-rotation core', exercises: [ { name: 'Incline Push-Up', scheme: '3 × 8' }, { name: 'Pike Push-Up', scheme: '3 × 6' }, { name: 'Plank Shoulder Taps', scheme: '3 × 10 / side' }, { name: 'Dead Bug', scheme: '3 × 8 / side' }, { name: 'Side Plank', scheme: '2 × 15 sec / side' } ] },
  { day: 3, type: 'workout', title: 'Legs & Glutes', focus: 'Lower-body volume and control', exercises: [ { name: 'Bodyweight Squat', scheme: '3 × 12' }, { name: 'Reverse Lunges', scheme: '3 × 8 / leg' }, { name: 'Glute Bridge', scheme: '3 × 15' }, { name: 'Wall Sit', scheme: '3 × 20 sec' }, { name: 'Calf Raise', scheme: '3 × 15' } ] },
  { day: 4, type: 'rest', title: 'Active Recovery', focus: 'Light mobility and easy cardio', exercises: [ { name: 'Cat-Cow + Thoracic Mobility', scheme: '2 × 8 slow reps' }, { name: 'Walking', scheme: '20 min easy walk' } ] },
  { day: 5, type: 'workout', title: 'Pull & Core', focus: 'Horizontal pull and posterior chain', exercises: [ { name: 'Inverted Row', scheme: '3 × 8' }, { name: 'Superman', scheme: '3 × 10' }, { name: 'Bird-Dog', scheme: '3 × 8 / side' }, { name: 'Plank', scheme: '3 × 25 sec' }, { name: 'Dead Bug', scheme: '3 × 8 / side' } ] },
  { day: 6, type: 'workout', title: 'Conditioning', focus: 'Easy circuit to build work capacity', exercises: [ { name: 'Jumping Jacks', scheme: '3 × 30 sec' }, { name: 'High Knees', scheme: '3 × 20 sec' }, { name: 'Mountain Climbers', scheme: '3 × 20 sec' }, { name: 'Bodyweight Squat', scheme: '3 × 12' } ] },
  { day: 7, type: 'rest', title: 'Full Rest', focus: 'Complete rest — let week 1 adaptations settle', exercises: [] },
  { day: 8, type: 'workout', title: 'Full Body', focus: 'Progress to full push-ups, add volume', exercises: [ { name: 'Bodyweight Squat', scheme: '3 × 14' }, { name: 'Push-Up', scheme: '3 × 8' }, { name: 'Single-Leg Glute Bridge', scheme: '3 × 8 / side' }, { name: 'Plank', scheme: '3 × 30 sec' }, { name: 'Bird-Dog', scheme: '3 × 10 / side' } ] },
  { day: 9, type: 'workout', title: 'Push & Core', focus: 'More pressing sets, longer side planks', exercises: [ { name: 'Push-Up', scheme: '4 × 8' }, { name: 'Pike Push-Up', scheme: '3 × 8' }, { name: 'Plank Shoulder Taps', scheme: '3 × 12 / side' }, { name: 'Side Plank', scheme: '3 × 20 sec / side' }, { name: 'Dead Bug', scheme: '3 × 10 / side' } ] },
  { day: 10, type: 'workout', title: 'Legs & Glutes', focus: 'Add walking lunges, longer wall sit', exercises: [ { name: 'Bodyweight Squat', scheme: '3 × 15' }, { name: 'Walking Lunges', scheme: '3 × 10 / leg' }, { name: 'Glute Bridge', scheme: '3 × 18' }, { name: 'Wall Sit', scheme: '3 × 30 sec' }, { name: 'Calf Raise', scheme: '3 × 18' } ] },
  { day: 11, type: 'rest', title: 'Active Recovery', focus: 'Mobility flow and easy walk', exercises: [ { name: 'Cat-Cow + Thoracic Mobility', scheme: '2 × 10 slow reps' }, { name: 'Bird-Dog', scheme: '2 × 10 / side' }, { name: 'Walking', scheme: '25 min easy walk' } ] },
  { day: 12, type: 'workout', title: 'Pull & Core', focus: 'Pull volume and longer planks', exercises: [ { name: 'Inverted Row', scheme: '4 × 8' }, { name: 'Superman', scheme: '3 × 12' }, { name: 'Plank', scheme: '3 × 35 sec' }, { name: 'Side Plank', scheme: '3 × 20 sec / side' }, { name: 'Dead Bug', scheme: '3 × 10 / side' } ] },
  { day: 13, type: 'workout', title: 'Conditioning', focus: 'Introduce jump squats and burpees', exercises: [ { name: 'Jumping Jacks', scheme: '3 × 40 sec' }, { name: 'High Knees', scheme: '3 × 30 sec' }, { name: 'Mountain Climbers', scheme: '3 × 25 sec' }, { name: 'Jump Squat', scheme: '3 × 8' }, { name: 'Burpees', scheme: '3 × 5' } ] },
  { day: 14, type: 'rest', title: 'Full Rest', focus: 'Complete rest — end of volume week', exercises: [] },
  { day: 15, type: 'workout', title: 'Full Body', focus: 'Higher intensity, 4 working sets', exercises: [ { name: 'Bodyweight Squat', scheme: '4 × 15' }, { name: 'Push-Up', scheme: '4 × 10' }, { name: 'Single-Leg Glute Bridge', scheme: '3 × 10 / side' }, { name: 'Plank', scheme: '3 × 40 sec' }, { name: 'Mountain Climbers', scheme: '3 × 30 sec' } ] },
  { day: 16, type: 'workout', title: 'Push & Core', focus: 'Build vertical press strength', exercises: [ { name: 'Push-Up', scheme: '4 × 10' }, { name: 'Pike Push-Up', scheme: '4 × 8' }, { name: 'Plank Shoulder Taps', scheme: '3 × 15 / side' }, { name: 'Side Plank', scheme: '3 × 30 sec / side' }, { name: 'Dead Bug', scheme: '3 × 12 / side' } ] },
  { day: 17, type: 'workout', title: 'Legs & Glutes', focus: 'Explosive lower body', exercises: [ { name: 'Jump Squat', scheme: '4 × 10' }, { name: 'Reverse Lunges', scheme: '3 × 12 / leg' }, { name: 'Single-Leg Glute Bridge', scheme: '3 × 12 / side' }, { name: 'Wall Sit', scheme: '3 × 40 sec' }, { name: 'Calf Raise', scheme: '3 × 20' } ] },
  { day: 18, type: 'rest', title: 'Active Recovery', focus: 'Mobility and a longer easy walk', exercises: [ { name: 'Cat-Cow + Thoracic Mobility', scheme: '2 × 12 slow reps' }, { name: 'Walking', scheme: '30 min easy walk' } ] },
  { day: 19, type: 'workout', title: 'Pull & Core', focus: 'Peak pulling effort', exercises: [ { name: 'Inverted Row', scheme: '4 × 10' }, { name: 'Pull-Up', scheme: '3 × max (or Inverted Row 3 × 8)' }, { name: 'Superman', scheme: '3 × 14' }, { name: 'Plank', scheme: '3 × 45 sec' }, { name: 'Side Plank', scheme: '3 × 30 sec / side' } ] },
  { day: 20, type: 'workout', title: 'Conditioning', focus: 'Hard full-body circuit', exercises: [ { name: 'Burpees', scheme: '4 × 6' }, { name: 'High Knees', scheme: '4 × 30 sec' }, { name: 'Mountain Climbers', scheme: '4 × 30 sec' }, { name: 'Jump Squat', scheme: '3 × 12' }, { name: 'Jumping Jacks', scheme: '3 × 45 sec' } ] },
  { day: 21, type: 'rest', title: 'Full Rest', focus: 'Complete rest — recover before peak week', exercises: [] },
  { day: 22, type: 'workout', title: 'Full Body', focus: 'Peak week — top-end volume', exercises: [ { name: 'Bodyweight Squat', scheme: '4 × 18' }, { name: 'Push-Up', scheme: '4 × 12' }, { name: 'Walking Lunges', scheme: '3 × 12 / leg' }, { name: 'Plank', scheme: '3 × 50 sec' }, { name: 'Bird-Dog', scheme: '3 × 12 / side' } ] },
  { day: 23, type: 'workout', title: 'Push & Core', focus: 'Max pressing volume', exercises: [ { name: 'Push-Up', scheme: '5 × 10' }, { name: 'Pike Push-Up', scheme: '4 × 10' }, { name: 'Plank Shoulder Taps', scheme: '3 × 18 / side' }, { name: 'Side Plank', scheme: '3 × 35 sec / side' }, { name: 'Dead Bug', scheme: '3 × 12 / side' } ] },
  { day: 24, type: 'workout', title: 'Legs & Glutes', focus: 'Power plus a skill-strength reach', exercises: [ { name: 'Jump Squat', scheme: '4 × 12' }, { name: 'Reverse Lunges', scheme: '4 × 12 / leg' }, { name: 'Single-Leg Glute Bridge', scheme: '3 × 14 / side' }, { name: 'Wall Sit', scheme: '3 × 50 sec' }, { name: 'Pistol Squat (advanced)', scheme: '3 × 3 / side (hold support)' } ] },
  { day: 25, type: 'rest', title: 'Active Recovery', focus: 'Full mobility reset', exercises: [ { name: 'Cat-Cow + Thoracic Mobility', scheme: '2 × 12 slow reps' }, { name: 'Bird-Dog', scheme: '2 × 10 / side' }, { name: 'Walking', scheme: '30 min easy walk' } ] },
  { day: 26, type: 'workout', title: 'Pull & Core', focus: 'Peak pulling and longest planks', exercises: [ { name: 'Inverted Row', scheme: '4 × 12' }, { name: 'Pull-Up', scheme: '3 × max (or Inverted Row 4 × 10)' }, { name: 'Superman', scheme: '3 × 15' }, { name: 'Plank', scheme: '3 × 60 sec' }, { name: 'Side Plank', scheme: '3 × 35 sec / side' } ] },
  { day: 27, type: 'workout', title: 'Conditioning', focus: 'Final hard circuit', exercises: [ { name: 'Burpees', scheme: '4 × 8' }, { name: 'Mountain Climbers', scheme: '4 × 40 sec' }, { name: 'High Knees', scheme: '4 × 40 sec' }, { name: 'Jump Squat', scheme: '4 × 12' }, { name: 'Jumping Jacks', scheme: '3 × 60 sec' } ] },
  { day: 28, type: 'workout', title: 'Deload', focus: 'Easy session to freshen up before the test', exercises: [ { name: 'Bodyweight Squat', scheme: '2 × 12' }, { name: 'Incline Push-Up', scheme: '2 × 10' }, { name: 'Glute Bridge', scheme: '2 × 12' }, { name: 'Plank', scheme: '2 × 30 sec' }, { name: 'Cat-Cow + Thoracic Mobility', scheme: '2 × 10 slow reps' } ] },
  { day: 29, type: 'rest', title: 'Full Rest', focus: 'Total rest — be fresh for the final test', exercises: [] },
  { day: 30, type: 'workout', title: 'Final Test', focus: 'Re-test maxes and compare to Day 1', exercises: [ { name: 'Push-Up', scheme: '1 × max reps' }, { name: 'Bodyweight Squat', scheme: 'max reps in 60 sec' }, { name: 'Plank', scheme: '1 × max hold' }, { name: 'Inverted Row', scheme: '1 × max reps' } ] },
];

export { CHALLENGE_VIDEO_OVERRIDE, challengeVideo, challengeSessionExercises, CHALLENGE_DAYS };
