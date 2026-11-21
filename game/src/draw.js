// draw.js — small canvas helpers shared by the three morning scenes.
// Every helper draws one primitive in the scene's own 600x440 space.

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
}

export function poly(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function text(ctx, str, x, y, size, fill, align, weight) {
  ctx.font = (weight || 'bold') + ' ' + size + 'px system-ui, sans-serif';
  ctx.fillStyle = fill;
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

export function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 310);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 600, 310);
}

export function cloud(ctx, x, y, s) {
  circle(ctx, x, y, 16 * s, '#ffffff');
  circle(ctx, x + 16 * s, y - 6 * s, 13 * s, '#ffffff');
  circle(ctx, x + 32 * s, y, 15 * s, '#ffffff');
  rect(ctx, x - 14 * s, y, 60 * s, 12 * s, '#ffffff');
}

export function sun(ctx, x, y, withRays) {
  if (withRays) {
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      line(ctx, x + Math.cos(a) * 38, y + Math.sin(a) * 38,
        x + Math.cos(a) * 52, y + Math.sin(a) * 52, '#f5a623', 4);
    }
  }
  circle(ctx, x, y, 30, '#ffd23e');
  circle(ctx, x, y, 30, 'rgba(255, 210, 62, 0.35)');
  circle(ctx, x, y, 24, '#ffe27a');
}
