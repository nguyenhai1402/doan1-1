// ===== qt-dangnhap.js - Đăng nhập quản trị (UCDNQT01, viết bằng jQuery) =====

khoiTaoDuLieuAdmin()
// PRE-2: đã đăng nhập rồi thì vào thẳng trang tổng quan
if (QT.nguoi()) window.location.href = "index.html"

function dangNhap() {
    const email = $("#dnEmail").val().trim()
    const matKhau = $("#dnMatKhau").val()
    $("#dnLoi").text("")

    // 5a: bỏ trống
    if (email === "" || matKhau === "") {
        $("#dnLoi").text("Vui lòng nhập email và mật khẩu.")
        return
    }
    const nv = QT.get("adminStaff", []).find(function (n) { return n.email === email && n.password === matKhau })
    // 5b: sai thông tin
    if (!nv) {
        $("#dnLoi").text("Thông tin đăng nhập không đúng.")
        return
    }
    // 6a: tài khoản bị khóa
    if (nv.trangThai !== "active") {
        $("#dnLoi").text("Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.")
        return
    }
    // 7: tạo phiên làm việc theo vai trò
    sessionStorage.setItem("adminSession", JSON.stringify({ id: nv.id, hoTen: nv.hoTen, email: nv.email, vaiTro: nv.vaiTro }))
    window.location.href = "index.html"
}

$("#dnNut").on("click", dangNhap)
$("#dnEmail, #dnMatKhau").on("keydown", function (e) { if (e.key === "Enter") dangNhap() })
// bấm vào dòng tài khoản mẫu thì tự điền
$(".tk-mau").on("click", function () {
    $("#dnEmail").val($(this).attr("data-email"))
    $("#dnMatKhau").val($(this).attr("data-mk"))
})
