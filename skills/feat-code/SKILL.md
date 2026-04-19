---
name: feat-code
description: Triển khai code tính năng mới theo từng task trong implement.md. Dùng khi người dùng muốn bắt đầu code, implement feature, hoặc gọi /feat-code. Chạy sau /feat-plan.
version: 1.1.0
---

# /feat-code - Triển Khai Code

## Hành Động

### Bước 1: Đọc Session & Files Kế Hoạch

Đọc `.broccoli/session.json`:
- Nếu không có session → nhắc dev chạy `/feat-analyze` trước
- Nếu có → lấy `feature_name`, cập nhật `current_step` thành `feat-code`

Đọc 2 files để nắm context:
1. `docs/feature/<feature_name>/plan.md` — hiểu tổng quan kiến trúc, stack, patterns
2. `docs/feature/<feature_name>/implement.md` — danh sách task cần triển khai theo thứ tự

Nếu `implement.md` không tồn tại → nhắc dev chạy `/feat-plan` trước.

---

### Bước 2: Xác Định Task Tiếp Theo

Đọc `implement.md`, tìm task **đầu tiên chưa được đánh dấu hoàn thành**.

Hiển thị cho dev:
```
Task hiện tại: <tên task>
File: <path>
Làm gì: <mô tả>
Output mong đợi: <output>

Còn lại: X task chưa làm / Y task tổng

Bắt đầu task này không?
```

- Nếu dev đồng ý → tiến hành Bước 3
- Nếu dev muốn bỏ qua hoặc chọn task khác → cho phép, nhưng ghi chú lý do

---

### Bước 3: Triển Khai Task

Code task hiện tại theo đúng mô tả trong `implement.md`:

1. **Xác nhận trước khi sửa**: Mô tả ngắn sẽ làm gì trong file, hỏi dev xác nhận trước khi thực sự viết code.
2. **Code từng phần nhỏ**: Không dump toàn bộ code 1 lần. Chia theo function hoặc logical unit nếu file lớn.
3. **Áp dụng coding standards** theo ngôn ngữ:
   - `.ts`, `.tsx`, `.js`, `.jsx` → `rules/javascript-typescript.md`
   - `.php` → `rules/php-laravel.md`
   - Project Shopify → `rules/shopify.md` (áp dụng thêm)
   - Mọi file → `rules/general.md`
4. **Giải thích ngắn**: Sau khi xong 1 đơn vị logic, tóm tắt 1-2 câu đã làm gì và tại sao.

**Xử lý các tình huống đặc biệt:**
- Cần tạo migration → tạo file migration, **KHÔNG chạy migrate**
- Cần env variable mới → nhắc dev thêm vào `.env`, không hardcode
- Phát hiện task bị block (phụ thuộc task khác chưa xong) → báo dev, hỏi có muốn làm task kia trước không
- Phát hiện plan/implement chưa hợp lý → dừng lại, báo dev cụ thể vấn đề gì, gợi ý quay lại `/feat-plan`

---

### Bước 4: Đánh Dấu Task Hoàn Thành

Sau khi code xong 1 task, cập nhật `implement.md` — thêm `[x]` vào đầu tên task:

```markdown
### [x] Task 1: <tên task>   ← đánh dấu xong
### Task 2: <tên task>        ← chưa làm
```

Tóm tắt ngắn task vừa xong:
```
✓ Task <tên> hoàn thành
  - <file đã tạo/sửa>: <thay đổi gì>

Còn lại: X task
Tiếp tục task tiếp theo không?
```

---

### Bước 5: Lặp Lại Hoặc Kết Thúc

- **Nếu còn task** → quay lại Bước 2, làm task tiếp theo
- **Nếu hết task** → xuất tổng kết và cập nhật session:

```
## Đã Triển Khai Xong

### Files Đã Tạo
- <file path> - <mô tả ngắn>

### Files Đã Sửa
- <file path> - <thay đổi gì>

### Lưu Ý Cho Dev
- <env variables cần thêm nếu có>
- <migration cần chạy nếu có>
- <điểm cần test thủ công>

--> Tiếp theo: chạy /review-perf, /review-arch, /review-clean, /review-security
```

Cập nhật `.broccoli/session.json`:
- `steps_completed`: thêm `"feat-code"`
- `current_step`: `"review-perf"` (bước review đầu tiên)

---

## Quy Tắc

- **LUÔN hỏi xác nhận** trước khi sửa hoặc tạo file. Không tự ý thay đổi.
- **Làm từng task một** theo thứ tự trong `implement.md`. Không nhảy task.
- **KHÔNG thêm tính năng ngoài task**. Nếu thấy cần thêm → báo dev, gợi ý cập nhật `implement.md`.
- **KHÔNG refactor code xung quanh** không liên quan đến task đang làm.
- **KHÔNG chạy lệnh có side effects**: migrate, seed, npm install, restart server.
- Nếu 1 task quá lớn → đề xuất chia nhỏ thêm trước khi bắt đầu.
- Không hardcode values. Dùng constants, config, env variables.
- Luôn trả lời bằng **tiếng Việt**.
