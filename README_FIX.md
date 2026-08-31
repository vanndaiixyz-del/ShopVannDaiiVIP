# ShopVannĐaiiVIP V9 — Fix toàn bộ luồng AUTH / ORDER / FILE

## Đã sửa
- Root cause Render Static không chạy backend: Blueprint chuyển sang Node Web Service.
- Đăng ký và đăng nhập người dùng.
- Cookie phiên HttpOnly + SameSite.
- Admin login server-side, không đưa plaintext password vào frontend.
- Chống thử mật khẩu Admin liên tục ở endpoint login.
- Tạo đơn bắt buộc đăng nhập.
- Admin xác nhận thanh toán.
- Chỉ đơn đã duyệt mới cấp file.
- Lịch sử mua và tải lại.
- Random TÚI MÙ sau khi thanh toán.
- Admin Test FREE.
- Health/version endpoint.
- Mapping file AIM 3105 theo đúng thư mục riêng, tránh lấy nhầm file trùng tên.
- Kiểm tra file thật trước khi báo có thể tải.
- Giữ nguyên ảnh QR thanh toán.

## File AIM còn thiếu trong ZIP
ZIP nguồn này không chứa file binary cho:
- AIMLOCK VIP (AIM FLIZA)
- AIMLOCK VIP (AIM 3105)

Hai sản phẩm vẫn được giữ trong danh mục để không làm mất cấu hình shop, nhưng server không giả tạo file. Muốn cấp đúng hai sản phẩm này cần bổ sung đúng file nguồn của chúng vào ZIP.
