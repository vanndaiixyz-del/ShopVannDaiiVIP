# ShopVannĐaiiVIP — FINAL ROOT FIX

## Đã sửa
- AIM FLIZA / AIMLOCK VIP có lựa chọn **FFTH** và **FFM**.
- FFTH dùng đúng `private_files/AIM FLIZA/AIMLOCK VIP FFTH.zip`.
- FFM dùng đúng `private_files/AIM FLIZA/AIMLOCK VIP FFM.zip`.
- AIM 3105 / AIMLOCK VIP dùng đúng `private_files/AIM 3105-IOS/AIMLOCK VIP 3105.zip`.
- AIMLOCK SUPPER được chuyển khỏi thư mục public; chỉ tải qua endpoint sau khi đơn đã được duyệt.
- Mua hàng bắt buộc đăng nhập.
- File chỉ được cấp sau khi Admin xác nhận thanh toán.
- Lịch sử mua cho phép tải lại đơn đã duyệt.
- Admin Test hỗ trợ chọn FFTH/FFM cho AIMLOCK VIP.
- Mật khẩu Admin không nằm trong frontend; server chỉ giữ verifier scrypt. Mật khẩu hiện tại vẫn là `VDVIP`.
- QR thanh toán được giữ nguyên.

## Quan trọng khi deploy Render
Project này là **Node/Express Web Service**, không phải Static Site.

Render phải chạy:
- Build: `npm install`
- Start: `npm start`
- Health: `/health`

Nếu service đang hiện `Runtime: Static` thì `/api/auth/*`, `/api/orders/*` và `/admin/api/*` không thể chạy. Đây chính là nguyên nhân kiểu lỗi “Máy chủ chưa chạy backend đăng nhập”.

Nếu Render không cho đổi Static Site sang Web Service, cần tạo/recreate Web Service từ chính ZIP này rồi gắn domain shop vào Web Service đó.
