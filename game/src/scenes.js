// scenes.js — the three bright morning scenes of "Pasar Pagi — Cari Bedanya".
// Each scene draws itself twice: once plain (left panel) and once with its 7
// differences applied (right panel). A difference is a data record — id, spot
// (x, y, radius in the 600x440 scene space) and a label — plus a branch inside
// the scene's draw() that paints the changed version when its id is in `diffs`.
// All art is drawn here with canvas primitives: no image, font or sound asset.

import { rect, circle, ellipse, line, poly, text, roundRect, sky, cloud, sun } from './draw.js';

function grassTuft(ctx, x, y) {
  line(ctx, x - 6, y, x - 9, y - 10, '#3f9e4d', 2);
  line(ctx, x, y, x, y - 12, '#3f9e4d', 2);
  line(ctx, x + 6, y, x + 9, y - 10, '#3f9e4d', 2);
}

function bird(ctx, x, y) {
  line(ctx, x - 7, y, x, y - 5, '#333333', 2);
  line(ctx, x, y - 5, x + 7, y, '#333333', 2);
}

function stripedAwning(ctx, x, y, w, colors) {
  const n = colors.length;
  const sw = w / n;
  for (let i = 0; i < n; i++) {
    poly(ctx, [[x + i * sw, y], [x + (i + 1) * sw, y], [x + (i + 1) * sw - 6, y + 34], [x + i * sw - 6, y + 34]], colors[i]);
  }
  line(ctx, x - 4, y + 34, x + w - 4, y + 34, '#5d3a1a', 3);
}

