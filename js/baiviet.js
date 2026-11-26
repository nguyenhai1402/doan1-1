// ===== baiviet.js - Dữ liệu bài viết blog (viết bằng jQuery) =====
// Dữ liệu mẫu lấy từ các bài trong blog.html. Được nạp vào localStorage (key "posts") ở lần mở đầu tiên;
// phân hệ quản trị sẽ đăng, sửa, gỡ bài ở đó.
// Mỗi bài: id, tieuDe, chuyenMuc ("Xu hướng" | "Khuyến mãi"), ngayDang (ISO), moDau, anh, noiDung (HTML), trangThai ("Đang đăng" | "Đã gỡ" | "Nháp")
// Chỉ bài "Đang đăng" mới hiển thị cho khách (BR-01).
// Lưu ý: chỉ bài BV01 có nội dung đầy đủ, các bài còn lại đang dùng đoạn mở đầu làm nội dung mẫu, bạn viết thêm nội dung thật vào trường noiDung.

const BAI_VIET_MAU = [
 {
  "id": "BV01",
  "tieuDe": "ÁO THUN COTTON NỮ DỄ THƯƠNG CHO MÙA HÈ – HOLA, SUNSHINE!",
  "chuyenMuc": "Xu hướng",
  "ngayDang": "2025-06-10T10:11:00",
  "moDau": "Chiếc áo thun nữ viền “hola” cực xinh mang sắc thái mùa hè nhẹ nhàng, rạng rỡ. Chất cotton mềm...",
  "anh": "img/img_blog/bl-13.webp",
  "noiDung": "<div class=\"phan-hai\">\n                    <h3 class=\"header\">HOLA, SUNSHINE! ☀️</h3>\n                    <p class=\"subtext\">Chào nắng theo cách riêng – dịu dàng, rực rỡ và một chút \"chic\"!\n                        Chiếc áo thun nữ dễ thương từ Freelancer Fashion chính là lời nhắn ngọt ngào mở đầu một ngày mới\n                        đầy năng lượng.​</p>\n                    <h3 class=\"header\">Áo Thun Mùa Hè – Nhẹ Nhàng Nhưng Không Nhạt Nhòa</h3>\n                    <p class=\"subtext\">Không cần họa tiết cầu kỳ hay thiết kế phức tạp,\n                        chỉ một điểm nhấn viền \"hola\" lượn sóng cũng đủ khiến nàng nổi bật theo cách tinh tế nhất.</p>\n                    <ul>\n                        <li style=\"list-style-type:disc;\">💬 Viền chữ “hola” mềm mại như mood mùa hè – tươi sáng, nhẹ\n                            tênh và đầy cảm hứng.​</li>\n                        <li style=\"list-style-type:disc;\">🧵 Chất liệu cotton mềm mát – phù hợp để nàng mặc từ sáng đến\n                            tối mà vẫn thoải mái.​</li>\n                        <li style=\"list-style-type:disc;\">👕 Form áo vừa vặn, lên dáng dễ thương, năng động – đúng chuẩn\n                            nàng thơ thành thị.​</li>\n                    </ul>\n                    <img src=\"img/img_blog/blog-2.2.webp\" alt=\"\">\n                    <img src=\"img/img_blog/blog-2.3.webp\" alt=\"\">\n                    <h3 class=\"header\">Phối Gì Cũng Hợp – Một Chiếc Áo Cho Mọi Phong Cách​</h3>\n                    <p class=\"subtext\">Dù nàng yêu phong cách nữ tính hay ưa chuộng sự đơn giản, chiếc áo thun cotton\n                        basic này đều chiều lòng mọi outfit:​​</p>\n                    <ul>\n                        <li style=\"list-style-type:disc;\">Kết hợp với quần jeans ống suông cho ngày đi làm nhẹ nhàng.​​\n                        </li>\n                        <li style=\"list-style-type:disc;\">Diện cùng chân váy mini hoặc midi để xuống phố thật xinh\n                            xắn.​​</li>\n                        <li style=\"list-style-type:disc;\">Thêm một đôi sneakers hoặc sandals là nàng đã có ngay một set\n                            đồ “chic and chill” đúng nghĩa!​​</li>\n                    </ul>\n                </div>\n                <div class=\"phan-ba\">\n                    <h2 class=\"header\">\n                        Sẵn Sàng Cho Mùa Nắng Cùng Freelancer Fashion​\n                    </h2>\n                    <h3 class=\"sub-header\">📍 Sản phẩm hiện có mặt trên toàn bộ hệ thống Freelancer – cả cửa hàng và\n                        kênh online.​</h3>\n                    <h3 class=\"sub-header\">\n                        Mua Ngay Tại Đây:​\n                    </h3>\n                    <ul>\n                        <li style=\"list-style-type:disc;\"><a href=\"sanphamchonu.html\">🔸 Website</a>​​</li>\n                        <li style=\"list-style-type:disc;\"><a href=\"#\">🔸 Shopee</a>​​</li>\n                        <li style=\"list-style-type:disc;\"><a href=\"#\">🔸 Hệ thống cửa hàng Freelancer</a>​​</li>\n                    </ul>\n                    <p class=\"poem\">\n                        ☀️ HOLA, SUNSHINE !​ <br>\n                        Một item nhỏ nhưng đủ làm nàng bật mood \"chic-and-chill\" từ sáng tới chiều.​\n                    </p>\n                    <p class=\"tags\"> Tags: <a href=\"sanphamchonu.html\"><span>FREELANCER, </span></a>\n                        <a href=\"sanphamchonu.html\"><span>Freelancer Fashion, </span></a>\n                        <a href=\"blog.htmls\"><span>áo thun, </span></a>\n                        <a href=\"blog.html\"><span>Thời trang nữ, năng động Cá Tính, </span></a>\n                        <a href=\"blog.html\"><span>Phong Cách New Arrival,</span></a>\n                        <a href=\"blog.html\"><span>New Collection</span></a>\n                    </p>\n                </div>",
  "trangThai": "Đang đăng",
  "anhLon": "img/img_blog/blog-2.1.webp",
  "moDauChiTiet": "Chiếc áo thun nữ viền “hola” cực xinh mang sắc thái mùa hè nhẹ nhàng, rạng rỡ. Chất cotton mềm mát, dễ phối đồ, lý tưởng cho ngày năng động và chill."
 },
 {
  "id": "BV02",
  "tieuDe": "QUẦN SHORT NĂNG ĐỘNG VÀ THOẢI MÁI CHO MÙA HÈ",
  "chuyenMuc": "Xu hướng",
  "ngayDang": "2025-06-10T10:10:00",
  "moDau": "Chào hè cực \"cool\" với chiếc quần short thoải mái từ JOHN HENRY!Thiết Kế Basic, Tối GiảnQuần short từ JOHN...",
  "anh": "img/img_blog/sp4.2.webp",
  "noiDung": "<div class=\"phan-hai\"><p class=\"subtext\">Chào hè cực \"cool\" với chiếc quần short thoải mái từ JOHN HENRY!Thiết Kế Basic, Tối GiảnQuần short từ JOHN</p><p class=\"subtext\">Nội dung chi tiết của bài viết đang được cập nhật.</p></div>",
  "trangThai": "Đang đăng"
 },
 {
  "id": "BV03",
  "tieuDe": "SUMMER SHORTS ESSENTIALS - QUẦN SHORT CẠP CAO NỮ",
  "chuyenMuc": "Xu hướng",
  "ngayDang": "2025-06-10T10:09:00",
  "moDau": "Khám phá thiết kế quần short cạp cao nữ phom đứng, màu beige trung tính – dễ phối áo sơ...",
  "anh": "img/img_blog/sp4.3.jpg",
  "noiDung": "<div class=\"phan-hai\"><p class=\"subtext\">Khám phá thiết kế quần short cạp cao nữ phom đứng, màu beige trung tính – dễ phối áo sơ</p><p class=\"subtext\">Nội dung chi tiết của bài viết đang được cập nhật.</p></div>",
  "trangThai": "Đang đăng"
 },
 {
  "id": "BV04",
  "tieuDe": "TỎA SÁNG PHONG CÁCH MÙA HÈ CÙNG OUTFIT NĂNG ĐỘNG",
  "chuyenMuc": "Xu hướng",
  "ngayDang": "2025-06-10T10:08:00",
  "moDau": "Thoải mái tận hưởng ngày hè xanh mát với outfit năng động từ JOHN HENRY. Sự kết hợp giữa chiếc..",
  "anh": "img/img_blog/sp4.12.webp",
  "noiDung": "<div class=\"phan-hai\"><p class=\"subtext\">Thoải mái tận hưởng ngày hè xanh mát với outfit năng động từ JOHN HENRY. Sự kết hợp giữa chiếc..</p><p class=\"subtext\">Nội dung chi tiết của bài viết đang được cập nhật.</p></div>",
  "trangThai": "Đang đăng"
 },
 {
  "id": "BV05",
  "tieuDe": "KHAI TRƯƠNG RỘN RÀNG, NGẬP TRÀN QUÀ TẶNG",
  "chuyenMuc": "Khuyến mãi",
  "ngayDang": "2025-06-10T10:07:00",
  "moDau": "Áp dụng: JOHN HENRY – 27 Bà Triệu, P. Xuân Phú, TP. HuếTừ 18/05 đến 20/05/2025Mừng khai trương cửa hàng...",
  "anh": "img/img_blog/sp4.4.jpg",
  "noiDung": "<div class=\"phan-hai\"><p class=\"subtext\">Áp dụng: JOHN HENRY – 27 Bà Triệu, P. Xuân Phú, TP. HuếTừ 18/05 đến 20/05/2025Mừng khai trương cửa hàng</p><p class=\"subtext\">Nội dung chi tiết của bài viết đang được cập nhật.</p></div>",
  "trangThai": "Đang đăng"
 },
 {
  "id": "BV06",
  "tieuDe": "BASIC BUT NEVER BORING - ÁO THUN TRƠN NỮ DỄ PHỐI, TÔN DÁNG",
  "chuyenMuc": "Xu hướng",
  "ngayDang": "2025-06-10T10:06:00",
  "moDau": "Khám phá thiết kế áo thun basic nữ form ôm nhẹ, chất liệu co giãn mịn mát từ Freelancer Fashion...",
  "anh": "img/img_blog/sp4.5.webp",
  "noiDung": "<div class=\"phan-hai\"><p class=\"subtext\">Khám phá thiết kế áo thun basic nữ form ôm nhẹ, chất liệu co giãn mịn mát từ Freelancer Fashion</p><p class=\"subtext\">Nội dung chi tiết của bài viết đang được cập nhật.</p></div>",
  "trangThai": "Đang đăng"
 },
 {
  "id": "BV07",
  "tieuDe": "NÂNG TẦM PHONG CÁCH HÈ VỚI ÁO POLO SỌC NGANG",
  "chuyenMuc": "Xu hướng",
  "ngayDang": "2025-06-10T10:05:00",
  "moDau": "Mùa hè là thời điểm lý tưởng để làm mới phong cách với những thiết kế thoải mái và cá...",
  "anh": "img/img_blog/sp4.6.webp",
  "noiDung": "<div class=\"phan-hai\"><p class=\"subtext\">Mùa hè là thời điểm lý tưởng để làm mới phong cách với những thiết kế thoải mái và cá</p><p class=\"subtext\">Nội dung chi tiết của bài viết đang được cập nhật.</p></div>",
  "trangThai": "Đang đăng"
 },
 {
  "id": "BV08",
  "tieuDe": "𝐍𝐄𝐖 𝐂𝐎𝐋𝐋𝐄𝐂𝐓𝐈𝐎𝐍 | 𝐃𝐄𝐀𝐑 𝐒𝐔𝐌𝐌𝐄R",
  "chuyenMuc": "Xu hướng",
  "ngayDang": "2025-06-10T10:04:00",
  "moDau": "Chào mùa hè rực rỡ cùng FreelancerMùa hè đã đến thật gần – và đây là thời điểm hoàn hảo...",
  "anh": "img/img_blog/sp4.7.webp",
  "noiDung": "<div class=\"phan-hai\"><p class=\"subtext\">Chào mùa hè rực rỡ cùng FreelancerMùa hè đã đến thật gần – và đây là thời điểm hoàn hảo</p><p class=\"subtext\">Nội dung chi tiết của bài viết đang được cập nhật.</p></div>",
  "trangThai": "Đang đăng"
 },
 {
  "id": "BV09",
  "tieuDe": "CHIẾC SƠ MI HOÀN HẢO CHO MÙA HÈ CỦA BẠN",
  "chuyenMuc": "Xu hướng",
  "ngayDang": "2025-06-10T10:03:00",
  "moDau": "Mùa hè là thời điểm lý tưởng để “refresh” phong cách. Một chiếc sơ mi tay ngắn thoáng mát, trẻ...",
  "anh": "img/img_blog/sp4.8.webp",
  "noiDung": "<div class=\"phan-hai\"><p class=\"subtext\">Mùa hè là thời điểm lý tưởng để “refresh” phong cách. Một chiếc sơ mi tay ngắn thoáng mát, trẻ</p><p class=\"subtext\">Nội dung chi tiết của bài viết đang được cập nhật.</p></div>",
  "trangThai": "Đang đăng"
 },
 {
  "id": "BV10",
  "tieuDe": "CHẠM VÀO HÈ – THOẢI MÁI & LỊCH LÃM CÙNG ÁO POLO",
  "chuyenMuc": "Xu hướng",
  "ngayDang": "2025-06-10T10:02:00",
  "moDau": "Thoáng mát, linh hoạt và dễ phối – áo polo chính là \"người bạn đồng hành\" không thể thiếu trong..",
  "anh": "img/img_blog/sp4.9.webp",
  "noiDung": "<div class=\"phan-hai\"><p class=\"subtext\">Thoáng mát, linh hoạt và dễ phối – áo polo chính là \"người bạn đồng hành\" không thể thiếu trong..</p><p class=\"subtext\">Nội dung chi tiết của bài viết đang được cập nhật.</p></div>",
  "trangThai": "Đang đăng"
 },
 {
  "id": "BV11",
  "tieuDe": "SALE TO ĐÓN LỄ – MUA CÀNG NHIỀU, GIẢM CÀNG SÂU",
  "chuyenMuc": "Khuyến mãi",
  "ngayDang": "2025-06-10T10:01:00",
  "moDau": "Mừng đại lễ 30/4 – 1/5, JOHN HENRY gửi tới bạn ưu đãi cực chất: sắm đồ xịn, giá siêu...",
  "anh": "img/img_blog/sp4.10.webp",
  "noiDung": "<div class=\"phan-hai\"><p class=\"subtext\">Mừng đại lễ 30/4 – 1/5, JOHN HENRY gửi tới bạn ưu đãi cực chất: sắm đồ xịn, giá siêu</p><p class=\"subtext\">Nội dung chi tiết của bài viết đang được cập nhật.</p></div>",
  "trangThai": "Đang đăng"
 },
 {
  "id": "BV12",
  "tieuDe": "TỎA SÁNG PHONG CÁCH MÙA HÈ CÙNG OUTFIT NĂNG ĐỘNG",
  "chuyenMuc": "Xu hướng",
  "ngayDang": "2025-06-10T10:00:00",
  "moDau": "Thoải mái tận hưởng ngày hè xanh mát với outfit năng động từ JOHN HENRY. Sự kết hợp giữa chiếc...",
  "anh": "img/img_blog/sp4.11.webp",
  "noiDung": "<div class=\"phan-hai\"><p class=\"subtext\">Thoải mái tận hưởng ngày hè xanh mát với outfit năng động từ JOHN HENRY. Sự kết hợp giữa chiếc</p><p class=\"subtext\">Nội dung chi tiết của bài viết đang được cập nhật.</p></div>",
  "trangThai": "Đang đăng"
 }
];

