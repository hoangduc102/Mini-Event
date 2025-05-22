# MiniEvent Mobile App

Ứng dụng di động cho dự án MiniEvent được xây dựng bằng React Native và Expo.

## Yêu cầu hệ thống

- Node.js (phiên bản 18 trở lên)
- npm hoặc yarn
- Expo CLI
- Android Studio (cho Android development)
- Xcode (cho iOS development, chỉ trên macOS)

## Cài đặt

1. Cài đặt các dependencies:

```bash
cd mobile
npm install hoặc npm install --legacy-peer-deps nếu thấy có lỗi 
```

2. Cấu hình môi trường:
- Tạo file `.env` trong thư mục `mobile` 
- Điền các biến môi trường cần thiết (EXPO_PUBLIC_FIREBASE_APIKEY, EXPO_PUBLIC_IP_ADDRESS, EXPO_PUBLIC_SENTRY_AUTH_TOKEN, EXPO_PUBLIC_DNS_SENTRY )

## Chạy ứng dụng

1. Khởi động backend server trước 

2. Chạy ứng dụng mobile:

```bash
npx expo 
```

Sau khi chạy lệnh trên, bạn có thể:
- Quét mã QR bằng ứng dụng Expo Go trên điện thoại
- Nhấn 'a' để mở trên Android emulator
- Nhấn 'i' để mở trên iOS simulator (chỉ trên macOS)

## Cấu trúc dự án

```
mobile/
├── app/              # Chứa các màn hình và navigation (Expo Router)
├── assets/          # Images, fonts và các tài nguyên khác
├── components/      # Các component tái sử dụng
├── config/         # Cấu hình ứng dụng
├── constants/      # Các hằng số và theme
├── store/          # State management (Redux/Context)
├── app.json        # Cấu hình Expo
├── eas.json        # Cấu hình EAS Build
├── babel.config.js # Cấu hình Babel
└── tsconfig.json   # Cấu hình TypeScript
```

## Tính năng chính

- Đăng nhập/Đăng ký
- Quản lý sự kiện
- Thông báo realtime
- Tích hợp Firebase
- Và nhiều tính năng khác...

## Liên kết hữu ích

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Firebase Documentation](https://firebase.google.com/docs)

## Hỗ trợ

Nếu bạn gặp vấn đề hoặc cần hỗ trợ, vui lòng:
1. Kiểm tra [issues](https://github.com/hoangduc102/issues)
2. Tạo issue mới nếu cần
3. Liên hệ team development
