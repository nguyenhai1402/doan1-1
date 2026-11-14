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

if (kq.length === 0) {
    $("#kqBox").html('<div class="empty-box">' + (q ? "Không tìm thấy sản phẩm phù hợp với từ khóa của bạn." : "Hãy nhập từ khóa vào ô tìm kiếm.") + '<br><a href="index.html">Về trang chủ</a></div>')
} else {
    let html = '<p class="search-info">Tìm thấy ' + kq.length + ' sản phẩm</p><div class="product-container">'
    $.each(kq, function (i, p) {
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
    $("#kqBox").html(html + "</div>")
    JH.bindCards($("#kqBox"))      // gắn trái tim cho các thẻ vừa vẽ
}
