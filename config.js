/* ============================================================
   CHỈ CHỈNH SỬA TRONG FILE NÀY (config.js)
   1) Đổi yourName, crushName, lời nhắn, thư tình, ngày kỷ niệm...
   2) Thêm ảnh vào assets/ và đổi galleryImages bên dưới.
   3) Lưu file, sau đó mở index.html hoặc đăng toàn bộ thư mục.
   Trên website KHÔNG có nút cá nhân hóa hay thay đổi nội dung.
   ============================================================ */
window.LOVE_CONFIG = {
  yourName: "Một người thương cậu",
  crushName: "Cậu",
  nickname: "người đặc biệt",
  email: "tvngocc@gmail.com", // Email nhận câu trả lời, ví dụ: ban@gmail.com. Để trống nếu không muốn.
  firstMet: "2026-09-17", // Ngày hai người quen nhau (YYYY-MM-DD)
  specialDate: "2026-11-18", // Ngày muốn hẹn / mốc quan trọng (YYYY-MM-DD)
  location: "Một góc nhỏ trong tim mình",
  heroLine: "Có một điều rất nhỏ, nhưng mình đã cất giữ thật lâu…",
  heroTitle1: "Thế giới có",
  heroTitle2: "hàng triệu người,",
  heroTitle3: "mình lại thương cậu.",
  tagline: "Mọi điều xinh đẹp đều có một câu chuyện. Và câu chuyện mình thích nhất, là câu chuyện có cậu.",
  quote: "Giữa vô vàn lần gặp gỡ, thật may vì mình đã gặp được cậu.",
  secret: "Cậu không phải lựa chọn ngẫu nhiên. Cậu là điều dịu dàng mà trái tim mình luôn muốn hướng về.",
  invitation: "Nếu một ngày đẹp trời, cậu cũng muốn thử nắm tay mình, chúng ta bắt đầu từ một buổi hẹn nhé?",
  letterTitle: "Gửi cậu, người khiến ngày bình thường trở nên đáng nhớ",
  letter: [
    "Mình đã nghĩ rất lâu về cách bắt đầu lá thư này. Vì cứ mỗi lần nhắc đến cậu, những câu chữ bỗng trở nên vụng về hơn bình thường.",
    "Mình thích cách cậu xuất hiện, nhẹ nhàng mà làm cả ngày của mình sáng lên. Thích những cuộc trò chuyện không cần quá nhiều lý do, thích cả những khoảnh khắc rất đỗi bình thường khi được ở gần cậu.",
    "Có lẽ thích một người không phải lúc nào cũng là điều gì thật lớn lao. Đôi khi chỉ là mong cậu ăn ngon, ngủ yên, gặp chuyện vui và biết rằng vẫn có một người âm thầm quan tâm cậu.",
    "Mình không mong cậu phải trả lời ngay, cũng không muốn cậu thấy áp lực. Mình chỉ muốn thật lòng nói rằng: mình thích cậu. Và dù câu trả lời thế nào, mình vẫn trân trọng cậu.",
    "Cảm ơn cậu vì đã là một phần thật đẹp trong những ngày của mình. ♡"
  ],
  memories: [
    { date: "Ngày đầu tiên", title: "Lần đầu mình nhìn thấy cậu", text: "Một khoảnh khắc rất bình thường, vậy mà đến bây giờ mình vẫn nhớ.", icon: "✦" },
    { date: "Một buổi chiều", title: "Cuộc trò chuyện đáng nhớ", text: "Chỉ vài câu đơn giản thôi, nhưng khiến mình mỉm cười cả ngày.", icon: "☕" },
    { date: "Từ lúc nào không hay", title: "Mình bắt đầu chờ tin nhắn", text: "Điện thoại sáng lên, tự nhiên trái tim cũng vui theo.", icon: "♡" },
    { date: "Hôm nay", title: "Mình quyết định nói thật", text: "Thay vì giữ trong lòng, mình muốn dành tặng cậu cả trang web này.", icon: "✉" }
  ],
  reasons: [
    "Nụ cười của cậu có thể cứu cả một ngày tệ của mình.",
    "Cậu luôn có cách làm những chuyện nhỏ trở nên đặc biệt.",
    "Mình thấy bình yên khi được nói chuyện cùng cậu.",
    "Cậu rất dễ thương, kể cả khi cậu không nhận ra.",
    "Chỉ cần nghĩ đến cậu, mình đã bất giác mỉm cười.",
    "Mình thích phiên bản chân thật nhất của cậu.",
    "Những câu chuyện của cậu khiến mình muốn lắng nghe mãi.",
    "Ở cạnh cậu, mình được là chính mình.",
    "Mình muốn cùng cậu khám phá nhiều điều mới.",
    "Cậu khiến mình muốn trở thành người tốt hơn.",
    "Mọi cuộc gặp có cậu đều đáng nhớ hơn một chút.",
    "Vì đơn giản, người ấy chính là cậu."
  ],
  // Để trống để dùng minh họa mẫu. Thay chuỗi bằng đường dẫn ảnh thật trong assets/.
  galleryImages: [
    "", "", "", "", "", ""
  ],
  galleryCaptions: [
    "Khoảnh khắc đầu tiên",
    "Một chút bình yên",
    "Bầu trời hôm ấy",
    "Hoa dành cho cậu",
    "Những ngày có nắng",
    "Điều mình muốn giữ"
  ],
  playlist: ["Bản nhạc nhỏ cho cậu", "Ngày mình biết thương", "Một lời chưa nói"],
  theme: "rose", // rose | lavender | midnight
  showCountdown: true,
  floatingHearts: true
};
