/**
 * MOVE Clip Studio — backend Google Apps Script
 * Lưu video + dự án vào 1 thư mục Google Drive cố định, và (tuỳ chọn) gọi Claude API để kiểm tra content.
 *
 * Script properties (Project Settings → Script properties):
 *   TEAM_PASSCODE      bắt buộc — mã truy cập của team (KHÔNG đưa lên GitHub)
 *   FOLDER_ID          tuỳ chọn — ghi đè thư mục mặc định (DEFAULT_FOLDER_ID bên dưới)
 *   ANTHROPIC_API_KEY  tuỳ chọn — bật nút "Kiểm tra & chia cảnh với Claude"
 *   MODEL              tuỳ chọn — mặc định claude-sonnet-5-5
 *
 * Deploy → New deployment → Web app → Execute as: Me · Who has access: Anyone
 */
const PROPS = PropertiesService.getScriptProperties();
// Thư mục cố định: 1.MOVE MATERIAL 2026 / MOVE Clip Studio
const DEFAULT_FOLDER_ID = '1toRjJ2Wbz3REkiwdW8CRxy3R9722T_Ib';

function doGet() { return out({ ok: true, app: 'MOVE Clip Studio backend' }); }
function doPost(e) {
  let p = {};
  try { p = JSON.parse(e.postData.contents); } catch (err) { return out({ ok: false, error: 'Bad request' }); }
  try { return out(handle(p)); } catch (err) { return out({ ok: false, error: String(err && err.message || err) }); }
}
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function root() {
  const id = PROPS.getProperty('FOLDER_ID') || DEFAULT_FOLDER_ID;
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  const f = DriveApp.createFolder('MOVE Clip Studio');
  PROPS.setProperty('FOLDER_ID', f.getId());
  return f;
}
function sub(name) { const r = root(), it = r.getFoldersByName(name); return it.hasNext() ? it.next() : r.createFolder(name); }
function safeName(s) { return String(s || 'clip').replace(/[\\/:*?"<>|]/g, '-').slice(0, 120); }
function stamp() { return Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyyMMdd-HHmm'); }

function handle(p) {
  const pass = PROPS.getProperty('TEAM_PASSCODE');
  if (!pass) return { ok: false, error: 'Backend chưa đặt TEAM_PASSCODE' };
  if (p.passcode !== pass) return { ok: false, error: 'Sai mã truy cập', auth: false };

  switch (p.action) {
    case 'ping':
      return { ok: true, auth: true, ai: !!PROPS.getProperty('ANTHROPIC_API_KEY'), folderUrl: root().getUrl() };

    case 'saveProject': {
      const name = safeName(p.name) + '.json';
      const f = upsert(sub('Projects'), name, JSON.stringify(p.project), 'application/json');
      return { ok: true, id: f.getId(), url: f.getUrl(), folderUrl: root().getUrl() };
    }

    case 'save': {
      if (!p.base64 || !p.fileName) return { ok: false, error: 'Thiếu file' };
      const base = safeName(p.name || 'clip') + '_' + stamp();
      const ext = (p.fileName.match(/\.(mp4|webm)$/i) || ['', 'mp4'])[1];
      const blob = Utilities.newBlob(Utilities.base64Decode(p.base64), p.mimeType || 'video/mp4', base + '.' + ext);
      const file = sub('Videos').createFile(blob);
      let projectUrl = null;
      if (p.project) projectUrl = upsert(sub('Projects'), safeName(p.name || 'clip') + '.json', JSON.stringify(p.project), 'application/json').getUrl();
      return { ok: true, fileUrl: file.getUrl(), projectUrl, folderUrl: root().getUrl() };
    }

    case 'list': {
      const it = sub('Projects').getFiles(), items = [];
      while (it.hasNext()) { const f = it.next(); items.push({ id: f.getId(), name: f.getName().replace(/\.json$/, ''), updated: f.getLastUpdated().toISOString() }); }
      items.sort((a, b) => b.updated.localeCompare(a.updated));
      return { ok: true, items: items.slice(0, 200) };
    }

    case 'get': {
      const f = DriveApp.getFileById(p.id), projId = sub('Projects').getId();
      let inside = false; const ps = f.getParents(); while (ps.hasNext()) if (ps.next().getId() === projId) inside = true;
      if (!inside) return { ok: false, error: 'Không có quyền đọc file này' };
      return { ok: true, project: JSON.parse(f.getBlob().getDataAsString('UTF-8')) };
    }

    case 'ai': {
      const key = PROPS.getProperty('ANTHROPIC_API_KEY');
      if (!key) return { ok: false, error: 'Chưa cấu hình ANTHROPIC_API_KEY' };
      const r = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
        method: 'post', contentType: 'application/json', muteHttpExceptions: true,
        headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        payload: JSON.stringify({ model: PROPS.getProperty('MODEL') || 'claude-sonnet-5-5', max_tokens: 8000, messages: [{ role: 'user', content: String(p.prompt || '').slice(0, 60000) }] }),
      });
      const j = JSON.parse(r.getContentText());
      if (r.getResponseCode() !== 200) return { ok: false, error: (j.error && j.error.message) || ('HTTP ' + r.getResponseCode()) };
      return { ok: true, text: (j.content || []).map(c => c.text || '').join('') };
    }
  }
  return { ok: false, error: 'Unknown action' };
}

function upsert(folder, name, content, mime) {
  const it = folder.getFilesByName(name);
  if (it.hasNext()) { const f = it.next(); f.setContent(content); return f; }
  return folder.createFile(name, content, mime);
}
