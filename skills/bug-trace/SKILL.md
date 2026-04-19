---
name: bug-trace
description: Trace và reproduce bug. Dùng khi người dùng muốn bắt đầu fix bug, tìm nguyên nhân lỗi, hoặc gọi /bug-trace. Đây là bước đầu tiên của Bugfix Workflow.
version: 1.0.0
---

# /bug-trace - Trace & Reproduce Bug

## Hành Động

### Bước 1: Thu Thập Thông Tin Bug

Nếu đã có session cũ → hỏi: "Đang có workflow **<tên cũ>** chưa hoàn thành. Bắt đầu mới không?"

Hỏi dev:
- Bug xảy ra ở đâu? (URL, page, action, chức năng)
- Expected behavior vs actual behavior?
- Có error log / screenshot không?
- Link GitLab issue nếu có?
- Bug xảy ra khi nào? (luôn luôn, random, điều kiện cụ thể?)

### Bước 2: Tạo Session Tracking

Tạo file `.broccoli/session.json` sau khi đã có mô tả bug:

```json
{
  "workflow": "bugfix",
  "description": "<mô tả ngắn bug từ dev>",
  "current_step": "bug-trace",
  "steps_completed": [],
  "started_at": "<ISO timestamp>"
}
```

### Bước 3: Trace Code

1. Tìm entry point:
   - Từ URL/route → tìm route handler
   - Từ action → tìm event handler/controller
2. Theo dõi data flow:
   - Route → Controller/Loader → Service → Model/Database
   - Trace qua từng layer, đọc code từng bước
3. Xác định chỗ gây bug:
   - So sánh expected vs actual logic
   - Tìm edge cases chưa handle
   - Kiểm tra data transformations

### Bước 4: Xác Định Root Cause

Phân biệt:
- **Triệu chứng**: Những gì user thấy (UI sai, error message)
- **Root cause**: Nguyên nhân gốc trong code

### Bước 5: Xuất Báo Cáo

```
## Kết Quả Trace Bug

**Bug**: <mô tả bug>
**Báo cáo từ**: <GitLab issue # nếu có>

### Luồng Xử Lý
1. <User action> → <file:function>
2. <Processing> → <file:function>
3. <Output> → <file:function>

### Root Cause
File: <file path>:<line>
<Giải thích nguyên nhân gốc>

### Ảnh Hưởng
- <Phạm vi ảnh hưởng>
- <Điều kiện để bug xảy ra>

--> Tiếp theo: chạy /bug-plan để lên plan fix
```

## Quy Tắc

- Đây là bước ĐẦU TIÊN của Bugfix Workflow. Luôn tạo mới session.
- Trace kỹ, KHÔNG đoán. Đọc code thực tế.
- Tìm ROOT CAUSE, không chỉ triệu chứng.
- Không code, không sửa file. Chỉ đọc và phân tích.
- Nếu không tìm được root cause → báo dev rõ ràng, gợi ý cần thêm thông tin gì.
- Luôn trả lời bằng tiếng Việt.
