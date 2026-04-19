# JavaScript / TypeScript Standards - Broccoli Team

## Biến & Khai Báo

- Dùng `const` mặc định. Chỉ dùng `let` khi cần reassign. Không dùng `var`.
- Dùng destructuring khi lấy properties từ object hoặc function params.
- Template literals thay vì string concatenation.
- Optional chaining `?.` thay vì check null thủ công: `user?.address?.city`
- Nullish coalescing `??` thay vì `||` khi default value chỉ dành cho `null/undefined`: `count ?? 0`
- Không dùng magic numbers/strings — đặt vào constants hoặc enum.

## Functions

- Arrow functions cho callbacks và anonymous functions.
- Async/await thay vì `.then()` chains. Chỉ dùng `.then()` khi cần chạy song song với `Promise.all()`.
- Default parameters thay vì check undefined trong body.
- Không dùng `arguments` object, dùng rest params `(...args)`.
- Mỗi function làm 1 việc. Nếu function > 30 dòng → xem xét tách nhỏ.

## Naming Conventions

- `camelCase` cho variables và functions: `getUserName`, `orderTotal`
- `PascalCase` cho classes, components, types, interfaces: `UserService`, `CartItem`
- `UPPER_SNAKE_CASE` cho constants: `MAX_RETRY_COUNT`, `API_BASE_URL`
- Boolean prefix: `is`, `has`, `can`, `should`: `isActive`, `hasPermission`
- Event handlers prefix: `handle` hoặc `on`: `handleClick`, `onSubmit`

## Import Order

Sắp xếp imports theo thứ tự, cách nhau bằng dòng trống:
1. External packages (`react`, `remix`, `prisma`...)
2. Internal modules (`@/services`, `@/utils`...)
3. Relative imports (`./components`, `../hooks`...)
4. Types/interfaces (`import type {...}`)

## TypeScript

- Không dùng `any`. Nếu chưa biết type, dùng `unknown` rồi narrow down.
- Define types/interfaces cho mọi function params và return values.
- Prefer `interface` cho object shapes, `type` cho unions/intersections.
- Dùng `as const` cho literal values thay vì type assertion.
- Strict mode luôn bật (`strict: true` trong tsconfig).
- Dùng utility types thay vì tự định nghĩa lại: `Partial<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`.
- Type guards cho runtime narrowing:
  ```ts
  function isUser(value: unknown): value is User {
    return typeof value === 'object' && value !== null && 'id' in value
  }
  ```
- Discriminated unions cho các state có nhiều variants:
  ```ts
  type Result = { status: 'success'; data: Order } | { status: 'error'; message: string }
  ```

## Array & Object

- Prefer `map`, `filter`, `reduce` thay vì `for` loops cho transformations.
- Spread operator để clone/merge: `{ ...defaults, ...overrides }`, `[...arr, newItem]`.
- `Object.entries()`, `Object.keys()`, `Object.values()` thay vì vòng lặp thủ công.
- Không mutate object/array nhận từ props hoặc function params — tạo bản copy trước.

## React

- Functional components + hooks. Không dùng class components.
- Tách logic phức tạp thành custom hooks (`use<Name>`).
- `useMemo` cho expensive computations, `useCallback` cho callbacks truyền xuống children.
- Không dùng `useEffect` cho derived state — tính trực tiếp trong render.
- Key prop: dùng unique ID, không dùng array index (trừ static lists).
- Props interface đặt tên: `<ComponentName>Props`.
- Không dùng `dangerouslySetInnerHTML` trừ khi nội dung đã được sanitize.

## Remix

- Data fetching trong `loader`, mutations trong `action`. Không fetch trong component.
- Dùng `json()` helper cho responses, define return type rõ ràng.
- Error handling qua `ErrorBoundary` component.
- Form submissions dùng `<Form>` component. Dùng `useFetcher` cho mutations không điều hướng trang.
- Server-only code đặt trong files `.server.ts`.
- Type `useLoaderData` với return type của loader:
  ```ts
  const data = useLoaderData<typeof loader>()
  ```
- Dùng `shouldRevalidate` để tránh revalidate không cần thiết.

## Error Handling

- Try/catch cho mọi async operations. Không để unhandled promise rejection.
- Custom error classes cho business logic errors.
- Throw early, catch late.
- Không log sensitive data (token, password, secret key) ra console.
- Production errors: log đủ context để debug, không expose stack trace ra client.

## Code Organization

- Mỗi file có 1 trách nhiệm rõ ràng. File > 200 dòng → xem xét tách.
- Group related files vào folder: `components/`, `hooks/`, `services/`, `utils/`.
- Barrel exports (`index.ts`) chỉ dùng cho public API của module, không export internal.

## Security

- Không hardcode API keys, tokens, passwords — luôn dùng environment variables.
- Validate và sanitize mọi input từ user trước khi xử lý.
- Không dùng `eval()`, `new Function()`, hay `dangerouslySetInnerHTML` với dữ liệu không tin tưởng.
- Không log request body hoặc headers có thể chứa credentials.

## Comments

- Không comment những gì code đã nói rõ. Comment giải thích **tại sao**, không phải **làm gì**.
- TODO comments phải có context: `// TODO: cần refactor sau khi API v2 release`
- Xóa code thay vì comment out — dùng git để recover nếu cần.

## Testing

- Test file đặt cùng thư mục: `user.service.ts` → `user.service.test.ts`
- `describe/it` mô tả behavior: `it('should return error when amount is negative')`
- Mỗi unit test cover: happy path + edge cases + error cases.
- Không mock quá nhiều — test phải phản ánh behavior thực.
- Không test implementation details, test observable behavior.
