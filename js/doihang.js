// ===== doihang.js - Liên hệ CSKH để yêu cầu đổi hàng (UCDOI02, viết bằng jQuery) =====
// Theo đặc tả: khách KHÔNG tự tạo yêu cầu đổi hàng. Khách xem thông tin CSKH và để lại thông tin,
// nhân viên CSKH (phân hệ quản trị) sẽ đối chiếu rồi tạo yêu cầu đổi hàng.

const user = JH.user()
const tuKhoaPhuKien = ["mũ", "cà vạt", "mắt kính", "thắt lưng", "quần lót", "bóp", "ví"]   // nhóm Phụ kiện: không đổi

// Sản phẩm thuộc nhóm Phụ kiện thì không áp dụng đổi hàng
function laPhuKien(ten) {
    const t = ten.toLowerCase()
    return tuKhoaPhuKien.some(function (k) { return t.indexOf(k) !== -1 })
}

// Đơn hàng ĐÃ GIAO của khách đang đăng nhập
function layDonDaGiao() {
    const orders = JSON.parse(localStorage.getItem("orders")) || []
    return orders.filter(function (o) {
        return o.emailKhach === user.email && o.trangThai === "Đã giao"
    })
}

function veTrang() {
    if (!user) {
        $("#doihangBox").html('<div class="empty-box">Vui lòng đăng nhập để liên hệ CSKH đổi hàng.<br><a href="index.html">Về trang chủ</a></div>')
        return
    }
    const donDaGiao = layDonDaGiao()
    // Chưa có đơn nào đã giao thì không thể yêu cầu đổi hàng
    if (donDaGiao.length === 0) {
        $("#doihangBox").html('<div class="empty-box">Bạn chưa có đơn hàng nào ở trạng thái <strong>Đã giao</strong> nên chưa thể yêu cầu đổi hàng.<br><a href="donhang.html">Xem đơn hàng của tôi</a></div>')
        return
    }
    let opts = ""
    $.each(donDaGiao, function (i, o) {
        opts += `<option value="${o.maDon}">${o.maDon} - ${new Date(o.ngayDat).toLocaleDateString("vi-VN")} - ${JH.money(o.tongTien)}</option>`
    })
    $("#doihangBox").html(`
        <div class="dh-policy">
            <h3>Liên hệ CSKH để đổi hàng</h3>
            <p><i class="fa-solid fa-phone"></i> Hotline: 0914 516 446 - 0906 954 368</p>
            <p><i class="fa-solid fa-envelope"></i> Email: cskh@duchai-styles.com</p>
            <p>Hãy cung cấp cho CSKH: mã đơn hàng, sản phẩm cần đổi, size/màu muốn đổi sang và lý do.
            Ngoài giờ làm việc, bạn có thể để lại thông tin bên dưới, CSKH sẽ liên hệ lại.</p>
        </div>
        <div class="tk-panel">
            <div class="tk-row"><label>Đơn hàng đã giao</label><select id="dh-don">${opts}</select></div>
            <div class="tk-row"><label>Sản phẩm cần đổi</label><select id="dh-sp"></select></div>
            <div class="tk-row"><label>Muốn đổi sang</label><input id="dh-doisang" type="text" placeholder="Ví dụ: size M, màu đen"></div>
            <div class="tk-row"><label>Số điện thoại liên hệ</label><input id="dh-sdt" type="text" value="${user.sdt || ""}"></div>
            <div class="tk-row"><label>Lý do đổi hàng</label><textarea id="dh-lydo" rows="3"></textarea></div>
            <div class="tk-error" id="dh-loi"></div>
            <button class="btn-main tk-btn" id="btnGuiLienHe">GỬI THÔNG TIN CHO CSKH</button>
        </div>
        <div id="dsYeuCau"></div>`)

    // Chọn đơn nào thì liệt kê sản phẩm của đơn đó
    function doSanPham() {
        const o = donDaGiao.find(function (x) { return x.maDon === $("#dh-don").val() })
        let html = ""
        $.each(o.sanPham, function (i, s) {
            html += `<option value="${i}">${s.ten} (${s.mau} / ${s.size})</option>`
        })
        $("#dh-sp").html(html)
    }
    $("#dh-don").on("change", doSanPham)
    // đi từ trang "Đơn hàng của tôi" (doihang.html?id=...) thì chọn sẵn đơn đó
    const idDon = new URLSearchParams(window.location.search).get("id")
    if (idDon && donDaGiao.some(function (x) { return x.maDon === idDon })) $("#dh-don").val(idDon)
    doSanPham()
    veYeuCau()
}

