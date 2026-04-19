# PHP / Laravel Standards - Broccoli Team

## PHP General

- Tuân thủ PSR-12 coding style.
- Type declarations cho function params và return types.
- Strict types: `declare(strict_types=1);` ở đầu mọi file.
- Không dùng `@` error suppression operator.
- Dùng null coalescing `??` và nullsafe `?->` thay vì check null thủ công.
- Dùng Collections thay vì array functions PHP thuần (`collect()`, `->map()`, `->filter()`, `->groupBy()`).

## Naming Conventions

- `camelCase` cho methods và variables: `getUserName()`, `$orderTotal`
- `PascalCase` cho classes: `UserService`, `OrderController`
- `snake_case` cho database columns và config keys: `created_at`, `api_key`
- `UPPER_SNAKE_CASE` cho constants: `MAX_ATTEMPTS`
- Boolean prefix: `is`, `has`, `can`: `$isActive`, `$hasPermission`

## Cấu Trúc Thư Mục & Vị Trí File

Đặt file đúng vị trí theo kiến trúc — không để sai layer:

```
app/
├── Console/Commands/        # Artisan commands
├── Enums/                   # Enum classes
├── Exceptions/              # Custom exceptions
├── Http/
│   ├── Controllers/         # Controllers (mỏng, chỉ gọi service)
│   ├── Middleware/          # Middleware
│   ├── Requests/            # Form Request validation
│   └── Resources/           # API Resources (JsonResource)
├── Jobs/                    # Queue jobs
├── Listeners/               # Event listeners
├── Models/                  # Eloquent models
├── Policies/                # Authorization policies
├── Providers/               # Service providers
└── Services/                # Business logic
config/                      # Mọi config đọc từ đây, không dùng env() ngoài đây
database/
├── factories/               # Model factories (cho testing)
├── migrations/              # Schema migrations
└── seeders/                 # Database seeders
```

## Config & Environment

- **Không bao giờ dùng `env()` ngoài thư mục `config/`** — config phải cache được (`php artisan config:cache`).
- Mọi env variable phải có default value trong config:
  ```php
  // config/services.php
  'momo' => [
      'partner_code' => env('MOMO_PARTNER_CODE', ''),
      'secret_key'   => env('MOMO_SECRET_KEY', ''),
  ]
  ```
- Truy cập config qua `config('services.momo.partner_code')`, không dùng `env()` trực tiếp trong code.
- Không hardcode values trong code — luôn dùng `config()` hoặc constants.

## Enums

- Dùng PHP 8.1+ backed enums cho mọi tập giá trị cố định — không dùng string/int constants rải rác.
- Đặt tất cả enums trong `app/Enums/`.
- Backed enum (string hoặc int) để lưu DB và so sánh dễ:
  ```php
  enum OrderStatus: string {
      case Pending  = 'pending';
      case Paid     = 'paid';
      case Cancelled = 'cancelled';
  }
  ```
- Cast enum trong model:
  ```php
  protected $casts = ['status' => OrderStatus::class];
  ```
- Dùng enum trong validation: `Rule::enum(OrderStatus::class)`.

## Laravel Controllers

- Resource Controllers cho CRUD: `index`, `show`, `store`, `update`, `destroy`.
- Single Action Controllers cho actions đặc biệt: `__invoke()`.
- Controller chỉ làm 3 việc: validate input → gọi service → trả response. Không chứa business logic.
- Return responses nhất quán qua API Resources: `new OrderResource($order)`.

## Laravel Models (Eloquent)

- Dùng Eloquent ORM, tránh raw queries. Nếu bắt buộc dùng raw, dùng parameter binding.
- Relationships define đầy đủ trong model với return type rõ ràng.
- Dùng `$fillable` hoặc `$guarded` cho mass assignment protection.
- Scopes cho query conditions hay dùng lại: `scopeActive()`, `scopeByStatus()`.
- Accessors/Mutators cho data transformation.
- Không query trong loops — dùng eager loading `with()`, `withCount()`, `loadMissing()`.
- Conditional queries dùng `when()`:
  ```php
  ->when($status, fn($q) => $q->where('status', $status))
  ```
