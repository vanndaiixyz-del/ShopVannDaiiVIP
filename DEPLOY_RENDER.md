# Deploy ShopVannĐaiiVIP on Render

## Quan trọng
Bản này có backend Node/Express để đăng nhập, đăng ký, Admin và giao dịch hoạt động đúng. Render service trong ảnh của bạn đang là **Static**, nên không thể chạy `server.js`.

Bạn cần một **Web Service (Node)** cho bộ source này. Không xóa dữ liệu sản phẩm trong ZIP.

### Nếu muốn giữ đúng URL shop hiện tại
Giữ Static Site hiện tại làm giao diện và cấu hình rewrite/proxy `/api/*`, `/admin/*`, `/health` tới Web Service Node. Cách này giữ URL frontend nhưng backend chạy riêng.

### Nếu muốn đơn giản nhất
Tạo Web Service từ chính repository/source này:
- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/health`

## Admin authentication
Không cần đặt `ADMIN_PASSWORD` trên Render cho bản này. Server dùng verifier cố định ở backend và cấp phiên Admin bằng cookie HttpOnly. Plaintext mật khẩu không nằm trong HTML/JS frontend.

## Sau khi deploy
Mở `/health`. Kết quả phải có `ok: true` và `adminConfigured: true`.
Sau đó kiểm tra:
1. Đăng ký tài khoản mới.
2. Đăng nhập.
3. Chọn AIM → Mua ngay.
4. Admin đăng nhập.
5. Admin xác nhận đơn.
6. Tài khoản tải lại sản phẩm sau khi đơn được duyệt.
