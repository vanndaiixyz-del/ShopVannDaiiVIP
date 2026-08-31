# Account / Order API

- POST /api/auth/register — đăng ký tài khoản.
- POST /api/auth/login — đăng nhập bằng cookie HttpOnly.
- POST /api/auth/logout — đăng xuất.
- GET /api/auth/me — kiểm tra phiên.
- GET /api/account/orders — lịch sử mua của tài khoản, có ngày/giờ mua và nút tải lại khi đã duyệt.

Đơn mới tự gắn với tài khoản đang đăng nhập. Admin chỉ đổi trạng thái đơn; ngày/giờ mua lấy tại lúc tạo đơn.
