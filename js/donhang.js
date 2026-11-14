// ===== donhang.js - Đơn hàng của tôi: xem danh sách, lọc theo trạng thái, hủy đơn (jQuery) =====

const cacTrangThai = ["Tất cả", "Chờ xác nhận", "Đã xác nhận", "Đang giao", "Đã giao", "Đã hủy"]
let locHienTai = "Tất cả"
const user = JH.user()

// đổi tên trạng thái thành class màu trong css
function lopMau(tt) {
    if (tt === "Chờ xác nhận") return "tt-cho"
    if (tt === "Đã xác nhận") return "tt-xacnhan"
    if (tt === "Đang giao") return "tt-giao"
    if (tt === "Đã giao") return "tt-da"
    return "tt-huy"
}

function veDonHang() {
    // lấy đơn của khách đang đăng nhập, đơn mới nhất lên đầu
    const orders = (JSON.parse(localStorage.getItem("orders")) || []).filter(function (o) {
        return o.emailKhach === user.email
    }).sort(function (a, b) {
        return new Date(b.ngayDat) - new Date(a.ngayDat)
    })

    // các nút lọc theo trạng thái (kèm số đơn)
    let tabs = '<div class="dh-tabs">'
    $.each(cacTrangThai, function (i, tt) {
        const dem = tt === "Tất cả" ? orders.length : orders.filter(function (o) { return o.trangThai === tt }).length
        tabs += '<div class="dh-tab ' + (tt === locHienTai ? "active" : "") + '" data-tt="' + tt + '">' + tt + " (" + dem + ")</div>"
    })
    tabs += "</div>"

    const ds = orders.filter(function (o) { return locHienTai === "Tất cả" || o.trangThai === locHienTai })
    let html = ""
    if (ds.length === 0) {
        html = '<div class="empty-box">Không có đơn hàng nào.<br><a href="index.html">Tiếp tục mua sắm</a></div>'
    }
    $.each(ds, function (i, o) {
        let sp = ""
        $.each(o.sanPham, function (j, s) {
            sp += `
            <div class="dh-sp">
                <img src="${s.anh}" alt="">
                <div class="ten">${s.ten}<br><small>${s.mau} / ${s.size}</small></div>
                <div>x${s.soLuong}</div>
                <div>${JH.money(s.gia)}</div>
            </div>`
        })
        html += `
        <div class="dh-card">
            <div class="dh-head">
                <div><span class="dh-ma">${o.maDon}</span> <span class="dh-ngay">- ${new Date(o.ngayDat).toLocaleString("vi-VN")}</span></div>
                <span class="dh-tt ${lopMau(o.trangThai)}">${o.trangThai}</span>
            </div>
            ${sp}
            <div class="dh-foot">
                <div>${o.phuongThuc} - ${o.thanhToan}</div>
                <div>
                    <span class="dh-tong">${JH.money(o.tongTien)}</span>
                    <button class="dh-btn" data-act="xem" data-ma="${o.maDon}">Xem hóa đơn</button>
                    ${o.trangThai === "Chờ xác nhận" ? '<button class="dh-btn huy" data-act="huy" data-ma="' + o.maDon + '">Hủy đơn</button>' : ""}
                </div>
            </div>
        </div>`
    })
    $("#donhangBox").html(tabs + html)
}

if (!user) {
    $("#donhangBox").html('<div class="empty-box">Vui lòng đăng nhập để xem đơn hàng.<br><a href="index.html">Về trang chủ</a></div>')
} else {
    // bấm vào nút lọc
    $("#donhangBox").on("click", ".dh-tab", function () {
        locHienTai = $(this).attr("data-tt")
        veDonHang()
    })
    // bấm Xem hóa đơn / Hủy đơn (nút được vẽ lại nên gắn qua #donhangBox)
    $("#donhangBox").on("click", "[data-act]", function () {
        const ma = $(this).attr("data-ma")
        if ($(this).attr("data-act") === "xem") {
            window.location.href = "hoadon.html?id=" + ma
            return
        }
        // Hủy đơn: chỉ được hủy khi đơn còn "Chờ xác nhận"
        if (!confirm("Bạn chắc chắn muốn hủy đơn " + ma + "?")) return
        const orders = JSON.parse(localStorage.getItem("orders")) || []
        $.each(orders, function (i, o) {
            if (o.maDon === ma && o.trangThai === "Chờ xác nhận") o.trangThai = "Đã hủy"
        })
        localStorage.setItem("orders", JSON.stringify(orders))
        JH.toast("Đã hủy đơn hàng")
        veDonHang()
    })
    veDonHang()
}
