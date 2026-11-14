// ===== thanhtoan.js - Trang đặt hàng (viết bằng jQuery) =====
// Nhận nhiều sản phẩm từ giỏ hàng hoặc "Mua ngay".
// Lưu ý: dùng hàm JH.money() và JH.shipFee() viết sẵn trong store.js (nhớ nạp store.js trước file này)

$(function () {
    // Thông báo khi mở trang
    alert("Nhập mã duchaitrian để được giảm giá 10% tổng hàng hóa");
})

// Danh sách mã giảm giá. loai: "phantram" (giảm theo %) hoặc "tien" (giảm số tiền cố định)
const maGiamGia = {
    duchaitrian: { loai: "phantram", giatri: 10 },
    giam50k: { loai: "tien", giatri: 50000 }
}

// Lấy sản phẩm cần đặt (do trang chi tiết / giỏ hàng lưu vào sessionStorage) và người đăng nhập
let sanphams = JSON.parse(sessionStorage.getItem("checkoutItems")) || []
const user = JSON.parse(localStorage.getItem("loggedInUser"))
const tuGioHang = sessionStorage.getItem("checkoutFrom") === "cart"

let tamTinh = 0      // tổng tiền hàng
let phiShip = 0      // phí vận chuyển
let tienGiam = 0     // tiền được giảm nhờ mã
let maDangDung = ""  // mã giảm giá đang áp dụng

// Hiển thị các số tiền ở bảng bên phải
function capNhatTien() {
    tamTinh = 0
    $.each(sanphams, function (i, sp) {
        tamTinh += sp.gia * sp.soLuong
    })
    phiShip = JH.shipFee(tamTinh)   // từ 300.000đ miễn phí, dưới đó 25.000đ

    tienGiam = 0
    if (maDangDung !== "") {
        const ma = maGiamGia[maDangDung]
        if (ma.loai === "phantram") {
            tienGiam = Math.round(tamTinh * ma.giatri / 100)
        } else {
            tienGiam = ma.giatri
        }
    }
    const tong = tamTinh + phiShip - tienGiam

    $("#tam-tinh").text(tamTinh.toLocaleString("vi-VN"))
    $("#phi-ship").text(phiShip === 0 ? "Miễn phí" : phiShip.toLocaleString("vi-VN") + "đ")
    $("#tien-giam").text(tienGiam.toLocaleString("vi-VN"))
    $(".price-total").text(tong.toLocaleString("vi-VN"))
    return tong
}

// Kiểm tra điều kiện trước khi hiển thị trang
if (!user) {
    alert("Vui lòng đăng nhập để đặt hàng.")
    window.location.href = "index.html"
} else if (sanphams.length === 0) {
    alert("Chưa có sản phẩm nào để đặt hàng. Hãy chọn sản phẩm trước.")
    window.location.href = "giohang.html"
} else {
    // Chèn từng sản phẩm vào bảng (trước dòng mã giảm giá)
    $.each(sanphams, function (i, sp) {
        const html = `
                <tr class="sanpham">
                    <td>
                        <img src="${sp.anh}" alt="">
                        <div class="soluong">${sp.soLuong}</div>
                    </td>
                    <td>
                        <h6 class="name">${sp.ten}</h6>
                        <span class="color">${sp.mau} / ${sp.size}</span>
                    </td>
                    <td class="price-root">${sp.gia.toLocaleString("vi-VN")}đ</td>
                </tr>
            `
        $(".product-buy .discount").before(html)
    })
    capNhatTien()

    // Điền sẵn thông tin khách đã đăng nhập (khách vẫn sửa được)
    $("#full-name").val((user.ho + " " + user.ten).trim())
    $("#email").val(user.email)
    $("#phone").val(user.sdt || "")

    // Có địa chỉ mặc định trong sổ địa chỉ thì điền luôn (tên và SĐT người nhận lấy theo địa chỉ đó)
    const diaChiMacDinh = (user.diaChi || []).find(function (d) { return d.macDinh })
    if (diaChiMacDinh) {
        $("#full-name").val(diaChiMacDinh.hoTen)
        $("#phone").val(diaChiMacDinh.sdt)
        $("#diachi").val(diaChiMacDinh.diaChi)
    }

    // Link điều hướng: đi từ giỏ hàng thì quay lại giỏ hàng
    if (tuGioHang) {
        $(".product-nav a").text("Giỏ hàng").attr("href", "giohang.html")
        $(".quaylai").attr("href", "giohang.html")
    } else {
        $(".product-nav a").text(sanphams[0].ten).attr("href", sanphams[0].link)
        $(".quaylai").attr("href", sanphams[0].link)
    }
}

