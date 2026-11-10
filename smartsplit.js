/* Smart scene splitter — rule-based (không cần AI / API key). Tiếng Việt.
   Chia content thô thành các cảnh 9:16 theo brand MOVE: hook → tổng quan → cảnh báo → bước → checklist → CTA. */
(function () {
const FILLER_START = /^(chúc mừng bạn[^,]*,?\s*|nhưng\s+|khoan đã,?\s*|khoan,?\s*|yên tâm,?\s*|mẹo nhỏ,?\s*|quan trọng nhất,?\s*|nhớ nhé,?\s*|riêng bước này,?\s*|vì vậy,?\s*|và\s+|còn\s+|thì\s+|tới hẹn\s+|ngoài ra,?\s*|lưu ý,?\s*|đặc biệt,?\s*)/i;
const TAIL = /[\s,]*(nhé|nha|nhá|thôi|đó|nè|á|luôn|nhen)[.!]*$/i;
const sentences = p => p.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+(?=[A-ZÀ-Ỹ0-9"“])/u).map(s => s.trim()).filter(Boolean);
const cap = s => s ? s.charAt(0).toLocaleUpperCase('vi') + s.slice(1) : s;
function clean(s) {
  s = s.trim().replace(/[.!?…]+$/, '');
  for (let i = 0; i < 3; i++) { const t = s.replace(FILLER_START, ''); if (t === s || t.length < 6) break; s = t; }
  s = s.replace(TAIL, '').replace(TAIL, '').trim();
  return cap(s);
}
function fit(s, n) {
  s = clean(s); if (s.length <= n) return s;
  const parts = s.split(/,\s*|\s+(?:nhưng|vì vậy|nên|để|rồi)\s+/).map(clean).filter(x => x.length >= 6);
  const best = parts.find(p => p.length <= n && p.length >= 12) || parts.filter(p => p.length <= n).sort((a, b) => b.length - a.length)[0];
  if (best) return best;
  const cut = s.slice(0, s.lastIndexOf(' ', n)).replace(/[,;:\s]+$/, '');
  return cut;
}
function itemOf(t) {
  t = t.replace(/^\s*(\d+[.)]|[-•*])\s*/, '');
  const ss = sentences(t), first = ss[0] || t;
  const parts = first.split(/,\s*/);
  let main = clean(parts[0]), note = parts.slice(1).join(', ');
  if (!note && ss[1]) note = ss[1];
  note = note ? clean(note) : '';
  if (main.length > 44) { const f = fit(main, 44), remn = clean(main.slice(f.length)); if (remn.length < 10) { /* keep whole */ } else { note = note || remn; main = f; } }
  return { t: main, n: note.length > 42 ? fit(note, 42) : note };
}
function artFor(txt) {
  const s = txt.toLowerCase();
  if (/mũ bảo hiểm|nón bảo hiểm/.test(s)) return 'helmet';
  if (/\d+\s*[-–]?\s*\d*\s*(tuần|ngày)/.test(s)) return 'clock';
  if (/cà vẹt|bưu điện|điện thoại|online|ứng dụng/.test(s)) return 'phone';
  if (/bấm biển|biển số/.test(s)) return 'plate';
  if (/cửa hàng|đại lý|showroom/.test(s)) return 'store';
  if (/thuế|lệ phí|trước bạ/.test(s)) return 'tax';
  if (/chờ|tuần|ngày làm việc|hẹn/.test(s)) return 'clock';
  if (/giấy tờ|hóa đơn|hồ sơ|căn cước/.test(s)) return 'docs';
  return 'none';
}
const ALERT = /(quan trọng|lưu ý|bắt buộc|khoan đã|cảnh báo|không được|chưa được)/i;
const TIP = /^(mẹo|tip|lưu ý nhỏ)/i;
const COUNT = /(\d+)\s+(bước|giấy tờ|thứ|điều|lưu ý|việc|mục|cách)/i;
const INLINE_LIST = /(kiểm tra|mang|chuẩn bị|gồm|cần)\s*(?:đủ\s*)?(\d+)\s+(thứ|giấy tờ|điều|mục|việc)\s*:?\s*(.+)$/i;

function smartSplit(raw, target = 40) {
  const paras = raw.replace(/\r/g, '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  // group: numbered lines become lists attached to the paragraph before
  const blocks = [];
  paras.forEach(p => {
    const lines = p.split('\n').map(l => l.trim()).filter(Boolean);
    const list = lines.filter(l => /^\d+[.)]\s+|^[-•*]\s+/.test(l));
    if (list.length >= 2) { const intro = lines.filter(l => !list.includes(l)).join(' '); blocks.push({ kind: 'list', intro, items: list }); }
    else blocks.push({ kind: 'text', text: lines.join(' ') });
  });
  const scenes = [];
  let stepNo = 0;
  blocks.forEach((b, bi) => {
    if (b.kind === 'list') {
      // title from intro or from the previous text block's last sentence (e.g. "Tổng cộng có 4 bước.")
      let titleSrc = b.intro, prev = scenes[scenes.length - 1];
      if (!titleSrc && prev && prev._last && COUNT.test(prev._last)) { titleSrc = prev._last; prev.body = prev.body && prev.body.includes(clean(prev._last)) ? '' : prev.body; }
      const m = (titleSrc || '').match(COUNT);
      const items = b.items.slice(0, 4).map(itemOf);
      const extra = b.items.slice(0, 4).map(l => sentences(l.replace(/^\s*\d+[.)]\s*/, '')).slice(1).join(' ')).filter(x => ALERT.test(x))[0];
      const isSteps = m && /bước/i.test(m[2]);
      const title = m ? (isSteps ? `${m[1]} bước để hoàn tất` : `Mang đủ ${m[1]} ${m[2]}`) : (titleSrc ? fit(sentences(titleSrc).pop(), 45) : 'Ghi nhớ');
      scenes.push({ bg: isSteps ? 'grad' : 'black', label: isSteps ? 'Tổng quan' : '', title, items, itemStyle: 'num', sub: extra ? fit(extra, 90) : '', art: 'none', _kind: 'list' });
      return;
    }
    const ss = sentences(b.text); if (!ss.length) return;
    const first = ss[0];
    const stepM = first.match(/^bước\s*(\d+|cuối|cuối cùng)\s*[.:,-]?\s*/i);
    // inline enumeration "kiểm tra 3 thứ: A, B và C"
    const inl = ss.map(s => s.match(INLINE_LIST)).find(Boolean);
    const isLast = bi === blocks.length - 1;
    const sc = { bg: 'black', label: '', title: '', body: '', sub: '', tip: '', items: [], itemStyle: 'num', hi: [], art: 'none' };
    if (stepM) {
      stepNo = /\d/.test(stepM[1]) ? +stepM[1] : Math.max(stepNo + 1, 4);
      const rest = first.slice(stepM[0].length) || ss[1] || '';
      let others = ss.slice(rest === ss[1] ? 2 : 1);
      const cutAt = others.findIndex(s => INLINE_LIST.test(s)); if (cutAt >= 0) others = others.slice(0, cutAt);
      const thi = rest.match(/^(.{3,30}?)\s+thì\s+(.+)$/i);
      if (thi) { Object.assign(sc, { bg: 'white', step: Math.min(4, stepNo), label: `Bước ${stepNo}`, title: (/cà vẹt|giấy/i.test(thi[1]) ? 'Nhận ' + clean(thi[1]).toLowerCase() : clean(thi[1])) }); others.unshift(thi[2]); }
      else Object.assign(sc, { bg: 'white', step: Math.min(4, stepNo), label: `Bước ${stepNo}`, title: fit(rest, 40) });
      if (others[0]) sc.body = fit(others[0], 100);
      if (others[1]) sc.sub = fit(others.slice(1).join(' '), 90);
    } else if (isLast) {
      Object.assign(sc, { bg: 'grad', label: /hỗ trợ|tư vấn|liên hệ/i.test(b.text) ? 'Cần hỗ trợ?' : '', title: fit(first, 55), body: ss[1] ? fit(ss[1], 90) : '', logoBig: true, pattern: true });
    } else if (scenes.length === 0) {
      Object.assign(sc, { bg: 'red', title: fit(first, 50), body: ss[1] ? fit(ss[1], 95) : '', art: 'scooter', pattern: true });
    } else {
      const alert = ALERT.test(b.text);
      const tipS = ss.find(s => TIP.test(s));
      const cand = ss.filter(s => !TIP.test(s) && !INLINE_LIST.test(s));
      // for alerts, prefer the sentence that states the fact (not the "if you…" lead-in)
      let ti = 0; if (alert && cand.length > 1 && /^(khoan|nếu|đây là)/i.test(clean(cand[0]))) ti = 1;
      Object.assign(sc, { bg: alert ? 'red' : 'black', label: alert ? 'Quan trọng' : '', title: fit(cand[ti] || first, 50) });
      const rest = cand.filter((s, i) => i !== ti);
      const strong = rest.find(s => /bắt buộc|phải|giữ kỹ|không cần/i.test(s));
      if (strong && strong !== rest[0]) sc.tip = fit(strong, 80);
      sc.body = rest[0] && rest[0] !== strong ? fit(rest[0], 100) : '';
      if (tipS) sc.tip = fit(tipS, 80);
      if (alert) sc.sfx = 'alert';
    }
    if (inl) {
      const parts = inl[4].split(/,\s*|\s+và\s+/).map(clean).filter(Boolean).slice(0, 4);
      if (parts.length >= 2) {
        // separate checklist scene
        const after = ss.slice(ss.findIndex(s => INLINE_LIST.test(s)) + 1).filter(s => !/chụp màn hình/i.test(s));
        if (sc.body && after.some(a => fit(a, 100) === sc.body)) sc.body = '';
        if (sc.sub && after.some(a => sc.sub.includes(clean(a)))) sc.sub = '';
        if (sc.art === 'none') sc.art = artFor([sc.title, sc.body, sc.sub].join(' '));
        scenes.push(sc);
        scenes.push({ sub: after[0] ? fit(after[0], 90) : '', bg: 'red', label: 'Chụp màn hình lại nhé', title: `Checklist ${inl[2]} ${inl[3]}`.replace(/^Checklist (\d+) thứ$/, 'Checklist trước khi lên đường'), items: parts.map(p => { const mm = p.match(/^(.*?)\s+(nếu .+)$/i); return mm ? { t: cap(mm[1]), n: cap(mm[2]) } : { t: p, n: '' }; }), itemStyle: 'check', art: 'none', _kind: 'check' });
        sc._last = ss[ss.length - 1];
        return;
      }
    }
    if (sc.art === 'none' && !sc.logoBig) sc.art = artFor([sc.title, sc.body, sc.sub].join(' '));
    if ([sc.body, sc.sub, sc.tip].filter(Boolean).length >= 3) sc.sub = '';
    sc._last = ss[ss.length - 1];
    scenes.push(sc);
  });
  // drop near-empty scenes, merge text-only scenes when too many
  let out = scenes.filter(s => s.title || s.items.length);
  while (out.length > (target >= 38 ? 11 : 9)) { const pick = f => out.findIndex((s, k) => k > 0 && k < out.length - 1 && !s.items.length && !s.step && f(s)); let i = pick(s => !s.tip && s.bg !== 'red'); if (i < 0) i = pick(s => s.bg !== 'red'); if (i < 0) break; out.splice(i, 1); }
  // highlight words in tips: uppercase words or key phrases
  out.forEach(s => {
    if (s.sub && s.items.some(it => it.n && (s.sub.includes(it.n) || it.n.includes(s.sub)))) s.items.forEach(it => { if (s.sub.includes(it.n) || it.n.includes(s.sub)) it.n = ''; });
    if (s.body && s.title && (s.body.includes(s.title) || s.title.includes(s.body))) s.body = '';
    const src = [s.title, s.tip].join(' ');
    const up = src.match(/\b[A-ZÀ-Ỹ]{3,}\b/gu); if (up) s.hi = up.slice(0, 3);
    if (s.items.length >= 3 || (s.tip && s.sub)) s.art = 'none';
    delete s._last; delete s._kind;
  });
  // color ratio: make sure ~40% red — convert a black text scene to red if needed
  const reds = out.filter(s => s.bg === 'red').length;
  if (reds / out.length < 0.3) { const k = out.findIndex((s, i) => i > 0 && s.bg === 'black' && !s.step); if (k > 0) out[k].bg = 'red'; }
  // durations from words, then scale to target
  const words = s => [s.label, s.title, s.body, s.sub, s.tip, ...s.items.map(i => i.t + ' ' + i.n)].join(' ').split(/\s+/).filter(Boolean).length;
  out.forEach(s => s.dur = Math.max(3, Math.min(6.5, 1.6 + words(s) / 7 + s.items.length * 0.35)));
  const tot = out.reduce((a, s) => a + s.dur, 0), k = Math.min(1.25, Math.max(0.6, target / tot));
  out.forEach(s => s.dur = +Math.max(2.8, Math.min(7, s.dur * k)).toFixed(1));
  return out;
}
window.smartSplit = smartSplit;
})();
