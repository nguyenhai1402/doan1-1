// ===== giohang.js - Trang giỏ hàng (UCGH02 xem, UCGH03 sửa số lượng, UCGH04 xóa) =====
const cartBox = document.getElementById("cartBox");

function renderCart() {
    const cart = JH.cart();
    if (cart.length === 0) {
        cartBox.innerHTML = '<div class="empty-box">Giỏ hàng của bạn đang trống.<br><a href="index.html">Tiếp tục mua sắm</a></div>';
        JH.refresh();
        return;
    }
    const sub = cart.reduce((s, c) => s + c.gia * c.soLuong, 0);
    const ship = JH.shipFee(sub);
    const rows = cart.map((c, i) => `
        <div class="cart-item">
            <a href="${c.link}"><img src="${c.anh}" alt=""></a>
            <div class="cart-info">
                <a href="${c.link}">${c.ten}</a>
                <p>Màu: ${c.mau} &nbsp;|&nbsp; Size: ${c.size}</p>
                <p class="unit">${JH.money(c.gia)}</p>
            </div>
            <div class="qty">
                <button data-act="giam" data-i="${i}">-</button>
                <span>${c.soLuong}</span>
                <button data-act="tang" data-i="${i}">+</button>
            </div>
            <div class="cart-line">${JH.money(c.gia * c.soLuong)}</div>
            <i class="fa-solid fa-trash cart-del" data-act="xoa" data-i="${i}" title="Xóa"></i>
        </div>`).join("");
    const conThieu = JH.SHIP_FREE - sub;
    cartBox.innerHTML = `
        <div class="cart-wrap">
            <div class="cart-list">${rows}</div>
            <div class="cart-sum">
                <h3>Tóm tắt đơn hàng</h3>
                <div class="row-sum"><span>Tạm tính</span><span>${JH.money(sub)}</span></div>
                <div class="row-sum"><span>Phí vận chuyển</span><span>${ship === 0 ? "Miễn phí" : JH.money(ship)}</span></div>
                <div class="row-sum total"><span>Tổng cộng</span><span>${JH.money(sub + ship)}</span></div>
                <p class="note">${conThieu > 0 ? "Mua thêm " + JH.money(conThieu) + " để được miễn phí vận chuyển." : "Đơn hàng của bạn được miễn phí vận chuyển."}</p>
                <p class="note">Mã giảm giá được nhập ở bước đặt hàng.</p>
                <button class="btn-main" id="btnDatHang">TIẾN HÀNH ĐẶT HÀNG</button>
                <a class="btn-sub" href="index.html">Tiếp tục mua sắm</a>
            </div>
        </div>`;
    JH.refresh();
}

// Một chỗ lắng nghe cho tất cả nút +, -, xóa (dùng event delegation)
cartBox.addEventListener("click", function (e) {
    const act = e.target.dataset.act, i = e.target.dataset.i;
    const cart = JH.cart();
    if (act === "tang") cart[i].soLuong++;
    else if (act === "giam") { if (cart[i].soLuong > 1) cart[i].soLuong--; }
    else if (act === "xoa") { if (!confirm("Xóa sản phẩm này khỏi giỏ hàng?")) return; cart.splice(i, 1); }
    else if (e.target.id === "btnDatHang") {
        if (!JH.requireLogin()) return;               // đặt hàng phải đăng nhập
        sessionStorage.setItem("checkoutItems", JSON.stringify(cart));
        sessionStorage.setItem("checkoutFrom", "cart");
        window.location.href = "thanhtoan.html";
        return;
    } else return;
    JH.set("cart", cart);
    renderCart();
});

renderCart();
