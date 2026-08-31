# Account / Order API — ShopVannĐaiiVIP V9

## User
- `POST /api/auth/register` — đăng ký tài khoản và tự đăng nhập.
- `POST /api/auth/login` — đăng nhập bằng cookie HttpOnly.
- `POST /api/auth/logout` — đăng xuất.
- `GET /api/auth/me` — kiểm tra phiên hiện tại.
- `GET /api/account/orders` — lịch sử mua, trạng thái và URL tải lại.

## Shop / Order
- `GET /api/products` — danh sách sản phẩm + kiểm tra file thật trên server.
- `POST /api/orders` — tạo đơn; bắt buộc đăng nhập và server từ chối sản phẩm không có file.
- `GET /api/orders/:id` — xem trạng thái đơn của chính tài khoản.
- `GET /api/orders/:id/download` — tải file sau khi Admin duyệt.
- `GET /api/orders/:id/file-status` — kiểm tra file có sẵn hay không.
- `POST /api/orders/:id/randomize` — random TÚI MÙ sau khi đã duyệt.

## Admin
- `POST /admin/api/login` — đăng nhập Admin.
- `GET /admin/api/me` — kiểm tra phiên Admin.
- `POST /admin/api/logout` — đăng xuất Admin.
- `GET /admin/api/orders` — danh sách đơn.
- `POST /admin/api/orders/:orderId/confirm` — xác nhận thanh toán.
- `POST /admin/api/test-order` — tạo đơn test 0đ.
- `GET /admin/api/orders/:orderId/download` — tải file của đơn test 0đ.

## Health
- `GET /health` — phải trả `ok: true`.
- `GET /api/version` — phải trả build `SHOPVANNDAIIVIP-AUTH-ORDERS-AIM-V9`.
