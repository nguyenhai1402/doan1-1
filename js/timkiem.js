// ===== timkiem.js - Kết quả tìm kiếm (UCXSP02), đọc từ PRODUCTS trong products.js =====
// bỏ dấu tiếng Việt để gõ "ao polo" vẫn tìm ra "Áo Polo"
const boDau = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();

const q = (new URLSearchParams(location.search).get("q") || "").trim();
document.getElementById("kqTitle").textContent = q ? 'KẾT QUẢ TÌM KIẾM: "' + q + '"' : "TÌM KIẾM SẢN PHẨM";
const box = document.getElementById("kqBox");
const input = document.querySelector(".header-mid-search input");
if (input) input.value = q;

const tuKhoa = boDau(q).split(/\s+/).filter(Boolean);
const kq = tuKhoa.length === 0 ? [] : PRODUCTS.filter(p => {
    const text = boDau(p.ten + " " + p.thuongHieu);
    return tuKhoa.every(k => text.includes(k));          // sản phẩm phải chứa tất cả từ khóa
});

if (kq.length === 0) {
    box.innerHTML = '<div class="empty-box">' + (q ? "Không tìm thấy sản phẩm phù hợp với từ khóa của bạn." : "Hãy nhập từ khóa vào ô tìm kiếm.") + '<br><a href="index.html">Về trang chủ</a></div>';
} else {
    box.innerHTML = '<p class="search-info">Tìm thấy ' + kq.length + ' sản phẩm</p><div class="product-container">' + kq.map(p => `
        <div class="product-item">
            <div class="item-top"><a href="${p.link}"><img src="${p.anh}" alt=""></a></div>
            <div class="item-bottom">
                <div class="item-bottom-describle"><p>${p.ten}</p></div>
                <div class="item-bottom-last">
                    <p>${p.gia.toLocaleString("vi-VN")}<span>đ</span></p>
                    <div class="item-icon"><i class="fa-regular fa-heart"></i><a href="${p.link}"><i class="fa-solid fa-cart-shopping"></i></a></div>
                </div>
            </div>
        </div>`).join("") + "</div>";
    JH.bindCards(box);                                   // gắn trái tim cho các thẻ vừa vẽ
}
