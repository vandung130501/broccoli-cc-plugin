---
name: review-security
description: Review bảo mật code. Dùng khi người dùng muốn kiểm tra security, injection, XSS, secrets, auth, OWASP, hoặc gọi /review-security.
version: 1.0.0
---

# /review-security - Review Bảo Mật

## Hành Động

1. Lấy danh sách files đã thay đổi:
   - Chạy `git diff --name-only` để lấy unstaged changes
   - Chạy `git diff --cached --name-only` để lấy staged changes
   - Kết hợp cả 2 danh sách

2. Nếu có file `.broccoli/session.json` trong project → đọc và cập nhật session:
   - Thêm `review-security` vào `steps_completed` (nếu chưa có)
   - Cập nhật `current_step` thành `review-security`

3. Gọi agent `security-reviewer` với danh sách files để review.

4. Hiển thị kết quả review theo format:

```
## Review Bảo Mật

### CRITICAL
- <file>:<line> - <lỗ hổng>
  -> Đề xuất: <cách fix>
  -> Ref: OWASP <mã>

### HIGH
- <file>:<line> - <lỗ hổng>
  -> Đề xuất: <cách fix>

### MEDIUM
- <file>:<line> - <rủi ro>
  -> Đề xuất: <cách fix>

### Passed
- <điểm tốt về bảo mật>

Tổng: X Critical | Y High | Z Medium | W Passed
```

5. Gợi ý tiếp theo:
   - Nếu có CRITICAL → "PHẢI sửa trước khi deploy. Không được bỏ qua."
   - Nếu có HIGH → "Nên sửa trước khi tạo MR"
   - Nếu không → gợi ý chạy các review khác hoặc commit

## Quy Tắc

- Chỉ review files có thay đổi (git diff), không review toàn bộ project.
- Không false positive: chỉ báo khi thực sự có rủi ro bảo mật.
- CRITICAL và HIGH phải có đề xuất fix cụ thể.
- Reference OWASP category cho findings nghiêm trọng.
- Nếu không có files thay đổi → thông báo "Không có code thay đổi để review".
- Luôn trả lời bằng tiếng Việt.
