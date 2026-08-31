# ShopVannĐaiiVIP — Render V9

Đây là bản **Node/Express Web Service**, không phải Static Site.

- Render phải chạy `npm install` rồi `npm start`.
- Server bind `0.0.0.0` và dùng `PORT` của Render (mặc định 10000).
- Health check: `/health`.
- API đăng nhập, đăng ký, đơn hàng và Admin chạy cùng origin với shop.
- `autoDeploy: true` được giữ trong Blueprint.
- **Không deploy dưới Static Site**: Static Site không chạy được `server.js`, `/api/auth/*`, `/api/orders/*` hoặc `/admin/api/*`.
- `DATA_DIR` cho phép chuyển dữ liệu tài khoản/đơn hàng sang nơi lưu trữ bền vững.

## Quan trọng
Service Static trong ảnh cũ **không thể chạy `server.js`**, nên mọi `/api/*` và `/admin/api/*` đều lỗi. Phải deploy source này dưới **Web Service**.

Render Free Web Service có filesystem tạm thời và có thể spin down; nếu cần giữ dữ liệu tài khoản/đơn hàng lâu dài, dùng Render Postgres hoặc persistent disk trên gói hỗ trợ.