function drawPasar(ctx, diffs) {
  // --- morning sky, sun, clouds, hills, rooftops ---
  sky(ctx, '#a8dcff', '#fff0b8');
  sun(ctx, 520, 58, !diffs.has('sun'));
  cloud(ctx, 70, 52, 1);
  cloud(ctx, 250, 38, 0.8);
  cloud(ctx, 400, 78, 0.7);
  ellipse(ctx, 300, 330, 420, 90, '#8fce7a');
  ellipse(ctx, 80, 320, 200, 70, '#7cc46a');
  // distant rooftops
  poly(ctx, [[30, 240], [70, 205], [110, 240]], '#c96f4a');
  rect(ctx, 38, 240, 64, 26, '#f2d8a7');
  poly(ctx, [[140, 240], [185, 200], [230, 240]], '#b85c3e');
  rect(ctx, 148, 240, 66, 26, '#f7e3b5');
  poly(ctx, [[470, 240], [510, 208], [550, 240]], '#c96f4a');
  rect(ctx, 478, 240, 64, 26, '#f2d8a7');
  // wire with birds across the sky
  line(ctx, 15, 30, 585, 30, '#555555', 2);
  bird(ctx, 150, 28);
  bird(ctx, 260, 28);
  if (diffs.has('bird')) bird(ctx, 380, 28);
  // --- market floor ---
  rect(ctx, 0, 300, 600, 140, '#e9c88f');
  rect(ctx, 0, 300, 600, 8, '#d9b478');
  for (let i = 0; i < 14; i++) circle(ctx, 30 + i * 42, 415 + (i % 3) * 6, 3, '#c9a468');

  // --- stall A: fruit, left (x 50..250) ---
  rect(ctx, 55, 200, 8, 110, '#6b4423');
  rect(ctx, 237, 200, 8, 110, '#6b4423');
  const awningA = ['#d23c2e', '#ffffff', '#d23c2e', '#ffffff', '#d23c2e', '#ffffff', '#d23c2e', '#ffffff'];
  if (diffs.has('awning')) awningA[4] = '#2fae5f';
  stripedAwning(ctx, 48, 192, 204, awningA);
  rect(ctx, 48, 296, 204, 40, '#8a5a2b');
  rect(ctx, 48, 296, 204, 8, '#a06a35');
  // baskets of fruit on the counter
  ellipse(ctx, 102, 292, 34, 10, '#7a4a21');
  const oranges = diffs.has('orange') ? 5 : 6;
  const orangeSpots = [[84, 282], [100, 278], [116, 282], [92, 288], [108, 288], [100, 270]];
  for (let i = 0; i < oranges; i++) {
    circle(ctx, orangeSpots[i][0], orangeSpots[i][1], 9, '#ff8c1a');
    circle(ctx, orangeSpots[i][0] - 3, orangeSpots[i][1] - 3, 3, '#ffb35c');
  }
  ellipse(ctx, 168, 292, 30, 10, '#7a4a21');
  circle(ctx, 152, 280, 9, '#e63946');
  circle(ctx, 168, 276, 9, '#e63946');
  circle(ctx, 184, 280, 9, '#e63946');
  circle(ctx, 160, 288, 9, '#e63946');
  circle(ctx, 176, 288, 9, '#e63946');
  // bananas
  poly(ctx, [[205, 292], [225, 278], [240, 288], [222, 294]], '#ffd23e');
  poly(ctx, [[208, 294], [228, 284], [238, 292], [224, 297]], '#f5b81d');
  // vendor behind the counter
  rect(ctx, 118, 238, 54, 62, '#3a7bd5');
  circle(ctx, 145, 214, 17, '#f2c09a');
  circle(ctx, 139, 212, 2, '#222222');
  circle(ctx, 151, 212, 2, '#222222');
  // straw hat (yellow) or red cap on the right panel
  if (diffs.has('hat')) {
    poly(ctx, [[128, 202], [162, 202], [156, 190], [134, 190]], '#d23c2e');
    rect(ctx, 126, 200, 38, 5, '#a82a20');
  } else {
    ellipse(ctx, 145, 200, 24, 7, '#f2c14e');
    poly(ctx, [[132, 200], [158, 200], [152, 184], [138, 184]], '#e8b23a');
  }
  // price board
  roundRect(ctx, 58, 250, 74, 26, 5, '#fffbe8');
  rect(ctx, 58, 250, 74, 26, 'rgba(0,0,0,0)');
  text(ctx, diffs.has('price') ? 'Rp6.000' : 'Rp5.000', 95, 264, 13, '#333333');
  text(ctx, 'JERUK', 95, 240, 11, '#5d3a1a');

  // --- stall B: vegetables, right (x 340..560) ---
  rect(ctx, 348, 200, 8, 110, '#6b4423');
  rect(ctx, 544, 200, 8, 110, '#6b4423');
  stripedAwning(ctx, 340, 192, 212, ['#2b6cb0', '#ffffff', '#2b6cb0', '#ffffff', '#2b6cb0', '#ffffff', '#2b6cb0', '#ffffff']);
  rect(ctx, 340, 296, 212, 40, '#8a5a2b');
  rect(ctx, 340, 296, 212, 8, '#a06a35');
  ellipse(ctx, 382, 292, 30, 10, '#7a4a21');
  circle(ctx, 368, 280, 10, '#4caf50');
  circle(ctx, 386, 276, 10, '#66bb6a');
  circle(ctx, 396, 284, 10, '#43a047');
  poly(ctx, [[438, 292], [448, 272], [458, 292]], '#ff7f2a');
  poly(ctx, [[458, 292], [468, 272], [478, 292]], '#ff7f2a');
  line(ctx, 448, 272, 448, 264, '#3f9e4d', 3);
  line(ctx, 468, 272, 468, 264, '#3f9e4d', 3);
  ellipse(ctx, 512, 292, 28, 10, '#7a4a21');
  circle(ctx, 500, 282, 5, '#d23c2e');
  circle(ctx, 512, 278, 5, '#d23c2e');
  circle(ctx, 524, 282, 5, '#d23c2e');
  circle(ctx, 506, 288, 5, '#e05252');
  circle(ctx, 518, 288, 5, '#e05252');

  // --- cat on a crate between the stalls ---
  rect(ctx, 296, 336, 42, 30, '#b07a3f');
  line(ctx, 296, 348, 338, 348, '#8a5a2b', 2);
  if (!diffs.has('cat')) {
    ellipse(ctx, 317, 330, 16, 9, '#f2a541');
    circle(ctx, 330, 322, 8, '#f2a541');
    poly(ctx, [[325, 316], [328, 308], [331, 315]], '#f2a541');
    poly(ctx, [[332, 315], [336, 308], [337, 316]], '#f2a541');
    line(ctx, 303, 328, 292, 318, '#f2a541', 3);
    circle(ctx, 332, 321, 1.5, '#222222');
  }
  // rice sacks and buckets on the floor
  ellipse(ctx, 272, 372, 22, 16, '#e8dcc0');
  ellipse(ctx, 272, 360, 22, 12, '#f2e8d0');
  rect(ctx, 566, 352, 22, 26, '#7a7a7a');
  rect(ctx, 566, 352, 22, 6, '#5d5d5d');
  // a chicken pecking at the floor, a basket of greens, fallen oranges
  ellipse(ctx, 452, 396, 16, 11, '#ffffff');
  circle(ctx, 466, 386, 7, '#ffffff');
  poly(ctx, [[470, 384], [477, 387], [470, 390]], '#ff8c1a');
  circle(ctx, 468, 384, 1.5, '#222222');
  line(ctx, 446, 406, 444, 414, '#ff8c1a', 2);
  line(ctx, 456, 406, 458, 414, '#ff8c1a', 2);
  ellipse(ctx, 66, 398, 26, 9, '#7a4a21');
  circle(ctx, 56, 390, 7, '#4caf50');
  circle(ctx, 66, 386, 7, '#66bb6a');
  circle(ctx, 76, 390, 7, '#43a047');
  circle(ctx, 336, 406, 7, '#ff8c1a');
  circle(ctx, 350, 410, 7, '#ff8c1a');
  circle(ctx, 322, 410, 6, '#ff8c1a');
  grassTuft(ctx, 30, 400);
  grassTuft(ctx, 580, 405);
  grassTuft(ctx, 200, 425);
  grassTuft(ctx, 430, 425);
}

