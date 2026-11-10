/* MOVE Clip Engine — renders brand-compliant 9:16 animated scenes on canvas + synth SFX.
   All coordinates are in a 1080x1920 design space. */
(function () {
const W = 1080, H = 1920;
const SAFE = { x0: 90, x1: W - 120, y0: 220, y1: H - 420 }; // TikTok/Reels UI-safe content area
const C = {
  RED: '#BE0000', WHITE: '#FFFFFF', BLACK: '#0B1718', PURPLE: '#A331F4', NEUTRAL: '#6D6D6D', NL: '#F2F2F2',
};
function hex(c) { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function mix(a, b, k) { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v * k + B[i] * (1 - k)).toString(16).padStart(2, '0')).join(''); }
const TH = {
  red:   { fg: C.WHITE, sub: mix(C.WHITE, C.RED, .82), acc: C.WHITE, hi: { box: C.BLACK }, motif: C.WHITE, logo: C.WHITE, off: mix(C.WHITE, C.RED, .35), num: C.WHITE, tipBg: C.BLACK, tipFg: C.WHITE, tipHi: C.PURPLE, check: C.WHITE, checkFg: C.RED },
  black: { fg: C.WHITE, sub: mix(C.WHITE, C.BLACK, .72), acc: C.RED, hi: { color: C.PURPLE }, motif: C.RED, logo: C.WHITE, off: mix(C.WHITE, C.BLACK, .25), num: C.RED, tipBg: C.PURPLE, tipFg: C.WHITE, tipHi: C.BLACK, check: C.RED, checkFg: C.WHITE },
  white: { fg: C.BLACK, sub: C.NEUTRAL, acc: C.RED, hi: { color: C.RED }, motif: C.RED, logo: C.BLACK, off: '#D7D7D7', num: C.RED, tipBg: C.BLACK, tipFg: C.WHITE, tipHi: C.PURPLE, check: C.RED, checkFg: C.WHITE },
  grad:  { fg: C.WHITE, sub: mix(C.WHITE, C.BLACK, .78), acc: C.WHITE, hi: { color: C.PURPLE }, motif: C.WHITE, logo: C.WHITE, off: mix(C.WHITE, C.BLACK, .3), num: C.WHITE, tipBg: C.PURPLE, tipFg: C.WHITE, tipHi: C.BLACK, check: C.WHITE, checkFg: C.RED },
};
const BG_NAMES = { red: 'Đỏ MOVE', black: 'Đen', white: 'Trắng', grad: 'Gradient Đen → Đỏ' };
const ART_NAMES = { none: 'Không', scooter: 'Xe điện', tax: 'Cơ quan thuế', store: 'Cửa hàng', plate: 'Biển số', phone: 'Điện thoại + thư', docs: 'Giấy tờ', helmet: 'Mũ bảo hiểm', clock: 'Đồng hồ chờ' };
const WIPE = 0.38;

// ---------- assets
const A = {};
function loadImg(src) { return new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = src; }); }
async function loadAssets() {
  const want = ['500', '600', '700', '900'].map(w => `${w} 40px "Mona Sans"`).concat(['400 40px "Josefin Sans"', '600 40px "Josefin Sans"']);
  let res = null;
  try { res = await Promise.race([Promise.all(want.map(f => document.fonts.load(f, 'Đường ặ'))), new Promise(r => setTimeout(() => r(null), 8000))]); } catch (e) {}
  A.fontsOK = !!res && res.every(x => x && x.length);
  [A.logo, A.motif, A.pattern] = await Promise.all(['assets/logo_white.png', 'assets/motif.png', 'assets/pattern_tile.png'].map(loadImg));
}
const tintCache = new Map();
function tinted(img, color) {
  const k = img.src + color; if (tintCache.has(k)) return tintCache.get(k);
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const x = c.getContext('2d'); x.drawImage(img, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
  tintCache.set(k, c); return c;
}

// ---------- text
const F = {
  label: () => '700 34px "Mona Sans"',
  title: s => `900 ${s}px "Mona Sans"`,
  body: () => '600 52px "Josefin Sans"',
  sub: () => '400 42px "Josefin Sans"',
  item: () => '600 50px "Mona Sans"',
  num: () => '900 56px "Mona Sans"',
  note: () => '400 40px "Josefin Sans"',
  tip: () => '700 46px "Mona Sans"',
};
function sizeOf(font) { return parseInt(font.match(/(\d+)px/)[1]); }
function wrap(ctx, text, font, maxW) {
  ctx.font = font; const lines = [];
  for (const para of String(text).split('\n')) {
    let cur = [];
    for (const w of para.split(/\s+/).filter(Boolean)) {
      const test = cur.concat(w).join(' ');
      if (ctx.measureText(test).width <= maxW || !cur.length) cur.push(w); else { lines.push(cur); cur = [w]; }
    }
    lines.push(cur);
  }
  return lines;
}
function textBlock(ctx, text, font, color, maxW, lh = 1.24, hi = [], hiStyle = null) {
  const lines = wrap(ctx, text, font, maxW), size = sizeOf(font), lhpx = Math.round(size * lh);
  const height = lhpx * (lines.length - 1) + Math.round(size * 1.2);
  const norm = s => s.replace(/[.,!?:;"“”()]/g, '');
  const hiSet = new Set((hi || []).map(norm).filter(Boolean));
  ctx.font = font; const width = Math.max(...lines.map(ws => ctx.measureText(ws.join(' ')).width));
  return {
    height, width, lines: lines.length,
    draw(c, x, y) {
      c.font = font; c.textBaseline = 'top'; const sp = c.measureText(' ').width;
      lines.forEach((ws, i) => {
        let cx = x; const ly = y + i * lhpx;
        ws.forEach(w => {
          const ww = c.measureText(w).width, isHi = hiSet.has(norm(w)) && hiStyle;
          if (isHi && hiStyle.box) { c.fillStyle = hiStyle.box; c.fillRect(cx - 8, ly - size * 0.08, ww + 16, size * 1.22); c.fillStyle = C.WHITE; }
          else c.fillStyle = isHi && hiStyle.color ? hiStyle.color : color;
          c.fillText(w, cx, ly); cx += ww + sp;
        });
      });
    },
  };
}

// ---------- shapes
function rr(c, x0, y0, x1, y1, r, fill, stroke, lw) { c.beginPath(); c.roundRect(x0, y0, x1 - x0, y1 - y0, r); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.lineWidth = lw; c.strokeStyle = stroke; c.stroke(); } }
function poly(c, pts, fill) { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fillStyle = fill; c.fill(); }
function el(c, cx, cy, rx, ry, fill) { c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); c.fillStyle = fill; c.fill(); }
function ln(c, pts, color, w) { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.strokeStyle = color; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(); }
function ctext(c, x, y, s, font, color) { c.font = font; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = color; c.fillText(s, x, y); c.textAlign = 'left'; c.textBaseline = 'top'; }
function drawLogo(c, x, y, w, color, alpha = 1) { const img = tinted(A.logo, color); const h = w * img.height / img.width; c.globalAlpha *= alpha; c.drawImage(img, x, y, w, h); c.globalAlpha /= alpha || 1; return h; }

// ---------- flat illustrations (palette only). Each: {w,h,draw(c, theme)}
const ART = {
  scooter: { w: 720, h: 380, draw(c) {
    for (const x of [150, 560]) { el(c, x, 300, 74, 74, C.BLACK); el(c, x, 300, 40, 40, C.NEUTRAL); el(c, x, 300, 14, 14, C.WHITE); }
    poly(c, [[70, 210], [110, 150], [330, 138], [380, 205], [360, 262], [110, 262]], C.WHITE);
    poly(c, [[150, 262], [300, 262], [250, 300], [150, 300]], mix(C.WHITE, C.RED, .8));
    rr(c, 150, 112, 340, 146, 16, C.BLACK); rr(c, 320, 240, 500, 268, 10, C.WHITE);
    poly(c, [[480, 268], [505, 130], [548, 92], [572, 104], [540, 268]], C.WHITE);
    ln(c, [[560, 220], [562, 300]], C.BLACK, 18); ln(c, [[552, 100], [530, 40]], C.BLACK, 14); ln(c, [[495, 40], [575, 40]], C.BLACK, 14);
    el(c, 578, 120, 16, 12, C.PURPLE); poly(c, [[60, 228], [54, 214], [75, 212]], C.RED);
    rr(c, 40, 228, 104, 262, 6, C.WHITE, C.BLACK, 4); ctext(c, 72, 246, '?', '700 24px "Mona Sans"', C.BLACK);
  } },
  tax: { w: 560, h: 300, draw(c, th) {
    const base = th === TH.white ? C.BLACK : C.WHITE, shade = th === TH.white ? C.NEUTRAL : mix(C.WHITE, C.RED, .8);
    poly(c, [[80, 90], [280, 10], [480, 90]], base); rr(c, 90, 90, 470, 112, 4, shade);
    for (let i = 0; i < 5; i++) rr(c, 112 + i * 72, 118, 140 + i * 72, 240, 6, base);
    rr(c, 70, 240, 490, 262, 4, base); rr(c, 50, 262, 510, 284, 4, shade);
    rr(c, 370, 140, 520, 290, 14, C.WHITE, th === TH.white ? C.BLACK : null, 4);
    [100, 80, 110, 60].forEach((w, i) => rr(c, 392, 170 + i * 26, 392 + w, 182 + i * 26, 6, mix(C.BLACK, C.WHITE, .25)));
    el(c, 515, 145, 30, 30, C.BLACK); ctext(c, 515, 147, '!', '900 36px "Mona Sans"', C.WHITE);
  } },
  store: { w: 620, h: 380, draw(c) {
    rr(c, 40, 120, 580, 370, 10, C.NL); rr(c, 20, 40, 600, 120, 12, C.BLACK);
    for (let i = 0; i < 9; i++) { const x = 30 + i * 62; poly(c, [[x, 120], [x + 62, 120], [x + 58, 175], [x + 4, 175]], i % 2 ? C.WHITE : C.RED); }
    rr(c, 70, 205, 330, 340, 8, mix(C.NEUTRAL, C.WHITE, .3)); poly(c, [[90, 330], [160, 215], [200, 215], [130, 330]], mix(C.WHITE, C.NEUTRAL, .55));
    rr(c, 380, 200, 540, 370, 8, C.BLACK); el(c, 520, 290, 6, 6, C.WHITE); rr(c, 0, 362, 620, 380, 6, mix(C.NEUTRAL, C.WHITE, .5));
    const lw = 200, img = tinted(A.logo, C.WHITE), lh = lw * img.height / img.width; c.drawImage(img, 310 - lw / 2, 80 - lh / 2, lw, lh);
  } },
  plate: { w: 560, h: 320, draw(c) {
    rr(c, 20, 40, 540, 300, 26, C.BLACK); rr(c, 40, 20, 520, 280, 22, C.WHITE, C.BLACK, 8);
    ctext(c, 280, 105, '59-X1', '700 88px "Mona Sans"', C.BLACK); ctext(c, 280, 205, '123.45', '700 88px "Mona Sans"', C.BLACK);
    el(c, 80, 60, 9, 9, C.NEUTRAL); el(c, 480, 60, 9, 9, C.NEUTRAL);
  } },
  phone: { w: 560, h: 380, draw(c) {
    rr(c, 300, 150, 540, 330, 14, C.RED); poly(c, [[300, 160], [420, 250], [540, 160], [540, 150], [300, 150]], mix(C.WHITE, C.RED, .2));
    ln(c, [[300, 158], [420, 248], [540, 158]], C.WHITE, 6);
    rr(c, 60, 10, 270, 370, 34, C.BLACK); rr(c, 76, 30, 254, 350, 22, C.NL); rr(c, 140, 18, 190, 26, 4, mix(C.WHITE, C.BLACK, .3));
    rr(c, 92, 90, 238, 210, 12, C.WHITE); rr(c, 92, 90, 238, 118, [12, 12, 0, 0], C.RED);
    [110, 80, 120].forEach((w, i) => rr(c, 106, 134 + i * 22, 106 + w, 144 + i * 22, 5, mix(C.BLACK, C.WHITE, .3)));
    el(c, 165, 270, 34, 34, C.PURPLE); ln(c, [[150, 270], [162, 283], [183, 258]], C.WHITE, 8);
  } },
  docs: { w: 520, h: 320, draw(c, th) {
    const paper = C.WHITE, line = mix(C.BLACK, C.WHITE, .25), edge = th === TH.white ? C.BLACK : null;
    [[40, 60, -8, '#3B82F6'], [170, 30, 0, null], [300, 60, 8, null]].forEach(([x, y, rot, _], i) => {
      c.save(); c.translate(x + 90, y + 125); c.rotate(rot * Math.PI / 180); c.translate(-90, -125);
      rr(c, 0, 0, 180, 250, 14, i === 0 ? mix(C.PURPLE, C.WHITE, .3) : paper, edge, 4);
      [120, 90, 130, 70, 110].forEach((w, j) => rr(c, 24, 40 + j * 34, 24 + w, 54 + j * 34, 6, i === 0 ? C.WHITE : line));
      c.restore();
    });
    el(c, 440, 70, 36, 36, C.RED); ln(c, [[422, 70], [436, 85], [460, 56]], C.WHITE, 8);
  } },
  helmet: { w: 420, h: 340, draw(c, th) {
    const shell = th === TH.red ? C.WHITE : C.BLACK;
    c.beginPath(); c.moveTo(40, 260); c.bezierCurveTo(30, 60, 380, 40, 390, 230); c.lineTo(390, 260); c.closePath(); c.fillStyle = shell; c.fill();
    poly(c, [[230, 150], [395, 150], [395, 225], [250, 225]], C.PURPLE);
    rr(c, 30, 255, 400, 290, 14, th === TH.red ? mix(C.WHITE, C.RED, .8) : C.NEUTRAL);
    ln(c, [[90, 120], [180, 85]], th === TH.red ? C.RED : C.WHITE, 10);
  } },
  clock: { w: 360, h: 360, draw(c, th) {
    const ring = th === TH.white ? C.BLACK : C.WHITE;
    el(c, 180, 190, 160, 160, ring); el(c, 180, 190, 132, 132, th === TH.red ? C.RED : th === TH.white ? C.WHITE : C.BLACK);
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ln(c, [[180 + Math.cos(a) * 110, 190 + Math.sin(a) * 110], [180 + Math.cos(a) * 122, 190 + Math.sin(a) * 122]], ring, 6); }
    ln(c, [[180, 190], [180, 110]], ring, 12); ln(c, [[180, 190], [240, 220]], C.PURPLE, 10); el(c, 180, 190, 12, 12, C.PURPLE);
    rr(c, 150, 10, 210, 36, 8, ring);
  } },
};

