// ===== yeuthich.js - Danh sách yêu thích (viết bằng jQuery), có phân trang: mỗi trang 2 dòng sản phẩm =====
// Cần nạp phantrang.js trước file này

const soDongMoiTrang = 2
let trangYT = 1

function renderWish() {
    if (!JH.user()) {
        $("#wishBox").html('<div class="empty-box">Vui lòng đăng nhập để xem danh sách yêu thích.<br><a href="index.html">Về trang chủ</a></div>')
        return
    }
    const list = JH.wishlist()
    if (list.length === 0) {
        $("#wishBox").html('<div class="empty-box">Bạn chưa có sản phẩm yêu thích nào.<br><a href="index.html">Khám phá sản phẩm</a></div>')
        JH.refresh()
        return
    }

    // Vẽ tạm một lưới rỗng để đo số cột hiện tại, rồi tính số sản phẩm mỗi trang = số cột x 2 dòng
    $("#wishBox").html('<div class="product-container" id="wishGrid"></div>')
    const moiTrang = laySoCot("#wishGrid") * soDongMoiTrang
    const tongTrang = Math.ceil(list.length / moiTrang)
    if (trangYT > tongTrang) trangYT = tongTrang           // xóa hết sản phẩm của trang cuối thì lùi về trang trước
    const batDau = (trangYT - 1) * moiTrang

    let html = ""
    $.each(list.slice(batDau, batDau + moiTrang), function (i, p) {
        html += `
        <div class="product-item">
            <div class="wish-del" data-i="${batDau + i}" title="Bỏ yêu thích"><i class="fa-solid fa-xmark"></i></div>
            <div class="item-top"><a href="${p.link || "#"}"><img src="${p.anh}" alt=""></a></div>
            <div class="item-bottom">
                <div class="item-bottom-describle"><p>${p.ten}</p></div>
                <div class="item-bottom-last">
                    <p>${JH.so(JH.toNum(p.gia))}<span>đ</span></p>
                    <div class="item-icon"><a href="${p.link || "#"}"><i class="fa-solid fa-cart-shopping"></i></a></div>
                </div>
            </div>
        </div>`
    })
    $("#wishGrid").html(html)
    $("#wishBox").append(htmlPhanTrang(tongTrang, trangYT))
    JH.refresh()
}

// Bấm dấu X để bỏ yêu thích (các thẻ được vẽ lại nên gắn sự kiện qua #wishBox)
$("#wishBox").on("click", ".wish-del", function () {
    const list = JH.wishlist()
    list.splice(Number($(this).attr("data-i")), 1)
    JH.set(JH.wishKey(), list)
    JH.toast("Đã bỏ khỏi yêu thích")
    renderWish()
})

// Bấm số trang
ganPhanTrang("#wishBox", function (trang) {
    trangYT = trang
    renderWish()
    $("html, body").animate({ scrollTop: 0 }, 300)
})

// Đổi kích thước màn hình thì số cột đổi theo, vẽ lại cho đúng 2 dòng
let cotCu = 0
$(window).on("resize", function () {
    if ($("#wishGrid").length > 0 && laySoCot("#wishGrid") !== cotCu) {
        cotCu = laySoCot("#wishGrid")
        renderWish()
    }
})

renderWish()
cotCu = $("#wishGrid").length > 0 ? laySoCot("#wishGrid") : 0
