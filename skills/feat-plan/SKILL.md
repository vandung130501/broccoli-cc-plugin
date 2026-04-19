---
name: feat-plan
description: Review và xác nhận plan triển khai tính năng. Đọc plan.md do /feat-analyze tạo ra, refine cùng dev, xác nhận trước khi code. Chạy sau /feat-analyze.
version: 1.1.0
---

# /feat-plan - Review & Xác Nhận Plan

## Hành Động

### Bước 1: Đọc Session & Plan

Đọc `.broccoli/session.json`:
- Nếu không có session → nhắc dev chạy `/feat-analyze <feature-name>` trước
- Nếu có → lấy `feature_name`, cập nhật `current_step` thành `feat-plan`

Đọc `docs/feature/<feature_name>/plan.md`:
- Nếu không có file → nhắc dev chạy `/feat-analyze` để tạo plan trước
- Nếu có → đọc toàn bộ nội dung

---

### Bước 2: Review Plan Cùng Dev

Trình bày lại plan đã đọc một cách rõ ràng, hỏi dev:

1. **Kiểm tra tính đầy đủ:**
   - Có file nào bị thiếu không?
   - Thứ tự triển khai có hợp lý không?
   - Có side effects nào chưa được đề cập không?

2. **Kiểm tra tính khả thi:**
   - Có phần nào quá phức tạp cần chia nhỏ không?
   - Có dependency bên ngoài nào cần chuẩn bị trước không?

3. **Hỏi dev xác nhận hoặc điều chỉnh:**
   ```
   Plan này đã đầy đủ chưa? Bạn muốn điều chỉnh gì không?
   ```

---

### Bước 3: Cập Nhật plan.md (nếu có thay đổi)

Nếu dev yêu cầu điều chỉnh → sửa trực tiếp `docs/feature/<feature_name>/plan.md`.

Sau khi sửa → hỏi lại xác nhận cho đến khi dev approve.

---

### Bước 4: Tạo File implement.md

Dựa trên `plan.md` đã được xác nhận, chia nhỏ thành các task con cụ thể và tạo file `docs/feature/<feature_name>/implement.md`.

**Nguyên tắc chia task:**
- Mỗi task là 1 đơn vị nhỏ, độc lập, có thể code và test riêng
- Ưu tiên thứ tự: DB/migration → models → services → routes/controllers → UI
- Mỗi task nên rõ: làm gì, trong file nào, output là gì

**Format file:**

```markdown
# Implement: <Tên Tính Năng>

> Được tạo bởi /feat-plan | <ngày tháng>

## Danh Sách Task

### Task 1: <tên task ngắn gọn>
- **File**: `<path>`
- **Làm gì**: <mô tả cụ thể>
- **Output**: <kết quả mong đợi sau khi xong task này>

### Task 2: <tên task>
- **File**: `<path>`
- **Làm gì**: <mô tả cụ thể>
- **Output**: <kết quả mong đợi>

...

## Thứ Tự Ưu Tiên
1. Task X (vì Y phụ thuộc vào nó)
2. Task Y
3. ...

## Ghi Chú
- <dependency giữa các task nếu có>
- <điểm cần chú ý khi triển khai>
```

Sau khi tạo file, tóm tắt danh sách task cho dev xem.

---

### Bước 5: Xác Nhận & Chuyển Sang Code

Hỏi dev xác nhận danh sách task trong `implement.md`:
- Nếu cần điều chỉnh → sửa `implement.md` theo yêu cầu
- Khi dev approve → tiếp tục

Cập nhật `.broccoli/session.json`:
- `steps_completed`: thêm `"feat-plan"`
- `current_step`: `"feat-code"`

Thông báo:
```
Plan và danh sách task đã được xác nhận.
File implement.md: docs/feature/<feature_name>/implement.md

--> Tiếp theo: chạy /feat-code để triển khai từng task theo thứ tự
```

---

## Quy Tắc

- **Không code trong bước này**. Chỉ review và xác nhận plan.
- Phải có **sự đồng ý rõ ràng** của dev trước khi kết thúc skill.
- Nếu phát hiện plan có vấn đề lớn → đề xuất quay lại `/feat-analyze` để phân tích lại.
- Nếu tính năng quá lớn → đề xuất chia nhỏ thành nhiều phases, mỗi phase là 1 MR.
- Follow patterns đã có trong project, không tự tạo pattern mới nếu không cần thiết.
- Luôn trả lời bằng **tiếng Việt**.
