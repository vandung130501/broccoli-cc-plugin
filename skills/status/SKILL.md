---
name: status
description: Xem trạng thái workflow hiện tại. Dùng khi người dùng muốn biết đang ở bước nào trong quy trình feature hoặc bugfix. Kích hoạt khi người dùng hỏi "đang ở đâu", "tiến trình", "status", hoặc gọi /status.
version: 1.1.0
---

# /status - Theo Dõi Tiến Trình Workflow

## Hành Động

1. Đọc `.broccoli/session.json` trong thư mục project hiện tại.

2. **Nếu KHÔNG có file** → hiển thị:
```
Chưa có workflow nào đang chạy.

Để bắt đầu:
  /feat-analyze  - Bắt đầu phát triển tính năng mới
  /bug-trace     - Bắt đầu fix bug
```

3. **Nếu CÓ file** → render danh sách bước theo logic bên dưới, sau đó gợi ý tiếp theo.

---

## Logic Render Từng Bước

Với mỗi bước trong workflow, áp dụng theo thứ tự ưu tiên:

| Điều kiện | Marker |
|-----------|--------|
| Step có trong `steps_completed` | `[x]` |
| Step === `current_step` | `[>]` |
| Step là **optional** và chưa trong `steps_completed` | `[?]` |
| Step là **required** và chưa trong `steps_completed` | `[ ]` |

---

## Danh Sách Bước Theo Workflow

### Feature Workflow

| Bước | Loại |
|------|------|
| `feat-analyze` | required |
| `feat-plan` | required |
| `feat-code` | required |
| `feat-test` | **optional** |
| `review-perf` | required |
| `review-arch` | required |
| `review-clean` | required |
| `review-security` | required |
| `feat-doc` | required |
| `feat-commit` | required |

### Bugfix Workflow

| Bước | Loại |
|------|------|
| `bug-trace` | required |
| `bug-plan` | required |
| `bug-fix` | required |
| `bug-test` | **optional** |
| `review-perf` | required |
| `review-arch` | required |
| `review-clean` | required |
| `review-security` | required |
| `bug-commit` | required |

---

## Format Hiển Thị

```
Workflow: <Feature|Bugfix> - <description>
Bắt đầu: <started_at>

  <marker> <step>  - <mô tả ngắn>
  ...
```

**Mô tả ngắn theo marker:**
- `[x]` → "Đã hoàn thành"
- `[>]` → "Đang thực hiện  <-- Đang ở đây"
- `[?]` → "Chưa làm (tùy chọn)"
- `[ ]` → "Chưa làm"

---

## Gợi Ý Tiếp Theo

Sau khi hiển thị, tự động xác định và gợi ý bước tiếp theo:

- **Bước tiếp theo** = bước required đầu tiên chưa có trong `steps_completed` và không phải `current_step`
- Nếu tất cả required steps đã xong → thông báo workflow hoàn thành
- Nếu `current_step` còn đang làm dở → nhắc tiếp tục step đó

```
Gợi ý: /<bước-tiếp-theo>
```

---

## Ký Hiệu

- `[x]` = Đã hoàn thành
- `[>]` = Đang thực hiện
- `[ ]` = Chưa làm
- `[?]` = Tùy chọn, chưa làm (có thể bỏ qua)

---

## Quy Tắc

- CHỈ ĐỌC session, KHÔNG GHI bất cứ thứ gì.
- Nếu file session bị lỗi format → thông báo lỗi, gợi ý xóa `.broccoli/session.json` để bắt đầu lại.
- Luôn trả lời bằng **tiếng Việt**.
