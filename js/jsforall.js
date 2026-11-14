
// Ẩn hiện header khi scroll
let vitribandau = window.pageYOffset;
// Lưu lại vị trí trc khi ccuộn của trang
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    const vitrihientai = window.pageYOffset;

    if (vitribandau > vitrihientai) {
        // Kéo lên: hiện header
        header.classList.remove("hidden");
    } else {
        // Kéo xuống: ẩn header
        header.classList.add("hidden");
    }

    vitribandau = vitrihientai;
});
// end ẩn hiện header

// JS hiển thị menu đăng nhập
let dangnhap = document.querySelector(".login p")
let hienthilog = document.querySelector(".form-dangnhap")
let closelog = document.querySelector(".form-dangnhap .close")
dangnhap.addEventListener("click", () => {

    hienthilog.classList.toggle("active")
})
// end JS hiển thị menu đăng nhập
closelog.addEventListener("click", () => {
    hienthilog.classList.remove("active")
})


//banner động
const allbanner1 = document.querySelectorAll(".banner-container-img > img")
const bannerContain = document.querySelector(".banner-container-img")
const dotBanner = document.querySelectorAll(".dot > i")


allbanner1.forEach(function (imgbanner, index) {
    imgbanner.style.left = index * 100 + "%";

    // ấn vào nút sẽ dịch banner theo vị trí của dot tương ứng banner
    // (kiểm tra dotBanner[index] có tồn tại để tránh lỗi khi số ảnh nhiều hơn số chấm)
    if (dotBanner[index]) {
        dotBanner[index].addEventListener("click", () => {
            handleBanner(index)
        })
    }
    // end ấn vào nút sẽ dịch banner theo vị trí của dot tương ứng banner
})
let indexBanner = 0
let bannerQuantity = allbanner1.length

function navigationBanner() {
    indexBanner++;
    if (indexBanner >= bannerQuantity) {
        indexBanner = 0
    }
    handleBanner(indexBanner)
}
function handleBanner(index) {
    bannerContain.style.left = "-" + index * 100 + "%"
    let dotActive = document.querySelector(".dot .active")
    if (dotActive) dotActive.classList.remove("active")
    if (dotBanner[index]) dotBanner[index].classList.add("active")
}
//  Mỗi 5 giây banner sẽ cuộn sang ngang 1 lần
if (bannerContain) setInterval(navigationBanner, 3000) // chỉ chạy khi trang có banner

// end  Mỗi 5 giây banner sẽ cuộn sang ngang 1 lần





//đăng nhập
const loginBtn = document.getElementById("buttonlogin");
const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");
const formDangNhap = document.querySelector(".login");
const userInfo = document.querySelector(".user-info");
const usernameDisplay = document.getElementById("usernameDisplay");
const logoutOption = document.getElementById("logoutOption");


if (loginBtn) loginBtn.addEventListener("click", function () {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    const user = accounts.find(acc => acc.email === email && acc.password === password);

    if (user && user.trangThai === "locked") {
        alert("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ CSKH.");
        return;
    }
    if (user) {
        alert("Đăng nhập thành công!");

        // Lưu trạng thái đăng nhập
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        // Hiển thị tên
        usernameDisplay.textContent = user.ten;
        userInfo.style.display = "block";

        // Ẩn form đăng nhập
        formDangNhap.style.display = "none";
        emailInput.value = "";
        passwordInput.value = "";
        if (window.JH) JH.refresh();
    } else {
        alert("Email hoặc mật khẩu không đúng.");
    }
});

// HIỂN THỊ TÊN NẾU ĐÃ ĐĂNG NHẬP
window.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
        usernameDisplay.textContent = user.ten;
        userInfo.style.display = "block";
        formDangNhap.style.display = "none";
    }
});

// ĐĂNG XUẤT
logoutOption.addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    userInfo.style.display = "none";
    formDangNhap.style.display = "block";
    alert("Đăng xuất thành công")
    if (window.JH) JH.refresh();
    
});


// chức năng ẩn hiện các danh mục
const toggleBtn = document.querySelector(".menu-toggle");
const headerBottom = document.querySelector(".header-bottom");

if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        headerBottom.classList.toggle("active");
    });
}

