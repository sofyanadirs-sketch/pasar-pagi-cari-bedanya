// input.js — mouse and keyboard play. Click either panel to mark a spot;
// arrow keys move a crosshair, Enter marks it, H asks for a hint, M toggles
// the magnifier, R restarts the scene, Esc goes back to the menu.

import { PANELS, PANEL_W, PANEL_H } from './render.js';
import { SCENES } from './scenes.js';

export function toSceneCoords(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * canvas.width;
  const y = ((clientY - rect.top) / rect.height) * canvas.height;
  for (let p = 0; p < PANELS.length; p++) {
    const o = PANELS[p];
    if (x >= o.x && x <= o.x + PANEL_W && y >= o.y && y <= o.y + PANEL_H) {
      return { panel: p, x: x - o.x, y: y - o.y };
    }
  }
  return null;
}

export function attachInput(canvas, lens, state, h) {
  canvas.addEventListener('pointerdown', (ev) => {
    h.unlockAudio();
    const hit = toSceneCoords(canvas, ev.clientX, ev.clientY);
    if (!hit) return;
    state.cursor.x = hit.x;
    state.cursor.y = hit.y;
    state.cursor.panel = hit.panel;
    state.keyboardMode = false;
    h.onMark(hit.x, hit.y);
  });

  canvas.addEventListener('pointermove', (ev) => {
    h.onHover(ev.clientX, ev.clientY);
  });

  canvas.addEventListener('pointerleave', () => {
    h.onHover(null, null);
  });

  window.addEventListener('keydown', (ev) => {
    if (ev.target && (ev.target.tagName === 'INPUT' || ev.target.tagName === 'TEXTAREA')) return;
    const step = ev.shiftKey ? 4 : 14;
    const c = state.cursor;
    switch (ev.key) {
      case 'ArrowLeft':
        ev.preventDefault();
        state.keyboardMode = true;
        c.x = Math.max(0, c.x - step);
        break;
      case 'ArrowRight':
        ev.preventDefault();
        state.keyboardMode = true;
        c.x = Math.min(PANEL_W, c.x + step);
        break;
      case 'ArrowUp':
        ev.preventDefault();
        state.keyboardMode = true;
        c.y = Math.max(0, c.y - step);
        break;
      case 'ArrowDown':
        ev.preventDefault();
        state.keyboardMode = true;
        c.y = Math.min(PANEL_H, c.y + step);
        break;
      case 'Enter':
      case ' ':
        ev.preventDefault();
        if (state.screen === 'menu') {
          h.onSelectScene(state.menuChoice);
        } else if (state.screen === 'sceneDone') {
          h.onNextScene();
        } else if (state.screen === 'allDone') {
          h.onReplay();
        } else {
          state.keyboardMode = true;
          h.onMark(c.x, c.y);
        }
        break;
      case 'h':
      case 'H':
        h.onHint();
        break;
      case 'm':
      case 'M':
        h.onToggleLens();
        break;
      case 'r':
      case 'R':
        if (state.screen === 'play') h.onRestart();
        break;
      case 'Escape':
        h.onMenu();
        break;
      case '1':
      case '2':
      case '3': {
        const i = Number(ev.key) - 1;
        if (i < SCENES.length) {
          if (state.screen === 'menu') state.menuChoice = i;
          else h.onSelectScene(i);
        }
        break;
      }
      default:
        break;
    }
  });
}
