---
name: feat-doc
description: Viết tài liệu cho feature vừa phát triển. Tạo logic.md cho Tester/PO và technical.md cho Developer. Chạy sau khi feat-code và đã hoàn thành 4 bước review.
version: 1.1.0
---

# /feat-doc - Viết Tài Liệu Feature

## Hành Động

### Bước 1: Kiểm Tra Điều Kiện

Đọc `.broccoli/session.json`:
- Nếu không có session → cảnh báo, hỏi dev có muốn tiếp tục không
- Nếu có → kiểm tra `steps_completed`

**Các bước bắt buộc phải hoàn thành trước:**
- `feat-code`
- `review-perf`, `review-arch`, `review-clean`, `review-security`

Nếu thiếu bước nào → liệt kê rõ bước còn thiếu và cảnh báo:
```
Chưa hoàn thành: <danh sách bước thiếu>
Nên chạy đủ các bước trên trước khi viết tài liệu.
Bạn vẫn muốn tiếp tục không?
```

---

### Bước 2: Đọc Context Từ Files

Đọc các files sau để lấy đủ thông tin viết tài liệu:

| File | Lấy gì |
|------|--------|
| `docs/feature/<feature_name>/task.md` | Yêu cầu gốc, acceptance criteria |
| `docs/feature/<feature_name>/plan.md` | Stack, DB changes, files thay đổi, env vars |
| `docs/feature/<feature_name>/implement.md` | Danh sách task đã triển khai |

Không dựa vào conversation history — chỉ dùng nội dung từ files trên.

---

### Bước 3: Tạo `logic.md`

Tạo `docs/feature/<feature_name>/logic.md` theo format trong `skills/feat-doc/logic-template.md`.

Quy tắc nội dung:
- Ngôn ngữ dễ hiểu, **không chứa code, SQL, thuật ngữ kỹ thuật**
- Focus vào user behavior và kết quả, không phải cách implement
- Checklist test phải cover happy path, edge cases, error cases

---

### Bước 4: Tạo `technical.md`

Tạo `docs/feature/<feature_name>/technical.md` theo format trong `skills/feat-doc/technical-template.md`.

Quy tắc nội dung:
- Bám sát thực tế: files, endpoints, DB changes lấy từ `plan.md` và `implement.md`
- Lưu ý maintain phải cụ thể, thực tiễn — không chung chung

---

### Bước 5: Cập Nhật Session

Cập nhật `.broccoli/session.json`:
- `steps_completed`: thêm `"feat-doc"`
- `current_step`: `"feat-commit"`

```
Đã tạo tài liệu:
- docs/feature/<feature_name>/logic.md     (Tester / PO)
- docs/feature/<feature_name>/technical.md (Developer)

--> Tiếp theo: /feat-commit để tạo commit
```

---

## Quy Tắc

- Nội dung phải từ **thực tế files** trong `docs/feature/`. KHÔNG bịa thông tin.
- Hỏi dev xác nhận trước khi tạo cả 2 files.
- Luôn trả lời bằng **tiếng Việt**.
