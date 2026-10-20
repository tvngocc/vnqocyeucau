# WEBSITE TỎ TÌNH — CHỈ SỬA NỘI DUNG TRONG CODE ♡

Đây là bản website tỏ tình không có trang quản trị hoặc nút **Cá nhân hóa**. Người nhận chỉ có thể đọc thư, xem ảnh, lật thẻ, chơi các tương tác và chủ động hồi đáp. Họ **không thể sửa tên, ảnh, nội dung thư hay màu giao diện trên website**.

## Chạy website

Giải nén ZIP rồi mở `index.html` bằng Chrome, Edge, Safari hoặc Firefox. Không cần server, database hay cài đặt.

## Đổi tên và lời tỏ tình trong mã nguồn

1. Mở **`config.js`** bằng Notepad hoặc VS Code.
2. Sửa những dòng trong đối tượng `window.LOVE_CONFIG`. Ví dụ:

```js
window.LOVE_CONFIG = {
  yourName: "Minh",
  crushName: "Linh",
  // ... các mục khác giữ nguyên hoặc sửa nếu muốn
};
```

Các mục đã có sẵn gồm `yourName` (tên bạn), `crushName` (người nhận), `nickname`, `heroTitle1/2/3`, `tagline`, `quote`, `letterTitle`, `letter` (các đoạn thư), `memories`, `reasons`, `galleryCaptions`, `email`, `firstMet`, `specialDate`, `theme`.

**Sau khi lưu `config.js`, tải lại `index.html` để xem nội dung mới.** Nếu bạn đã đăng website thì tải file đã sửa lên hosting để thay đổi công khai.

## Thay ảnh trong code (không có nút thay ảnh trên web)

1. Chép ảnh thật tên `anh-1.jpg`, `anh-2.jpg`... vào thư mục `assets/`.
2. Trong `config.js`, tìm `galleryImages` và sửa:

```js
galleryImages: [
  "assets/anh-1.jpg",
  "assets/anh-2.jpg",
  "assets/anh-3.jpg",
  "assets/anh-4.jpg",
  "assets/anh-5.jpg",
  "assets/anh-6.jpg"
],
```

Để chuỗi `""` nếu bạn muốn ảnh minh họa mặc định. Không có dữ liệu ảnh nào bị lưu vào trình duyệt.

## Chức năng dành cho người nhận

- Đọc thư tỏ tình bằng cách mở phong bì; có thể sao chép nội dung.
- Bật/tắt giai điệu tự tạo (Web Audio API), không tự phát.
- Lật 12 thẻ lý do, xem timeline, album và ảnh phóng to.
- Cào lớp phủ để hiện lời nhắn bí mật.
- Kéo thanh đo rung động để xem hiệu ứng.
- Xem ngày quen nhau và đồng hồ đếm ngược.
- Chọn một trong ba phản hồi tôn trọng lựa chọn của người nhận; gửi qua ứng dụng email hoặc sao chép tin nhắn, **không tự động gửi**.
- Chọn ngày/hoạt động để tạo file lịch hẹn `.ics` (chỉ là một thao tác tương tác, không thay đổi nội dung website).
- Chia sẻ link, hiệu ứng confetti/trái tim, menu responsive và nút lên đầu trang.

## Đăng online

**Netlify Drop:** vào https://app.netlify.com/drop, kéo cả thư mục chứa `index.html`, `config.js`, `script.js`, `style.css`, `assets/` lên. **GitHub Pages:** đưa toàn bộ các file vào repo rồi bật Settings → Pages.

Khi dùng nút **Gửi qua email**, bạn cần điền email thật trong `config.js`. Người nhận vẫn tự quyết định có gửi hay không, website không có tracking và không thu thập câu trả lời qua máy chủ.

## Tệp kèm theo

- `index.html`: giao diện và các thành phần trang.
- `config.js`: **nơi duy nhất sửa tên, thư, ảnh và dữ liệu**.
- `script.js`: tương tác, không chứa chức năng chỉnh sửa nội dung của trang.
- `style.css`: thiết kế, hiệu ứng, responsive.
- `assets/`: hình minh họa và ảnh do bạn thêm.
- `mo-ngay.html`: **bản 1 file** để xem thử. Nếu muốn sửa bản 1 file, phải mở file HTML bằng VS Code và sửa khối `window.LOVE_CONFIG` bên trong chính tệp đó. Cách thuận tiện hơn là chỉnh `config.js` trong bộ mã nguồn.
