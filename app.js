(async function () {
const E = window.MoveEngine, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const SAMPLE_RAW = `Chúc mừng bạn vừa rước em xe điện mới về nhà, nhưng khoan, chưa có biển số thì em ấy mới chỉ là đồ trang trí phòng khách thôi. Vài phút nữa thôi, mình cùng làm giấy tờ để em ấy lăn bánh nhé. Tổng cộng có 4 bước.

1. Đóng lệ phí trước bạ ở cơ quan thuế.
2. Kê khai đăng ký xe.
3. Mang xe đi bấm biển ở Công An xã Phường.
4. Chờ nhận cà vẹt rồi chạy thôi. Nhớ nhé, chưa có biển số thì chưa được ra đường, dù em ấy có đẹp cỡ nào.

Khoan đã, nếu bạn mua xe thuộc bộ sưu tập mới, đây là phần quan trọng nhất. Mẫu xe này mới tinh, mới tới mức hệ thống thuế còn chưa kịp biết tên. Vì vậy bạn bắt buộc phải khai thuế trực tiếp tại cơ quan thuế, chưa làm nhanh được.

Yên tâm, hãng nào ra mẫu xe mới cũng gặp chuyện này. Hồ sơ của bạn hoàn toàn ổn. Ra cơ quan thuế, bạn mang đủ 3 giấy tờ.

1. Giấy xuất xưởng, chính là tờ màu xanh.
2. Hóa đơn giá trị gia tăng của xe, chỉ cần của xe thôi, không cần hóa đơn pin.
3. Hóa đơn đầu vào, thêm căn cước công dân của chủ xe.

Mẹo nhỏ, kiểm tra đủ giấy tờ ngay lúc nhận xe, đỡ phải chạy tới chạy lùi. Nộp xong, cơ quan thuế sẽ xác nhận hẹn khoảng 1-2 tuần để cập nhật tên mẫu xe mới lên hệ thống. Tới hẹn bạn có thể lên thuế online khai hoặc ra lại cơ quan thuế khai nhé.

Trong lúc chờ, em xe chưa bấm biển được, nên tạm thời mình ngắm thôi, chưa chạy nha. Khi tên xe đã có trên hệ thống, bạn khai và đóng lệ phí trước bạ. Khoản này sẽ tùy thuộc vào từng khu vực và giá tính lệ phí do cơ quan thuế xác định.

Quan trọng nhất, giữ kỹ mã hồ sơ lệ phí trước bạ. Bước sau cần đến nó.

Bước 2. Kê khai đăng ký xe. Riêng bước này, bạn nên ghé cửa hàng nhờ nhân viên hướng dẫn hỗ trợ thao tác trước, tránh tự ý ra thẳng công an bấm biển thao tác online là công an chỉ về cửa hàng lại mất công chạy tới chạy lui nhé.

Bước 3. Mang xe và giấy tờ gốc đến công an xã hoặc phường. Cán bộ kiểm tra, cà số khung số máy. Hồ sơ hợp lệ là bấm biển ngay. Lệ phí bấm biển cũng sẽ tùy vào từng khu vực nhé.

Bước cuối, cà vẹt thì tùy vào hệ thống trả về sẽ gửi qua bưu điện hoặc xem trên điện thoại. Trước khi lên đường, kiểm tra 3 thứ: Bảo hiểm trách nhiệm dân sự, bằng lái hạng A1 nếu xe trên 4kW và một chiếc mũ bảo hiểm thật xịn. Chi phí làm biển, lệ phí trước bạ hay phí dịch vụ sẽ tùy thuộc vào từng khu vực nha. Chụp màn hình checklist này lại nhé.

Cần hỗ trợ gì cứ ghé cửa hàng gần nhất hỏi tư vấn viên. Chúc bạn và em xe mới thượng lộ bình an.`;
const SAMPLE_SCENES = [
  { bg: 'red', title: 'Rước em xe điện mới về nhà rồi?', body: 'Chưa có biển số thì em ấy mới chỉ là đồ trang trí phòng khách thôi.', art: 'scooter', pattern: true, dur: 3.4 },
  { bg: 'grad', label: 'Làm giấy tờ xe điện', title: '4 bước để lăn bánh', itemStyle: 'num', items: [{ t: 'Đóng lệ phí trước bạ' }, { t: 'Kê khai đăng ký xe' }, { t: 'Bấm biển tại Công an xã/phường' }, { t: 'Nhận cà vẹt & lên đường' }], sub: 'Chưa có biển số thì chưa được ra đường, dù em ấy đẹp cỡ nào.', dur: 5 },
  { bg: 'red', label: 'Quan trọng · Bộ sưu tập Smart MOVE', title: 'Mẫu xe mới tinh, hệ thống thuế chưa kịp có tên', tip: 'Bắt buộc khai thuế TRỰC TIẾP tại cơ quan thuế.', hi: ['TRỰC', 'TIẾP'], sub: 'Hãng nào ra mẫu mới cũng vậy. Hồ sơ của bạn hoàn toàn ổn.', art: 'tax', align: 'right', sfx: 'alert', dur: 4.6 },
  { bg: 'black', step: 1, label: 'Bước 1 · Lệ phí trước bạ', title: 'Mang đủ 3 giấy tờ', itemStyle: 'num', items: [{ t: 'Giấy xuất xưởng', n: 'Tờ màu xanh' }, { t: 'Hóa đơn GTGT của xe', n: 'Chỉ của xe, không cần hóa đơn pin' }, { t: 'Hóa đơn đầu vào', n: 'Kèm CCCD của chủ xe' }], tip: 'Mẹo: kiểm tra đủ giấy tờ ngay lúc nhận xe.', dur: 5.8 },
  { bg: 'black', step: 1, label: 'Bước 1 · Sau khi nộp', title: 'Chờ 1–2 tuần', body: 'để thuế cập nhật tên mẫu xe mới. Tạm ngắm, chưa chạy nha.', itemStyle: 'timeline', items: [{ t: 'Nộp hồ sơ' }, { t: 'Chờ 1–2 tuần' }, { t: 'Khai online / trực tiếp & đóng lệ phí' }], tip: 'Giữ kỹ MÃ HỒ SƠ lệ phí trước bạ. Bước sau cần đến nó.', hi: ['MÃ', 'HỒ', 'SƠ'], sub: 'Lệ phí tùy khu vực và giá tính do cơ quan thuế xác định.', dur: 5.6 },
  { bg: 'white', step: 2, label: 'Bước 2', title: 'Kê khai đăng ký xe', body: 'Ghé cửa hàng để nhân viên hỗ trợ thao tác trước.', sub: 'Tránh ra thẳng công an rồi bị chỉ về lại cửa hàng.', art: 'store', dur: 3.8 },
  { bg: 'white', step: 3, label: 'Bước 3', title: 'Bấm biển', body: 'Mang xe + giấy tờ gốc đến Công an xã/phường.', sub: 'Cà số khung, số máy. Hồ sơ hợp lệ là bấm biển ngay. Lệ phí tùy khu vực.', art: 'plate', dur: 4.0 },
  { bg: 'white', step: 4, label: 'Bước 4', title: 'Nhận cà vẹt', body: 'Gửi qua bưu điện hoặc xem trên điện thoại.', sub: 'Tùy hệ thống trả về.', art: 'phone', dur: 3.2 },
  { bg: 'red', label: 'Chụp màn hình lại nhé', title: 'Checklist trước khi lên đường', itemStyle: 'check', items: [{ t: 'Bảo hiểm trách nhiệm dân sự' }, { t: 'Bằng lái hạng A1', n: 'Nếu xe trên 4kW' }, { t: 'Mũ bảo hiểm thật xịn' }], sub: 'Chi phí làm biển, lệ phí trước bạ, phí dịch vụ tùy từng khu vực.', dur: 5.6 },
  { bg: 'grad', label: 'Cần hỗ trợ?', title: 'Ghé cửa hàng MOVE gần nhất hỏi tư vấn viên.', body: 'Chúc bạn và em xe mới thượng lộ bình an.', logoBig: true, pattern: true, dur: 4.0 },
];

// ---------------- state
let state = { raw: '', target: 40, scenes: [], notes: [], aud: 'all' };
try { const s = JSON.parse(localStorage.getItem('move-clip-studio') || 'null'); if (s && s.scenes) state = Object.assign(state, s); } catch (e) {}
const save = () => { try { localStorage.setItem('move-clip-studio', JSON.stringify(state)); } catch (e) {} };
let tl = null, curScene = 0, audioBuf = null, audioDirty = true;

await E.loadAssets();
// ---------------- backend (Google Apps Script → Drive cố định + Claude API)
const CFG = window.CLIP_CONFIG || {}, API = (CFG.APPS_SCRIPT_URL || '').trim();
let pass = ''; try { pass = localStorage.getItem('move-clip-pass') || ''; } catch (e) {}
let backend = { auth: false, ai: false, folderUrl: '' };
async function api(action, data = {}) {
  if (!API) throw new Error('Chưa cấu hình APPS_SCRIPT_URL trong config.js');
  const r = await fetch(API, { method: 'POST', body: JSON.stringify(Object.assign({ action, passcode: pass }, data)) });
  const j = await r.json(); if (!j.ok) throw new Error(j.error || 'Lỗi backend'); return j;
}
function setDriveUI() {
  $$('.drive-only').forEach(el => el.style.display = backend.auth ? '' : 'none');
  $('#saveBtn').style.display = lastBlob ? '' : 'none'; $('#driveBtn').style.display = lastBlob && backend.auth ? '' : 'none';
  $('#driveSt').innerHTML = backend.auth ? `Đã kết nối · <a href="${backend.folderUrl}" target="_blank" rel="noopener">Mở thư mục Drive</a>` : (API ? 'Chưa kết nối' : '');
  $('#projRow').style.display = backend.auth ? '' : 'none';
  $('#aiParse').style.display = backend.ai ? '' : 'none';
  const dw = $('#driveWarn');
  if (!backend.auth) { dw.style.display = ''; dw.textContent = !API ? 'Chưa kết nối Google Drive (backend chưa được cấu hình) — clip chỉ tải về máy, chưa tự lưu lên Drive.' : 'Chưa kết nối Google Drive — nhập mã team ở bước 1 để clip tự lưu lên Drive.'; }
  else dw.style.display = 'none';
}
async function connect(silent) {
  if (!API) return;
  $('#driveBox').style.display = '';
  if (!pass) { setDriveUI(); return; }
  $('#driveSt').textContent = 'Đang kết nối…';
  try { const j = await api('ping'); backend = { auth: true, ai: !!j.ai, folderUrl: j.folderUrl }; try { localStorage.setItem('move-clip-pass', pass); } catch (e) {} listProjects(); }
  catch (e) { backend = { auth: false, ai: false, folderUrl: '' }; if (!silent) $('#driveSt').textContent = e.message; }
  setDriveUI(); if (!backend.auth && !silent) $('#driveSt').textContent = 'Không kết nối được — kiểm tra mã truy cập.';
}
async function listProjects() {
  try { const j = await api('list'); $('#projList').innerHTML = '<option value="">— Mở dự án đã lưu (' + j.items.length + ') —</option>' + j.items.map(it => `<option value="${it.id}">${esc(it.name)} · ${new Date(it.updated).toLocaleDateString('vi-VN')}</option>`).join(''); } catch (e) {}
}
$('#connect').onclick = () => { pass = $('#pass').value.trim(); connect(false); };
$('#pass').value = pass;
$('#refreshProj').onclick = listProjects;
$('#openProj').onclick = async () => {
  const id = $('#projList').value; if (!id) return;
  try { const j = await api('get', { id }); const imgs = j.project.images; delete j.project.images; Object.assign(state, j.project); await unpackImages(imgs); state.scenes = (state.scenes || []).map(sanitize); $('#raw').value = state.raw || ''; $('#projName').value = state.name || ''; changed(); go(2); }
  catch (e) { msg('#m1', e.message, true); }
};
const projName = () => (state.name || (state.scenes[0] && state.scenes[0].title) || 'clip').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^\w-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'clip';
const projData = async () => ({ name: state.name || '', raw: state.raw, target: state.target, aud: state.aud, scenes: state.scenes, images: await packImages(), savedAt: new Date().toISOString() });

// ---------------- photo backgrounds (IndexedDB, fallback memory)
const memImgs = new Map();
function idb() { return new Promise((res, rej) => { try { const q = indexedDB.open('move-clip-imgs', 1); q.onupgradeneeded = () => q.result.createObjectStore('img'); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); } catch (e) { rej(e); } }); }
async function imgPut(id, blob) { memImgs.set(id, blob); try { const d = await idb(); await new Promise((res, rej) => { const tx = d.transaction('img', 'readwrite'); tx.objectStore('img').put(blob, id); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); } catch (e) {} }
async function imgGet(id) { if (memImgs.has(id)) return memImgs.get(id); try { const d = await idb(); return await new Promise(res => { const q = d.transaction('img').objectStore('img').get(id); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); }); } catch (e) { return null; } }
async function loadImg(id) { if (!id || E.hasImage(id)) return; const b = await imgGet(id); if (b) { const bm = await createImageBitmap(b); E.setImage(id, bm); } }
async function loadAllImgs() { await Promise.all(state.scenes.map(s => loadImg(s.bgImg))); drawPreview(); }
async function prepPhoto(file) {
  const bm = await createImageBitmap(file), mx = 1600, sc = Math.min(1, mx / Math.max(bm.width, bm.height));
  const cv = document.createElement('canvas'); cv.width = Math.round(bm.width * sc); cv.height = Math.round(bm.height * sc);
  cv.getContext('2d').drawImage(bm, 0, 0, cv.width, cv.height);
  const blob = await new Promise(r => cv.toBlob(r, 'image/jpeg', 0.85));
  const id = 'img_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  await imgPut(id, blob); E.setImage(id, await createImageBitmap(blob)); return id;
}
const blobToData = b => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(b); });
async function packImages() { const out = {}; for (const s of state.scenes) if (s.bgImg && !out[s.bgImg]) { const b = await imgGet(s.bgImg); if (b) out[s.bgImg] = await blobToData(b); } return out; }
async function unpackImages(images) { for (const [id, data] of Object.entries(images || {})) { const b = await (await fetch(data)).blob(); await imgPut(id, b); E.setImage(id, await createImageBitmap(b)); } }

