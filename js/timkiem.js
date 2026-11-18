// ===== timkiem.js - Kết quả tìm kiếm (viết bằng jQuery), đọc từ PRODUCTS trong products.js =====

// bỏ dấu tiếng Việt để gõ "ao polo" vẫn tìm ra "Áo Polo"
function boDau(s) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase()
}

const q = (new URLSearchParams(location.search).get("q") || "").trim()
$("#kqTitle").text(q ? 'KẾT QUẢ TÌM KIẾM: "' + q + '"' : "TÌM KIẾM SẢN PHẨM")
$(".header-mid-search input").val(q)

const tuKhoa = boDau(q).split(/\s+/).filter(Boolean)
const kq = tuKhoa.length === 0 ? [] : PRODUCTS.filter(function (p) {
    const text = boDau(p.ten + " " + p.thuongHieu)
    // sản phẩm phải chứa tất cả từ khóa
    return tuKhoa.every(function (k) { return text.includes(k) })
})

// Phân trang: mỗi trang 2 dòng sản phẩm (cần nạp phantrang.js trước file này)
const soDongMoiTrang = 2
let trangTK = 1

function veKetQua() {
    if (kq.length === 0) {
        $("#kqBox").html('<div class="empty-box">' + (q ? "Không tìm thấy sản phẩm phù hợp với từ khóa của bạn." : "Hãy nhập từ khóa vào ô tìm kiếm.") + '<br><a href="index.html">Về trang chủ</a></div>')
        return
    }
    // vẽ tạm lưới rỗng để đo số cột, mỗi trang = số cột x 2 dòng
    $("#kqBox").html('<p class="search-info">Tìm thấy ' + kq.length + ' sản phẩm</p><div class="product-container" id="kqGrid"></div>')
    const moiTrang = laySoCot("#kqGrid") * soDongMoiTrang
    const tongTrang = Math.ceil(kq.length / moiTrang)
    if (trangTK > tongTrang) trangTK = tongTrang
    const batDau = (trangTK - 1) * moiTrang

    let html = ""
    $.each(kq.slice(batDau, batDau + moiTrang), function (i, p) {
        html += `
        <div class="product-item">
            <div class="item-top"><a href="${p.link}"><img src="${p.anh}" alt=""></a></div>
            <div class="item-bottom">
                <div class="item-bottom-describle"><p>${p.ten}</p></div>
                <div class="item-bottom-last">
                    <p>${p.gia.toLocaleString("vi-VN")}<span>đ</span></p>
                    <div class="item-icon"><i class="fa-regular fa-heart"></i><a href="${p.link}"><i class="fa-solid fa-cart-shopping"></i></a></div>
                </div>
            </div>
        </div>`
    })
    $("#kqGrid").html(html)
    $("#kqBox").append(htmlPhanTrang(tongTrang, trangTK))
    JH.bindCards($("#kqBox"))      // gắn trái tim cho các thẻ vừa vẽ
}

ganPhanTrang("#kqBox", function (trang) {
    trangTK = trang
    veKetQua()
    $("html, body").animate({ scrollTop: 0 }, 300)
})
// đổi kích thước màn hình thì số cột đổi theo
let cotCuTK = 0
$(window).on("resize", function () {
    if ($("#kqGrid").length > 0 && laySoCot("#kqGrid") !== cotCuTK) {
        cotCuTK = laySoCot("#kqGrid")
        veKetQua()
    }
})

veKetQua()
cotCuTK = $("#kqGrid").length > 0 ? laySoCot("#kqGrid") : 0
