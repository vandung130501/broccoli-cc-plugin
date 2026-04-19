---
name: bug-plan
description: Lên plan fix bug. Dùng khi người dùng muốn lập kế hoạch sửa bug, hoặc gọi /bug-plan. Chạy sau /bug-trace.
version: 1.0.0
---

# /bug-plan - Lên Plan Fix Bug

## Hành Động

### Bước 1: Đọc Session

Đọc `.broccoli/session.json`:
- Nếu không có session → nhắc dev chạy `/bug-trace` trước
- Nếu có → cập nhật `current_step` thành `bug-plan`

### Bước 2: Đọc Context

Từ conversation history, lấy:
- Root cause đã xác định
- Files liên quan
- Phạm vi ảnh hưởng

### Bước 3: Đề Xuất Phương Án Fix

```
## Plan Fix Bug

**Bug**: <mô tả>
**Root Cause**: <tóm tắt nguyên nhân>

### Phương Án Fix
<Mô tả cách fix>

### Files Cần Sửa
1. <file path> - <sửa gì>
2. <file path> - <sửa gì>

### Side Effects
- <Kiểm tra: fix có ảnh hưởng chỗ khác không?>
- <Kiểm tra: logic liên quan có bị thay đổi?>

### Verify
- <Cách kiểm tra fix đã đúng>
- <Edge cases cần test thêm>
```

### Bước 4: Xác Nhận

Hỏi dev: "Bạn đồng ý với phương án fix này không?"

- Nếu root cause phức tạp → đề xuất 2-3 phương án, so sánh pros/cons
- Nếu dev đồng ý → gợi ý chạy `/bug-fix`
- Nếu dev muốn sửa → điều chỉnh

## Quy Tắc

- KHÔNG code trong bước này. Chỉ lên plan.
- Ưu tiên fix NHỎ NHẤT có thể (minimal change). Không refactor thêm.
- Luôn kiểm tra side effects: fix chỗ này có phá chỗ khác không?
- Fix đúng root cause, không fix triệu chứng.
- Nếu root cause nằm ở thiết kế sai → đề xuất 2 options: quick fix + proper fix.
- Luôn trả lời bằng tiếng Việt.