// ---------------- navigation
function go(n, fromHash) {
  if (!fromHash && location.hash !== '#step-' + n) { try { history.pushState(null, '', '#step-' + n); } catch (e) {} }
  $$('#steps button').forEach(b => b.classList.toggle('on', b.dataset.s == n));
  $$('.pane').forEach(p => p.classList.toggle('on', p.id === 'p' + n));
  if (n == 2) renderEditor(); if (n == 3) renderSum3(); if (n == 4) detectFormats();
}
$$('#steps button').forEach(b => b.onclick = () => go(b.dataset.s));
window.addEventListener('popstate', () => { const m = location.hash.match(/step-(\d)/); go(m ? m[1] : 1, true); });
document.addEventListener('click', e => { const g = e.target.closest('[data-go]'); if (g) go(g.dataset.go); });

// ---------------- step 1
$('#raw').value = state.raw; $('#target').value = state.target; $('#targetV').textContent = state.target + 's';
$('#raw').oninput = () => { state.raw = $('#raw').value; save(); };
$('#target').oninput = () => { state.target = +$('#target').value; $('#targetV').textContent = state.target + 's'; save(); };
$('#loadSample').onclick = () => { state.raw = SAMPLE_RAW; $('#raw').value = SAMPLE_RAW; state.scenes = JSON.parse(JSON.stringify(SAMPLE_SCENES)); state.notes = [{ level: 'info', text: 'Đã nạp kịch bản mẫu đã biên tập sẵn (45s).' }]; changed(); go(2); };
$('#quickParse').onclick = () => {
  if (!state.raw.trim()) return msg('#m1', 'Chưa có content.', true);
  state.scenes = (window.smartSplit ? window.smartSplit(state.raw, state.target) : quickParse(state.raw)).map(sanitize); state.notes = [{ level: 'info', text: 'Chia cảnh tự động theo quy tắc (không dùng AI): đã rút gọn câu, nhận diện bước / danh sách / cảnh báo / checklist và gợi ý hình. Nên đọc lại từng cảnh trước khi xuất.' }];
  changed(); go(2);
};
$('#aiParse').onclick = async () => {
  if (!state.raw.trim()) return msg('#m1', 'Chưa có content.', true);
  if (!backend.ai) return msg('#m1', 'Chưa bật Claude trên backend. Dùng "Chia cảnh tự động" thay thế.', true);
  const b = $('#aiParse'); b.disabled = true; b.innerHTML = '<span class="spin"></span>Claude đang kiểm tra content…';
  try {
    const j = await api('ai', { prompt: aiPrompt(state.raw, state.target) });
    const txt = j.text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, ''); const res = JSON.parse(txt.slice(txt.indexOf('{'), txt.lastIndexOf('}') + 1));
    if (!res || !Array.isArray(res.scenes) || !res.scenes.length) throw new Error('Kết quả không hợp lệ');
    state.scenes = res.scenes.map(sanitize); state.notes = (res.notes || []).filter(n => n && n.text);
    changed(); go(2); msg('#m1', '');
  } catch (e) {
    msg('#m1', 'Không phân tích được: ' + (e.message || e), true);
  } finally { b.disabled = false; b.textContent = 'Kiểm tra & chia cảnh với Claude'; }
};
function msg(sel, t, err) { const m = $(sel); m.textContent = t; m.className = (m.className.replace(/\berr\b/, '') + (err ? ' err' : '')).trim(); }

