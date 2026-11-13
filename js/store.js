// ===== store.js - Phần dùng chung cho phân hệ khách hàng (nạp TRƯỚC jsforall.js) =====
// Lưu trữ: localStorage (accounts, loggedInUser, cart, wishlist_<email>, orders)
const JH = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
    money(n) { return Number(n).toLocaleString("vi-VN") + "đ"; },
    toNum(s) { return parseInt(String(s).replace(/[^0-9]/g, "")) || 0; },
    user() { return this.get("loggedInUser", null); },

    // ---- Thông báo nhỏ góc màn hình ----
    toast(msg) {
        const t = document.createElement("div");
        t.className = "jh-toast"; t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => t.classList.add("show"), 10);
        setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 300); }, 2200);
    },

    // ---- Bắt buộc đăng nhập (đặt hàng, yêu thích) ----
    requireLogin() {
        if (this.user()) return true;
        alert("Vui lòng đăng nhập để sử dụng chức năng này.");
        const f = document.querySelector(".form-dangnhap");
        if (f) f.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return false;
    },

    // ---- Giỏ hàng: mỗi dòng {key,id,ten,mau,size,gia,soLuong,anh,link} ----
    cart() { return this.get("cart", []); },
    addToCart(item) {
        const cart = this.cart();
        item.key = item.id + "|" + item.mau + "|" + item.size;
        const found = cart.find(c => c.key === item.key);
        if (found) found.soLuong += item.soLuong; else cart.push(item);
        this.set("cart", cart); this.refresh();
    },

    // ---- Yêu thích: lưu theo email người dùng ----
    wishKey() { const u = this.user(); return u ? "wishlist_" + u.email : null; },
    wishlist() { const k = this.wishKey(); return k ? this.get(k, []) : []; },
    toggleWish(p) {                       // p = {id,ten,gia,anh,link}; trả về true nếu vừa thêm
        if (!this.requireLogin()) return null;
        let list = this.wishlist();
        const has = list.some(x => x.id === p.id);
        list = has ? list.filter(x => x.id !== p.id) : list.concat(p);
        this.set(this.wishKey(), list); this.refresh();
        this.toast(has ? "Đã bỏ khỏi yêu thích" : "Đã thêm vào yêu thích ♥");
        return !has;
    },

    // ---- Cập nhật icon + số đếm trên header và trạng thái trái tim ----
    refresh() {
        const n = this.cart().reduce((s, c) => s + c.soLuong, 0);
        const cb = document.getElementById("cartBadge"), wb = document.getElementById("wishBadge");
        if (cb) cb.textContent = n;
        if (wb) wb.textContent = this.wishlist().length;
        const ids = this.wishlist().map(x => x.id);
        document.querySelectorAll("[data-wid]").forEach(el => {
            const on = ids.includes(el.dataset.wid);
            const heart = el.matches("i") ? el : el.querySelector("i");
            heart.className = (on ? "fa-solid" : "fa-regular") + " fa-heart" + (on ? " liked" : "");
        });
    },

    // Phí vận chuyển: miễn phí từ 300.000đ, dưới mức đó 25.000đ
    SHIP_FREE: 300000, SHIP_FEE: 25000,
    shipFee(sub) { return sub >= this.SHIP_FREE || sub === 0 ? 0 : this.SHIP_FEE; },

    // Gắn trái tim cho các thẻ .product-item (gọi lại được khi trang vẽ thẻ động)
    bindCards(root) {
        (root || document).querySelectorAll(".product-item").forEach(card => {
            const heart = card.querySelector(".item-icon .fa-heart");
            if (!heart || heart.dataset.wid || !card.querySelector(".item-top img")) return;
            heart.dataset.wid = JH.cardData(card).id; heart.style.cursor = "pointer";
            heart.addEventListener("click", () => JH.toggleWish(JH.cardData(card)));
        });
        JH.refresh();
    },

    // Đọc thông tin 1 thẻ sản phẩm (.product-item) trên trang danh sách
    cardData(card) {
        const img = card.querySelector(".item-top img"), a = card.querySelector(".item-top a");
        return {
            id: img.getAttribute("src"),
            ten: card.querySelector(".item-bottom-describle p").textContent.trim(),
            gia: this.toNum(card.querySelector(".item-bottom-last p").textContent),
            anh: img.getAttribute("src"),
            link: a ? a.getAttribute("href") : ""
        };
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. Chèn icon Yêu thích + Giỏ hàng vào header (không cần sửa HTML từng trang)
    const last = document.querySelector(".header-mid-last");
    if (last) {
        last.insertAdjacentHTML("afterbegin",
            '<div class="hd-icon"><a href="yeuthich.html" title="Yêu thích"><i class="fa-regular fa-heart"></i><span class="hd-badge" id="wishBadge">0</span></a></div>' +
            '<div class="hd-icon"><a href="giohang.html" title="Giỏ hàng"><i class="fa-solid fa-cart-shopping"></i><span class="hd-badge" id="cartBadge">0</span></a></div>');
    }
    // 2. Gắn trái tim cho mọi thẻ sản phẩm
    JH.bindCards();
    // 2b. Tìm kiếm trên header -> timkiem.html?q=...
    const sInput = document.querySelector(".header-mid-search input"), sBtn = document.querySelector(".header-mid-search a");
    if (sInput) {
        const go = () => { const q = sInput.value.trim(); if (q) location.href = "timkiem.html?q=" + encodeURIComponent(q); };
        sInput.addEventListener("keydown", e => { if (e.key === "Enter") go(); });
        if (sBtn) sBtn.addEventListener("click", e => { e.preventDefault(); go(); });
    }
    // 3. Hiển thị trạng thái ban đầu
    JH.refresh();
});
