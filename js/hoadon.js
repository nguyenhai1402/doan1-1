// ===== hoadon.js - Hiển thị hóa đơn của một đơn hàng (viết bằng jQuery) =====
// Lấy mã đơn từ địa chỉ (hoadon.html?id=DH123...) hoặc mã đơn vừa đặt xong (sessionStorage)

$(function () {
    const thamSo = new URLSearchParams(window.location.search)
    const maDon = thamSo.get("id") || sessionStorage.getItem("lastOrderId")

    const orders = JSON.parse(localStorage.getItem("orders")) || []
    const order = orders.find(function (o) {
        return o.maDon === maDon
    })

    if (!order) {
        alert("Không tìm thấy đơn hàng.")
        window.location.href = "index.html"
        return
    }

    // Hàm đổi số thành dạng 1.000.000đ
    function tien(n) {
        return n.toLocaleString("vi-VN") + "đ"
    }

    //Gán thông tin đơn hàng vào hóa đơn
    $("#ma-don").text(order.maDon)
    $("#ngay-dat").text(new Date(order.ngayDat).toLocaleString("vi-VN"))

    //Gán thông tin khách hàng
    $("#ho-ten").text(order.nguoiNhan.hoTen)
    $("#email").text(order.nguoiNhan.email)
    $("#sdt").text(order.nguoiNhan.sdt)
    $("#dia-chi").text(order.nguoiNhan.diaChi)

    // Danh sách sản phẩm trong đơn
    let html = ""
    $.each(order.sanPham, function (i, sp) {
        html += `
            <tr>
                <td>${sp.ten}<br><small>${sp.mau} / ${sp.size}</small></td>
                <td>${tien(sp.gia)}</td>
                <td>${sp.soLuong}</td>
                <td>${tien(sp.gia * sp.soLuong)}</td>
            </tr>`
    })
    $("#ds-sp").html(html)

    // Các khoản tiền
    $("#tam-tinh").text(tien(order.tamTinh))
    $("#phi-ship").text(order.phiShip === 0 ? "Miễn phí" : tien(order.phiShip))
    $("#tien-giam").text("-" + tien(order.tienGiam))
    $("#tong-gia").text(tien(order.tongTien))
    $("#phuong-thuc").text(order.phuongThuc)
    $("#thanh-toan").text(order.thanhToan)
    $("#trang-thai").text(order.trangThai)
});