function aiPrompt(raw, target) {
  return `Bạn là biên tập viên motion graphic cho thương hiệu xe điện MOVE (Việt Nam). Hãy KIỂM TRA content dưới đây và chuyển nó thành kịch bản clip animation dọc 9:16, chữ là chính, dễ đọc, gọn, tập trung ý chính, tổng thời lượng khoảng ${target}s (bắt buộc trong 15–45s, mỗi cảnh 3–6s).

Chỉ trả về JSON (không markdown) đúng dạng:
{"scenes":[Scene,...],"notes":[{"level":"error"|"warn"|"info","text":"..."}]}

Scene = {
 "bg": "red"|"black"|"white"|"grad",
 "step": null hoặc 1..4 (chỉ khi content là quy trình nhiều bước),
 "label": nhãn ngắn ≤ 40 ký tự hoặc "",
 "title": tiêu đề ≤ 55 ký tự (bắt buộc),
 "body": ≤ 100 ký tự hoặc "",
 "items": tối đa 4 mục [{"t": ≤ 38 ký tự, "n": ghi chú ≤ 42 ký tự hoặc ""}],
 "itemStyle": "num"|"check"|"timeline"|"none",
 "tip": câu nhấn mạnh/mẹo ≤ 80 ký tự hoặc "",
 "sub": chú thích phụ ≤ 90 ký tự hoặc "",
 "hi": tối đa 3 từ đơn cần nhấn mạnh, phải xuất hiện nguyên văn trong title/body/tip,
 "layout": "default"|"center"|"bignum"|"quote"|"compare"|"cards"|"artTop" (center: 1 câu chốt; bignum: title là con số/ngắn như "1–2 tuần", "120 km"; compare: items[0] là tiêu đề 2 cột {"t":"Xe xăng","n":"Xe điện"}, các item sau {"t":vế trái,"n":vế phải}; cards: 2–4 items dạng thẻ; artTop: hình to ở trên),
 "art": "none"|"scooter"|"tax"|"store"|"plate"|"phone"|"docs"|"helmet"|"clock"|"charger"|"battery"|"plug"|"bolt"|"route"|"gauge"|"shield"|"service"|"app"|"gift"|"calendar"|"price"|"key"|"swap",
 "align": "center"|"right",
 "pattern": true|false,
 "logoBig": true|false,
 "sfx": "whoosh"|"alert",
 "dur": số giây
}

Quy tắc brand MOVE 2026:
- Tỉ lệ màu theo thời lượng: nền đỏ ~40%, trắng ~20%, đen ~20%, gradient đen→đỏ cho phần còn lại. Tím chỉ là điểm nhấn (tự động).
- Cảnh 1: bg "red", hook mạnh, có thể art "scooter" + pattern true.
- Cảnh cuối: CTA, bg "grad", logoBig true, pattern true, art "none".
- Pattern chỉ ở cảnh mở và cảnh kết. Cảnh cảnh báo dùng bg "red" + sfx "alert".
- Cảnh có ≥ 3 items hoặc có cả tip và sub thì art "none" (trừ layout cards/compare luôn art "none"). Mỗi cảnh một ý. Đa dạng bố cục: dùng bignum cho con số nổi bật, center cho câu chốt, cards cho 3–4 giấy tờ/lợi ích, compare khi so sánh 2 thứ.
- Không thêm thông tin không có trong content, giữ đúng số liệu, giọng thân thiện như content gốc.
- 6–11 cảnh.

"notes" là kết quả KIỂM TRA content gốc: lỗi chính tả/ngữ pháp, chỗ mâu thuẫn hoặc khó hiểu, thông tin cần xác minh (pháp lý, phí, thời gian), nội dung quan trọng đã bị lược khi rút gọn. Viết tiếng Việt, ngắn.

CONTENT:
"""
${raw}
"""`;
}
function sanitize(s) {
  const pick = (v, list, d) => list.includes(v) ? v : d;
  return {
    bg: pick(s.bg, ['red', 'black', 'white', 'grad'], 'black'), step: s.step >= 1 && s.step <= 4 ? +s.step : null,
    label: s.label || '', title: s.title || '', body: s.body || '', sub: s.sub || '', tip: s.tip || '',
    items: Array.isArray(s.items) ? s.items.slice(0, 5).map(i => ({ t: (i && (i.t || i.text)) || String(i || ''), n: (i && i.n) || '' })).filter(i => i.t) : [],
    itemStyle: pick(s.itemStyle, ['num', 'check', 'timeline', 'none'], 'num'), hi: Array.isArray(s.hi) ? s.hi.slice(0, 4) : [],
    layout: pick(s.layout, Object.keys(E.LAYOUT_NAMES), 'default'), art: pick(s.art, Object.keys(E.ART_NAMES), 'none'), align: s.align === 'right' ? 'right' : 'center',
    bgImg: s.bgImg || '', bgDim: s.bgDim === undefined || s.bgDim === '' ? 0.55 : +s.bgDim, bgPos: ['top', 'center', 'bottom'].includes(s.bgPos) ? s.bgPos : 'center', kenburns: s.kenburns !== false,
    pattern: !!s.pattern, logoBig: !!s.logoBig, sfx: s.sfx === 'alert' ? 'alert' : 'whoosh', dur: +s.dur > 0 ? Math.min(9, Math.max(2.5, +s.dur)) : 0,
  };
}
function quickParse(raw) {
  const cut = (s, n) => { s = s.trim(); return s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n)).trim() + '…'; };
  const sentences = p => p.split(/(?<=[.!?])\s+/).map(x => x.trim()).filter(Boolean);
  const paras = raw.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const out = [];
  paras.forEach((p, i) => {
    const lines = p.split('\n').map(l => l.trim()).filter(Boolean);
    const listL = lines.filter(l => /^\d+[.)]\s+/.test(l));
    if (listL.length >= 2) {
      const prev = out[out.length - 1];
      out.push({ bg: 'grad', label: '', title: prev && !prev.items.length ? '' : 'Ghi nhớ', items: listL.slice(0, 4).map(l => { const t = l.replace(/^\d+[.)]\s+/, ''); const ss = sentences(t); return { t: cut(ss[0].replace(/[.]$/, ''), 38), n: ss[1] ? cut(ss[1], 42) : '' }; }), itemStyle: 'num' });
      if (prev && !prev.items.length && !prev.logoBig && i > 1) { out[out.length - 1].title = prev.title; out.splice(out.length - 2, 1); }
      return;
    }
    const ss = sentences(p), stepM = p.match(/^Bước\s*(\d)/i);
    out.push({ bg: 'black', step: stepM ? +stepM[1] : null, label: stepM ? 'Bước ' + stepM[1] : '', title: cut((stepM ? ss[0].replace(/^Bước\s*\d+[.:]?\s*/i, '') || ss[1] || '' : ss[0]).replace(/[.]$/, ''), 55), body: cut(ss.slice(stepM ? 1 : 1, 2).join(' '), 100), sub: '', tip: '', items: [], itemStyle: 'num', hi: [], art: 'none' });
  });
  out.forEach((s, i) => {
    s.hi = s.hi || []; s.items = s.items || []; s.art = s.art || 'none'; s.sub = s.sub || ''; s.tip = s.tip || ''; s.body = s.body || ''; s.label = s.label || '';
    if (s.step) s.bg = 'white'; else if (!s.items.length) s.bg = i % 2 ? 'black' : 'red';
  });
  if (out.length) { Object.assign(out[0], { bg: 'red', art: 'scooter', pattern: true, step: null }); }
  if (out.length > 1) { const l = out[out.length - 1]; Object.assign(l, { bg: 'grad', logoBig: true, pattern: true, art: 'none', step: null }); }
  return out.slice(0, 12).map(sanitize);
}

