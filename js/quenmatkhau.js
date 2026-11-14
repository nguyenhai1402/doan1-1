// ===== quenmatkhau.js - Khôi phục mật khẩu (jQuery) =====
// Đồ án tĩnh nên KHÔNG gửi email thật: mã xác nhận được hiển thị trong hộp thông báo (giả lập).

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Bước 1: nhập email, tạo mã xác nhận 6 số
$("#btnGuiMa").on("click", function () {
    $("#err-qmk-email").text("")
    const email = $("#qmk-email").val().trim()
    if (!emailRegex.test(email)) {
        $("#err-qmk-email").text("Email không hợp lệ.")
        return
    }
    const accounts = JSON.parse(localStorage.getItem("accounts")) || []
    const co = accounts.some(function (acc) { return acc.email === email })
    if (!co) {
        $("#err-qmk-email").text("Email này chưa đăng ký tài khoản.")
        return
    }
    const ma = String(Math.floor(100000 + Math.random() * 900000))
    // lưu mã tạm, hết hạn sau 5 phút
    sessionStorage.setItem("maKhoiPhuc", JSON.stringify({ email: email, ma: ma, hetHan: Date.now() + 5 * 60 * 1000 }))
    alert("[GIẢ LẬP EMAIL]\nMã xác nhận của bạn là: " + ma + "\n(Thực tế hệ thống sẽ gửi mã này qua email, mã có hiệu lực 5 phút)")
    $("#qmk-buoc1").hide()
    $("#qmk-buoc2").show()
})

// Bước 2: nhập mã + mật khẩu mới
$("#btnDatLai").on("click", function () {
    $("#qmk-buoc2 .tk-error").text("")
    const luu = JSON.parse(sessionStorage.getItem("maKhoiPhuc"))
    const ma = $("#qmk-ma").val().trim()
    const mk = $("#qmk-mk").val()
    const mk2 = $("#qmk-mk2").val()
    let hople = true

    if (!luu || Date.now() > luu.hetHan) {
        $("#err-qmk-ma").text("Mã đã hết hạn, vui lòng tải lại trang để gửi mã mới.")
        hople = false
    } else if (ma !== luu.ma) {
        $("#err-qmk-ma").text("Mã xác nhận không đúng.")
        hople = false
    }
    if (mk.length < 6) { $("#err-qmk-mk").text("Mật khẩu ít nhất 6 ký tự."); hople = false }
    if (mk2 !== mk) { $("#err-qmk-mk2").text("Mật khẩu nhập lại không khớp."); hople = false }
    if (!hople) return

    const accounts = JSON.parse(localStorage.getItem("accounts")) || []
    $.each(accounts, function (i, acc) {
        if (acc.email === luu.email) acc.password = mk
    })
    localStorage.setItem("accounts", JSON.stringify(accounts))
    sessionStorage.removeItem("maKhoiPhuc")
    alert("Đặt lại mật khẩu thành công! Hãy đăng nhập bằng mật khẩu mới.")
    window.location.href = "index.html"
})
