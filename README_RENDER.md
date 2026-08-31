# ShopVannĐaiiVIP – Render

Bản này được cấu hình để Render tự triển khai khi repository được cập nhật (`autoDeploy: true`) và tự đánh thức web service khi có request nhờ health check `/health`.

## Quan trọng
- Không cần bấm Restart thủ công chỉ vì service Render đang sleep: truy cập shop sẽ tự đánh thức service.
- Nếu bạn thay đổi mã nguồn, Render vẫn phải deploy phiên bản mới; với `autoDeploy: true`, việc deploy có thể tự chạy sau khi push lên Git.
- Dữ liệu `orders.json` nằm trên filesystem của service. Nếu cần dữ liệu đơn hàng không mất sau redeploy/restart, nên chuyển sang PostgreSQL hoặc persistent storage.
