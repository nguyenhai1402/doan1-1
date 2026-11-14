// ===== store.js - Phần dùng chung cho phân hệ khách hàng =====
// Viết bằng jQuery. Thứ tự nạp: jquery -> store.js -> jsforall.js -> file js của từng trang
// Lưu ý: file này viết dạng object JH chứa nhiều hàm (để các trang gọi chung JH.money(), JH.user()...)
// Lưu trữ: localStorage (accounts, loggedInUser, cart, wishlist_<email>, orders)

const JH = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
    money(n) { return Number(n).toLocaleString("vi-VN") + "đ"; },
    toNum(s) { return parseInt(String(s).replace(/[^0-9]/g, "")) || 0; },
    user() { return this.get("loggedInUser", null); },

    // ---- Thông báo nhỏ góc màn hình ----
    toast(msg) {
        const $t = $('<div class="jh-toast"></div>').text(msg).appendTo("body");
        setTimeout(function () { $t.addClass("show"); }, 10);
        setTimeout(function () { $t.removeClass("show"); setTimeout(function () { $t.remove(); }, 300); }, 2200);
    },

    // ---- Bắt buộc đăng nhập (đặt hàng, yêu thích) ----
    requireLogin() {
        if (this.user()) return true;
        alert("Vui lòng đăng nhập để sử dụng chức năng này.");
        $(".form-dangnhap").addClass("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return false;
    },

    // ---- Giỏ hàng: mỗi dòng {key,id,ten,mau,size,gia,soLuong,anh,link} ----
    cart() { return this.get("cart", []); },
    addToCart(item) {
        const cart = this.cart();
        item.key = item.id + "|" + item.mau + "|" + item.size;
        const found = cart.find(function (c) { return c.key === item.key; });
        if (found) found.soLuong += item.soLuong; else cart.push(item);
        this.set("cart", cart); this.refresh();
    },

    // ---- Yêu thích: lưu theo email người dùng ----
    wishKey() { const u = this.user(); return u ? "wishlist_" + u.email : null; },
    wishlist() { const k = this.wishKey(); return k ? this.get(k, []) : []; },
    toggleWish(p) {                       // p = {id,ten,gia,anh,link}; trả về true nếu vừa thêm
        if (!this.requireLogin()) return null;
        let list = this.wishlist();
        const has = list.some(function (x) { return x.id === p.id; });
        list = has ? list.filter(function (x) { return x.id !== p.id; }) : list.concat(p);
        this.set(this.wishKey(), list); this.refresh();
        this.toast(has ? "Đã bỏ khỏi yêu thích" : "Đã thêm vào yêu thích ♥");
        return !has;
    },

    // ---- Cập nhật icon + số đếm trên header và trạng thái trái tim ----
    refresh() {
        const n = this.cart().reduce(function (s, c) { return s + c.soLuong; }, 0);
        $("#cartBadge").text(n);
        $("#wishBadge").text(this.wishlist().length);
        const ids = this.wishlist().map(function (x) { return x.id; });
        $("[data-wid]").each(function () {
            const on = ids.includes($(this).attr("data-wid"));
            const $heart = $(this).is("i") ? $(this) : $(this).find("i");
            $heart.attr("class", (on ? "fa-solid" : "fa-regular") + " fa-heart" + (on ? " liked" : ""));
        });
    },

    // Phí vận chuyển: miễn phí từ 300.000đ, dưới mức đó 25.000đ
    SHIP_FREE: 300000, SHIP_FEE: 25000,
    shipFee(sub) { return sub >= this.SHIP_FREE || sub === 0 ? 0 : this.SHIP_FEE; },

    // Gắn trái tim cho các thẻ .product-item (gọi lại được khi trang vẽ thẻ động)
    bindCards(root) {
        $(root || document).find(".product-item").each(function () {
            const $card = $(this);
            const $heart = $card.find(".item-icon .fa-heart");
            if ($heart.length === 0 || $heart.attr("data-wid") || $card.find(".item-top img").length === 0) return;
            $heart.attr("data-wid", JH.cardData($card).id).css("cursor", "pointer");
            $heart.on("click", function () { JH.toggleWish(JH.cardData($card)); });
        });
        JH.refresh();
    },

    // Đọc thông tin 1 thẻ sản phẩm (.product-item) trên trang danh sách
    cardData($card) {
        const $img = $card.find(".item-top img");
        return {
            id: $img.attr("src"),
            ten: $card.find(".item-bottom-describle p").first().text().trim(),
            gia: this.toNum($card.find(".item-bottom-last p").first().text()),
            anh: $img.attr("src"),
            link: $card.find(".item-top a").attr("href") || ""
        };
    }
};

$(function () {
    // 1. Chèn icon Yêu thích + Giỏ hàng vào header (không cần sửa HTML từng trang)
    $(".header-mid-last").prepend(
        '<div class="hd-icon"><a href="yeuthich.html" title="Yêu thích"><i class="fa-regular fa-heart"></i><span class="hd-badge" id="wishBadge">0</span></a></div>' +
        '<div class="hd-icon"><a href="giohang.html" title="Giỏ hàng"><i class="fa-solid fa-cart-shopping"></i><span class="hd-badge" id="cartBadge">0</span></a></div>');

    // 2. Menu người dùng (hiện khi rê chuột vào tên): thêm link tài khoản + đơn hàng + nút đăng xuất
    $("#logoutOption").html('<a href="taikhoan.html">Tài khoản của tôi</a><a href="donhang.html">Đơn hàng của tôi</a><span id="btnLogout">Đăng xuất</span>');

    // 3. Gắn trái tim cho mọi thẻ sản phẩm
    JH.bindCards();

    // 4. Tìm kiếm trên header -> timkiem.html?q=...
    function timKiem() {
        const q = $(".header-mid-search input").val().trim();
        if (q) location.href = "timkiem.html?q=" + encodeURIComponent(q);
    }
    $(".header-mid-search input").on("keydown", function (e) { if (e.key === "Enter") timKiem(); });
    $(".header-mid-search a").on("click", function (e) { e.preventDefault(); timKiem(); });
});
