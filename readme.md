# Broccoli - Claude Code Plugin

Plugin Claude Code cho team dev Shopify/Web. Hỗ trợ 2 workflow chính: **phát triển tính năng** và **fix bug**, tích hợp sẵn coding standards và auto-review.

---

## Cài Đặt

Chạy 2 lệnh sau trong Claude Code:

```
/plugin marketplace add vandung130501/broccoli-cc-plugin
/plugin install broccoli@broccoli
```

Sau đó chạy `/reload-plugins` hoặc khởi động lại Claude Code để kích hoạt.

Thêm vào `.gitignore` của mỗi project để không commit session tracking:

```
.broccoli/
```

---

## Skills (Slash Commands)

### Feature Workflow

| Command | Mô tả |
|---------|-------|
| `/feat-analyze` | Phân tích yêu cầu, khám phá codebase liên quan |
| `/feat-plan` | Lên kế hoạch chi tiết: file nào tạo/sửa, thứ tự triển khai |
| `/feat-code` | Triển khai code theo plan đã duyệt |
| `/feat-test` | Viết & chạy test *(tùy chọn)* |
| `/feat-doc` | Tạo tài liệu feature (cho Tester/PO và Developer) |
| `/feat-commit` | Tạo commit message chuẩn Conventional Commits và commit |

### Bugfix Workflow

| Command | Mô tả |
|---------|-------|
| `/bug-trace` | Trace code, tìm root cause của bug |
| `/bug-plan` | Lên phương án fix, kiểm tra side effects |
| `/bug-fix` | Triển khai fix theo plan đã duyệt |
| `/bug-test` | Viết test verify bug đã fix *(tùy chọn)* |
| `/bug-commit` | Tạo commit message chuẩn và commit |

### Review (dùng chung cho cả 2 workflow)

| Command | Mô tả |
|---------|-------|
| `/review-perf` | Review performance: N+1 queries, memory leaks, bundle size... |
| `/review-arch` | Review kiến trúc: separation of concerns, design patterns, coupling... |
| `/review-clean` | Review clean code: naming, DRY, complexity, dead code... |
| `/review-security` | Review bảo mật: injection, hardcoded secrets, input validation... |

### Tiện Ích

| Command | Mô tả |
|---------|-------|
| `/status` | Xem workflow hiện tại đang ở bước nào |

---

## Feature Workflow — Chi Tiết

```
/feat-analyze → /feat-plan → /feat-code → [/feat-test] → /review-* → /feat-doc → /feat-commit
```

> Mỗi bước đọc file từ bước trước và tạo file cho bước tiếp theo. Session được lưu tại `.broccoli/session.json`.

### `/feat-analyze <feature-name>`

**Đọc:** `docs/feature/<feature-name>/task.md`
> Nếu chưa có → nhắc tạo theo template `skills/feat-analyze/task-template.md`

**Tạo:**
- `.broccoli/session.json` — session tracking
- `docs/feature/<feature-name>/plan.md` — kiến trúc, files cần tạo/sửa, thứ tự triển khai

---

### `/feat-plan`

**Đọc:** `.broccoli/session.json` · `docs/feature/<feature-name>/plan.md`

**Tạo:**
- `docs/feature/<feature-name>/implement.md` — danh sách task con, file nào làm gì, output mong đợi

---

### `/feat-code`

**Đọc:** `.broccoli/session.json` · `plan.md` · `implement.md`

**Làm:** Code từng task theo thứ tự trong `implement.md`, đánh dấu `[x]` khi xong

---

### `/feat-test` *(tùy chọn)*

**Đọc:** `.broccoli/session.json` · `implement.md`

**Tạo:** File test đặt cùng thư mục với file được test (e.g. `user.service.test.ts`)

---

### `/review-perf` · `/review-arch` · `/review-clean` · `/review-security`

**Đọc:** `git diff` — chỉ review files có thay đổi

**Không tạo file**, xuất báo cáo trực tiếp trong chat

---

### `/feat-doc`

**Đọc:** `task.md` · `plan.md` · `implement.md`

**Tạo:**
- `docs/feature/<feature-name>/logic.md` — mô tả nghiệp vụ cho Tester/PO (không có code)
- `docs/feature/<feature-name>/technical.md` — kiến trúc, endpoints, DB changes cho Developer

---

### `/feat-commit`

**Đọc:** `git diff` · `.broccoli/session.json`

**Làm:** Stage files cụ thể, tạo commit message chuẩn Conventional Commits, commit

---

## Bugfix Workflow — Chi Tiết

```
/bug-trace → /bug-plan → /bug-fix → [/bug-test] → /review-* → /bug-commit
```

### `/bug-trace`

**Đọc:** Code files liên quan (trace từ route → controller → service → model)

**Tạo:** `.broccoli/session.json` — lưu mô tả bug, root cause, files liên quan

---

### `/bug-plan`

**Đọc:** `.broccoli/session.json` · conversation history (root cause từ bug-trace)

**Không tạo file**, xuất plan fix trong chat (files cần sửa, side effects, cách verify)

---

### `/bug-fix`

**Đọc:** `.broccoli/session.json` · plan từ `/bug-plan`

**Làm:** Sửa tối thiểu các files theo plan, chạy test liên quan nếu có

---

### `/bug-test` *(tùy chọn)*

**Đọc:** `.broccoli/session.json` · files đã sửa

**Tạo:** Test case reproduce đúng bug đã fix (fail nếu revert, pass với code hiện tại)

---

### `/bug-commit`

**Đọc:** `git diff` · `.broccoli/session.json`

**Làm:** Stage files cụ thể, tạo commit message dạng `fix(<scope>): <mô tả bug đã fix>`

---

## Hooks Tự Động

| Hook | Khi nào | Hành động |
|------|---------|-----------|
| Pre-commit lint | Trước `git commit` | Chạy ESLint (JS/TS) hoặc `php -l` (PHP). Block nếu có lỗi. |
| Review reminder | Trước `git push` | Nhắc nhở nếu chưa chạy review. |
| Security check | Sau khi Edit/Write file | Quét hardcoded secrets, SQL raw, XSS patterns. |
| Notify wait | Claude đang chờ phản hồi | Gửi Windows notification. |

---

## Coding Standards

Plugin tự động áp dụng coding standards phù hợp dựa trên stack phát hiện được:

- **JavaScript/TypeScript** — React, Remix, Node.js conventions
- **PHP/Laravel** — PSR-12, Eloquent, Service pattern
- **Shopify** — API versioning, HMAC, Polaris, App Bridge
- **Git** — Conventional Commits, branch naming `tên/loại/mô-tả`

---

## Yêu Cầu

- Claude Code CLI đã cài đặt
- Node.js (cho hook scripts)
- Git

---

## Stack Hỗ Trợ

JavaScript, TypeScript, React, Remix, Node.js, PHP, Laravel, Shopify (Embedded Apps, Theme Extensions)
