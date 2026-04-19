---
name: bug-test
description: Verify bug đã fix bằng test. Bước tùy chọn, không bắt buộc. Chạy sau /bug-fix, trước các bước review. Gọi bằng /bug-test.
version: 1.0.0
---

# /bug-test - Verify Fix Bằng Test *(Tùy Chọn)*

> Bước này **không bắt buộc**. Dev có thể bỏ qua và chạy thẳng các bước review.

## Hành Động

### Bước 1: Đọc Session & Context

Đọc `.broccoli/session.json`:
- Nếu không có session → cảnh báo, hỏi dev có muốn tiếp tục không
- Nếu có → cập nhật `current_step` thành `bug-test`

Lấy thông tin từ conversation history:
- Root cause đã xác định
- Files đã sửa

---

### Bước 2: Kiểm Tra Test Setup

Xác định project có framework test nào (jest, vitest, phpunit). Nếu không có → thông báo và hỏi dev có muốn bỏ qua không.

---

### Bước 3: Reproduce Bug Trước Fix

Nếu có test liên quan đến bug → chạy trước để xác nhận test đang fail (chứng minh bug tồn tại):

```bash
npm run test -- <file-liên-quan>
# hoặc
php artisan test --filter <TestClass>
```

Nếu test đang pass dù bug tồn tại → nghĩa là chưa có test cover case này → chuyển sang Bước 4.

---

### Bước 4: Viết Test Cho Bug Case

Viết test reproduce đúng scenario của bug vừa fix:
- Test phải **fail** nếu revert lại fix
- Test phải **pass** với code hiện tại
- Đặt tên rõ: `it('should not subtract shipping when applying discount')`

Hỏi dev xác nhận trước khi tạo file test mới.

---

### Bước 5: Chạy Regression Check

Chạy toàn bộ test suite để đảm bảo fix không phá chỗ khác:

```
## Kết Quả Test

### Bug Case
- <tên test>: passed ✓

### Regression
- Test cũ: X passed / Y failed

### Kết Luận
- Bug đã fix và không gây regression: <có/không>
```

Nếu có test fail → báo dev, không tự ý sửa.

---

### Bước 6: Cập Nhật Session

Cập nhật `.broccoli/session.json`:
- `steps_completed`: thêm `"bug-test"`
- `current_step`: `"review-perf"`

```
--> Tiếp theo: /review-perf, /review-arch, /review-clean, /review-security
```

---

## Quy Tắc

- Bước này **tùy chọn** — dev có thể bỏ qua bất cứ lúc nào.
- **Không sửa code** để test pass. Test fail → báo dev.
- Test viết ra phải thực sự verify bug case, không viết test chung chung cho có.
- Luôn trả lời bằng **tiếng Việt**.
