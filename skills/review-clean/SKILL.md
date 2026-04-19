---
name: review-clean
description: Review clean code. Dùng khi người dùng muốn kiểm tra code quality, naming, readability, DRY, coding standards, hoặc gọi /review-clean.
version: 1.0.0
---

# /review-clean - Review Clean Code

## Hành Động

1. Lấy danh sách files đã thay đổi:
   - Chạy `git diff --name-only` để lấy unstaged changes
   - Chạy `git diff --cached --name-only` để lấy staged changes
   - Kết hợp cả 2 danh sách

2. Nếu có file `.broccoli/session.json` trong project → đọc và cập nhật session:
   - Thêm `review-clean` vào `steps_completed` (nếu chưa có)
   - Cập nhật `current_step` thành `review-clean`

3. Gọi agent `clean-reviewer` với danh sách files để review.

4. Hiển thị kết quả review theo format:

```
## Review Clean Code

### Cần Sửa
- <file>:<line> - <vấn đề>
  -> Đề xuất: <giải pháp cụ thể>

### Cần Xem Lại
- <file>:<line> - <vấn đề>
  -> Đề xuất: <giải pháp>

### Passed
- <điểm tốt>

Tổng: X Cần Sửa | Y Cần Xem Lại | Z Passed
```

5. Gợi ý tiếp theo:
   - Nếu có "Cần Sửa" → gợi ý sửa trước
   - Nếu không → gợi ý chạy các review khác chưa chạy

## Quy Tắc

- Chỉ review files có thay đổi (git diff), không review toàn bộ project.
- Áp dụng coding standards từ rules/ tương ứng với ngôn ngữ của file.
- Cân bằng giữa clean code và pragmatism - không quá khắt khe với changes nhỏ.
- Nếu không có files thay đổi → thông báo "Không có code thay đổi để review".
- Luôn trả lời bằng tiếng Việt.
