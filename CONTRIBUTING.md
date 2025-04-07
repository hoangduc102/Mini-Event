# Hướng dẫn đóng góp cho Frontend

## Môi trường phát triển

### Yêu cầu hệ thống
- Node.js (phiên bản 18.x trở lên)
- npm hoặc yarn
- Git

### Cài đặt
1. Clone repository:
```bash
git clone [URL_REPOSITORY]
cd [TEN_DU_AN]
```

2. Cài đặt dependencies:
```bash
npm install
# hoặc
yarn install
```

3. Chạy dự án ở chế độ development:
```bash
npm run dev
# hoặc
yarn dev
```

## Quy tắc code

### Cấu trúc thư mục
- `src/components`: Chứa các component tái sử dụng
- `src/pages`: Chứa các trang của ứng dụng
- `src/assets`: Chứa các tài nguyên tĩnh (hình ảnh, font, ...)
- `src/hooks`: Chứa các custom hooks
- `src/utils`: Chứa các hàm tiện ích
- `src/services`: Chứa các service gọi API
- `src/contexts`: Chứa các React contexts
- `src/types`: Chứa các type definitions

### Quy ước đặt tên
- Components: PascalCase (ví dụ: `Button.tsx`, `UserProfile.tsx`)
- Hooks: camelCase với prefix "use" (ví dụ: `useAuth.ts`, `useForm.ts`)
- Utils: camelCase (ví dụ: `formatDate.ts`, `validateForm.ts`)
- Types: PascalCase (ví dụ: `User.ts`, `ApiResponse.ts`)

### Code Style
- Sử dụng TypeScript cho tất cả các file
- Tuân thủ ESLint và Prettier config
- Mỗi component nên có một file riêng
- Sử dụng functional components với hooks
- Tránh inline styles, sử dụng CSS modules hoặc styled-components

## Quy trình đóng góp

1. Tạo branch mới từ `main`:
```bash
git checkout -b feature/tên-tính-năng
# hoặc
git checkout -b fix/tên-lỗi
```

2. Commit changes:
```bash
git add .
git commit -m "feat: thêm tính năng mới"
# hoặc
git commit -m "fix: sửa lỗi abc"
```

3. Push branch lên remote:
```bash
git push origin feature/tên-tính-năng
```

4. Tạo Pull Request từ branch của bạn vào `main`

### Quy ước commit message
- `feat:` Thêm tính năng mới
- `fix:` Sửa lỗi
- `docs:` Cập nhật tài liệu
- `style:` Cập nhật style (formatting, missing semi colons, etc)
- `refactor:` Refactor code
- `test:` Thêm hoặc sửa test
- `chore:` Cập nhật build tasks, package manager configs, etc

## Testing
- Viết unit test cho các components và hooks
- Sử dụng Jest và React Testing Library
- Đảm bảo test coverage tối thiểu 80%

## Review code
- Mỗi PR cần có ít nhất 1 reviewer
- Reviewer nên kiểm tra:
  - Code style và conventions
  - Performance considerations
  - Security concerns
  - Test coverage
  - Documentation

## Tài liệu tham khảo
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

## Liên hệ
Nếu bạn có bất kỳ câu hỏi nào, vui lòng tạo issue hoặc liên hệ với maintainer của dự án. 