// Danh sách yêu cầu khách đã gửi
function veYeuCau() {
    const ds = (JSON.parse(localStorage.getItem("doiHangLienHe")) || []).filter(function (y) {
        return y.emailKhach === user.email
    })
    if (ds.length === 0) { $("#dsYeuCau").html(""); return }
    let html = '<h3 class="tk-sub">Thông tin bạn đã gửi</h3>'
    $.each(ds, function (i, y) {
        html += `<div class="dc-item"><p><strong>${y.maDon}</strong> - ${y.sanPham} → ${y.doiSang}</p>
                 <p>Gửi lúc ${new Date(y.ngayGui).toLocaleString("vi-VN")} - <span class="dc-tag">${y.trangThai}</span></p></div>`
    })
    $("#dsYeuCau").html(html)
}

// Bấm nút gửi thông tin
$("#doihangBox").on("click", "#btnGuiLienHe", function () {
    $("#dh-loi").text("")
    const orders = JSON.parse(localStorage.getItem("orders")) || []
    const maDon = $("#dh-don").val()
    const don = orders.find(function (o) { return o.maDon === maDon })
    const sp = don.sanPham[$("#dh-sp").val()]
    const doiSang = $("#dh-doisang").val().trim()
    const sdt = $("#dh-sdt").val().trim()
    const lyDo = $("#dh-lydo").val().trim()
    const dsLienHe = JSON.parse(localStorage.getItem("doiHangLienHe")) || []

    let loi = ""
    // BR-02: chỉ đổi trong 7 ngày kể từ ngày nhận hàng (ngayGiao do quản trị ghi khi chuyển đơn sang "Đã giao")
    if (don.ngayGiao && Date.now() - new Date(don.ngayGiao).getTime() > 7 * 24 * 60 * 60 * 1000) {
        loi = "Đơn hàng đã quá 7 ngày kể từ ngày nhận hàng, không đủ điều kiện đổi hàng."
    } else if (laPhuKien(sp.ten)) {
        loi = "Sản phẩm thuộc nhóm Phụ kiện, không áp dụng đổi hàng."
    } else if (dsLienHe.some(function (y) { return y.maDon === maDon })) {
        loi = "Mỗi hóa đơn chỉ được đổi một lần. Đơn này đã có yêu cầu đổi hàng."
    } else if (doiSang === "" || lyDo === "") {
        loi = "Vui lòng nhập size/màu muốn đổi sang và lý do đổi hàng."
    } else if (!/^0\d{9}$/.test(sdt)) {
        loi = "Số điện thoại phải bắt đầu bằng 0 và đủ 10 số."
    }
    if (loi !== "") { $("#dh-loi").text(loi); return }

    dsLienHe.push({
        id: "LH" + Date.now(),
        maDon: maDon,
        emailKhach: user.email,
        hoTen: (user.ho + " " + user.ten).trim(),
        sdt: sdt,
        sanPham: sp.ten + " (" + sp.mau + " / " + sp.size + ")",
        doiSang: doiSang,
        lyDo: lyDo,
        ngayGui: new Date().toISOString(),
        trangThai: "Chờ CSKH liên hệ"
    })
    localStorage.setItem("doiHangLienHe", JSON.stringify(dsLienHe))
    JH.toast("Đã gửi thông tin, CSKH sẽ liên hệ với bạn")
    $("#dh-doisang, #dh-lydo").val("")
    veYeuCau()
})

veTrang()
