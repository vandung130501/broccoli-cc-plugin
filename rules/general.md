# Quy Tắc Chung - Broccoli Team

## Nguyên Tắc Cốt Lõi

- Đặt tên biến, hàm, class rõ ràng, thể hiện đúng mục đích. Không dùng tên viết tắt mơ hồ (d, tmp, x) trừ biến lặp i, j, k.
- Không hardcode magic numbers hoặc magic strings. Dùng constants hoặc config.
- Mỗi hàm chỉ làm 1 việc duy nhất. Nếu hàm dài hơn 30 dòng, cân nhắc tách nhỏ.
- Error handling đầy đủ cho mọi external call (API, database, file system). Không để exception tự crash mà không xử lý.
- Không lưu trữ sensitive data (passwords, API keys, tokens) trong code. Dùng environment variables.

## File & Project

- Không commit file `.env`, credentials, `node_modules/`, `vendor/`, `.DS_Store`.
- Mỗi file tập trung vào 1 responsibility. Không nhồi nhiều class/module không liên quan vào cùng file.
- Import/require đặt ở đầu file, không import giữa chừng.

## Database

- Database chính: MySQL
- Mọi thay đổi schema phải qua migration, không sửa trực tiếp database.
- Đặt tên table số nhiều (users, orders, products).
- Đặt tên column snake_case (created_at, order_id).
- Luôn có timestamps (created_at, updated_at) cho mọi table.
- Foreign key đặt tên theo pattern: `<table_singular>_id` (user_id, order_id).

## Error Handling

- Log đủ context để debug: thời gian, user, action, input, error message.
- Không catch exception rồi bỏ trống. Ít nhất phải log error.
- Phân biệt lỗi user (4xx) và lỗi hệ thống (5xx). Trả về message phù hợp.

## Validation & Security

- Validate input tại mọi system boundary: HTTP request, webhook payload, form data.
- Không trust dữ liệu từ client. Luôn validate phía server.
- Sanitize output trước khi render vào HTML.

## Performance

- Tránh N+1 query: dùng eager loading khi fetch relationships.
- Pagination mặc định cho mọi list endpoint (không trả về toàn bộ data).
- Không chạy heavy operation trong request cycle — đưa vào background job nếu > 3 giây.

## Testing

- Viết test cho business logic quan trọng: service layer, calculations, validations.
- Mỗi bug fix nên có test case reproduce lại bug đó.
- Test không được phụ thuộc vào nhau hoặc vào thứ tự chạy.

## Comments

- Không comment code hiển nhiên (// tăng i lên 1).
- Comment giải thích WHY, không giải thích WHAT.
- TODO phải kèm context: `// TODO(tên): mô tả - ngày`.