// ---------- motion helpers
const ease = x => { x = Math.max(0, Math.min(1, x)); return 1 - Math.pow(1 - x, 3); };
function bgFill(c, kind) {
  if (kind === 'grad') {
    c.fillStyle = C.BLACK; c.fillRect(0, 0, W, H);
    const g = c.createRadialGradient(W * 1.05, H * 1.02, 0, W * 1.05, H * 1.02, H * 0.95);
    for (let i = 0; i <= 10; i++) { const d = i / 10, k = Math.pow(1 - d, 1.6); g.addColorStop(d, mix(C.RED, C.BLACK, k)); }
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  } else { c.fillStyle = { red: C.RED, black: C.BLACK, white: C.WHITE }[kind] || C.BLACK; c.fillRect(0, 0, W, H); }
}

// ---------- layout
let measureCtx;
function mctx() { if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d'); return measureCtx; }
function wordCount(s) { return String(s || '').split(/\s+/).filter(Boolean).length; }
function sceneWords(s) { return wordCount(s.label) + wordCount(s.title) + wordCount(s.body) + wordCount(s.sub) + wordCount(s.tip) + (s.items || []).reduce((a, it) => a + wordCount(it.t) + wordCount(it.n), 0); }

function layoutScene(s, idx) {
  const c = mctx(), th = TH[s.bg] || TH.black, maxW = SAFE.x1 - SAFE.x0, X = SAFE.x0;
  const els = [], warn = [];
  let t = idx === 0 ? 0.15 : 0.45;
  let y = s.logoBig ? 520 : (s.step ? 430 : 440);
  const push = (o) => { els.push(o); return o; };
  if (s.label) { const b = textBlock(c, s.label.toUpperCase(), F.label(), th.acc, maxW); push({ t0: t, y, h: b.height, draw: (cc, yy) => b.draw(cc, X, yy) }); y += b.height + 16; t += 0.05; }
  if (s.title) {
    let size = s.titleSize, b;
    if (!size) { for (const sz of [104, 96, 88, 80, 72, 64]) { b = textBlock(c, s.title, F.title(sz), th.fg, maxW, 1.15); size = sz; if (b.lines <= 2 || (sz <= 80 && b.lines <= 3)) break; } }
    b = textBlock(c, s.title, F.title(size), th.fg, maxW, 1.15, s.hi, th.hi);
    push({ t0: t, y, h: b.height, draw: (cc, yy) => b.draw(cc, X, yy) }); y += b.height + 40; t += 0.55;
  }
  if (s.body) { const b = textBlock(c, s.body, F.body(), th.fg, maxW, 1.26, s.hi, th.hi); push({ t0: t, y, h: b.height, draw: (cc, yy) => b.draw(cc, X, yy), sfx: 'pop' }); y += b.height + 34; t += 0.5; }
  const items = (s.items || []).filter(it => it.t);
  if (items.length) {
    const style = s.itemStyle || 'num';
    if (style === 'timeline') {
      const ty = y, step = 115;
      items.forEach((it, i) => {
        const b = textBlock(c, it.t, F.item(), th.fg, maxW - 70);
        const t0 = t + i * 0.5;
        push({ t0, y: ty - 6 + i * step, h: b.height, dy: 0, draw: (cc, yy) => b.draw(cc, X + 70, yy), sfx: 'tick' });
      });
      const t0 = t, n = items.length;
      els.push({ t0: t0, y: ty, h: 0, dy: 0, d: 0.01, fx: true, draw: (cc, yy, k, lt) => {
        const kk = ease((lt - t0) / (0.5 * n)); ln(cc, [[X + 20, ty + 20], [X + 20, ty + 20 + (n - 1) * step * kk]], th.off, 4);
        items.forEach((_, i) => { const ti = t0 + i * 0.5; if (lt >= ti) { const r = 14 * ease((lt - ti) / 0.25); el(cc, X + 20, ty + 20 + i * step, r, r, i === n - 1 ? C.RED : th.fg); } });
      } });
      y = ty + (n - 1) * step + 70; t += n * 0.5;
    } else {
      items.forEach((it, i) => {
        const indent = style === 'check' ? 104 : style === 'num' ? 120 : 0;
        const b = textBlock(c, it.t, style === 'check' ? '700 52px "Mona Sans"' : F.item(), th.fg, maxW - indent);
        const nb = it.n ? textBlock(c, it.n, F.note(), th.sub, maxW - indent) : null;
        const t0 = t + i * 0.45, iy = y;
        push({ t0, y: iy, h: b.height, sfx: style === 'check' ? 'ding' : 'tick', draw: (cc, yy, k) => {
          if (style === 'num') { cc.font = F.num(); cc.fillStyle = th.num; cc.textBaseline = 'top'; cc.fillText(String(i + 1).padStart(2, '0'), X, yy - 2); }
          if (style === 'check') { rr(cc, X, yy, X + 64, yy + 64, 14, th.check); if (k > 0.3) ln(cc, k < 0.6 ? [[X + 15, yy + 33], [X + 28, yy + 46]] : [[X + 15, yy + 33], [X + 28, yy + 46], [X + 50, yy + 20]], th.checkFg, 7); }
          b.draw(cc, X + indent, yy);
        } });
        let ny = iy + b.height;
        if (nb) { const ty0 = ny + 2; push({ t0: t0 + 0.1, y: ty0, h: nb.height, draw: (cc, yy) => nb.draw(cc, X + indent, yy) }); ny = ty0 + nb.height; }
        y = ny + (style === 'none' ? 24 : 40);
      });
      t += items.length * 0.45 + 0.1;
    }
  }
  if (s.tip) {
    const b = textBlock(c, s.tip, F.tip(), th.tipFg, maxW - 60, 1.26, s.hi, { color: th.tipHi });
    const ty = y + 6, h = b.height + 44, t0 = t;
    push({ t0, y: ty, h, dy: 0, sfx: 'pop', draw: (cc, yy, k) => { rr(cc, X, yy, X + Math.min(maxW, 60 + b.width), yy + h, 16, th.tipBg); b.draw(cc, X + 30, yy + 24); } });
    y = ty + h + 34; t += 0.5;
  }
  if (s.sub) { const b = textBlock(c, s.sub, F.sub(), th.sub, maxW, 1.3); push({ t0: t, y, h: b.height, draw: (cc, yy) => b.draw(cc, X, yy) }); y += b.height + 30; t += 0.4; }
  // big logo (outro)
  if (s.logoBig) {
    const lw = 540, img = A.logo, lh = lw * img.height / img.width, ly = y + 60, t0 = t + 0.1;
    push({ t0, y: ly, h: lh, d: 0.6, sfx: 'outro', draw: (cc, yy) => drawLogo(cc, (W - lw) / 2, yy, lw, th.logo) });
    y = ly + lh; t = t0 + 0.6;
    if (s.pattern) { addTrack(els, ly + lh + 70, 44, t0 + 0.3, 1.0, C.WHITE, 0, W); y += 120; }
  }
  // illustration
  let artBox = null;
  if (s.art && s.art !== 'none' && ART[s.art]) {
    const a = ART[s.art], trackH = s.pattern && !s.logoBig ? 52 : 0;
    const room = SAFE.y1 - y - trackH;
    const scale = Math.min(1, room / a.h, maxW / a.w);
    if (scale < 0.55) warn.push(`Không đủ chỗ cho hình "${ART_NAMES[s.art]}" — rút gọn chữ hoặc bỏ hình.`);
    else {
      const aw = a.w * scale, ah = a.h * scale, ay = y + Math.max(0, (room - ah) / 2) * (s.art === 'scooter' ? 0 : 1);
      const ride = s.art === 'scooter', t0 = ride ? Math.max(0.9, t - 0.3) : t, ax = s.align === 'right' ? SAFE.x1 - aw : X + (maxW - aw) / 2;
      artBox = { y: ay, h: ah };
      push({ t0, y: ay, h: ah, d: ride ? 1.0 : 0.55, dy: ride ? 0 : 60, sfx: ride ? 'whoosh' : 'pop', draw: (cc, yy, k) => {
        cc.save(); const rx = ride ? -aw - X + (ax + aw + X) * k : ax; cc.translate(ride ? rx : ax, yy); cc.scale(scale, scale);
        if (ride) cc.globalAlpha = 1; a.draw(cc, th); cc.restore();
      }, ride });
      if (trackH) addTrack(els, ay + ah + 6, 46, t0, 1.0, th.motif, X, SAFE.x1);
      y = ay + ah + trackH; t = t0 + (ride ? 1.0 : 0.5);
    }
  } else if (s.pattern && !s.logoBig) { addTrack(els, y + 20, 56, t, 1.1, th.motif, X, SAFE.x1); y += 90; t += 0.6; }
  const lastAppear = t;
  if (y > SAFE.y1 + 2) warn.push(`Nội dung tràn khỏi vùng an toàn ${Math.round(y - SAFE.y1)}px — rút gọn chữ.`);
  const words = sceneWords(s);
  const autoDur = Math.max(3, Math.min(9, Math.max(lastAppear + 1.3, 0.8 + words / 6)));
  return { els, warn, bottom: y, autoDur, words, lastAppear };
}
function addTrack(els, y, h, t0, dur, color, x0, x1) {
  els.push({ t0, y, h, dy: 0, d: 0.01, fx: true, draw: (cc, yy, k, lt) => {
    const kk = ease((lt - t0) / dur); if (kk <= 0) return;
    const img = tinted(A.pattern, color), tw = img.width * h / img.height, w = (x1 - x0) * kk;
    const off = ((lt - t0) * 40) % tw;
    cc.save(); cc.beginPath(); cc.rect(x0, y, w, h); cc.clip();
    for (let x = x0 - off; x < x0 + w; x += tw) cc.drawImage(img, x, y, tw, h);
    cc.restore();
  } });
}

// ---------- timeline
function buildTimeline(scenes) {
  let start = 0; const out = [];
  scenes.forEach((s, i) => {
    const L = layoutScene(s, i); const dur = +s.dur > 0 ? +s.dur : +L.autoDur.toFixed(1);
    out.push({ s, L, start, dur, idx: i }); start += dur;
  });
  return { scenes: out, total: start };
}

function drawScene(c, e, lt, prevBg, opts = {}) {
  const s = e.s, th = TH[s.bg] || TH.black;
  bgFill(c, s.bg);
  if (prevBg && lt < WIPE) {
    const k = ease(lt / WIPE), x = -500 + (W + 900) * k;
    c.save(); c.beginPath(); c.moveTo(x, 0); c.lineTo(W + 10, 0); c.lineTo(W + 10, H); c.lineTo(x - 420, H); c.closePath(); c.clip(); bgFill(c, prevBg); c.restore();
  }
  const fade = Math.max(0, Math.min(1, (e.dur - lt) / 0.22));
  if (!s.logoBig) drawLogo(c, (W - 360) / 2, SAFE.y0 + 10, 360, th.logo);
  c.save(); c.globalAlpha = fade;
  if (s.step) for (let i = 0; i < 4; i++) { const x = SAFE.x0 + i * 74; rr(c, x, 372, x + 58, 380, 4, i + 1 === +s.step ? th.acc : i + 1 < +s.step ? th.fg : th.off); }
  for (const o of e.L.els) {
    if (lt < o.t0) continue;
    const k = ease((lt - o.t0) / (o.d || 0.45)), dy = o.dy === undefined ? 36 : o.dy;
    c.save(); c.globalAlpha = fade * (o.fx || o.ride ? 1 : k); c.textBaseline = 'top';
    o.draw(c, o.y + dy * (1 - k), k, lt); c.restore();
  }
  c.restore();
  if (opts.safe) drawSafe(c);
}
function drawSafe(c) {
  c.save(); c.fillStyle = 'rgba(163,49,244,0.18)';
  c.fillRect(0, 0, W, SAFE.y0); c.fillRect(0, SAFE.y1, W, H - SAFE.y1); c.fillRect(SAFE.x1, SAFE.y0, W - SAFE.x1, SAFE.y1 - SAFE.y0); c.fillRect(0, SAFE.y0, SAFE.x0, SAFE.y1 - SAFE.y0);
  c.setLineDash([14, 10]); c.strokeStyle = '#A331F4'; c.lineWidth = 3; c.strokeRect(SAFE.x0, SAFE.y0, SAFE.x1 - SAFE.x0, SAFE.y1 - SAFE.y0);
  c.font = '600 28px "Mona Sans"'; c.fillStyle = '#A331F4'; c.textBaseline = 'top'; c.fillText('UI TikTok / Reels', 24, SAFE.y1 + 20); c.restore();
}
function renderAt(c, tl, t, opts) {
  t = Math.max(0, Math.min(tl.total - 1e-4, t));
  let i = tl.scenes.findIndex(e => t < e.start + e.dur); if (i < 0) i = tl.scenes.length - 1;
  const e = tl.scenes[i]; if (!e) { c.fillStyle = C.BLACK; c.fillRect(0, 0, W, H); return; }
  drawScene(c, e, t - e.start, i > 0 ? tl.scenes[i - 1].s.bg : null, opts);
}

// ---------- audio: everything synthesized (no third-party audio, no copyright)
function sfxEvents(tl) {
  const ev = [];
  tl.scenes.forEach(e => {
    ev.push([e.start + 0.05, e.s.sfx === 'alert' ? 'alert' : 'whoosh']);
    e.L.els.forEach(o => { if (o.sfx && o.t0 < e.dur) ev.push([e.start + o.t0, o.sfx]); });
  });
  return ev;
}
async function renderAudio(tl, { music = true, sfx = true, sr = 48000 } = {}) {
  const len = Math.ceil((tl.total + 0.1) * sr);
  const ac = new OfflineAudioContext(2, len, sr);
  const master = ac.createGain(); master.gain.value = 0.9;
  const comp = ac.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.2;
  master.connect(comp); comp.connect(ac.destination);
  const noise = ac.createBuffer(1, sr * 2, sr); { const d = noise.getChannelData(0); let s = 7; for (let i = 0; i < d.length; i++) { s = (s * 16807) % 2147483647; d[i] = s / 1073741823.5 - 1; } }
  const env = (g, t, a, peak, dec) => { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); };
  const osc = (type, f, t, dur, peak, a = 0.003, dest = master) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f; env(g, t, a, peak, dur); o.connect(g); g.connect(dest); o.start(t); o.stop(t + a + dur + 0.05); return o; };
  const S = {
    whoosh(t) { const n = ac.createBufferSource(); n.buffer = noise; const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.9; bp.frequency.setValueAtTime(400, t); bp.frequency.exponentialRampToValueAtTime(5000, t + 0.42); const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.5, t + 0.2); g.gain.linearRampToValueAtTime(0.0001, t + 0.45); n.connect(bp); bp.connect(g); g.connect(master); n.start(t); n.stop(t + 0.5); },
    tick(t) { osc('sine', 1700, t, 0.05, 0.25); },
    pop(t) { const o = osc('sine', 900, t, 0.1, 0.4, 0.002); o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(300, t + 0.1); },
    ding(t) { [1, 2.01, 3.02].forEach((h, i) => osc('sine', 1318.5 * h, t, 0.8, 0.2 / (i + 1))); },
    alert(t) { osc('triangle', 880, t, 0.14, 0.3); osc('triangle', 660, t + 0.16, 0.28, 0.3); },
    outro(t) { [523.25, 659.25, 783.99, 1046.5].forEach(f => { osc('sine', f, t, 1.6, 0.12, 0.01); osc('sine', f * 2, t, 1.0, 0.04, 0.01); }); },
  };
  if (sfx) sfxEvents(tl).forEach(([t, k]) => S[k] && S[k](Math.max(0, t)));
  if (music) {
    const bus = ac.createGain(); bus.gain.setValueAtTime(0, 0); bus.gain.linearRampToValueAtTime(0.55, 0.3); bus.gain.setValueAtTime(0.55, Math.max(0.4, tl.total - 1.5)); bus.gain.linearRampToValueAtTime(0, tl.total); bus.connect(master);
    const beat = 60 / 100, bar = beat * 4, chords = [[220, 261.63, 329.63], [174.61, 220, 261.63], [130.81, 196, 261.63], [196, 246.94, 293.66]];
    for (let b = 0; b * bar < tl.total; b++) {
      const t0 = b * bar, ch = chords[b % 4];
      ch.forEach(f => { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(0.045, t0 + 0.4); g.gain.setValueAtTime(0.045, t0 + bar - 0.4); g.gain.linearRampToValueAtTime(0, t0 + bar); o.connect(g); g.connect(bus); o.start(t0); o.stop(t0 + bar + 0.05); });
      for (let k = 0; k < 4; k++) {
        const tk = t0 + k * beat; if (tk > tl.total) break;
        const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(140, tk); o.frequency.exponentialRampToValueAtTime(50, tk + 0.12); env(g, tk, 0.002, 0.35, 0.22); o.connect(g); g.connect(bus); o.start(tk); o.stop(tk + 0.3);
        const n = ac.createBufferSource(); n.buffer = noise; const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7000; const hg = ac.createGain(); env(hg, tk + beat / 2, 0.001, 0.06, 0.04); n.connect(hp); hp.connect(hg); hg.connect(bus); n.start(tk + beat / 2, Math.random()); n.stop(tk + beat / 2 + 0.08);
      }
    }
  }
  return ac.startRendering();
}

window.MoveEngine = { fontsOK: () => !!A.fontsOK, W, H, SAFE, C, TH, BG_NAMES, ART_NAMES, loadAssets, buildTimeline, renderAt, renderAudio, layoutScene, sceneWords };
})();
