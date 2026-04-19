---
name: bug-commit
description: Tạo commit cho bugfix theo Conventional Commits. Dùng khi người dùng muốn commit code fix bug, hoặc gọi /bug-commit. Chạy sau khi đã review.
version: 1.0.0
---

# /bug-commit - Commit Bugfix

## Hành Động

### Bước 1: Đọc Session

Đọc `.broccoli/session.json`:
- Nếu không có session → vẫn cho phép commit, nhưng nhắc về workflow
- Nếu có → cập nhật `current_step` thành `bug-commit`

### Bước 2: Kiểm Tra Changes

1. Chạy `git status` để xem files thay đổi
2. Chạy `git diff` và `git diff --cached` để xem nội dung thay đổi
3. Nếu không có changes → thông báo "Không có thay đổi để commit"

### Bước 3: Tạo Commit Message

Phân tích changes và tạo message theo Conventional Commits:

```
fix(<scope>): <mô tả ngắn vấn đề đã fix>

Root cause: <giải thích ngắn nguyên nhân>
Fix: <giải thích ngắn cách fix>

Refs: #<issue-number nếu có>
```

Quy tắc commit message:
- Type: `fix` (vì đây là bugfix workflow)
- Scope: module/area bị bug (cart, auth, billing...)
- Subject: mô tả BUG ĐÃ FIX, không phải mô tả code đã sửa
- Body: giải thích root cause và cách fix
- Footer: reference GitLab issue

### Bước 4: Xác Nhận & Commit

1. Hiển thị commit message cho dev review
2. Hỏi: "Bạn xác nhận commit với message trên?"
3. Nếu dev đồng ý:
   - Stage files cần thiết (KHÔNG dùng `git add -A`)
   - Thực hiện commit
4. Nếu dev muốn sửa → điều chỉnh message

### Bước 5: Cập Nhật Session

Cập nhật `.broccoli/session.json`:
- `steps_completed`: thêm `"bug-commit"`
- `current_step`: `"done"`

### Bước 6: Gợi Ý MR

```
Bugfix workflow hoàn thành!

Gợi ý tạo Merge Request:
- Title: fix(<scope>): <mô tả>
- Branch: <branch hiện tại>
- Target: <main/develop>

Bạn có muốn push và tạo MR không?
```

## Quy Tắc

- KHÔNG commit files có thể chứa secrets (.env, credentials).
- KHÔNG dùng `git add -A` hoặc `git add .`. Stage từng file cụ thể.
- KHÔNG push trừ khi dev yêu cầu.
- Commit message phải m�� tả BUG, không phải CODE. Dev đọc message phải hiểu bug gì đã fix.
- Luôn trả lời bằng tiếng Việt.
