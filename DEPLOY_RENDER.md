# Deploy ShopVannĐaiiVIP trên Render

## Lỗi gốc của bản V8
Bản cũ đã có `server.js`, nhưng service trong ảnh của bạn là **Static**. Static Site chỉ phục vụ HTML/CSS/JS và không chạy Node/Express, vì vậy `/api/auth/*`, `/api/orders/*` và `/admin/api/*` không tồn tại. Đây chính là lý do trang báo `Máy chủ chưa chạy backend đăng nhập`, Admin không đăng nhập được và luồng mua AIM không tạo đơn được. Render xác nhận app có API/server-side auth phải chạy bằng **Web Service**, không phải Static Site.

## Bản V9
ZIP này đã được sửa để chạy thành **một Web Service Node/Express duy nhất**:
- Trang shop + backend dùng cùng một origin.
- Đăng ký/đăng nhập hoạt động bằng cookie HttpOnly.
- Admin đăng nhập bằng verifier scrypt ở server; mật khẩu plaintext không nằm trong HTML/JS.
- Mật khẩu Admin hiện tại vẫn được kiểm tra bằng verifier ở server; plaintext không nằm trong frontend.
- AIM giữ nguyên danh mục và file có trong ZIP.
- File 3105 được map đúng thư mục `private_files/AIM 3105-IOS/` để không lấy nhầm file cùng tên của AIM FLIZA.
- QR thanh toán được giữ nguyên.
- Chỉ đơn đã được Admin xác nhận mới tải được file.
- Lịch sử mua có nút **Tải lại** sau khi duyệt.
- TÚI MÙ random một lần và lưu kết quả vào đơn.
- Admin có đơn test FREE.
- Có `/health` để kiểm tra backend.

## Cách deploy đúng
1. **Không deploy ZIP này dưới Static Site.**
2. Tạo/đổi sang **Web Service** từ source này.
3. Runtime: Node.
4. Build Command: `npm install`.
5. Start Command: `npm start`.
6. Health Check Path: `/health`.
7. Deploy xong mở `/health`. Phải thấy JSON có:
   - `ok: true`
   - `backend: "node-express"`
   - build `SHOPVANNDAIIVIP-AUTH-ORDERS-AIM-V9`

### Lưu ý về dữ liệu trên Render Free
Render Free Web Service có filesystem tạm thời; dữ liệu lưu trong `data/` có thể mất khi service spin down/restart/redeploy. Vì vậy bản V9 tách `DATA_DIR` để có thể chuyển sang persistent disk hoặc datastore sau này. Render hiện cho Free Postgres nhưng database Free có giới hạn và hết hạn sau 30 ngày; không nên xem đó là lưu trữ production lâu dài.

Nếu muốn dữ liệu tài khoản/đơn hàng tồn tại lâu dài, hãy dùng Render Postgres hoặc persistent disk theo khả năng của gói Render.
