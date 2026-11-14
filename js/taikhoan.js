// ===== taikhoan.js - Tài khoản của tôi: thông tin cá nhân, sổ địa chỉ, đổi mật khẩu (jQuery) =====

let user = JH.user()

// Lưu tài khoản đã sửa vào danh sách accounts và cả loggedInUser
function luuTaiKhoan() {
    const accounts = JSON.parse(localStorage.getItem("accounts")) || []
    $.each(accounts, function (i, acc) {
        if (acc.email === user.email) accounts[i] = user
    })
    localStorage.setItem("accounts", JSON.stringify(accounts))
    localStorage.setItem("loggedInUser", JSON.stringify(user))
}

const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/
const phoneRegex = /^0\d{9}$/

if (!user) {
    // chưa đăng nhập: ẩn nội dung, hiện thông báo
    $("#taikhoanBox").hide()
    $("#chuaDangNhap").show()
} else {
    user.diaChi = user.diaChi || []

    // ---------- chuyển tab ----------
    $(".tk-tab").on("click", function () {
        $(".tk-tab").removeClass("active")
        $(this).addClass("active")
        $(".tk-panel").hide()
        $("#panel-" + $(this).attr("data-tab")).show()
    })

    // ---------- 1. Thông tin cá nhân ----------
    $("#tk-ho").val(user.ho)
    $("#tk-ten").val(user.ten)
    $('input[name="tk-sex"][value="' + user.gioiTinh + '"]').prop("checked", true)
    $("#tk-date").val(user.ngaySinh)
    $("#tk-phone").val(user.sdt)
    $("#tk-email").val(user.email)

    $("#btnLuuHoSo").on("click", function () {
        $("#panel-hoso .tk-error").text("")
        const ho = $("#tk-ho").val().trim()
        const ten = $("#tk-ten").val().trim()
        const ngaySinh = $("#tk-date").val()
        const sdt = $("#tk-phone").val().trim()
        let hople = true

        if (!ho || !nameRegex.test(ho)) { $("#err-ho").text("Họ không hợp lệ."); hople = false }
        if (!ten || !nameRegex.test(ten)) { $("#err-ten").text("Tên không hợp lệ."); hople = false }
        if (!ngaySinh || new Date(ngaySinh) >= new Date()) { $("#err-date").text("Ngày sinh không hợp lệ."); hople = false }
        if (!phoneRegex.test(sdt)) { $("#err-phone").text("SĐT phải bắt đầu bằng 0 và đủ 10 số."); hople = false }
        if (!hople) return

        user.ho = ho
        user.ten = ten
        user.gioiTinh = $('input[name="tk-sex"]:checked').val() || user.gioiTinh
        user.ngaySinh = ngaySinh
        user.sdt = sdt
        luuTaiKhoan()
        $("#usernameDisplay").text(user.ten)       // cập nhật tên trên header
        JH.toast("Đã lưu thông tin cá nhân")
    })

    // ---------- 2. Sổ địa chỉ ----------
    let idDangSua = ""     // rỗng = đang thêm mới, có giá trị = đang sửa địa chỉ đó

    function veDiaChi() {
        if (user.diaChi.length === 0) {
            $("#dsDiaChi").html('<p class="empty-box" style="padding:20px 0">Bạn chưa có địa chỉ nào.</p>')
            return
        }
        let html = ""
        $.each(user.diaChi, function (i, d) {
            html += `
            <div class="dc-item ${d.macDinh ? "mac-dinh" : ""}">
                <p><strong>${d.hoTen}</strong> - ${d.sdt} ${d.macDinh ? '<span class="dc-tag">Mặc định</span>' : ""}</p>
                <p>${d.diaChi}</p>
                <div class="dc-act">
                    <span data-act="sua" data-id="${d.id}">Sửa</span>
                    <span data-act="xoa" data-id="${d.id}">Xóa</span>
                    ${d.macDinh ? "" : '<span data-act="macdinh" data-id="' + d.id + '">Đặt làm mặc định</span>'}
                </div>
            </div>`
        })
        $("#dsDiaChi").html(html)
    }

    function resetFormDiaChi() {
        idDangSua = ""
        $("#dc-hoten, #dc-sdt, #dc-diachi").val("")
        $("#dc-macdinh").prop("checked", false)
        $("#tieuDeDiaChi").text("Thêm địa chỉ mới")
        $("#btnHuySua").hide()
        $("#panel-diachi .tk-error").text("")
    }

    // Các nút Sửa / Xóa / Mặc định được vẽ lại nên gắn sự kiện qua #dsDiaChi
    $("#dsDiaChi").on("click", "[data-act]", function () {
        const act = $(this).attr("data-act")
        const id = $(this).attr("data-id")
        const d = user.diaChi.find(function (x) { return x.id === id })
        if (act === "sua") {
            idDangSua = id
            $("#dc-hoten").val(d.hoTen)
            $("#dc-sdt").val(d.sdt)
            $("#dc-diachi").val(d.diaChi)
            $("#dc-macdinh").prop("checked", d.macDinh)
            $("#tieuDeDiaChi").text("Sửa địa chỉ")
            $("#btnHuySua").show()
            return
        }
        if (act === "xoa") {
            if (!confirm("Xóa địa chỉ này?")) return
            user.diaChi = user.diaChi.filter(function (x) { return x.id !== id })
            // xóa địa chỉ mặc định thì lấy địa chỉ đầu tiên còn lại làm mặc định
            if (d.macDinh && user.diaChi.length > 0) user.diaChi[0].macDinh = true
        }
        if (act === "macdinh") {
            $.each(user.diaChi, function (i, x) { x.macDinh = (x.id === id) })
        }
        luuTaiKhoan()
        veDiaChi()
    })

    $("#btnLuuDiaChi").on("click", function () {
        $("#panel-diachi .tk-error").text("")
        const hoTen = $("#dc-hoten").val().trim()
        const sdt = $("#dc-sdt").val().trim()
        const diaChi = $("#dc-diachi").val().trim()
        let hople = true
        if (hoTen === "") { $("#err-dc-hoten").text("Vui lòng nhập họ tên người nhận."); hople = false }
        if (!phoneRegex.test(sdt)) { $("#err-dc-sdt").text("SĐT phải bắt đầu bằng 0 và đủ 10 số."); hople = false }
        if (diaChi === "") { $("#err-dc-diachi").text("Vui lòng nhập địa chỉ."); hople = false }
        if (!hople) return

        let macDinh = $("#dc-macdinh").is(":checked")
        if (user.diaChi.length === 0) macDinh = true         // địa chỉ đầu tiên luôn là mặc định
        if (macDinh) {
            $.each(user.diaChi, function (i, x) { x.macDinh = false })
        }
        if (idDangSua === "") {
            user.diaChi.push({ id: "DC" + Date.now(), hoTen: hoTen, sdt: sdt, diaChi: diaChi, macDinh: macDinh })
        } else {
            const d = user.diaChi.find(function (x) { return x.id === idDangSua })
            d.hoTen = hoTen; d.sdt = sdt; d.diaChi = diaChi
            d.macDinh = macDinh || d.macDinh
        }
        luuTaiKhoan()
        resetFormDiaChi()
        veDiaChi()
        JH.toast("Đã lưu địa chỉ")
    })
    $("#btnHuySua").on("click", resetFormDiaChi)
    veDiaChi()

    // ---------- 3. Đổi mật khẩu ----------
    $("#btnDoiMatKhau").on("click", function () {
        $("#panel-matkhau .tk-error").text("")
        const cu = $("#mk-cu").val()
        const moi = $("#mk-moi").val()
        const moi2 = $("#mk-moi2").val()
        let hople = true
        if (cu !== user.password) { $("#err-mk-cu").text("Mật khẩu hiện tại không đúng."); hople = false }
        if (moi.length < 6) { $("#err-mk-moi").text("Mật khẩu mới ít nhất 6 ký tự."); hople = false }
        if (moi2 !== moi) { $("#err-mk-moi2").text("Mật khẩu nhập lại không khớp."); hople = false }
        if (!hople) return

        user.password = moi
        luuTaiKhoan()
        $("#mk-cu, #mk-moi, #mk-moi2").val("")
        JH.toast("Đã đổi mật khẩu")
    })
}
