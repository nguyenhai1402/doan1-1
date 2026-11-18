// ===== cuahang.js - Hệ thống cửa hàng: lọc theo thương hiệu, tỉnh/thành, quận/huyện (jQuery) =====
// (UCTCCH01) Cần nạp stores.js trước file này

// Lúc đầu các ô tỉnh/thành lấy từ tất cả cửa hàng đang hoạt động
let tatCaCuaHang = layCuaHang("")
doDanhSachTinh("#ch-tinh", tatCaCuaHang)
doDanhSachQuan("#ch-quan", tatCaCuaHang, "")

// Mỗi trang 8 cửa hàng (cần nạp phantrang.js trước file này)
const soCHMoiTrang = 8
let trangCH = 1

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
    const tongTrang = Math.ceil(ds.length / soCHMoiTrang)
    if (trangCH > tongTrang) trangCH = tongTrang
    const batDau = (trangCH - 1) * soCHMoiTrang

    let html = '<p class="search-info">Có ' + ds.length + " cửa hàng</p>"
    $.each(ds.slice(batDau, batDau + soCHMoiTrang), function (i, ch) {
        html += `
        <div class="ch-item">
            <div class="ch-ten">${ch.ten} <span class="ch-tag ${ch.thuongHieu === "Freelancer" ? "fr" : "jh"}">${ch.thuongHieu}</span></div>
            <p><i class="fa-solid fa-location-dot"></i> ${ch.diaChi}, ${ch.tinh}</p>
            <p><i class="fa-solid fa-phone"></i> ${ch.sdt}</p>
        </div>`
    })
    $("#ch-ketqua").html(html + htmlPhanTrang(tongTrang, trangCH))
}

// Bấm số trang
ganPhanTrang("#ch-ketqua", function (trang) {
    trangCH = trang
    veCuaHang()
    $("html, body").animate({ scrollTop: 0 }, 300)
})

// Đổi thương hiệu hoặc tỉnh thì nạp lại ô bên dưới
$("#ch-thuonghieu").on("change", function () {
    const ds = layCuaHang($(this).val())
    doDanhSachTinh("#ch-tinh", ds)
    doDanhSachQuan("#ch-quan", ds, "")
    trangCH = 1
    veCuaHang()
})
$("#ch-tinh").on("change", function () {
    doDanhSachQuan("#ch-quan", layCuaHang($("#ch-thuonghieu").val()), $(this).val())
    trangCH = 1
    veCuaHang()
})
$("#ch-quan").on("change", function () {
    trangCH = 1
    veCuaHang()
})

veCuaHang()
