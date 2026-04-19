---
name: feat-analyze
description: Phân tích yêu cầu tính năng mới. Đọc file task.md, hỏi làm rõ yêu cầu với dev, khám phá codebase, viết plan.md. Đây là bước đầu tiên của Feature Workflow. Gọi bằng /feat-analyze <feature-name>.
version: 1.1.0
---

# /feat-analyze - Phân Tích Yêu Cầu & Viết Plan

## Cách Gọi

```
/feat-analyze <feature-name>
```

Nếu không có `<feature-name>`, hỏi dev tên feature trước khi làm bất cứ điều gì.

---

## Hành Động

### Bước 1: Đọc Tài Liệu Yêu Cầu

Đọc `docs/feature/<feature-name>/task.md`.

**Nếu file không tồn tại**, thông báo:
```
Chưa có file docs/feature/<feature-name>/task.md.

Vui lòng tạo file theo format trong:
  skills/feat-analyze/task-template.md

Điền đầy đủ yêu cầu, sau đó gõ "done" để tiếp tục.
```
Dừng lại, chờ dev xác nhận rồi đọc lại file trước khi tiếp tục.

**Nếu file tồn tại**, tóm tắt ngắn nội dung đã đọc được.

---

### Bước 2: Hỏi Làm Rõ Yêu Cầu

Đặt câu hỏi để làm rõ những điểm còn mơ hồ. Hỏi từng nhóm, tối đa 3-4 câu mỗi lượt.

Các khía cạnh cần làm rõ nếu task.md chưa đề cập:
- **Scope**: làm chính xác gì, không làm gì
- **User flow**: luồng từng bước cụ thể
- **Edge cases**: xử lý lỗi, trường hợp ngoại lệ
- **Ràng buộc**: giới hạn kỹ thuật, API bên ngoài
- **Acceptance criteria**: khi nào thì done

Dừng khi dev nói "đủ rồi", "tiếp tục", hoặc "ok".

---

### Bước 3: Khám Phá Codebase

Tự động phân tích project sau khi yêu cầu đã rõ:

1. **Xác định stack**: kiểm tra `package.json`, `composer.json`, `shopify.app.toml`
2. **Tìm files liên quan**: search keywords, trace data flow từ route → service → model
3. **Hiểu cấu trúc**: design patterns, DB schema, naming conventions

---

### Bước 4: Tạo Session Tracking

Tạo `.broccoli/session.json`:

```json
{
  "workflow": "feature",
  "feature_name": "<feature-name>",
  "description": "<mô tả ngắn từ task.md>",
  "current_step": "feat-analyze",
  "steps_completed": [],
  "started_at": "<ISO timestamp>"
}
```

Nếu đã có session cũ → hỏi xác nhận trước khi ghi đè.

---

### Bước 5: Viết plan.md

Tạo `docs/feature/<feature-name>/plan.md` theo format trong `skills/feat-analyze/plan-template.md`.

Nội dung phải dựa trên thực tế codebase khám phá ở Bước 3, không phỏng đoán.

Sau khi tạo, thông báo đường dẫn file.

---

### Bước 6: Cập Nhật Session & Gợi Ý Tiếp Theo

Cập nhật `.broccoli/session.json`:
- `steps_completed`: thêm `"feat-analyze"`
- `current_step`: `"feat-plan"`

```
--> Tiếp theo: /feat-plan để chia task và xác nhận plan trước khi code
```

---

## Quy Tắc

- Đây là bước **ĐẦU TIÊN** của Feature Workflow.
- **Không code, không sửa file source**. Chỉ đọc, hỏi, và viết tài liệu.
- Phải **hỏi cho đến khi đủ rõ** — không viết plan khi còn điểm mơ hồ.
- Session chỉ được tạo **sau khi** đã có description từ task.md.
- Luôn trả lời bằng **tiếng Việt**.
