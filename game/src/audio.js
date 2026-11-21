// audio.js — original sounds made with the Web Audio API: no audio files.
// A short pluck on a find, a low buzz on a wrong click, a little arpeggio
// when a scene is finished, and a soft tick on a plain click.

let ctx = null;

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, at, dur, type, vol) {
  const ac = ensure();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ac.currentTime + at);
  gain.gain.exponentialRampToValueAtTime(vol || 0.12, ac.currentTime + at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + at + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + at);
  osc.stop(ac.currentTime + at + dur + 0.05);
}

export function playClick() {
  tone(620, 0, 0.06, 'triangle', 0.05);
}

export function playFind() {
  tone(523, 0, 0.14, 'sine', 0.14);
  tone(784, 0.07, 0.2, 'sine', 0.14);
  tone(1047, 0.14, 0.24, 'sine', 0.1);
}

export function playWrong() {
  tone(180, 0, 0.18, 'sawtooth', 0.06);
  tone(140, 0.08, 0.2, 'sawtooth', 0.05);
}

export function playHint() {
  tone(880, 0, 0.12, 'sine', 0.08);
  tone(1175, 0.1, 0.16, 'sine', 0.08);
}

export function playWin() {
  const notes = [523, 659, 784, 1047, 1319];
  notes.forEach((n, i) => tone(n, i * 0.11, 0.28, 'triangle', 0.12));
}

export function unlockAudio() {
  ensure();
}
