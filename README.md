# MOVE Clip Studio

Web app nội bộ team Media MOVE: **nhập content → kiểm tra → tạo clip animation 9:16 → chọn định dạng → export**, theo MOVE Brand Guideline 2026. Video, dự án được lưu vào **một thư mục Google Drive cố định** của team.

## 1. Bật GitHub Pages
Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
Link web: `https://joonngo.github.io/Animation/`

## 2. Backend lưu Google Drive (Apps Script) — làm 1 lần, bằng tài khoản Google của team
1. Vào https://script.google.com → **New project** → dán toàn bộ `apps-script/Code.gs`.
2. **Project Settings → Script properties**, thêm:
   | Key | Giá trị |
   |---|---|
   | `TEAM_PASSCODE` | mã truy cập team (bắt buộc, không đưa lên GitHub) |
   | `FOLDER_ID` | ID thư mục Drive cố định (tuỳ chọn — bỏ trống sẽ tự tạo "MOVE Clip Studio") |
   | `ANTHROPIC_API_KEY` | tuỳ chọn — bật nút "Kiểm tra & chia cảnh với Claude" (tính phí API) |
3. **Deploy → New deployment → Web app** · Execute as: **Me** · Who has access: **Anyone** → Deploy → cấp quyền Drive → copy **Web app URL**.
4. Dán URL vào `config.js` → `APPS_SCRIPT_URL` → commit.

Thư mục Drive: `Videos/` (file MP4/WebM) và `Projects/` (JSON dự án, mở lại để sửa tiếp).

## 3. Dùng
Mở web → nhập **mã truy cập team** ở bước 1 → Kết nối. Không có mã vẫn dùng đầy đủ, chỉ tải clip về máy.

## Ghi chú
- Export dùng WebCodecs: Chrome / Edge mới. Giới hạn upload Drive ~35 MB (clip 45s 1080p chất lượng Tiêu chuẩn vừa đủ).
- Âm thanh (SFX + nhạc nền) tự tổng hợp trong trình duyệt — không dùng âm thanh bên ngoài.
- Font Mona Sans / Josefin Sans tải từ Google Fonts. Logo, motif, pattern trích từ Brand Guideline 2026.
- Sau khi sửa `apps-script/Code.gs`: Deploy → Manage deployments → Edit → New version (giữ nguyên URL).
