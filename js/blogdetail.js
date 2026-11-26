// ===== blogdetail.js - Đọc một bài viết (UCBLOG01, viết bằng jQuery) =====
// Mã bài lấy từ địa chỉ: blogdetail.html?id=BV01. Cần nạp baiviet.js trước file này

const idBai = new URLSearchParams(window.location.search).get("id")
const bai = layMotBaiViet(idBai)          // undefined nếu không có hoặc bài đã bị gỡ

if (!bai) {
    // 5a: bài đã bị gỡ hoặc không tồn tại
    $("#bcTieuDe").text("Bài viết không khả dụng")
    $("#baiVietBox").html('<div class="empty-box">Bài viết không khả dụng.<br><a href="blog.html">Quay lại blog</a></div>')
} else {
    document.title = bai.tieuDe
    $("#bcLink").attr("href", "blog.html?cm=" + encodeURIComponent(bai.chuyenMuc))
    $("#bcChuyenMuc").text("Blog " + bai.chuyenMuc.toLowerCase())
    $("#bcTieuDe").text(bai.tieuDe)

    // Phần đầu: tiêu đề, thời gian đăng, ảnh, đoạn mở đầu; sau đó là nội dung đầy đủ
    $("#baiVietBox").html(`
        <div class="phan-mot">
            <h3 class="header">${bai.tieuDe}</h3>
            <p class="subtext">${ngayDayDu(bai.ngayDang)}</p>
            <img src="${bai.anhLon || bai.anh}" alt="">
            <p class="bottom">${bai.moDauChiTiet || bai.moDau}</p>
        </div>` + bai.noiDung)

    // Bài viết liên quan: 3 bài mới nhất cùng chuyên mục (trừ bài đang đọc)
    const lienQuan = layBaiViet(bai.chuyenMuc).filter(function (x) { return x.id !== bai.id }).slice(0, 3)
    if (lienQuan.length > 0) {
        let html = '<div class="blog-header"><p>BÀI VIẾT LIÊN QUAN</p></div><div class="blog-container-item">'
        $.each(lienQuan, function (i, x) {
            const link = "blogdetail.html?id=" + x.id
            html += `
                    <div class="blog-item">
                        <div class="blog-item-top">
                            <a href="${link}"><img src="${x.anh}" alt=""></a>
                        </div>
                        <div class="blog-item-bottom">
                            <div class="blog-date"><p>${ngayNganGon(x.ngayDang)}</p></div>
                            <a href="${link}"><h3>${x.tieuDe}</h3></a>
                            <p>${x.moDau}</p>
                        </div>
                    </div>`
        })
        $("#baiVietLienQuan").html(html + "</div>")
    }
}
