# Git Workflow - project-name Team

## Branch Naming

Format: `tên/loại/mô-tả`

- `dunglv/feature/add-momo-payment`
- `dunglv/bugfix/fix-cart-total`
- `dunglv/refactor/clean-auth-service`
- `dunglv/hotfix/fix-payment-crash`

Loại branch:
- `feature` - Tính năng mới
- `bugfix` - Sửa bug
- `refactor` - Refactor code
- `hotfix` - Fix khẩn cấp trên production
- `chore` - Cập nhật dependencies, config, tooling
- `docs` - Cập nhật tài liệu
- `test` - Thêm/sửa tests

## Commit Message

Format: Conventional Commits

```
<type>(<scope>): <mô tả ngắn>

<body - chi tiết nếu cần>

<footer - refs, breaking changes>
```

Types:
- `feat` - Tính năng mới
- `fix` - Sửa bug
- `refactor` - Refactor, không thay đổi behavior
- `style` - Format, lint, không thay đổi logic
- `docs` - Documentation
- `chore` - Dependencies, config, tooling
- `perf` - Cải thiện performance
- `test` - Thêm/sửa tests

Scopes thường dùng: `auth`, `cart`, `payment`, `product`, `order`, `webhook`, `api`, `ui`, `db`

Quy tắc:
- Subject line tối đa 72 ký tự
- Viết ở thể mệnh lệnh: "add feature" không phải "added feature"
- Không kết thúc subject bằng dấu chấm
- Body giải thích WHY, không phải WHAT
- Reference GitLab issue: `Refs: #123`

## Merge Request

- Mỗi MR giải quyết 1 vấn đề/tính năng duy nhất.
- Title theo format commit message.
- Description phải có:
  - Mô tả ngắn thay đổi
  - Cách test
  - Screenshots (nếu có UI changes)
- Không merge vào `main`/`master`/`develop` trực tiếp. Luôn qua MR.
- Squash commits khi merge nếu có quá nhiều commits nhỏ.

## Rebase vs Merge

- Dùng `rebase` để đồng bộ branch cá nhân với develop/main (giữ history sạch).
- Dùng `merge` (hoặc squash merge) khi merge MR vào develop/main.
- Không rebase branch đã push lên remote khi người khác đang làm việc trên đó.

## Quy Tắc

- Không force push vào branch chung (main, develop, staging).
- Pull/rebase trước khi push để tránh conflict.
- Không commit files generated (build/, dist/, .cache/).
- Không commit secrets, env files, credentials.
- Xóa branch sau khi merge MR.
- Không merge MR khi CI đang fail.
