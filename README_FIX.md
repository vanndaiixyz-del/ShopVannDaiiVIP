# Fix cấp file

Bản này sửa lỗi `File không tồn tại` bằng cách:
- Tìm file sản phẩm theo tên trong `private_files`, `storage`, `files` và các thư mục lồng nhau.
- Chỉ đơn đã `PAID`/`PAID_TEST` mới tải được.
- Có đường dẫn tải `/api/orders/:id/download`.
- Có `/api/orders/:id/file-status` để kiểm tra server có thấy file tương ứng.
- Có nút `Kiểm tra thanh toán` trên shop.


## TÚI MÙ
- Giá: 50.000đ.
- Chỉ random sau khi đơn đã được Admin xác nhận thanh toán.
- Kết quả random được lưu vào đơn để không đổi khi tải lại.

## AIM files in this package
- AIM FLIZA: AIMLOCK SUPPER, AIM DRAG, AIM BODY, AIM NECK are mapped to the actual ZIP files included in `private_files`/`public/downloads`.
- AIM 3105: AIM NECK, AIM BODY, AIM DRAG, AIM HEAD, DRAG VIP V1, AIM DRAG NEW, AIM NECK NEW and AIM MAGIC are mapped to the actual ZIP files included.
- The source ZIP does **not** contain the binary files for AIMLOCK VIP (FLIZA) or AIMLOCK VIP (3105), so the server does not pretend those files exist. Those products remain listed but their download is blocked until the real source files are supplied.
- Product preview SVGs are also copied to the root `assets/products/` directory so they load when the site is served as a Render Static Site.
