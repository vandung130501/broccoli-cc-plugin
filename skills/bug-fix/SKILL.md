---
name: bug-fix
description: Triển khai fix bug. Dùng khi người dùng muốn code fix, sửa lỗi, hoặc gọi /bug-fix. Chạy sau /bug-plan.
version: 1.0.0
---

# /bug-fix - Triển Khai Fix Bug

## Hành Động

### Bước 1: Đọc Session & Context

Đọc `.broccoli/session.json`:
- Nếu không có session → nhắc dev chạy `/bug-trace` trước
- Nếu có → cập nhật `current_step` thành `bug-fix`

Đọc lại plan fix từ conversation history.

### Bước 2: Triển Khai Fix

1. **Xác nhận trước khi sửa**: Mô tả ngắn sẽ sửa gì trong file, hỏi dev xác nhận.
2. **Fix theo plan**: Chỉ sửa những gì trong plan. Không refactor thêm.
3. **Áp dụng coding standards**: Tự động nhận diện ngôn ngữ và áp dụng rules tương ứng.
4. **Minimal change**: Chỉ thay đổi tối thiểu cần thiết để fix bug.

### Bước 3: Verify

Sau khi fix:
1. Đọc lại code đã sửa — fix có giải quyết đúng root cause không?
2. Kiểm tra side effects — logic liên quan có bị ảnh hưởng không?
3. Nếu project có test suite → chạy test liên quan đến file vừa sửa:
   ```bash
   # JS/TS - chạy test file liên quan
   npm run test -- <file-liên-quan>

   # Laravel
   php artisan test --filter <TestClass>
   ```
4. Nếu test fail → báo dev, không tự ý sửa thêm.
5. Nếu phát hiện vấn đề khác → báo dev, không tự mở rộng fix.

### Bước 4: Tổng Kết

```
## Đã Fix

### Files Đã Sửa
- <file path>:<line range> - <thay đổi gì>

### Verify
- Root cause đã fix: <có/không>
- Side effects: <có/không>
- Test liên quan: <passed/failed/không có>

--> Tiếp theo: /bug-test (tùy chọn) hoặc /review-perf, /review-arch, /review-clean, /review-security
```

## Quy Tắc

- LUÔN hỏi xác nhận trước khi sửa file.
- FIX ĐÚNG root cause. Không fix bề m��t.
- MINIMAL CHANGE. Ch��� sửa những gì cần thiết. Không clean up code xung quanh.
- Nếu plan chưa đủ → dừng lại, báo dev, gợi ý quay lại `/bug-plan`.
- Không thêm features, không refactor, không optimize. Chỉ fix bug.
- Luôn trả lời bằng tiếng Việt.
