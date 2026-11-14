// ===== hoadon.js - Hiển thị hóa đơn của một đơn hàng =====
// Lấy mã đơn từ địa chỉ (hoadon.html?id=DH123...) hoặc mã đơn vừa đặt xong (sessionStorage)

document.addEventListener("DOMContentLoaded", function () {
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
    document.getElementById("ma-don").innerText = order.maDon
    document.getElementById("ngay-dat").innerText = new Date(order.ngayDat).toLocaleString("vi-VN")

    //Gán thông tin khách hàng
    document.getElementById("ho-ten").innerText = order.nguoiNhan.hoTen
    document.getElementById("email").innerText = order.nguoiNhan.email
    document.getElementById("sdt").innerText = order.nguoiNhan.sdt
    document.getElementById("dia-chi").innerText = order.nguoiNhan.diaChi

    // Danh sách sản phẩm trong đơn
    let html = ""
    order.sanPham.forEach(function (sp) {
        html += `
            <tr>
                <td>${sp.ten}<br><small>${sp.mau} / ${sp.size}</small></td>
                <td>${tien(sp.gia)}</td>
                <td>${sp.soLuong}</td>
                <td>${tien(sp.gia * sp.soLuong)}</td>
            </tr>`
    })
    document.getElementById("ds-sp").innerHTML = html

    // Các khoản tiền
    document.getElementById("tam-tinh").innerText = tien(order.tamTinh)
    document.getElementById("phi-ship").innerText = order.phiShip === 0 ? "Miễn phí" : tien(order.phiShip)
    document.getElementById("tien-giam").innerText = "-" + tien(order.tienGiam)
    document.getElementById("tong-gia").innerText = tien(order.tongTien)
    document.getElementById("phuong-thuc").innerText = order.phuongThuc
    document.getElementById("thanh-toan").innerText = order.thanhToan
    document.getElementById("trang-thai").innerText = order.trangThai
});
