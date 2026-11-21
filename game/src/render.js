// render.js — paints the two panels side by side on one canvas, the found
// markers on both panels, the hint pulse, the keyboard crosshair and the
// magnifier lens. Scene art itself lives in scenes.js.

import { SCENES } from './scenes.js';

export const PANEL_W = 600;
export const PANEL_H = 440;
export const PANELS = [
  { x: 10, y: 50 },
  { x: 630, y: 50 },
];
export const CANVAS_W = 1240;
export const CANVAS_H = 560;

function panelLabel(ctx, x, y, label, sub) {
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillStyle = '#3a2c14';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x, y);
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillStyle = '#7a6a45';
  ctx.fillText(sub, x + ctx.measureText(label).width + 12, y);
}

function drawMarker(ctx, px, py, x, y, r, now, foundAt) {
  const age = now - (foundAt || 0);
  const pop = age < 250 ? 0.6 + (age / 250) * 0.4 : 1;
  const rr = r * pop;
  ctx.beginPath();
  ctx.arc(px + x, py + y, rr, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 183, 0, 0.18)';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#ffb700';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(px + x, py + y, rr + 6, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 183, 0, 0.65)';
  ctx.stroke();
  // a small tick inside the ring
  ctx.beginPath();
  ctx.moveTo(px + x - rr * 0.4, py + y);
  ctx.lineTo(px + x - rr * 0.1, py + y + rr * 0.35);
  ctx.lineTo(px + x + rr * 0.45, py + y - rr * 0.35);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#b97d00';
  ctx.lineCap = 'round';
  ctx.stroke();
}

function drawHintPulse(ctx, px, py, x, y, now) {
  const phase = (now % 700) / 700;
  const r = 18 + phase * 26;
  ctx.beginPath();
  ctx.arc(px + x, py + y, r, 0, Math.PI * 2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(43, 108, 176, ' + (0.9 - phase * 0.7) + ')';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(px + x, py + y, 10, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(43, 108, 176, 0.25)';
  ctx.fill();
}

export function drawPanels(ctx, scene, found, opts) {
  const now = (opts && opts.now) || performance.now();
  const leftDiffs = new Set();
  const rightDiffs = new Set(scene.diffs.map((d) => d.id));
  const showAll = opts && opts.showAll;

  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#fdf6e3';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  panelLabel(ctx, PANELS[0].x, 26, 'GAMBAR KIRI', '— yang asli');
  panelLabel(ctx, PANELS[1].x, 26, 'GAMBAR KANAN', '— ada 7 perbedaan');

  for (let p = 0; p < 2; p++) {
    const origin = PANELS[p];
    ctx.save();
    ctx.beginPath();
    ctx.rect(origin.x, origin.y, PANEL_W, PANEL_H);
    ctx.clip();
    ctx.translate(origin.x, origin.y);
    scene.draw(ctx, p === 0 ? leftDiffs : rightDiffs);
    ctx.restore();
    ctx.strokeStyle = '#8a6d3b';
    ctx.lineWidth = 3;
    ctx.strokeRect(origin.x, origin.y, PANEL_W, PANEL_H);
    // markers for found differences, on both panels
    for (const d of scene.diffs) {
      if (found.has(d.id) || showAll) {
        drawMarker(ctx, origin.x, origin.y, d.x, d.y, d.r,
          now, opts && opts.foundAt ? opts.foundAt[d.id] : 0);
      }
    }
    // hint pulse only on the right panel
    if (opts && opts.hint && p === 1) {
      drawHintPulse(ctx, origin.x, origin.y, opts.hint.x, opts.hint.y, now);
    }
  }

  // keyboard crosshair
  if (opts && opts.cursor && opts.cursor.visible) {
    const c = opts.cursor;
    const origin = PANELS[c.panel];
    const cx = origin.x + c.x;
    const cy = origin.y + c.y;
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#d23c2e';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy);
    ctx.lineTo(cx + 20, cy);
    ctx.moveTo(cx, cy - 20);
    ctx.lineTo(cx, cy + 20);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#d23c2e';
    ctx.stroke();
  }

  // bottom strip: scene name and the differences found so far
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillStyle = '#3a2c14';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(scene.name, 10, 522);
  const names = scene.diffs.filter((d) => found.has(d.id)).map((d) => d.label);
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillStyle = '#7a6a45';
  const line = names.length
    ? 'Ketemu: ' + names.join('  •  ')
    : 'Belum ada yang ketemu — klik perbedaan yang kamu lihat di gambar kanan atau kiri.';
  ctx.fillText(line.slice(0, 140), 150, 522);
}

export function drawLens(lens, main, mouseX, mouseY) {
  // mouseX/mouseY are CSS pixels over the main canvas; the lens shows a 2x
  // zoom of the panel underneath the pointer.
  const rect = main.getBoundingClientRect();
  const scaleX = main.width / rect.width;
  const scaleY = main.height / rect.height;
  const cx = (mouseX - rect.left) * scaleX;
  const cy = (mouseY - rect.top) * scaleY;
  const lctx = lens.getContext('2d');
  const size = lens.width;
  lctx.clearRect(0, 0, size, size);
  lctx.save();
  lctx.beginPath();
  lctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
  lctx.clip();
  const zoom = 2;
  const src = size / zoom;
  lctx.imageSmoothingEnabled = true;
  lctx.drawImage(main, cx - src / 2, cy - src / 2, src, src, 0, 0, size, size);
  lctx.restore();
  lctx.beginPath();
  lctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
  lctx.lineWidth = 4;
  lctx.strokeStyle = '#3a2c14';
  lctx.stroke();
  lctx.beginPath();
  lctx.moveTo(size / 2 - 8, size / 2);
  lctx.lineTo(size / 2 + 8, size / 2);
  lctx.moveTo(size / 2, size / 2 - 8);
  lctx.lineTo(size / 2, size / 2 + 8);
  lctx.lineWidth = 2;
  lctx.strokeStyle = 'rgba(210, 60, 46, 0.9)';
  lctx.stroke();
}

export function sceneNames() {
  return SCENES.map((s) => s.name);
}
