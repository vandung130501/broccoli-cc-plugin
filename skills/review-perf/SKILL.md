---
name: review-perf
description: Review performance code. Dùng khi người dùng muốn kiểm tra hiệu năng, tối ưu performance, hoặc gọi /review-perf. Kiểm tra N+1 queries, memory leaks, re-renders, caching, API rate limits.
version: 1.0.0
---

# /review-perf - Review Performance

## Hành Động

1. Lấy danh sách files đã thay đổi:
   - Chạy `git diff --name-only` để lấy unstaged changes
   - Chạy `git diff --cached --name-only` để lấy staged changes
   - Kết hợp cả 2 danh sách

2. Nếu có file `.broccoli/session.json` trong project → đọc và cập nhật session:
   - Thêm `review-perf` vào `steps_completed` (nếu chưa có)
   - Cập nhật `current_step` thành `review-perf`

3. Gọi agent `perf-reviewer` với danh sách files để review.

4. Hiển thị kết quả review theo format:

```
## Review Performance

### Critical
- <file>:<line> - <vấn đề>
  -> Đề xuất: <giải pháp>

### Warning
- <file>:<line> - <vấn đề>
  -> Đề xuất: <giải pháp>

### Info
- <file>:<line> - <gợi ý>

Tổng: X Critical | Y Warning | Z Info
```

5. Gợi ý tiếp theo:
   - Nếu có Critical → "Nên sửa trước khi tiếp tục"
   - Nếu không → gợi ý chạy `/review-arch`, `/review-clean`, `/review-security`

## Quy Tắc

- Chỉ review files có thay đổi (git diff), không review toàn bộ project.
- Nếu không có files thay đổi → thông báo "Không có code thay đổi để review".
- Luôn trả lời bằng tiếng Việt.
