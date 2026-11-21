// shots.js — screenshot staging for the maker. Open the game with
// ?shot=play to get a mid-game frame (3 of 7 found, 4 left, counter visible),
// ?shot=play2 for the second scene mid-game, ?shot=end for a finished scene,
// ?shot=start for the menu. The game itself is unchanged: these presets only
// set the state the page loads with, so the screenshots are real renders.

import { startScene } from './state.js';
import { SCENES } from './scenes.js';

export function applyShot(state) {
  const q = new URLSearchParams(window.location.search);
  const shot = q.get('shot');
  if (!shot) return false;
  if (shot === 'start') {
    state.screen = 'menu';
    state.menuChoice = 0;
    return true;
  }
  if (shot === 'play') {
    startScene(state, 0);
    const ids = SCENES[0].diffs.slice(0, 3).map((d) => d.id);
    state.found = new Set(ids);
    state.score = 15000;
    state.elapsed = 83;
    state.startedAt = performance.now() - 83000;
    state.cursor = { x: 300, y: 380, panel: 0 };
    state.keyboardMode = true;
    return true;
  }
  if (shot === 'play2') {
    startScene(state, 1);
    const ids = SCENES[1].diffs.slice(0, 2).map((d) => d.id);
    state.found = new Set(ids);
    state.score = 25000;
    state.hintsLeft = 2;
    state.elapsed = 47;
    state.startedAt = performance.now() - 47000;
    state.cursor = { x: 200, y: 400, panel: 1 };
    state.keyboardMode = true;
    return true;
  }
  if (shot === 'end') {
    startScene(state, 0);
    state.found = new Set(SCENES[0].diffs.map((d) => d.id));
    state.score = 35000;
    state.sceneBonus = 23500;
    state.score += state.sceneBonus;
    state.elapsed = 195;
    state.totalElapsed = 195;
    state.screen = 'sceneDone';
    return true;
  }
  return false;
}
