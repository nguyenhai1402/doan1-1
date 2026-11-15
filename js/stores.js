// ===== stores.js - Dữ liệu cửa hàng + tồn kho theo cửa hàng (dùng jQuery) =====
// !!! DỮ LIỆU MẪU: hãy thay bằng cửa hàng thật (xem trang "Hệ thống cửa hàng" của johnhenry.vn).
// Dữ liệu được nạp vào localStorage (key "stores") ở lần mở đầu tiên; phân hệ quản trị sẽ sửa dữ liệu ở đó.

const CUA_HANG_MAU = [
    { id: "CH01", ten: "John Henry Nguyễn Trãi", thuongHieu: "John Henry", tinh: "TP. Hồ Chí Minh", quan: "Quận 1", diaChi: "172 Nguyễn Trãi, P. Bến Thành, Quận 1", sdt: "0914 516 446", hoatDong: true },
    { id: "CH02", ten: "John Henry Võ Văn Tần", thuongHieu: "John Henry", tinh: "TP. Hồ Chí Minh", quan: "Quận 3", diaChi: "25 Võ Văn Tần, P. Võ Thị Sáu, Quận 3", sdt: "0906 954 368", hoatDong: true },
    { id: "CH03", ten: "John Henry Phú Mỹ Hưng", thuongHieu: "John Henry", tinh: "TP. Hồ Chí Minh", quan: "Quận 7", diaChi: "105 Nguyễn Lương Bằng, P. Tân Phú, Quận 7", sdt: "0914 516 447", hoatDong: true },
    { id: "CH04", ten: "Freelancer Nguyễn Trãi", thuongHieu: "Freelancer", tinh: "TP. Hồ Chí Minh", quan: "Quận 1", diaChi: "174 Nguyễn Trãi, P. Bến Thành, Quận 1", sdt: "0906 954 369", hoatDong: true },
    { id: "CH05", ten: "Freelancer Thủ Đức", thuongHieu: "Freelancer", tinh: "TP. Hồ Chí Minh", quan: "TP. Thủ Đức", diaChi: "88 Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức", sdt: "0906 954 370", hoatDong: true },
    { id: "CH06", ten: "John Henry Bà Triệu", thuongHieu: "John Henry", tinh: "Hà Nội", quan: "Hai Bà Trưng", diaChi: "120 Bà Triệu, P. Lê Đại Hành, Hai Bà Trưng", sdt: "0912 000 111", hoatDong: true },
    { id: "CH07", ten: "John Henry Cầu Giấy", thuongHieu: "John Henry", tinh: "Hà Nội", quan: "Cầu Giấy", diaChi: "36 Xuân Thủy, P. Dịch Vọng Hậu, Cầu Giấy", sdt: "0912 000 112", hoatDong: true },
    { id: "CH08", ten: "Freelancer Hoàn Kiếm", thuongHieu: "Freelancer", tinh: "Hà Nội", quan: "Hoàn Kiếm", diaChi: "15 Hàng Bài, P. Hàng Bài, Hoàn Kiếm", sdt: "0912 000 113", hoatDong: true },
    { id: "CH09", ten: "Freelancer Đống Đa", thuongHieu: "Freelancer", tinh: "Hà Nội", quan: "Đống Đa", diaChi: "52 Chùa Bộc, P. Quang Trung, Đống Đa", sdt: "0912 000 114", hoatDong: true },
    { id: "CH10", ten: "John Henry Hải Châu", thuongHieu: "John Henry", tinh: "Đà Nẵng", quan: "Hải Châu", diaChi: "200 Nguyễn Văn Linh, P. Nam Dương, Hải Châu", sdt: "0905 111 222", hoatDong: true },
    { id: "CH11", ten: "Freelancer Hải Châu", thuongHieu: "Freelancer", tinh: "Đà Nẵng", quan: "Hải Châu", diaChi: "78 Lê Duẩn, P. Hải Châu 1, Hải Châu", sdt: "0905 111 223", hoatDong: true },
    { id: "CH12", ten: "John Henry Hưng Yên", thuongHieu: "John Henry", tinh: "Hưng Yên", quan: "TP. Hưng Yên", diaChi: "12 Nguyễn Văn Linh, P. An Tảo, TP. Hưng Yên", sdt: "0221 333 444", hoatDong: true },
    { id: "CH13", ten: "Freelancer Hưng Yên", thuongHieu: "Freelancer", tinh: "Hưng Yên", quan: "TP. Hưng Yên", diaChi: "20 Điện Biên, P. Quang Trung, TP. Hưng Yên", sdt: "0221 333 445", hoatDong: true },
    { id: "CH14", ten: "John Henry Cần Thơ (tạm đóng)", thuongHieu: "John Henry", tinh: "Cần Thơ", quan: "Ninh Kiều", diaChi: "30 Hòa Bình, P. Tân An, Ninh Kiều", sdt: "0292 555 666", hoatDong: false }
]

// Nạp dữ liệu mẫu lần đầu
if (!localStorage.getItem("stores")) {
    localStorage.setItem("stores", JSON.stringify(CUA_HANG_MAU))
}

// Lấy các cửa hàng ĐANG HOẠT ĐỘNG (cửa hàng đã đóng không hiển thị cho khách).
// thuongHieu để rỗng = lấy tất cả thương hiệu
function layCuaHang(thuongHieu) {
    const ds = JSON.parse(localStorage.getItem("stores")) || []
    return ds.filter(function (ch) {
        return ch.hoatDong && (!thuongHieu || ch.thuongHieu === thuongHieu)
    })
}

// Tồn kho của 1 biến thể (màu + size) của 1 sản phẩm tại 1 cửa hàng.
// Quản trị viên nhập tồn kho vào localStorage "inventory" (khóa: idCuaHang|idSanPham|mau|size).
// Chưa có dữ liệu thì dùng số mẫu cố định theo khóa (để demo, cùng khóa luôn ra cùng số).
function layTonKho(idCuaHang, idSanPham, mau, size) {
    const kho = JSON.parse(localStorage.getItem("inventory")) || {}
    const khoa = idCuaHang + "|" + idSanPham + "|" + mau + "|" + size
    if (kho[khoa] !== undefined) return kho[khoa]
    let tong = 0
    for (let i = 0; i < khoa.length; i++) {
        tong += khoa.charCodeAt(i) * (i + 7)
    }
    return tong % 4 === 0 ? 0 : tong % 9 + 1     // khoảng 1/4 số cửa hàng hết hàng
}

// Đổ danh sách tỉnh/thành vào <select> từ danh sách cửa hàng
function doDanhSachTinh(selector, dsCuaHang) {
    const cacTinh = []
    $.each(dsCuaHang, function (i, ch) {
        if (cacTinh.indexOf(ch.tinh) === -1) cacTinh.push(ch.tinh)
    })
    let html = '<option value="">Chọn tỉnh/thành</option>'
    $.each(cacTinh, function (i, t) { html += '<option value="' + t + '">' + t + "</option>" })
    $(selector).html(html)
}

// Đổ danh sách quận/huyện của một tỉnh vào <select>
function doDanhSachQuan(selector, dsCuaHang, tinh) {
    const cacQuan = []
    $.each(dsCuaHang, function (i, ch) {
        if (ch.tinh === tinh && cacQuan.indexOf(ch.quan) === -1) cacQuan.push(ch.quan)
    })
    let html = '<option value="">Tất cả quận/huyện</option>'
    $.each(cacQuan, function (i, q) { html += '<option value="' + q + '">' + q + "</option>" })
    $(selector).html(html)
}
