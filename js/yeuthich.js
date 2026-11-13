// ===== yeuthich.js - Danh sách yêu thích (UCYT02 xem, UCYT03 xóa) =====
const wishBox = document.getElementById("wishBox");

function renderWish() {
    if (!JH.user()) {
        wishBox.innerHTML = '<div class="empty-box">Vui lòng đăng nhập để xem danh sách yêu thích.<br><a href="index.html">Về trang chủ</a></div>';
        return;
    }
    const list = JH.wishlist();
    if (list.length === 0) {
        wishBox.innerHTML = '<div class="empty-box">Bạn chưa có sản phẩm yêu thích nào.<br><a href="index.html">Khám phá sản phẩm</a></div>';
        JH.refresh();
        return;
    }
    wishBox.innerHTML = '<div class="product-container">' + list.map((p, i) => `
        <div class="product-item">
            <div class="wish-del" data-i="${i}" title="Bỏ yêu thích"><i class="fa-solid fa-xmark" data-i="${i}"></i></div>
            <div class="item-top"><a href="${p.link || "#"}"><img src="${p.anh}" alt=""></a></div>
            <div class="item-bottom">
                <div class="item-bottom-describle"><p>${p.ten}</p></div>
                <div class="item-bottom-last">
                    <p>${JH.toNum(p.gia).toLocaleString("vi-VN")}<span>đ</span></p>
                    <div class="item-icon"><a href="${p.link || "#"}"><i class="fa-solid fa-cart-shopping"></i></a></div>
                </div>
            </div>
        </div>`).join("") + "</div>";
    JH.refresh();
}

wishBox.addEventListener("click", function (e) {
    const i = e.target.dataset.i;
    if (i === undefined) return;
    const list = JH.wishlist();
    list.splice(i, 1);
    JH.set(JH.wishKey(), list);
    JH.toast("Đã bỏ khỏi yêu thích");
    renderWish();
});
renderWish();
