---
name: feat-test
description: Viết và chạy test cho feature vừa implement. Bước tùy chọn, không bắt buộc trong workflow. Chạy sau /feat-code, trước các bước review. Gọi bằng /feat-test.
version: 1.0.0
---

# /feat-test - Viết & Chạy Test *(Tùy Chọn)*

> Bước này **không bắt buộc**. Dev có thể bỏ qua và chạy thẳng các bước review.

## Hành Động

### Bước 1: Đọc Session & Context

Đọc `.broccoli/session.json`:
- Nếu không có session → cảnh báo, hỏi dev có muốn tiếp tục không
- Nếu có → cập nhật `current_step` thành `feat-test`

Đọc `docs/feature/<feature_name>/implement.md` để biết danh sách task đã triển khai.

---

### Bước 2: Kiểm Tra Test Setup

Xác định project có framework test nào:

| File kiểm tra | Framework |
|---------------|-----------|
| `jest.config.*` / `vitest.config.*` | Jest / Vitest (JS/TS) |
| `phpunit.xml` / `phpunit.xml.dist` | PHPUnit (Laravel) |
| `package.json` → scripts `test` | Script test JS |
| `composer.json` → scripts `test` | Script test PHP |

Nếu **không tìm thấy** test setup → thông báo:
```
Project chưa có test setup.
Bạn muốn:
1. Bỏ qua bước test (tiếp tục review)
2. Tôi hướng dẫn cài đặt test framework phù hợp
```

---

### Bước 3: Chạy Test Hiện Có (Regression Check)

Trước khi viết test mới, chạy test suite hiện có để kiểm tra regression:

```bash
# JS/TS
npm run test -- --passWithNoTests

# Laravel/PHP
php artisan test
```

Báo cáo kết quả:
- Số test passed / failed / skipped
- Nếu có test **fail** → liệt kê rõ, hỏi dev có muốn xử lý trước không

---

### Bước 4: Viết Test Cho Code Mới

Dựa trên `implement.md`, viết test cho từng task đã hoàn thành:

**Ưu tiên viết test cho:**
- Service / business logic functions (quan trọng nhất)
- Utility functions có logic phức tạp
- API endpoints (happy path + error cases)

**Không cần test:**
- UI components đơn giản (render only)
- Migration files
- Config files

**Quy tắc viết test:**
- Mỗi function/method ít nhất 1 happy path + 1 error case
- Tên test mô tả rõ scenario: `it('should return error when amount is negative')`
- Không mock quá nhiều — test phải phản ánh behavior thực
- Hỏi dev xác nhận trước khi tạo file test mới

---

### Bước 5: Chạy Lại Test Suite

Sau khi viết test mới, chạy lại toàn bộ:

```
## Kết Quả Test

### Regression
- Test cũ: X passed / Y failed

### Test Mới
- Viết thêm: Z test cases
- Kết quả: X passed / Y failed

### Coverage (nếu có)
- Files đã cover: <danh sách>
```

Nếu có test fail → báo dev, không tự ý sửa code để test pass.

---

### Bước 6: Cập Nhật Session

Cập nhật `.broccoli/session.json`:
- `steps_completed`: thêm `"feat-test"`
- `current_step`: `"review-perf"`

```
--> Tiếp theo: /review-perf, /review-arch, /review-clean, /review-security
```

---

## Quy Tắc

- Bước này **tùy chọn** — dev có thể bỏ qua bất cứ lúc nào.
- **Không sửa code** để test pass. Nếu test fail → báo dev điều tra.
- **Không chạy** `migrate`, `seed`, hoặc lệnh có side effects lên DB production.
- Viết test **tối thiểu nhưng có giá trị** — không viết test chỉ để tăng coverage số.
- Luôn trả lời bằng **tiếng Việt**.
