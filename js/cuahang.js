// ===== cuahang.js - Hệ thống cửa hàng: lọc theo thương hiệu, tỉnh/thành, quận/huyện (jQuery) =====
// (UCTCCH01) Cần nạp stores.js trước file này

// Lúc đầu các ô tỉnh/thành lấy từ tất cả cửa hàng đang hoạt động
let tatCaCuaHang = layCuaHang("")
doDanhSachTinh("#ch-tinh", tatCaCuaHang)
doDanhSachQuan("#ch-quan", tatCaCuaHang, "")

// Hiển thị danh sách cửa hàng theo 3 ô lọc
function veCuaHang() {
    const thuongHieu = $("#ch-thuonghieu").val()
    const tinh = $("#ch-tinh").val()
    const quan = $("#ch-quan").val()

    const ds = layCuaHang(thuongHieu).filter(function (ch) {
        return (!tinh || ch.tinh === tinh) && (!quan || ch.quan === quan)
    })

    if (ds.length === 0) {
        $("#ch-ketqua").html('<div class="empty-box">Không có cửa hàng tại khu vực đã chọn.</div>')
        return
    }
    let html = '<p class="search-info">Có ' + ds.length + " cửa hàng</p>"
    $.each(ds, function (i, ch) {
        html += `
        <div class="ch-item">
            <div class="ch-ten">${ch.ten} <span class="ch-tag ${ch.thuongHieu === "Freelancer" ? "fr" : "jh"}">${ch.thuongHieu}</span></div>
            <p><i class="fa-solid fa-location-dot"></i> ${ch.diaChi}, ${ch.tinh}</p>
            <p><i class="fa-solid fa-phone"></i> ${ch.sdt}</p>
        </div>`
    })
    $("#ch-ketqua").html(html)
}

// Đổi thương hiệu hoặc tỉnh thì nạp lại ô bên dưới
$("#ch-thuonghieu").on("change", function () {
    const ds = layCuaHang($(this).val())
    doDanhSachTinh("#ch-tinh", ds)
    doDanhSachQuan("#ch-quan", ds, "")
    veCuaHang()
})
$("#ch-tinh").on("change", function () {
    doDanhSachQuan("#ch-quan", layCuaHang($("#ch-thuonghieu").val()), $(this).val())
    veCuaHang()
})
$("#ch-quan").on("change", veCuaHang)

veCuaHang()