- Dùng `whereHas()` thay vì load relation rồi filter.

## API Resources

- Luôn dùng `JsonResource` để transform response — không return model trực tiếp.
- Đặt trong `app/Http/Resources/`.
- Collections dùng `ResourceCollection` hoặc `OrderResource::collection($orders)`.
- Nhất quán response structure:
  ```php
  return response()->json([
      'data'    => new OrderResource($order),
      'message' => 'Order created successfully',
  ]);
  ```

## Laravel Validation

- Form Request classes cho validation — không validate trong controller.
- Đặt trong `app/Http/Requests/`.
- Custom validation rules cho business logic phức tạp — đặt trong `app/Rules/`.
- Messages tiếng Việt khi hiển thị cho end user.

## Laravel Services

- Service classes chứa toàn bộ business logic. Đặt trong `app/Services/`.
- Inject dependencies qua constructor (dependency injection).
- Interface + Implementation cho services có thể swap:
  ```php
  interface PaymentServiceInterface { ... }
  class MomoPaymentService implements PaymentServiceInterface { ... }
  ```
- Bind interface trong `AppServiceProvider`.

## Laravel Database

- Migration cho mọi thay đổi schema. Không sửa migration đã chạy trên production.
- Đặt tên migration rõ ràng: `create_orders_table`, `add_status_to_orders_table`.
- Index cho columns hay query (foreign keys, columns trong WHERE/ORDER BY).
- Factories trong `database/factories/` — dùng cho testing, không dùng cho production seed.
- Seeders: phân biệt `DatabaseSeeder` (production safe) và seeder chỉ cho dev/test.

## Error Handling

- Custom exceptions cho business logic errors — đặt trong `app/Exceptions/`:
  ```php
  class PaymentFailedException extends RuntimeException { ... }
  ```
- Try/catch tại service layer cho external calls (API, payment gateway).
- Không để exception bubble lên controller khi có thể handle được.
- Log đủ context khi catch: `Log::error('Payment failed', ['order_id' => $id, 'error' => $e->getMessage()])`.
- Không log sensitive data (credentials, secret keys, card numbers).
- Handler trong `app/Exceptions/Handler.php` cho global error responses.

## Laravel Security

- Không dùng `DB::raw()` với user input. Luôn dùng parameter binding.
- CSRF protection cho mọi form.
- Authorization qua Policies — đặt trong `app/Policies/`.
- Mass assignment protection (`$fillable` hoặc `$guarded`).
- Validate và sanitize mọi user input trước khi xử lý.
- Rate limiting cho API endpoints.

## Comments & DocBlocks

- PHPDoc cho public methods của services và interfaces:
  ```php
  /**
   * Tạo payment request gửi đến MoMo.
   *
   * @throws PaymentFailedException
   */
  public function createPayment(Order $order): PaymentResult
  ```
- Comment giải thích **tại sao**, không phải **làm gì**.
- Không comment code thừa — xóa đi, dùng git để recover.

## Testing

- Feature tests trong `tests/Feature/`, Unit tests trong `tests/Unit/`.
- Dùng `RefreshDatabase` trait cho tests cần DB.
- HTTP tests dùng `$this->postJson()`, `$this->getJson()` — assert cả status và response structure:
  ```php
  $this->postJson('/api/orders', $data)
       ->assertCreated()
       ->assertJsonStructure(['data' => ['id', 'status']]);
  ```
- Factories cho test data, không hardcode raw arrays.
- Mock external services (payment gateway, email) — không gọi thật trong test.

## Không Làm

- Không dùng `dd()`, `dump()`, `var_dump()` trong production code.
- Không dùng `env()` ngoài thư mục `config/`.
- Không xóa hoặc sửa migration đã chạy trên production.
- Không chứa business logic trong Controller, Middleware, hoặc Model.
- Không return raw Model từ API — luôn qua Resource.
