// state.js — the game's state: screen, scene progress, score in Rupiah,
// timer, hints and the crosshair. Pure data and small rules, no drawing.

import { SCENES } from './scenes.js';

export const FIND_REWARD = 5000; // Rp per difference found
export const WRONG_COST = 1000; // Rp lost on a wrong click
export const HINT_COST = 2000; // Rp per hint
export const SCENE_BONUS = 10000; // Rp for finishing a scene
export const BONUS_PER_SECOND = 50; // Rp per second left under the par time
export const PAR_SECONDS = 240; // 4 minutes a scene is worth a time bonus for
export const HINTS_PER_SCENE = 3;

export function formatRupiah(n) {
  return 'Rp' + Math.max(0, Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return String(m).padStart(2, '0') + ':' + String(r).padStart(2, '0');
}

export function newState() {
  return {
    screen: 'menu', // menu | play | sceneDone | allDone
    sceneIndex: 0,
    found: new Set(), // difference ids found in this scene
    score: 0,
    hintsLeft: HINTS_PER_SCENE,
    startedAt: 0, // ms timestamp when the current scene started
    elapsed: 0, // seconds spent in the current scene
    totalElapsed: 0, // seconds spent across all scenes
    sceneBonus: 0, // bonus just earned for the finished scene
    wrongClicks: 0,
    hintPulse: null, // { x, y, until } — a hint ring on the right panel
    lensOn: false,
    cursor: { x: 300, y: 220, panel: 0 }, // keyboard crosshair, scene coords
    keyboardMode: false,
    lastFind: null, // { x, y, panel, at } — the latest find, for its pop
    message: '', // short toast line under the panels
    messageUntil: 0,
    menuChoice: 0, // highlighted scene card on the menu
  };
}

export function sceneOf(state) {
  return SCENES[state.sceneIndex];
}

export function remaining(state) {
  return sceneOf(state).diffs.length - state.found.size;
}

export function startScene(state, index) {
  state.sceneIndex = index;
  state.found = new Set();
  state.hintsLeft = HINTS_PER_SCENE;
  state.startedAt = performance.now();
  state.elapsed = 0;
  state.hintPulse = null;
  state.lastFind = null;
  state.message = '';
  state.screen = 'play';
}

export function tick(state, now) {
  if (state.screen === 'play') {
    state.elapsed = (now - state.startedAt) / 1000;
  }
  if (state.hintPulse && now > state.hintPulse.until) state.hintPulse = null;
  if (state.message && now > state.messageUntil) state.message = '';
}

// Try to mark a difference at scene coords (x, y) on either panel.
// Returns 'found' | 'wrong' | 'already' | 'done'.
export function markAt(state, x, y) {
  if (state.screen !== 'play') return 'done';
  const scene = sceneOf(state);
  for (const d of scene.diffs) {
    if (state.found.has(d.id)) continue;
    const dx = x - d.x;
    const dy = y - d.y;
    if (dx * dx + dy * dy <= (d.r + 8) * (d.r + 8)) {
      state.found.add(d.id);
      state.score += FIND_REWARD;
      state.lastFind = { x: d.x, y: d.y, at: performance.now() };
      state.message = 'Ketemu: ' + d.label + '  +' + formatRupiah(FIND_REWARD);
      state.messageUntil = performance.now() + 1800;
      if (state.found.size === scene.diffs.length) finishScene(state);
      return 'found';
    }
  }
  state.score = Math.max(0, state.score - WRONG_COST);
  state.wrongClicks += 1;
  state.message = 'Bukan di situ  −' + formatRupiah(WRONG_COST);
  state.messageUntil = performance.now() + 1500;
  return 'wrong';
}

export function finishScene(state) {
  const timeBonus = Math.max(0, PAR_SECONDS - Math.floor(state.elapsed)) * BONUS_PER_SECOND;
  state.sceneBonus = SCENE_BONUS + timeBonus;
  state.score += state.sceneBonus;
  state.totalElapsed += state.elapsed;
  state.screen = state.sceneIndex + 1 >= SCENES.length ? 'allDone' : 'sceneDone';
}

export function useHint(state) {
  if (state.screen !== 'play') return null;
  if (state.hintsLeft <= 0) {
    state.message = 'Hint habis — cari sendiri, semangat!';
    state.messageUntil = performance.now() + 1800;
    return null;
  }
  const scene = sceneOf(state);
  const left = scene.diffs.filter((d) => !state.found.has(d.id));
  if (left.length === 0) return null;
  const pick = left[Math.floor(Math.random() * left.length)];
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - HINT_COST);
  state.hintPulse = { x: pick.x, y: pick.y, until: performance.now() + 2200 };
  state.message = 'Hint: lihat dekat ' + pick.label + '  −' + formatRupiah(HINT_COST);
  state.messageUntil = performance.now() + 2200;
  return pick;
}
