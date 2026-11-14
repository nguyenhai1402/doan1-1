// ===== yeuthich.js - Danh sách yêu thích (viết bằng jQuery) =====

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
    let html = '<div class="product-container">'
    $.each(list, function (i, p) {
        html += `
        <div class="product-item">
            <div class="wish-del" data-i="${i}" title="Bỏ yêu thích"><i class="fa-solid fa-xmark"></i></div>
            <div class="item-top"><a href="${p.link || "#"}"><img src="${p.anh}" alt=""></a></div>
            <div class="item-bottom">
                <div class="item-bottom-describle"><p>${p.ten}</p></div>
                <div class="item-bottom-last">
                    <p>${JH.toNum(p.gia).toLocaleString("vi-VN")}<span>đ</span></p>
                    <div class="item-icon"><a href="${p.link || "#"}"><i class="fa-solid fa-cart-shopping"></i></a></div>
                </div>
            </div>
        </div>`
    })
    $("#wishBox").html(html + "</div>")
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

renderWish()
