---
name: review-arch
description: Review kiến trúc code. Dùng khi người dùng muốn kiểm tra architecture, design patterns, dependencies, separation of concerns, hoặc gọi /review-arch.
version: 1.0.0
---

# /review-arch - Review Kiến Trúc

## Hành Động

1. Lấy danh sách files đã thay đổi:
   - Chạy `git diff --name-only` để lấy unstaged changes
   - Chạy `git diff --cached --name-only` để lấy staged changes
   - Kết hợp cả 2 danh sách

2. Nếu có file `.broccoli/session.json` trong project → đọc và cập nhật session:
   - Thêm `review-arch` vào `steps_completed` (nếu chưa có)
   - Cập nhật `current_step` thành `review-arch`

3. Gọi agent `arch-reviewer` với danh sách files để review. Agent sẽ đọc thêm files xung quanh để hiểu context kiến trúc.

4. Hiển thị kết quả review theo format:

```
## Review Kiến Trúc

### Critical
- <vấn đề kiến trúc nghiêm trọng>
  -> Đề xuất: <giải pháp>

### Warning
- <vấn đề nên cải thiện>
  -> Đề xuất: <giải pháp>

### Passed
- <điểm tốt trong kiến trúc>

Tổng: X Critical | Y Warning | Z Passed
```

5. Gợi ý tiếp theo:
   - Nếu có Critical → "Nên sửa trước khi tiếp tục"
   - Nếu không → gợi ý chạy các review khác chưa chạy

## Quy Tắc

- Chỉ review files có thay đổi, nhưng ĐƯỢC ĐỌC thêm files xung quanh để hiểu context.
- Nếu không có files thay đổi → thông báo "Không có code thay đổi để review".
- Luôn trả lời bằng tiếng Việt.
