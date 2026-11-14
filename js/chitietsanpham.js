// ===== chitietsanpham.js - Trang chi tiết sản phẩm (viết bằng jQuery) =====

// ===== Slider ảnh sản phẩm =====
const $anhSP = $(".left-item > img")       // tất cả ảnh sản phẩm
const $khungAnh = $(".left-item")          // khung chứa các ảnh
$anhSP.each(function (index) {
    $(this).css("left", index * 100 + "%")
})
let imgQuantity = $anhSP.length
let navimgindex = 0

// nút điều hướng ảnh sang trái
$(".nav > .left").on("click", function () {
    navimgindex--
    if (navimgindex < 0) {
        navimgindex = imgQuantity - 1
    }
    handleImg(navimgindex)
})
// nút điều hướng ảnh sang phải
$(".nav > .right").on("click", function () {
    navimgindex++
    if (navimgindex >= imgQuantity) {
        navimgindex = 0
    }
    handleImg(navimgindex)
})
function handleImg(index) {
    $khungAnh.css("right", index * 100 + "%")
}


// Gắn sự kiện click cho các size đã bán hết
$(".run-out").on("click", function () {
    alert("Kích cỡ này chúng tôi đã hết. Bạn hãy liên hệ chúng tôi qua số điện thoại hoặc các trang mạng xã hội");
});


// open hướng dẫn chọn size
$(".size-measure > img, .size-measure > p").on("click", function () {
    $(".size-reference-container").show()
})

//   close hướng dẫn chọn size
$(".size-reference .close").on("click", function () {
    $(".size-reference-container").hide()
})


// mô tả và policy
$(".nav-header > .lione").on("click", function () {
    $(".nav-detail").show()
    $(".nav-policy").hide()
    $(this).addClass("active")
    $(".nav-header > .litwo").removeClass("active")
})
$(".nav-header > .litwo").on("click", function () {
    $(".nav-policy").show()
    $(".nav-detail").hide()
    $(this).addClass("active")
    $(".nav-header > .lione").removeClass("active")
})


// Tăng giảm số lượng
const $bangSL = $(".product-quantity")
const $nutGiam = $bangSL.find("tr > td:first-child p")
const $nutTang = $bangSL.find("tr > td:last-child p")
const $soLuong = $bangSL.find("tr > td:nth-child(2) p")
let quantity = 1

$nutGiam.on("click", function () {
    if (quantity > 1) {
        quantity--
    }
    $soLuong.text(quantity)
})
$nutTang.on("click", function () {
    quantity++
    $soLuong.text(quantity)
})


// ===== Chọn size =====
let sizeChon = ""
$(".size > ul > li:not(.run-out)").on("click", function () {
    $(".size > ul > li").removeClass("selected")
    $(this).addClass("selected")
    sizeChon = $(this).text().trim()
})

// Lấy thông tin sản phẩm đang xem (null nếu chưa chọn size)
function laySanPham() {
    if (!sizeChon) { JH.toast("Vui lòng chọn kích thước"); return null }
    const anh = $(".product-detail-left .left-item img").first().attr("src")
    return {
        id: anh,                                                   // dùng ảnh đầu làm mã nhận diện
        ten: $(".product-detail-right .title").first().text().trim(),
        mau: $(".color span").first().text().trim(),
        size: sizeChon,
        gia: JH.toNum($(".price").first().text()),
        soLuong: quantity,
        anh: anh,
        link: location.pathname.split("/").pop()
    }
}

// Thêm vào giỏ hàng (khách vãng lai cũng được dùng)
$(".them-gio").on("click", function () {
    const sp = laySanPham()
    if (!sp) return
    JH.addToCart(sp)
    JH.toast("Đã thêm vào giỏ hàng")
})

// Mua ngay: bắt buộc đăng nhập, rồi chuyển sang thanh toán
$(".mua-ngay").on("click", function () {
    const sp = laySanPham()
    if (!sp || !JH.requireLogin()) return
    sessionStorage.setItem("checkoutItems", JSON.stringify([sp]))
    sessionStorage.removeItem("checkoutFrom")
    window.location.href = "thanhtoan.html"
})

// Yêu thích
const anhYT = $(".product-detail-left .left-item img").first().attr("src")
$(".ct-wish i").attr("data-wid", anhYT)
JH.refresh()
$(".ct-wish").on("click", function () {
    JH.toggleWish({
        id: anhYT,
        ten: $(".product-detail-right .title").first().text().trim(),
        gia: JH.toNum($(".price").first().text()),
        anh: anhYT,
        link: location.pathname.split("/").pop()
    })
})
