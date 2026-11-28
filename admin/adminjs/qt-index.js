// ===== qt-index.js - Trang tổng quan quản trị (jQuery) =====

$(function () {
    if (!QT.batDau({ trang: "tongquan", tieuDe: "Tổng quan", vaiTro: ["admin", "cskh"] })) return
    const nguoi = QT.nguoi()
    const sanPham = QT.get("products", [])
    const donHang = QT.get("orders", [])

    // Thẻ số liệu: quản trị viên thấy cả sản phẩm, CSKH chỉ thấy đơn hàng
    const choAdmin = nguoi.vaiTro === "admin"
    const doanhThu = donHang.filter(function (o) { return o.trangThai !== "Đã hủy" }).reduce(function (s, o) { return s + o.tongTien }, 0)
    const choXN = donHang.filter(function (o) { return o.trangThai === "Chờ xác nhận" }).length
    const sapHet = []
    sanPham.forEach(function (sp) {
        sp.bienThe.forEach(function (bt) { if (bt.tonKho <= 5) sapHet.push({ sp: sp, bt: bt }) })
    })
    let kpi = ""
    function the(so, nhan, icon) {
        return '<div class="col-6 col-lg-3"><div class="qt-kpi"><i class="fa-solid ' + icon + '"></i><div class="so">' + so + '</div><div class="nhan">' + nhan + "</div></div></div>"
    }
    kpi += the(donHang.length, "Tổng số đơn hàng", "fa-receipt")
    kpi += the(choXN, "Đơn chờ xác nhận", "fa-hourglass-half")
    kpi += the(QT.money(doanhThu), "Doanh thu (trừ đơn đã hủy)", "fa-sack-dollar")
    if (choAdmin) kpi += the(sanPham.filter(function (s) { return s.trangThai === "Xuất bản" }).length + "/" + sanPham.length, "Sản phẩm xuất bản / tổng", "fa-shirt")
    else kpi += the(QT.get("accounts", []).length, "Khách hàng", "fa-users")
    $("#kpi").html(kpi)

    // Đơn hàng mới nhất
    const moi = donHang.slice().sort(function (a, b) { return new Date(b.ngayDat) - new Date(a.ngayDat) }).slice(0, 6)
    if (moi.length === 0) {
        $("#dhMoi").html('<p class="text-secondary mb-0">Chưa có đơn hàng nào.</p>')
    } else {
        let h = '<table class="table table-sm align-middle mb-0"><thead><tr><th>Mã đơn</th><th>Khách</th><th class="text-end">Tổng tiền</th><th>Trạng thái</th></tr></thead><tbody>'
        $.each(moi, function (i, o) {
            h += "<tr><td>" + QT.html(o.maDon) + "</td><td>" + QT.html(o.nguoiNhan.hoTen) + '</td><td class="text-end">' + QT.money(o.tongTien) + '</td><td><span class="tt tt-3">' + QT.html(o.trangThai) + "</span></td></tr>"
        })
        $("#dhMoi").html(h + "</tbody></table>")
    }

    // Biến thể sắp hết hàng (chỉ quản trị viên quản lý tồn kho)
    if (!choAdmin) {
        $("#sapHet").html('<p class="text-secondary mb-0">Chỉ quản trị viên xem được tồn kho.</p>')
    } else if (sapHet.length === 0) {
        $("#sapHet").html('<p class="text-secondary mb-0">Không có biến thể nào sắp hết.</p>')
    } else {
        sapHet.sort(function (a, b) { return a.bt.tonKho - b.bt.tonKho })
        let h = '<table class="table table-sm align-middle mb-2"><thead><tr><th>Sản phẩm</th><th>Size</th><th class="text-end">Tồn</th></tr></thead><tbody>'
        $.each(sapHet.slice(0, 6), function (i, x) {
            h += "<tr><td>" + QT.html(x.sp.ten.slice(0, 32)) + "</td><td>" + QT.html(x.bt.size) + '</td><td class="text-end"><span class="tt ' + (x.bt.tonKho === 0 ? "tt-2" : "tt-3") + '">' + x.bt.tonKho + "</span></td></tr>"
        })
        $("#sapHet").html(h + '</tbody></table><a href="tonkho.html">Xem toàn bộ tồn kho &raquo;</a>')
    }
})
