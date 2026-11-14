// ===== jsforall.js - Phần chung của mọi trang khách hàng (viết bằng jQuery) =====

// Ẩn hiện header khi scroll
let vitribandau = $(window).scrollTop()
// Lưu lại vị trí trc khi cuộn của trang

$(window).on("scroll", function () {
    const vitrihientai = $(window).scrollTop()

    if (vitribandau > vitrihientai) {
        // Kéo lên: hiện header
        $("header").removeClass("hidden")
    } else {
        // Kéo xuống: ẩn header
        $("header").addClass("hidden")
    }

    vitribandau = vitrihientai
})
// end ẩn hiện header

// JS hiển thị menu đăng nhập
// (.first() vì trong .login có nhiều thẻ p, chỉ thẻ p đầu tiên là icon người)
$(".login p").first().on("click", function () {
    $(".form-dangnhap").toggleClass("active")
})
// end JS hiển thị menu đăng nhập
$(".form-dangnhap .close").on("click", function () {
    $(".form-dangnhap").removeClass("active")
})


//banner động
const $bannerContain = $(".banner-container-img")
const $anhBanner = $(".banner-container-img > img")
const $dotBanner = $(".dot > i")

$anhBanner.each(function (index) {
    $(this).css("left", index * 100 + "%")

    // ấn vào chấm tròn sẽ dịch banner theo vị trí tương ứng
    // (nếu không có chấm thứ index thì $dotBanner.eq(index) rỗng, không báo lỗi)
    $dotBanner.eq(index).on("click", function () {
        handleBanner(index)
    })
})
let indexBanner = 0
let bannerQuantity = $anhBanner.length

function navigationBanner() {
    indexBanner++;
    if (indexBanner >= bannerQuantity) {
        indexBanner = 0
    }
    handleBanner(indexBanner)
}
function handleBanner(index) {
    $bannerContain.css("left", "-" + index * 100 + "%")
    $(".dot .active").removeClass("active")
    $dotBanner.eq(index).addClass("active")
}
//  Mỗi 3 giây banner sẽ cuộn sang ngang 1 lần (chỉ chạy khi trang có banner)
if ($bannerContain.length > 0) setInterval(navigationBanner, 3000)


//đăng nhập
$("#buttonlogin").on("click", function () {
    const email = $("#loginEmail").val().trim();
    const password = $("#loginPassword").val();
    const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    const user = accounts.find(function (acc) {
        return acc.email === email && acc.password === password
    });

    if (user && user.trangThai === "locked") {
        alert("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ CSKH.");
        return;
    }
    if (user) {
        alert("Đăng nhập thành công!");

        // Lưu trạng thái đăng nhập
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        // Hiển thị tên, ẩn form đăng nhập
        $("#usernameDisplay").text(user.ten);
        $(".user-info").show();
        $(".login").hide();
        $("#loginEmail").val("");
        $("#loginPassword").val("");
        JH.refresh();

        // Trang bắt buộc đăng nhập (tài khoản, đơn hàng) thì tải lại để hiện nội dung
        if ($(".can-dang-nhap").length > 0) location.reload();
    } else {
        alert("Email hoặc mật khẩu không đúng.");
    }
});

// HIỂN THỊ TÊN NẾU ĐÃ ĐĂNG NHẬP
$(function () {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
        $("#usernameDisplay").text(user.ten);
        $(".user-info").show();
        $(".login").hide();
    }
});

// ĐĂNG XUẤT
// (dùng .on("click", "#btnLogout", ...) vì nút này do store.js tạo ra sau khi trang tải xong)
$("#logoutOption").on("click", "#btnLogout", function () {
    localStorage.removeItem("loggedInUser");
    $(".user-info").hide();
    $(".login").show();
    alert("Đăng xuất thành công")
    JH.refresh();
    // Đang ở trang bắt buộc đăng nhập thì về trang chủ
    if ($(".can-dang-nhap").length > 0) window.location.href = "index.html";
});


// chức năng ẩn hiện các danh mục
$(".menu-toggle").on("click", function () {
    $(".header-bottom").toggleClass("active");
});
