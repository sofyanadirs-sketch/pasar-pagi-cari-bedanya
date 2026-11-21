// main.js — wires the game together: the HUD, the menu and end overlays,
// the render loop, the magnifier lens, and the sounds for each outcome.

import { SCENES } from './scenes.js';
import {
  newState, startScene, tick, markAt, useHint, remaining, sceneOf,
  formatRupiah, formatTime,
} from './state.js';
import { drawPanels, drawLens, CANVAS_W, CANVAS_H } from './render.js';
import { attachInput } from './input.js';
import { playClick, playFind, playWrong, playHint, playWin, unlockAudio } from './audio.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
const lens = document.getElementById('lens');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

const el = (id) => document.getElementById(id);
const hudTime = el('hud-time');
const hudScore = el('hud-score');
const hudLeft = el('hud-left');
const hudHints = el('hud-hints');
const toast = el('toast');
const sceneTitle = el('scene-title');
const overlayMenu = el('overlay-menu');
const overlayDone = el('overlay-done');
const doneTitle = el('done-title');
const doneBody = el('done-body');
const btnNext = el('btn-next');
const btnReplay = el('btn-replay');

const state = newState();
let hover = { x: null, y: null };
let foundAt = {};

// --- overlays -------------------------------------------------------------
function buildMenu() {
  const list = el('scene-list');
  list.innerHTML = '';
  SCENES.forEach((s, i) => {
    const card = document.createElement('button');
    card.className = 'scene-card' + (state.menuChoice === i ? ' chosen' : '');
    card.type = 'button';
    card.innerHTML = '<b>' + (i + 1) + '. ' + s.name + '</b><span>' + s.tagline + '</span><em>7 perbedaan · klik untuk main</em>';
    card.addEventListener('click', () => selectScene(i));
    card.addEventListener('mouseenter', () => {
      state.menuChoice = i;
      buildMenu();
    });
    list.appendChild(card);
  });
}

function showMenu() {
  state.screen = 'menu';
  overlayDone.classList.add('hidden');
  overlayMenu.classList.remove('hidden');
  buildMenu();
}

function showDone() {
  overlayMenu.classList.add('hidden');
  const scene = sceneOf(state);
  if (state.screen === 'allDone') {
    doneTitle.textContent = 'Semua scene selesai!';
    doneBody.innerHTML = 'Total skor <b>' + formatRupiah(state.score) +
      '</b> · total waktu <b>' + formatTime(state.totalElapsed) +
      '</b> · klik salah <b>' + state.wrongClicks + '</b> kali.<br>' +
      '21 perbedaan ditemukan di tiga pagi yang berbeda — pasar, warung kopi, dan stasiun.';
    btnNext.classList.add('hidden');
    btnReplay.classList.remove('hidden');
  } else {
    doneTitle.textContent = scene.name + ' selesai!';
    doneBody.innerHTML = 'Semua 7 perbedaan ketemu dalam <b>' + formatTime(state.elapsed) +
      '</b>.<br>Bonus scene <b>+' + formatRupiah(state.sceneBonus) +
      '</b> · skor sekarang <b>' + formatRupiah(state.score) + '</b>.';
    btnNext.classList.remove('hidden');
    btnReplay.classList.remove('hidden');
    btnNext.textContent = 'Lanjut: ' + SCENES[state.sceneIndex + 1].name + ' →';
  }
  overlayDone.classList.remove('hidden');
}

function selectScene(i) {
  unlockAudio();
  playClick();
  foundAt = {};
  startScene(state, i);
  overlayMenu.classList.add('hidden');
  overlayDone.classList.add('hidden');
}

function nextScene() {
  selectScene(state.sceneIndex + 1);
}

// --- play actions ---------------------------------------------------------
function onMark(x, y) {
  const result = markAt(state, x, y);
  if (result === 'found') {
    const scene = sceneOf(state);
    const d = scene.diffs.find((dd) => state.found.has(dd.id) && !foundAt[dd.id]);
    if (d) foundAt[d.id] = performance.now();
    playFind();
    if (state.screen === 'sceneDone' || state.screen === 'allDone') {
      playWin();
      setTimeout(showDone, 650);
    }
  } else if (result === 'wrong') {
    playWrong();
    canvas.classList.remove('shake');
    void canvas.offsetWidth;
    canvas.classList.add('shake');
  }
}

function onHint() {
  unlockAudio();
  const pick = useHint(state);
  if (pick) playHint();
}

function onToggleLens() {
  state.lensOn = !state.lensOn;
  el('btn-lens').classList.toggle('on', state.lensOn);
  lens.classList.toggle('hidden', !state.lensOn);
}

function onHover(x, y) {
  hover = { x, y };
}

// --- input ----------------------------------------------------------------
attachInput(canvas, lens, state, {
  unlockAudio,
  onMark,
  onHint,
  onToggleLens,
  onRestart: () => selectScene(state.sceneIndex),
  onMenu: showMenu,
  onSelectScene: selectScene,
  onNextScene: nextScene,
  onReplay: () => selectScene(0),
  onHover,
});

el('btn-hint').addEventListener('click', onHint);
el('btn-lens').addEventListener('click', onToggleLens);
el('btn-menu').addEventListener('click', showMenu);
btnNext.addEventListener('click', nextScene);
btnReplay.addEventListener('click', () => selectScene(0));
el('btn-restart').addEventListener('click', () => selectScene(state.sceneIndex));

// --- HUD + loop -----------------------------------------------------------
function updateHud() {
  const scene = sceneOf(state);
  sceneTitle.textContent = scene.name + ' — cari 7 perbedaan';
  hudTime.textContent = formatTime(state.elapsed);
  hudScore.textContent = formatRupiah(state.score);
  hudLeft.textContent = 'Sisa ' + remaining(state) + ' dari 7';
  hudHints.textContent = 'Hint: ' + state.hintsLeft + ' (H)';
  toast.textContent = state.message || '';
  toast.classList.toggle('show', Boolean(state.message));
}

function frame(now) {
  tick(state, now);
  updateHud();
  const scene = sceneOf(state);
  drawPanels(ctx, scene, state.found, {
    now,
    hint: state.hintPulse,
    foundAt,
    cursor: state.keyboardMode && state.screen === 'play'
      ? { ...state.cursor, visible: true }
      : null,
  });
  if (state.lensOn && hover.x !== null && state.screen === 'play') {
    const rect = canvas.getBoundingClientRect();
    lens.style.left = Math.min(Math.max(hover.x - rect.left - 80, 0), rect.width - 160) + 'px';
    lens.style.top = Math.min(Math.max(hover.y - rect.top - 80, 0), rect.height - 160) + 'px';
    lens.classList.remove('hidden');
    drawLens(lens, canvas, hover.x, hover.y);
  } else {
    lens.classList.add('hidden');
  }
  requestAnimationFrame(frame);
}

// --- start ----------------------------------------------------------------
const staged = applyShot(state);
if (state.screen === 'sceneDone' || state.screen === 'allDone') {
  showDone();
} else if (!staged || state.screen === 'menu') {
  showMenu();
} else {
  // a staged play shot starts straight in the game: hide both overlays
  overlayMenu.classList.add('hidden');
  overlayDone.classList.add('hidden');
}
updateHud();
requestAnimationFrame(frame);

// for play-testing from the console and the screenshot runs
window.__game = { state, SCENES, selectScene, showMenu };
