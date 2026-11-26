// ===== blog.js - Danh sách bài viết theo chuyên mục (UCBLOG01, viết bằng jQuery) =====
// Cần nạp phantrang.js và baiviet.js trước file này

const soBaiMoiTrang = 6
let chuyenMucHienTai = new URLSearchParams(window.location.search).get("cm") || ""   // "" = tất cả
let trangBlog = 1

function veBlog() {
    // đánh dấu nút chuyên mục đang chọn và đổi dòng đường dẫn
    $(".blog-tab").each(function () {
        $(this).toggleClass("active", $(this).attr("data-cm") === chuyenMucHienTai)
    })
    $("#bcChuyenMuc").text(chuyenMucHienTai === "" ? "Blog" : "Blog " + chuyenMucHienTai.toLowerCase())

    const ds = layBaiViet(chuyenMucHienTai)         // chỉ bài đang đăng, mới nhất trước
    if (ds.length === 0) {
        $("#blogList").html('<div class="empty-box">Chưa có bài viết.</div>')
        return
    }
    const tongTrang = Math.ceil(ds.length / soBaiMoiTrang)
    if (trangBlog > tongTrang) trangBlog = tongTrang
    const batDau = (trangBlog - 1) * soBaiMoiTrang

    let html = '<div class="blog-container-item">'
    $.each(ds.slice(batDau, batDau + soBaiMoiTrang), function (i, bv) {
        const link = "blogdetail.html?id=" + bv.id
        html += `
                <div class="blog-item">
                    <div class="blog-item-top">
                        <a href="${link}"><img src="${bv.anh}" alt=""></a>
                    </div>
                    <div class="blog-item-bottom">
                        <a href="${link}"><h3>${bv.tieuDe}</h3></a>
                        <p>${bv.moDau}</p>
                        <div class="blog-last">
                            <p>${ngayNganGon(bv.ngayDang)} - ${bv.chuyenMuc}</p>
                            <a href="${link}"><p>Xem thêm >></p></a>
                        </div>
                    </div>
                </div>`
    })
    $("#blogList").html(html + "</div>" + htmlPhanTrang(tongTrang, trangBlog))
}

// Bấm nút chuyên mục
$(".blog-tab").on("click", function () {
    chuyenMucHienTai = $(this).attr("data-cm")
    trangBlog = 1
    veBlog()
})
// Bấm số trang
ganPhanTrang("#blogList", function (trang) {
    trangBlog = trang
    veBlog()
    $("html, body").animate({ scrollTop: 0 }, 300)
})

veBlog()