// Nạp dữ liệu mẫu lần đầu
if (!localStorage.getItem("posts")) {
    localStorage.setItem("posts", JSON.stringify(BAI_VIET_MAU))
}

// Danh sách bài đang đăng, mới nhất trước. chuyenMuc để rỗng = lấy tất cả chuyên mục
function layBaiViet(chuyenMuc) {
    const ds = JSON.parse(localStorage.getItem("posts")) || []
    return ds.filter(function (bv) {
        return bv.trangThai === "Đang đăng" && (!chuyenMuc || bv.chuyenMuc === chuyenMuc)
    }).sort(function (a, b) {
        return new Date(b.ngayDang) - new Date(a.ngayDang)
    })
}

// Lấy 1 bài theo id; trả về undefined nếu không có hoặc đã bị gỡ (bài không khả dụng)
function layMotBaiViet(id) {
    return layBaiViet("").find(function (bv) { return bv.id === id })
}

// Ngày dạng 10/6/2025 (dùng ở danh sách)
function ngayNganGon(iso) {
    const d = new Date(iso)
    return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear()
}

// Ngày dạng "10 tháng 06, 2025" (dùng ở trang chi tiết)
function ngayDayDu(iso) {
    const d = new Date(iso)
    return String(d.getDate()).padStart(2, "0") + " tháng " + String(d.getMonth() + 1).padStart(2, "0") + ", " + d.getFullYear()
}