function drawWarung(ctx, diffs) {
  // --- warm wall, floor, morning window ---
  rect(ctx, 0, 0, 600, 330, '#f7e8c8');
  rect(ctx, 0, 330, 600, 110, '#c89a67');
  for (let i = 0; i < 8; i++) line(ctx, 0, 350 + i * 11, 600, 350 + i * 11, '#b3854f', 1);
  // window with the morning outside
  rect(ctx, 36, 36, 158, 134, '#8a5a2b');
  rect(ctx, 44, 44, 142, 118, '#bfe6ff');
  circle(ctx, 160, 70, 18, '#ffd23e');
  ellipse(ctx, 120, 130, 60, 22, '#8fce7a');
  ellipse(ctx, 170, 140, 50, 18, '#7cc46a');
  line(ctx, 115, 44, 115, 162, '#8a5a2b', 4);
  line(ctx, 44, 103, 186, 103, '#8a5a2b', 4);
  // light rays from the window
  poly(ctx, [[60, 170], [130, 170], [220, 330], [150, 330]], 'rgba(255, 240, 170, 0.35)');
  // --- menu board ---
  roundRect(ctx, 246, 36, 190, 96, 8, '#2f5d3a');
  rect(ctx, 246, 36, 190, 96, 'rgba(0,0,0,0)');
  text(ctx, 'MENU PAGI', 341, 56, 15, '#ffe9a8');
  text(ctx, 'KOPI  ' + (diffs.has('menu') ? 'Rp9.000' : 'Rp8.000'), 341, 82, 14, '#ffffff');
  text(ctx, 'TEH   Rp5.000', 341, 104, 14, '#ffffff');
  text(ctx, 'PISANG GORENG  Rp4.000', 341, 124, 11, '#d8e8c8');
  // --- wall clock ---
  circle(ctx, 482, 62, 27, '#fffbe8');
  circle(ctx, 482, 62, 27, 'rgba(0,0,0,0)');
  line(ctx, 482, 62, 482, 62, '#333333', 1);
  ctx.beginPath(); ctx.arc(482, 62, 27, 0, Math.PI * 2); ctx.strokeStyle = '#5d3a1a'; ctx.lineWidth = 4; ctx.stroke();
  if (diffs.has('clock')) {
    line(ctx, 482, 62, 482, 44, '#333333', 3); // 08:00 — minute hand up
    line(ctx, 482, 62, 470, 69, '#333333', 3); // hour hand at 8
  } else {
    line(ctx, 482, 62, 482, 44, '#333333', 3); // 07:00 — minute hand up
    line(ctx, 482, 62, 475, 74, '#333333', 3); // hour hand at 7
  }
  circle(ctx, 482, 62, 3, '#333333');
  // --- shelf with jars ---
  rect(ctx, 428, 150, 150, 10, '#8a5a2b');
  roundRect(ctx, 440, 118, 26, 32, 4, '#d8b25c');
  roundRect(ctx, 478, 112, 26, 38, 4, '#a8642e');
  roundRect(ctx, 516, 120, 26, 30, 4, '#7a4a21');
  text(ctx, 'GULA', 453, 134, 9, '#fffbe8');
  text(ctx, 'KOPI', 491, 131, 9, '#fffbe8');
  // --- hanging lamps ---
  line(ctx, 250, 0, 250, 34, '#5d3a1a', 2);
  poly(ctx, [[238, 34], [262, 34], [254, 52], [246, 52]], '#f5a623');
  circle(ctx, 250, 54, 6, '#ffe27a');
  line(ctx, 400, 0, 400, 34, '#5d3a1a', 2);
  poly(ctx, [[388, 34], [412, 34], [404, 52], [396, 52]], '#f5a623');
  circle(ctx, 400, 54, 6, '#ffe27a');
  // --- counter ---
  rect(ctx, 36, 252, 528, 88, '#8a5a2b');
  rect(ctx, 36, 252, 528, 10, '#a06a35');
  rect(ctx, 36, 330, 528, 10, '#6b4423');
  text(ctx, 'WARUNG KOPI PAGI', 300, 322, 13, '#ffe9a8');
  // kettle with steam
  ellipse(ctx, 120, 246, 34, 20, '#9aa5ad');
  poly(ctx, [[150, 238], [172, 228], [172, 238], [152, 246]], '#9aa5ad');
  circle(ctx, 120, 224, 6, '#7a858d');
  if (!diffs.has('steam')) {
    ctx.beginPath();
    ctx.moveTo(120, 216);
    ctx.quadraticCurveTo(110, 200, 120, 188);
    ctx.quadraticCurveTo(130, 176, 120, 164);
    ctx.strokeStyle = 'rgba(120, 120, 120, 0.55)';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(136, 216);
    ctx.quadraticCurveTo(128, 202, 136, 192);
    ctx.strokeStyle = 'rgba(120, 120, 120, 0.4)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  // cups on the counter
  const cups = diffs.has('cup') ? 2 : 3;
  const cupX = [222, 272, 322];
  for (let i = 0; i < cups; i++) {
    roundRect(ctx, cupX[i] - 12, 232, 24, 18, 3, '#ffffff');
    ellipse(ctx, cupX[i], 232, 12, 4, '#6b4423');
    rect(ctx, cupX[i] + 12, 238, 6, 8, '#ffffff');
  }
  // newspaper on the counter
  poly(ctx, [[380, 250], [440, 246], [442, 236], [384, 240]], '#f2f2f2');
  line(ctx, 392, 244, 432, 241, '#999999', 1);
  line(ctx, 392, 247, 420, 245, '#999999', 1);
  // coffee sack on the floor
  ellipse(ctx, 60, 392, 26, 20, '#c9a468');
  ellipse(ctx, 60, 378, 26, 14, '#d9bc84');
  text(ctx, 'KOPI', 60, 380, 10, '#5d3a1a');
  // --- stools in front of the counter ---
  const stools = diffs.has('stool') ? 3 : 4;
  const stoolX = [120, 220, 320, 420];
  for (let i = 0; i < stools; i++) {
    rect(ctx, stoolX[i] - 4, 372, 8, 34, '#6b4423');
    ellipse(ctx, stoolX[i], 368, 26, 8, '#a8642e');
  }
  // --- bench with a sleeping cat, right ---
  rect(ctx, 468, 300, 116, 12, '#8a5a2b');
  rect(ctx, 474, 312, 8, 30, '#6b4423');
  rect(ctx, 570, 312, 8, 30, '#6b4423');
  if (!diffs.has('cat')) {
    ellipse(ctx, 526, 294, 26, 10, '#e8e8e8');
    circle(ctx, 550, 290, 9, '#e8e8e8');
    poly(ctx, [[544, 284], [546, 276], [550, 283]], '#e8e8e8');
    line(ctx, 502, 292, 488, 284, '#e8e8e8', 4);
  }
  // --- potted plant, far right ---
  poly(ctx, [[534, 372], [562, 372], [556, 396], [540, 396]], '#c96f4a');
  line(ctx, 548, 372, 548, 332, '#3f9e4d', 3);
  ellipse(ctx, 536, 336, 12, 8, '#4caf50');
  ellipse(ctx, 560, 340, 12, 8, '#43a047');
  ellipse(ctx, 548, 326, 12, 8, '#66bb6a');
  const flowers = diffs.has('flower') ? 2 : 3;
  const flowerSpots = [[536, 330], [560, 334], [548, 320]];
  for (let i = 0; i < flowers; i++) {
    circle(ctx, flowerSpots[i][0], flowerSpots[i][1], 5, '#ff6b9d');
    circle(ctx, flowerSpots[i][0], flowerSpots[i][1], 2, '#ffd23e');
  }
}

function drawStasiun(ctx, diffs) {
  // --- morning sky, sun, hills, town ---
  sky(ctx, '#a8dcff', '#ffe9a8');
  sun(ctx, 80, 58, true);
  cloud(ctx, 200, 48, 1);
  cloud(ctx, 420, 36, 0.8);
  cloud(ctx, 520, 84, 0.7);
  ellipse(ctx, 300, 320, 430, 80, '#8fce7a');
  poly(ctx, [[360, 240], [400, 205], [440, 240]], '#b85c3e');
  rect(ctx, 368, 240, 64, 22, '#f2d8a7');
  poly(ctx, [[460, 240], [495, 210], [530, 240]], '#c96f4a');
  rect(ctx, 468, 240, 54, 22, '#f7e3b5');
  // --- station clock on a pole ---
  rect(ctx, 296, 108, 8, 90, '#5d5d5d');
  circle(ctx, 300, 88, 25, '#fffbe8');
  ctx.beginPath(); ctx.arc(300, 88, 25, 0, Math.PI * 2); ctx.strokeStyle = '#333333'; ctx.lineWidth = 4; ctx.stroke();
  if (diffs.has('clock')) {
    line(ctx, 300, 88, 282, 88, '#333333', 3); // 06:45 — minute hand at 9
    line(ctx, 300, 88, 290, 104, '#333333', 3); // hour hand near 7
  } else {
    line(ctx, 300, 88, 300, 106, '#333333', 3); // 06:30 — minute hand at 6
    line(ctx, 300, 88, 294, 102, '#333333', 3); // hour hand between 6 and 7
  }
  circle(ctx, 300, 88, 3, '#333333');
  // --- train on the tracks ---
  rect(ctx, 0, 262, 600, 16, '#4a4a4a');
  for (let i = 0; i < 12; i++) rect(ctx, 20 + i * 50, 262, 26, 16, '#333333');
  rect(ctx, 40, 180, 520, 84, '#d23c2e');
  rect(ctx, 40, 180, 520, 22, '#f2f2f2');
  rect(ctx, 40, 248, 520, 16, '#8c1f16');
  // train windows: 4 lit, or 3 lit on the right panel
  const litWindows = diffs.has('window') ? 3 : 4;
  for (let i = 0; i < 4; i++) {
    const wx = 80 + i * 110;
    rect(ctx, wx, 208, 62, 30, i < litWindows ? '#ffe27a' : '#5d6b7a');
    line(ctx, wx + 31, 208, wx + 31, 238, '#d23c2e', 3);
  }
  // door + wheels
  rect(ctx, 540, 202, 20, 62, '#8c1f16');
  circle(ctx, 110, 268, 14, '#222222');
  circle(ctx, 300, 268, 14, '#222222');
  circle(ctx, 490, 268, 14, '#222222');
  // --- sign board: train number ---
  roundRect(ctx, 58, 118, 124, 36, 6, '#2b3a55');
  text(ctx, diffs.has('sign') ? 'KA 102' : 'KA 101', 120, 130, 15, '#ffffff');
  text(ctx, 'JAKARTA', 120, 146, 10, '#ffd23e');
  // --- signal light pole, right ---
  rect(ctx, 556, 150, 6, 130, '#5d5d5d');
  circle(ctx, 559, 168, 12, '#333333');
  circle(ctx, 559, 164, 5, diffs.has('signal') ? '#e63946' : '#3f9e4d');
  circle(ctx, 559, 176, 5, '#333333');
  // --- platform ---
  rect(ctx, 0, 300, 600, 140, '#c9c2b4');
  rect(ctx, 0, 300, 600, 8, '#b0a894');
  line(ctx, 0, 300, 600, 300, '#ffe27a', 4);
  // --- bench with newspaper ---
  rect(ctx, 420, 296, 120, 12, '#8a5a2b');
  rect(ctx, 428, 308, 8, 28, '#6b4423');
  rect(ctx, 524, 308, 8, 28, '#6b4423');
  if (!diffs.has('paper')) {
    poly(ctx, [[448, 296], [492, 294], [494, 286], [450, 288]], '#f2f2f2');
    line(ctx, 456, 291, 488, 289, '#999999', 1);
  }
  // --- suitcase by the bench: red or blue ---
  roundRect(ctx, 372, 336, 34, 28, 5, diffs.has('case') ? '#2b6cb0' : '#d23c2e');
  rect(ctx, 382, 330, 14, 8, '#5d3a1a');
  line(ctx, 372, 350, 406, 350, '#8c1f16', 2);
  // --- pigeons on the platform ---
  ellipse(ctx, 200, 382, 12, 8, '#8d9bb5');
  circle(ctx, 210, 374, 6, '#8d9bb5');
  circle(ctx, 212, 372, 1.5, '#222222');
  if (!diffs.has('pigeon')) {
    ellipse(ctx, 240, 384, 12, 8, '#aab4c8');
    circle(ctx, 250, 376, 6, '#aab4c8');
    circle(ctx, 252, 374, 1.5, '#222222');
  }
  // --- lamp posts, kiosk, luggage cart ---
  rect(ctx, 60, 210, 6, 92, '#5d5d5d');
  circle(ctx, 63, 206, 8, '#ffe27a');
  rect(ctx, 540, 320, 44, 40, '#f2d8a7');
  poly(ctx, [[536, 320], [588, 320], [580, 300], [544, 300]], '#d23c2e');
  text(ctx, 'KORAN', 562, 340, 10, '#5d3a1a');
  rect(ctx, 150, 396, 60, 8, '#7a7a7a');
  circle(ctx, 162, 408, 7, '#222222');
  circle(ctx, 198, 408, 7, '#222222');
  rect(ctx, 156, 372, 48, 24, '#2b6cb0');
  grassTuft(ctx, 30, 425);
  grassTuft(ctx, 330, 425);
}

// --- catalogue: name, draw, and the 7 differences of each scene ---
export const SCENES = [
  {
    id: 'pasar',
    name: 'Pasar Pagi',
    tagline: 'Pasar pagi yang ramai — 7 perbedaan tersembunyi di antara lapak buah dan sayur.',
    draw: drawPasar,
    diffs: [
      { id: 'sun', x: 520, y: 58, r: 42, label: 'Sinar matahari' },
      { id: 'bird', x: 380, y: 28, r: 20, label: 'Burung di kabel' },
      { id: 'awning', x: 150, y: 209, r: 26, label: 'Garis tenda lapak' },
      { id: 'hat', x: 145, y: 205, r: 24, label: 'Topi pedagang' },
      { id: 'price', x: 95, y: 263, r: 24, label: 'Harga jeruk' },
      { id: 'orange', x: 100, y: 282, r: 22, label: 'Jeruk di keranjang' },
      { id: 'cat', x: 317, y: 326, r: 26, label: 'Kucing di peti' },
    ],
  },
  {
    id: 'warung',
    name: 'Warung Kopi Pagi',
    tagline: 'Warung kopi di pagi hari — 7 perbedaan di antara uap ketel dan cangkir.',
    draw: drawWarung,
    diffs: [
      { id: 'steam', x: 122, y: 196, r: 24, label: 'Uap ketel' },
      { id: 'menu', x: 341, y: 82, r: 30, label: 'Harga kopi di papan' },
      { id: 'clock', x: 482, y: 62, r: 30, label: 'Jarum jam dinding' },
      { id: 'cup', x: 322, y: 241, r: 18, label: 'Cangkir ketiga' },
      { id: 'cat', x: 526, y: 294, r: 26, label: 'Kucing di bangku' },
      { id: 'flower', x: 548, y: 330, r: 22, label: 'Bunga di pot' },
      { id: 'stool', x: 420, y: 368, r: 22, label: 'Bangku keempat' },
    ],
  },
  {
    id: 'stasiun',
    name: 'Stasiun Pagi',
    tagline: 'Stasiun di pagi hari — 7 perbedaan di antara kereta dan peron.',
    draw: drawStasiun,
    diffs: [
      { id: 'clock', x: 300, y: 88, r: 28, label: 'Jam stasiun' },
      { id: 'sign', x: 120, y: 136, r: 26, label: 'Nomor kereta' },
      { id: 'window', x: 441, y: 223, r: 24, label: 'Jendela kereta' },
      { id: 'signal', x: 559, y: 168, r: 22, label: 'Lampu sinyal' },
      { id: 'paper', x: 470, y: 292, r: 20, label: 'Koran di bangku' },
      { id: 'case', x: 389, y: 350, r: 24, label: 'Warna koper' },
      { id: 'pigeon', x: 244, y: 380, r: 18, label: 'Merpati kedua' },
    ],
  },
];
