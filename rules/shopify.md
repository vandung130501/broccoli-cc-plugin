# Shopify Standards - project-name Team

## API

- Kiểm tra API version compatibility. Pin version trong code, không dùng "latest".
- Nâng API version: theo dõi [Shopify changelog](https://shopify.dev/docs/api/release-notes), test trên dev store trước, nâng từng version một (không skip).
- **Admin API**: dùng cho operations phía server (orders, products, customers). Không expose token ra client.
- **Storefront API**: dùng cho operations phía client/frontend (product listing, cart). Token có thể public nhưng giới hạn scopes.
- Prefer GraphQL over REST API cho queries phức tạp (ít request, chọn đúng fields).
- Handle rate limits: retry with exponential backoff (1s, 2s, 4s, max 3 retries). GraphQL: theo dõi `extensions.cost.throttleStatus`.
- Pagination: dùng cursor-based pagination cho GraphQL, không dùng page number.
- Error handling: check `userErrors` trong GraphQL response, không chỉ check HTTP status.

## Authentication & Session

- Verify session token ở mọi request. Không trust client-side data.
- App Bridge: dùng đúng version, handle session token refresh.
- OAuth flow: validate HMAC signature cho mọi callback.
- Scopes: request minimum scopes cần thiết. Không request thừa.

## Webhooks

- HMAC signature verification BẮT BUỘC cho mọi webhook endpoint.
- Idempotent handling: cùng 1 webhook có thể gửi nhiều lần.
- Respond 200 trong 5 giây. Xử lý nặng đưa vào background job/queue.
- Xử lý webhook `APP_UNINSTALLED` để cleanup data.

## Embedded Apps (Polaris)

- Tuân thủ Shopify design guidelines khi dùng Polaris components.
- App Bridge cho navigation, toast, modal. Không dùng browser native.
- Loading states cho mọi async operation.
- Error states với actionable messages (không chỉ "Something went wrong").
- Responsive layout, test trên cả desktop và mobile admin.

## Theme App Extensions

- Liquid: dùng filters đúng cách, tránh logic phức tạp trong template.
- App blocks: cung cấp settings đầy đủ cho merchant customize.
- Performance: minimize liquid objects, lazy load JavaScript.
- Không inject inline scripts/styles. Dùng asset files.

## Billing & Charges

- Recurring charges: handle subscription flow đúng (create → redirect → confirm).
- Test billing trong development store trước.
- Handle charge declined gracefully.
- Cung cấp free trial nếu có.

## Metafields

- Namespace rõ ràng theo app: `app_<handle>` (lowercase, chỉ dùng letters/numbers/underscores, tối đa 20 ký tự). Ví dụ: `myapp_settings`.
- Type definitions chính xác (json, single_line_text_field, number_integer...).
- Không lưu sensitive data trong metafields (visible qua API).

## Performance

- Bulk operations cho xử lý nhiều records (Bulk Query, Bulk Mutation).
- Cache responses khi có thể (product data, shop info).
- Minimize API calls: batch queries, chọn đúng fields trong GraphQL.
- Background jobs cho operations > 5 giây.

## Shopify CLI

- Dùng `shopify app dev` để chạy local với tunnel tự động.
- Sync extensions: `shopify app deploy` để deploy theme extensions / functions lên Partner Dashboard.
- Không hardcode store URL trong code — lấy từ session hoặc environment variable.

## Data & Privacy

- Tuân thủ Shopify data protection requirements.
- Implement mandatory webhooks: `customers/data_request`, `customers/redact`, `shop/redact`.
- Không lưu trữ customer data không cần thiết.
- Xóa data khi app bị uninstall (theo policy).
