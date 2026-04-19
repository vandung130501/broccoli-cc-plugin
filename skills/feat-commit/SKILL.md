---
name: feat-commit
description: Tạo commit cho feature theo Conventional Commits. Dùng khi người dùng muốn commit code feature, hoặc gọi /feat-commit. Chạy sau khi đã review.
version: 1.0.0
---

# /feat-commit - Commit Feature

## Hành Động

### Bước 1: Đọc Session

Đọc `.broccoli/session.json`:
- Nếu không có session → vẫn cho phép commit, nhưng nhắc về workflow
- Nếu có → cập nhật `current_step` thành `feat-commit`

### Bước 2: Kiểm Tra Changes

1. Chạy `git status` để xem files thay đổi
2. Chạy `git diff` và `git diff --cached` để xem nội dung thay đổi
3. Nếu không có changes → thông báo "Không có thay đổi để commit"

### Bước 3: Tạo Commit Message

Phân tích changes và tạo message theo Conventional Commits:

```
feat(<scope>): <mô tả ngắn>

<body - liệt kê chi tiết thay đổi>

Refs: #<issue-number nếu có>
```

Quy tắc commit message:
- Type: `feat` (vì đây là feature workflow)
- Scope: module/area chính bị ảnh hưởng (billing, auth, cart...)
- Subject: tối đa 72 ký tự, thể mệnh lệnh, không dấu chấm cuối
- Body: liệt kê thay đổi chính bằng bullet points
- Footer: reference GitLab issue nếu có

### Bước 4: Xác Nhận & Commit

1. Hiển thị commit message cho dev review
2. Hỏi: "Bạn xác nhận commit với message trên?"
3. Nếu dev đồng ý:
   - Stage files cần thiết (hỏi dev muốn stage gì, KHÔNG dùng `git add -A`)
   - Thực hiện commit
4. Nếu dev muốn sửa → điều chỉnh message

### Bước 5: Gợi Ý MR

Sau khi commit thành công:

```
Commit thành công!

Gợi ý tạo Merge Request:
- Title: feat(<scope>): <mô tả>
- Branch: <branch hiện tại>
- Target: <main/develop>

Bạn có muốn push và tạo MR không?
```

### Bước 6: Cập Nhật Session

Cập nhật `.broccoli/session.json`:
- Thêm `feat-commit` vào `steps_completed`
- Gợi ý chạy `/feat-doc` để viết tài liệu

## Quy Tắc

- KHÔNG commit files có thể chứa secrets (.env, credentials).
- KHÔNG dùng `git add -A` ho���c `git add .`. Stage từng file cụ thể.
- KHÔNG push trừ khi dev yêu cầu.
- Commit message phải phản ánh đúng thay đổi thực tế.
- Nếu có quá nhiều changes không liên quan → gợi ý chia thành nhiều commits.
- Luôn trả lời bằng tiếng Việt.
