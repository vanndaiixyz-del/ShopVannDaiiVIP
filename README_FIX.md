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