// ---------------- timeline + checks
function changed() { tl = E.buildTimeline(state.scenes); audioDirty = true; save(); renderChecks(); updateTime(); drawPreview(); }
function checks() {
  const out = [];
  if (!state.scenes.length) return [{ level: 'error', text: 'Chưa có cảnh nào.' }];
  const T = tl.total;
  if (T < 14.95) out.push({ level: 'error', text: `Tổng thời lượng ${T.toFixed(1)}s < 15s.` });
  else if (T > 45.05) out.push({ level: 'error', text: `Tổng thời lượng ${T.toFixed(1)}s > 45s — bớt cảnh hoặc giảm thời lượng.` });
  else out.push({ level: 'ok', text: `Thời lượng ${T.toFixed(1)}s (15–45s).` });
  tl.scenes.forEach((e, i) => {
    e.L.warn.forEach(w => { const px = +((w.match(/(\d+)px/) || [])[1] || 0); out.push({ level: /tràn/.test(w) && px > 40 ? 'error' : 'warn', text: `Cảnh ${i + 1}: ${w}`, i }); });
    const need = e.L.words / 6; if (need > e.dur * 2) out.push({ level: 'warn', text: `Cảnh ${i + 1}: dày chữ (${e.L.words} chữ, cần ~${need.toFixed(1)}s để đọc hết, đang ${e.dur.toFixed(1)}s) — rút gọn hoặc tăng thời lượng.`, i });
    if (e.L.lastAppear > e.dur - 0.6) out.push({ level: 'warn', text: `Cảnh ${i + 1}: phần tử cuối xuất hiện quá sát lúc chuyển cảnh — tăng thời lượng.`, i });
    if ((e.s.title || '').length > 60) out.push({ level: 'warn', text: `Cảnh ${i + 1}: tiêu đề dài (${e.s.title.length} ký tự).`, i });
    (e.s.hi || []).forEach(h => { const txt = [e.s.title, e.s.body, e.s.tip].join(' '); if (h && !txt.includes(h)) out.push({ level: 'info', text: `Cảnh ${i + 1}: từ nhấn mạnh "${h}" không có trong chữ.`, i }); });
  });
  const r = ratio(); if (r.red < 0.25 || r.red > 0.6) out.push({ level: 'info', text: `Nền đỏ chiếm ${Math.round(r.red * 100)}% thời lượng (guideline ~40%).` });
  if (!state.scenes.some(s => s.logoBig)) out.push({ level: 'info', text: 'Chưa có cảnh kết với logo lớn / CTA.' });
  if (state.scenes.length > 12) out.push({ level: 'warn', text: 'Hơn 12 cảnh — clip dễ bị dồn.' });
  return out;
}
function ratio() { const r = { red: 0, black: 0, white: 0, grad: 0 }; tl.scenes.forEach(e => r[e.s.bg] += e.dur / tl.total); return r; }
function renderChecks() {
  const box = $('#checks'); if (!box) return;
  const list = checks().concat((state.notes || []).map(n => ({ level: n.level === 'error' ? 'err' : n.level, text: 'Content: ' + n.text })));
  const cnt = l => list.filter(x => x.level === l || (l === 'error' && x.level === 'err')).length;
  const r = ratio();
  box.innerHTML = `<div class="sum"><span class="pill err">${cnt('error')} lỗi</span><span class="pill warn">${cnt('warn')} cảnh báo</span><span class="pill info">${cnt('info')} ghi chú</span><span style="margin-left:auto;color:var(--neutral);font-weight:600">${state.scenes.length} cảnh · ${tl.total.toFixed(1)}s</span></div>
    <div class="ratio">${[['red', '#BE0000'], ['grad', 'linear-gradient(90deg,#0B1718,#BE0000)'], ['black', '#0B1718'], ['white', '#fff;box-shadow:inset 0 0 0 1px #ddd']].map(([k, c]) => `<i style="width:${r[k] * 100}%;background:${c}"></i>`).join('')}</div>
    <div class="note" style="margin-bottom:8px">Tỉ lệ nền: đỏ ${Math.round(r.red * 100)}% · gradient ${Math.round(r.grad * 100)}% · đen ${Math.round(r.black * 100)}% · trắng ${Math.round(r.white * 100)}%</div>
    <ul>${list.map(x => `<li class="${x.level === 'error' ? 'err' : x.level}">${esc(x.text)}</li>`).join('')}</ul>`;
  $$('#scenes .scene').forEach((el, i) => { const e = tl.scenes[i]; if (!e) return; el.querySelector('.d').textContent = e.dur.toFixed(1) + 's' + (+state.scenes[i].dur ? '' : ' (tự động)'); el.querySelector('.w').textContent = e.L.warn.length ? '⚠ ' + e.L.warn.length : ''; });
}
function renderSum3() { const c = checks(); const err = c.filter(x => x.level === 'error'); $('#sum3').innerHTML = `<div class="sum"><span class="pill ${err.length ? 'err' : 'ok'}">${err.length ? err.length + ' lỗi cần sửa' : 'Sẵn sàng export'}</span><span style="margin-left:auto;color:var(--neutral)">${state.scenes.length} cảnh · ${tl.total.toFixed(1)}s · 1080×1920</span></div>${err.length ? '<ul>' + err.map(x => `<li class="err">${esc(x.text)}</li>`).join('') + '</ul>' : '<div class="note">Bấm ▶ ở khung bên phải để xem clip.</div>'}`; }
function alertMsg(t) { const m = document.getElementById('m2'); if (m) { m.textContent = t; m.className = 'msg err'; } }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------------- editor
function renderEditor() {
  const box = $('#scenes'); box.innerHTML = '';
  const bgSw = { red: '#BE0000', black: '#0B1718', white: '#fff', grad: 'linear-gradient(135deg,#0B1718 40%,#BE0000)' };
  state.scenes.forEach((s, i) => {
    const d = document.createElement('div'); d.className = 'scene' + (i === curScene ? ' cur open' : '');
    d.innerHTML = `<div class="hd"><span class="sw" style="background:${bgSw[s.bg]}"></span><span class="t">${i + 1}. ${esc(s.title || '(chưa có tiêu đề)')}</span><span class="w"></span><span class="d"></span>
      <button class="btn ghost sm" data-a="up">↑</button><button class="btn ghost sm" data-a="down">↓</button><button class="btn ghost sm" data-a="dup">⧉</button><button class="btn ghost sm" data-a="del">✕</button></div>
      <div class="bd">
        <div class="grid4" style="grid-template-columns:repeat(5,1fr)">
          <div><label class="f">Nền</label><select data-k="bg">${Object.entries(E.BG_NAMES).map(([k, v]) => `<option value="${k}" ${s.bg === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
          <div><label class="f">Bước</label><select data-k="step"><option value="">—</option>${[1, 2, 3, 4].map(n => `<option ${+s.step === n ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
          <div><label class="f">Bố cục</label><select data-k="layout">${Object.entries(E.LAYOUT_NAMES).map(([k, v]) => `<option value="${k}" ${(s.layout || 'default') === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
          <div><label class="f">Hình flat</label><select data-k="art">${Object.entries(E.ART_NAMES).map(([k, v]) => `<option value="${k}" ${s.art === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
          <div><label class="f">Thời lượng (s)</label><input type="number" step="0.1" min="2" max="9" data-k="dur" value="${+s.dur || ''}" placeholder="tự động"></div>
        </div>
        <label class="f">Nhãn</label><input type="text" data-k="label" value="${esc(s.label || '')}">
        <label class="f">Tiêu đề</label><input type="text" data-k="title" value="${esc(s.title || '')}">
        <label class="f">Nội dung</label><input type="text" data-k="body" value="${esc(s.body || '')}">
        <div class="grid2">
          <div><label class="f">Danh sách (mỗi dòng: nội dung | ghi chú)</label><textarea rows="4" data-k="items">${esc((s.items || []).map(it => it.t + (it.n ? ' | ' + it.n : '')).join('\n'))}</textarea></div>
          <div><label class="f">Kiểu danh sách</label><select data-k="itemStyle">${[['num', 'Đánh số'], ['check', 'Checklist'], ['timeline', 'Timeline'], ['none', 'Không ký hiệu']].map(([k, v]) => `<option value="${k}" ${s.itemStyle === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
            <label class="f">Nhấn mạnh (từ, cách nhau dấu phẩy)</label><input type="text" data-k="hi" value="${esc((s.hi || []).join(', '))}"></div>
        </div>
        <label class="f">Ảnh nền thật</label>
        <div class="row" style="gap:8px">
          <label class="btn ghost sm" style="cursor:pointer">${s.bgImg ? 'Đổi ảnh' : 'Tải ảnh lên'}<input type="file" accept="image/*" data-photo style="display:none"></label>
          ${s.bgImg ? `<button class="btn ghost sm" data-a="noimg">Bỏ ảnh</button>
          <span style="font-size:12px;color:var(--neutral)">Độ phủ màu</span><input type="range" min="0.2" max="0.9" step="0.05" data-k="bgDim" value="${s.bgDim ?? 0.55}" style="width:120px;accent-color:var(--red)">
          <select data-k="bgPos" style="width:auto"><option value="top" ${s.bgPos === 'top' ? 'selected' : ''}>Canh trên</option><option value="center" ${s.bgPos !== 'top' && s.bgPos !== 'bottom' ? 'selected' : ''}>Canh giữa</option><option value="bottom" ${s.bgPos === 'bottom' ? 'selected' : ''}>Canh dưới</option></select>
          <label style="font-size:12px"><input type="checkbox" data-k="kenburns" ${s.kenburns !== false ? 'checked' : ''}> Zoom chậm</label>` : '<span class="note">JPG/PNG, ảnh dọc cho đẹp nhất. Màu nền của cảnh sẽ phủ lên ảnh để chữ dễ đọc.</span>'}
        </div>
        <label class="f">Hộp nhấn / mẹo</label><input type="text" data-k="tip" value="${esc(s.tip || '')}">
        <label class="f">Chú thích phụ</label><input type="text" data-k="sub" value="${esc(s.sub || '')}">
        <div class="row" style="margin-top:10px;gap:18px;font-size:13px">
          <label><input type="checkbox" data-k="pattern" ${s.pattern ? 'checked' : ''}> Pattern vệt bánh xe (1 hàng)</label>
          <label><input type="checkbox" data-k="logoBig" ${s.logoBig ? 'checked' : ''}> Cảnh kết: logo lớn</label>
          <label><input type="checkbox" data-k="sfx" ${s.sfx === 'alert' ? 'checked' : ''}> SFX cảnh báo</label>
          <label><input type="checkbox" data-k="align" ${s.align === 'right' ? 'checked' : ''}> Hình canh phải</label>
        </div>
      </div>`;
    d.querySelector('.hd').onclick = ev => {
      const a = ev.target.dataset.a;
      if (a) { ev.stopPropagation(); const sc = state.scenes;
        if (a === 'up' && i > 0) [sc[i - 1], sc[i]] = [sc[i], sc[i - 1]];
        if (a === 'down' && i < sc.length - 1) [sc[i + 1], sc[i]] = [sc[i], sc[i + 1]];
        if (a === 'dup') sc.splice(i + 1, 0, JSON.parse(JSON.stringify(sc[i])));
        if (a === 'del') sc.splice(i, 1);
        changed(); renderEditor(); return; }
      const wasOpen = d.classList.contains('open'); curScene = i; $$('#scenes .scene').forEach((x, j) => { x.classList.toggle('cur', j === i); x.classList.toggle('open', j === i && !wasOpen); });
      seekScene(i);
    };
    d.querySelectorAll('[data-k]').forEach(inp => {
      const k = inp.dataset.k;
      const fn = () => {
        let v = inp.type === 'checkbox' ? inp.checked : inp.value;
        if (k === 'items') v = v.split('\n').map(l => l.trim()).filter(Boolean).map(l => { const [t, ...n] = l.split('|'); return { t: t.trim(), n: n.join('|').trim() }; });
        if (k === 'hi') v = v.split(',').map(x => x.trim()).filter(Boolean);
        if (k === 'step') v = v ? +v : null; if (k === 'dur') v = +v || 0;
        if (k === 'sfx') v = v ? 'alert' : 'whoosh'; if (k === 'align') v = v ? 'right' : 'center';
        s[k] = v; changed();
        if (k === 'title') d.querySelector('.t').textContent = `${i + 1}. ${s.title || '(chưa có tiêu đề)'}`;
        if (k === 'bg') d.querySelector('.sw').style.background = bgSw[s.bg];
        seekScene(i);
      };
      inp.addEventListener(inp.tagName === 'SELECT' || inp.type === 'checkbox' ? 'change' : 'input', fn);
    });
    const ni = d.querySelector('[data-a=noimg]'); if (ni) ni.onclick = () => { s.bgImg = ''; changed(); renderEditor(); seekScene(i); };
    const ph = d.querySelector('[data-photo]');
    if (ph) ph.onchange = async () => { const f = ph.files[0]; if (!f) return; try { s.bgImg = await prepPhoto(f); if (s.bg === 'white') s.bg = 'black'; changed(); renderEditor(); seekScene(i); } catch (err) { alertMsg('Không đọc được ảnh: ' + err.message); } };
    box.appendChild(d);
  });
  renderChecks();
}
$('#addScene').onclick = () => { state.scenes.push(sanitize({ bg: 'black', title: 'Cảnh mới' })); curScene = state.scenes.length - 1; changed(); renderEditor(); };

// ---------------- preview player
const cv = $('#cv'), cx = cv.getContext('2d');
let t = 0, playing = false, ac = null, src = null, t0Wall = 0, t0 = 0;
function drawPreview() {
  if (!tl || !tl.scenes.length) { cx.fillStyle = '#0B1718'; cx.fillRect(0, 0, cv.width, cv.height); return; }
  cx.setTransform(cv.width / E.W, 0, 0, cv.height / E.H, 0, 0);
  E.renderAt(cx, tl, t, { safe: $('#safeT').checked });
  cx.setTransform(1, 0, 0, 1, 0, 0);
}
function updateTime() { if (!tl) return; $('#tm').textContent = `${t.toFixed(1)} / ${tl.total.toFixed(1)}s`; $('#scrub').value = tl.total ? Math.round(t / tl.total * 1000) : 0; }
function seekScene(i) { const e = tl.scenes[i]; if (!e) return; stop(); t = e.start + Math.min(e.dur - 0.3, Math.max(e.L.lastAppear + 0.6, e.dur * 0.6)); drawPreview(); updateTime(); }
async function ensureAudio() {
  const mode = state.aud;
  if (audioDirty || !audioBuf || audioBuf._mode !== mode) { audioBuf = mode === 'none' ? null : await E.renderAudio(tl, { music: mode === 'all', sfx: true }); if (audioBuf) audioBuf._mode = mode; audioDirty = false; }
  return audioBuf;
}
async function play() {
  if (!tl || !tl.total) return;
  if (t >= tl.total - 0.05) t = 0;
  ac = ac || new AudioContext();
  try { await ac.resume(); } catch (e) {}
  const buf = $('#sndT').checked ? await ensureAudio() : null;
  if (buf) { src = ac.createBufferSource(); src.buffer = buf; src.connect(ac.destination); src.start(0, t); }
  t0Wall = ac.currentTime; t0 = t; playing = true; $('#play').textContent = '❚❚'; loop();
}
function stop() { playing = false; $('#play').textContent = '▶'; if (src) { try { src.stop(); } catch (e) {} src = null; } }
function loop() { if (!playing) return; t = t0 + (ac.currentTime - t0Wall); if (t >= tl.total) { t = tl.total; stop(); } drawPreview(); updateTime(); if (playing) requestAnimationFrame(loop); }
$('#play').onclick = () => playing ? stop() : play();
$('#scrub').oninput = () => { stop(); t = $('#scrub').value / 1000 * tl.total; drawPreview(); updateTime(); };
$('#safeT').onchange = drawPreview;
$$('input[name=aud]').forEach(r => { r.checked = r.value === state.aud; r.onchange = () => { state.aud = r.value; audioDirty = true; save(); }; });

// ---------------- export
const FMT = [];
async function detectFormats() {
  if (FMT.length) return;
  const vOK = async (codec, w = 1080, h = 1920) => { try { return window.VideoEncoder && (await VideoEncoder.isConfigSupported({ codec, width: w, height: h, bitrate: 8e6, framerate: 30 })).supported; } catch (e) { return false; } };
  const aOK = async codec => { try { return window.AudioEncoder && (await AudioEncoder.isConfigSupported({ codec, sampleRate: 48000, numberOfChannels: 2, bitrate: 192000 })).supported; } catch (e) { return false; } };
  let avc = null; for (const c of ['avc1.640033', 'avc1.640032', 'avc1.640028', 'avc1.4d0033', 'avc1.42003e']) if (await vOK(c)) { avc = c; break; }
  const aac = await aOK('mp4a.40.2'), opus = await aOK('opus');
  const vp9 = await vOK('vp09.00.41.08') ? 'vp09.00.41.08' : (await vOK('vp09.00.10.08') ? 'vp09.00.10.08' : null);
  FMT.push({ id: 'mp4', name: 'MP4 (H.264)', desc: aac ? 'Âm thanh AAC · đăng mọi nền tảng' : opus ? 'Âm thanh Opus · nên kiểm tra trước khi đăng' : 'Không có âm thanh trên trình duyệt này', ok: !!avc && !!window.Mp4Muxer, v: avc, a: aac ? 'aac' : opus ? 'opus' : null, ext: 'mp4' });
  FMT.push({ id: 'webm', name: 'WebM (VP9)', desc: 'Âm thanh Opus · nhẹ, dùng cho web', ok: !!vp9 && !!window.WebMMuxer, v: vp9, a: opus ? 'opus' : null, ext: 'webm' });
  const mrType = ['video/mp4;codecs=avc1,mp4a.40.2', 'video/webm;codecs=vp9,opus', 'video/webm'].find(m => window.MediaRecorder && MediaRecorder.isTypeSupported(m));
  FMT.push({ id: 'rec', name: 'Ghi thời gian thực', desc: 'Dự phòng cho trình duyệt cũ · mất bằng thời lượng clip', ok: !!mrType, mime: mrType, ext: mrType && mrType.startsWith('video/mp4') ? 'mp4' : 'webm' });
  const first = FMT.find(f => f.ok);
  $('#fmtOpt').innerHTML = FMT.map(f => `<label class="${f.ok ? '' : 'dis'}"><input type="radio" name="fmt" value="${f.id}" ${f === first ? 'checked' : ''} ${f.ok ? '' : 'disabled'}><b>${f.name}</b><span>${f.ok ? f.desc : 'Trình duyệt không hỗ trợ'}</span></label>`).join('');
}
const val = n => (document.querySelector(`input[name=${n}]:checked`) || {}).value;
let lastBlob = null, lastName = '';
$('#exportBtn').onclick = async () => {
  const err = checks().filter(x => x.level === 'error');
  if (err.length) { $('#m4').innerHTML = `<span style="color:var(--red)">Còn ${err.length} lỗi ở bước Kiểm tra: ${esc(err[0].text)}</span>`; return; }
  await detectFormats(); stop();
  const f = FMT.find(x => x.id === val('fmt')); if (!f) return;
  const res = +val('res'), w = res === 1080 ? 1080 : 720, h = res === 1080 ? 1920 : 1280, fps = +val('fps'), br = +val('q') * 1e6 * (res === 1080 ? 1 : 0.55);
  const btn = $('#exportBtn'); btn.disabled = true; lastBlob = null; setDriveUI(); $('#m4d').textContent = ''; $('#outVid').style.display = 'none';
  const prog = p => { $('#prog').style.width = Math.round(p * 100) + '%'; };
  try {
    $('#m4').textContent = 'Đang dựng âm thanh…'; prog(0);
    const audio = state.aud === 'none' ? null : await E.renderAudio(tl, { music: state.aud === 'all', sfx: true });
    let blob;
    if (f.id === 'rec') blob = await recordRealtime(f, w, h, fps, br, audio, prog);
    else blob = await encodeWebCodecs(f, w, h, fps, br, audio, prog);
    lastBlob = blob; lastName = `MOVE_clip_${w}x${h}_${fps}fps.${f.ext}`;
    const v = $('#outVid'); v.src = URL.createObjectURL(blob); v.style.display = 'block';
    $('#m4').textContent = `Xong: ${lastName} · ${(blob.size / 1048576).toFixed(1)} MB · ${tl.total.toFixed(1)}s`;
    prog(1); setDriveUI();
    if (backend.auth && $('#autoDrive').checked) await saveDrive();
  } catch (e) { console.error(e); $('#m4').innerHTML = `<span style="color:var(--red)">Export lỗi: ${esc(e.message || e)}</span>`; }
  finally { btn.disabled = false; }
};
function saveFile() {
  if (!lastBlob) return;
  const a = document.createElement('a'); a.href = URL.createObjectURL(lastBlob); a.download = lastName; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 60000);
}
$('#saveBtn').onclick = saveFile;
async function saveDrive() {
  if (!lastBlob || !backend.auth) return;
  const max = (CFG.MAX_UPLOAD_MB || 35) * 1048576;
  if (lastBlob.size > max) { $('#m4d').innerHTML = `<span style="color:var(--red)">File ${(lastBlob.size / 1048576).toFixed(1)} MB vượt giới hạn ${CFG.MAX_UPLOAD_MB || 35} MB của Drive backend — export lại ở chất lượng Tiêu chuẩn hoặc 720p.</span>`; return; }
  const b = $('#driveBtn'); b.disabled = true; $('#m4d').textContent = 'Đang tải lên Google Drive…';
  try {
    const base64 = await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result.split(',')[1]); fr.onerror = rej; fr.readAsDataURL(lastBlob); });
    const j = await api('save', { name: projName(), fileName: lastName, mimeType: lastBlob.type, base64, project: await projData() });
    $('#m4d').innerHTML = `Đã lưu lên Drive: <a href="${j.fileUrl}" target="_blank" rel="noopener">video</a> · <a href="${j.folderUrl}" target="_blank" rel="noopener">thư mục</a>`; listProjects();
  } catch (e) { $('#m4d').innerHTML = `<span style="color:var(--red)">Lưu Drive lỗi: ${esc(e.message)}</span>`; }
  finally { b.disabled = false; }
}
$('#driveBtn').onclick = saveDrive;
$('#saveProj').onclick = async () => {
  $('#m2').textContent = 'Đang lưu dự án…';
  try { const j = await api('saveProject', { name: projName(), project: await projData() }); $('#m2').innerHTML = `Đã lưu dự án: <a href="${j.url}" target="_blank" rel="noopener">${esc(projName())}.json</a>`; listProjects(); }
  catch (e) { msg('#m2', e.message, true); }
};

async function encodeWebCodecs(f, w, h, fps, br, audio, prog) {
  const isMp4 = f.id === 'mp4', M = isMp4 ? Mp4Muxer : WebMMuxer;
  const muxer = new M.Muxer({
    target: new M.ArrayBufferTarget(),
    video: { codec: isMp4 ? 'avc' : 'V_VP9', width: w, height: h, frameRate: fps },
    audio: audio && f.a ? { codec: isMp4 ? f.a : 'A_OPUS', numberOfChannels: 2, sampleRate: audio.sampleRate } : undefined,
    ...(isMp4 ? { fastStart: 'in-memory' } : {}), firstTimestampBehavior: 'offset',
  });
  let encErr = null;
  const ve = new VideoEncoder({ output: (c, m) => muxer.addVideoChunk(c, m), error: e => encErr = e });
  ve.configure({ codec: f.v, width: w, height: h, bitrate: br, framerate: fps, ...(isMp4 ? { avc: { format: 'avc' } } : {}) });
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d', { alpha: false });
  const N = Math.round(tl.total * fps);
  $('#m4').textContent = 'Đang mã hóa hình…';
  for (let i = 0; i < N; i++) {
    if (encErr) throw encErr;
    x.setTransform(w / E.W, 0, 0, h / E.H, 0, 0); E.renderAt(x, tl, i / fps, {});
    const fr = new VideoFrame(c, { timestamp: Math.round(i * 1e6 / fps), duration: Math.round(1e6 / fps) });
    ve.encode(fr, { keyFrame: i % (fps * 2) === 0 }); fr.close();
    if (ve.encodeQueueSize > 8) await new Promise(r => setTimeout(r, 4));
    if (i % 10 === 0) { prog(i / N * 0.9); await new Promise(r => setTimeout(r, 0)); }
  }
  await ve.flush(); ve.close();
  if (audio && f.a) {
    $('#m4').textContent = 'Đang mã hóa âm thanh…';
    const ae = new AudioEncoder({ output: (ch, m) => muxer.addAudioChunk(ch, m), error: e => encErr = e });
    ae.configure({ codec: f.a === 'aac' && isMp4 ? 'mp4a.40.2' : 'opus', sampleRate: audio.sampleRate, numberOfChannels: 2, bitrate: 192000 });
    const L = audio.getChannelData(0), R = audio.getChannelData(1), sr = audio.sampleRate, n = Math.min(audio.length, Math.round(tl.total * sr)), step = 4800;
    for (let s = 0; s < n; s += step) {
      const k = Math.min(step, n - s), data = new Float32Array(k * 2); data.set(L.subarray(s, s + k), 0); data.set(R.subarray(s, s + k), k);
      const ad = new AudioData({ format: 'f32-planar', sampleRate: sr, numberOfFrames: k, numberOfChannels: 2, timestamp: Math.round(s / sr * 1e6), data });
      ae.encode(ad); ad.close();
    }
    await ae.flush(); ae.close(); if (encErr) throw encErr;
  }
  muxer.finalize(); prog(1);
  return new Blob([muxer.target.buffer], { type: isMp4 ? 'video/mp4' : 'video/webm' });
}
async function recordRealtime(f, w, h, fps, br, audio, prog) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
  const stream = c.captureStream(fps); const actx = new AudioContext(); await actx.resume();
  let srcN = null;
  if (audio) { const dest = actx.createMediaStreamDestination(); srcN = actx.createBufferSource(); srcN.buffer = audio; srcN.connect(dest); dest.stream.getAudioTracks().forEach(tr => stream.addTrack(tr)); }
  const rec = new MediaRecorder(stream, { mimeType: f.mime, videoBitsPerSecond: br }); const chunks = [];
  rec.ondataavailable = e => e.data.size && chunks.push(e.data);
  const done = new Promise(r => rec.onstop = r);
  $('#m4').textContent = 'Đang ghi thời gian thực…';
  rec.start(250); const start = actx.currentTime + 0.05; if (srcN) srcN.start(start);
  await new Promise(res => { const step = () => { const tt = actx.currentTime - start; x.setTransform(w / E.W, 0, 0, h / E.H, 0, 0); E.renderAt(x, tl, Math.max(0, tt), {}); prog(Math.min(1, tt / tl.total)); if (tt < tl.total) requestAnimationFrame(step); else res(); }; step(); });
  rec.stop(); await done; actx.close();
  return new Blob(chunks, { type: f.mime.split(';')[0] });
}

// ---------------- boot
if (!state.scenes.length) { state.scenes = JSON.parse(JSON.stringify(SAMPLE_SCENES)); state.raw = state.raw || ''; }
changed(); seekScene(0); loadAllImgs();
$('#projName').value = state.name || ''; $('#projName').oninput = () => { state.name = $('#projName').value; save(); };
$('#aiParse').style.display = 'none'; setDriveUI(); connect(true);
if (state.raw) $('#raw').value = state.raw;
})();