// Gắn sự kiện cho nút sử dụng giảm giá
$(".dcuse").on("click", function (e) {
    e.preventDefault()
    const ma = $("#discount").val().trim().toLowerCase()
    if (maGiamGia[ma]) {
        maDangDung = ma
        capNhatTien()
        alert("Áp dụng mã giảm giá thành công!")
    } else {
        maDangDung = ""         // mã sai thì bỏ mã đang dùng, trả về giá gốc
        capNhatTien()
        alert("Mã giảm giá bạn nhập vào không hợp lệ")
    }
})

//Kiểm tra sự hợp lệ khi nhập dữ liệu
$("#submit-btn").on("click", function (e) {
    e.preventDefault();

    let isValid = true;

    const name = $("#full-name").val().trim();
    const email = $("#email").val().trim();
    const phone = $("#phone").val().trim();
    const address = $("#diachi").val().trim();
    const payment = $("#payment-method").val()      // chưa chọn thì jQuery trả về null

    // Xóa thông báo lỗi cũ
    $("#error-fullname, #error-email, #error-phone, #error-address, #error-payment").text("");

    // Regex kiểm tra
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^0\d{9}$/;

    // Tên
    if (name === "") {
        $("#error-fullname").text("Vui lòng nhập họ tên.");
        isValid = false;
    }

    // Email
    if (!emailRegex.test(email)) {
        $("#error-email").text("Email không đúng định dạng.");
        isValid = false;
    }

    // SĐT
    if (!phoneRegex.test(phone)) {
        $("#error-phone").text("Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số.");
        isValid = false;
    }

    // Địa chỉ
    if (address === "") {
        $("#error-address").text("Hãy nhập địa chỉ của bạn.");
        isValid = false;
    }
    // Kiểm tra chọn phương thức thanh toán
    if (!payment) {
        $("#error-payment").text("Vui lòng chọn phương thức thanh toán.");
        isValid = false;
    }

    if (!isValid) return;
    if (!user || sanphams.length === 0) return;

    // Thanh toán VNPay (giả lập): hộp xác nhận thay cho cổng thanh toán thật
    // (cách làm đơn giản cho đồ án tĩnh; bản thật cần kết nối cổng VNPay phía máy chủ)
    let daThanhToan = false
    if (payment === "vnpay") {
        daThanhToan = confirm("[GIẢ LẬP VNPAY]\nSố tiền: " + capNhatTien().toLocaleString("vi-VN") + "đ\nBấm OK để thanh toán thành công, Cancel để hủy giao dịch.")
        if (!daThanhToan) {
            alert("Giao dịch bị hủy. Đơn hàng chưa được tạo.")
            return
        }
    }

    // Tạo đơn hàng và lưu vào localStorage (phân hệ quản trị sẽ đọc lại danh sách này)
    const maDon = "DH" + Date.now()
    const order = {
        maDon: maDon,
        emailKhach: user.email,
        ngayDat: new Date().toISOString(),
        trangThai: "Chờ xác nhận",     // Chờ xác nhận, Đã xác nhận, Đang giao, Đã giao, Đã hủy
        nguoiNhan: { hoTen: name, email: email, sdt: phone, diaChi: address },
        sanPham: sanphams,
        tamTinh: tamTinh,
        phiShip: phiShip,
        maGiamGia: maDangDung,
        tienGiam: tienGiam,
        tongTien: tamTinh + phiShip - tienGiam,
        phuongThuc: payment === "vnpay" ? "VNPay" : "Thanh toán khi nhận hàng",
        thanhToan: daThanhToan ? "Đã thanh toán" : "Chưa thanh toán"
    }

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Đặt từ giỏ hàng thì xóa giỏ; xóa dữ liệu tạm; nhớ mã đơn để trang hóa đơn hiển thị
    if (tuGioHang) localStorage.removeItem("cart")
    sessionStorage.removeItem("checkoutItems")
    sessionStorage.removeItem("checkoutFrom")
    sessionStorage.setItem("lastOrderId", maDon)
    window.location.href = "hoadon.html";
});
//end Kiểm tra sự hợp lệ khi nhập dữ liệu
