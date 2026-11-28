// ===== qt-data.js - Dữ liệu mẫu cho phân hệ quản trị (nạp vào localStorage ở lần mở đầu tiên) =====
// Cần nạp ../js/products.js trước (danh sách PRODUCTS của web khách hàng, làm gốc để tạo dữ liệu sản phẩm).
// Các khóa localStorage: adminStaff, categories, products, inventoryLog (và dùng lại orders, accounts, stores, posts của web khách hàng)

// Tài khoản nhân viên mẫu (vaiTro: "admin" = Quản trị viên, "cskh" = Nhân viên CSKH)
const NHAN_VIEN_MAU = [
    { id: "NV01", hoTen: "Quản trị viên", email: "admin@duchai.vn", password: "Admin@123", vaiTro: "admin", trangThai: "active" },
    { id: "NV02", hoTen: "Nhân viên CSKH", email: "cskh@duchai.vn", password: "Cskh@123", vaiTro: "cskh", trangThai: "active" }
]

// Cây danh mục ba tầng: Thương hiệu -> Nhóm -> Loại (lấy theo menu của web)
const CAY_DANH_MUC = {
    "John Henry": {
        "Áo nam": ["Áo polo", "Áo sơ mi", "Áo thun", "Áo len", "Áo khoác", "Vest-Blazer"],
        "Quần nam": ["Quần khaki", "Quần jeans", "Quần tây", "Quần sort"],
        "Phụ kiện nam": ["Nón lưỡi trai", "Mắt kính cao cấp", "Quần lót nam", "Cà vạt", "Thắt lưng", "Bóp-ví"]
    },
    "Freelancer": {
        "Đầm": ["Đầm"],
        "Chân váy": ["Chân váy"],
        "Áo nữ": ["Áo blouse", "Áo T-shirt", "Áo sơ mi nữ", "Áo polo nữ", "Áo blazer", "Áo len nữ"],
        "Quần nữ": ["Quần jean", "Quần tây nữ", "Quần sort nữ"],
        "Phụ kiện nữ": ["Mắt kính nữ", "Thắt lưng nữ"]
    }
}

// Tạo đường dẫn không dấu: "Áo polo" -> "ao-polo"
function taoDuongDan(ten) {
    return ten.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function taoDanhMucMau() {
    const ds = []
    let dem = 0
    function them(ten, cha, cap, duongDanCha) {
        dem++
        const dm = { id: "DM" + String(dem).padStart(3, "0"), ten: ten, cha: cha, cap: cap, duongDan: (duongDanCha ? duongDanCha + "/" : "") + taoDuongDan(ten) }
        ds.push(dm)
        return dm
    }
    Object.keys(CAY_DANH_MUC).forEach(function (hieu) {
        const h = them(hieu, "", 1, "")
        Object.keys(CAY_DANH_MUC[hieu]).forEach(function (nhom) {
            const n = them(nhom, h.id, 2, h.duongDan)
            CAY_DANH_MUC[hieu][nhom].forEach(function (loai) { them(loai, n.id, 3, n.duongDan) })
        })
    })
    return ds
}

// Tên sản phẩm -> loại danh mục (theo thương hiệu). Dùng khi tạo dữ liệu mẫu từ PRODUCTS
const LUAT_LOAI = [
    [/cà vạt/i, "Cà vạt", "Cà vạt"], [/mũ|nón/i, "Nón lưỡi trai", "Nón lưỡi trai"],
    [/mắt kính/i, "Mắt kính cao cấp", "Mắt kính nữ"], [/thắt lưng/i, "Thắt lưng", "Thắt lưng nữ"],
    [/quần khaki/i, "Quần khaki", "Quần jean"], [/chân váy/i, "Chân váy", "Chân váy"],
    [/đầm/i, "Đầm", "Đầm"], [/polo/i, "Áo polo", "Áo polo nữ"]
]
const LOAI_FREESIZE = ["Cà vạt", "Nón lưỡi trai", "Mắt kính cao cấp", "Thắt lưng", "Mắt kính nữ", "Thắt lưng nữ"]
const LOAI_PHU_KIEN = LOAI_FREESIZE
// Sáu sản phẩm đã có trang chi tiết riêng: dùng đúng tên và mã của trang
const SP_CO_TRANG = {
    "chitietsanpham.html": { ten: "Áo Polo Tay Ngắn Form Vừa KS25SS19P-SC", sku: "KS25SS19P-SC", mau: "BROWN" },
    "chitietsanpham2.html": { ten: "Áo Polo Nam Form Vừa Tay Ngắn" }, "chitietsanpham3.html": { ten: "Quần Khaki Nam Form Ôm" },
    "chitietsanpham4.html": { ten: "Cà Vạt Nam Lịch Lãm" }, "chitietsanpham5.html": { ten: "Đầm Tay Ngắn Form Suông" },
    "chitietsanpham6.html": { ten: "Chân Váy Bút Chì Xếp Nhún Xẻ Tà" }
}

function taoSanPhamMau(dsDanhMuc) {
    const timLoai = function (hieu, tenLoai) {
        const h = dsDanhMuc.find(function (d) { return d.cap === 1 && d.ten === hieu })
        const loai = dsDanhMuc.find(function (d) { return d.cap === 3 && d.ten === tenLoai && thuocHieu(d, h.id) })
        return loai
    }
    function thuocHieu(dm, idHieu) {
        const nhom = dsDanhMuc.find(function (d) { return d.id === dm.cha })
        return nhom && nhom.cha === idHieu
    }
    return PRODUCTS.map(function (p, i) {
        const coTrang = SP_CO_TRANG[p.link]
        const ten = coTrang ? coTrang.ten : p.ten.replace(/\.+$/, "").trim()
        let loai = null
        LUAT_LOAI.some(function (r) {
            if (r[0].test(ten)) { loai = timLoai(p.thuongHieu, p.thuongHieu === "John Henry" ? r[1] : r[2]); return !!loai }
            return false
        })
        if (!loai) loai = timLoai(p.thuongHieu, p.thuongHieu === "John Henry" ? "Áo thun" : "Áo blouse")
        const ma = (p.thuongHieu === "John Henry" ? "JH" : "FL") + String(i + 1).padStart(3, "0")
        const sku = coTrang && coTrang.sku ? coTrang.sku : ma
        const mau = coTrang && coTrang.mau ? coTrang.mau : "MẶC ĐỊNH"
        const sizes = LOAI_FREESIZE.indexOf(loai.ten) !== -1 ? ["FREESIZE"] : ["S", "M", "L", "XL"]
        const bienThe = sizes.map(function (size, k) {
            let ton = (i * 7 + k * 5) % 21
            if (i === 0) ton = k === 0 ? 8 : 0                         // sản phẩm đầu: chỉ còn size S (khớp trang chi tiết)
            return { id: "BT" + String(i + 1).padStart(3, "0") + k, mau: mau, size: size, sku: sku + "-" + size,
                maVach: "893" + String(i * 10 + k + 1).padStart(10, "0"), gia: p.gia, tonKho: ton }
        })
        return { id: p.id, maSP: "SP" + String(i + 1).padStart(3, "0"), ten: ten, sku: sku, loaiId: loai.id, gia: p.gia,
            nhan: [0, 3].indexOf(i) !== -1 ? "BEST SELLER" : ([1, 2, 5].indexOf(i) !== -1 ? "NEW" : ""),
            khongKM: LOAI_PHU_KIEN.indexOf(loai.ten) !== -1, trangThai: "Xuất bản",
            moTa: "Sản phẩm thuộc bộ sưu tập mới của " + p.thuongHieu + ".", ngayXuatBan: "2025-06-01",
            bienThe: bienThe, hinhAnh: [{ mau: mau, url: p.anh }] }
    })
}

// Nạp dữ liệu mẫu lần đầu
function khoiTaoDuLieuAdmin() {
    if (!localStorage.getItem("adminStaff")) localStorage.setItem("adminStaff", JSON.stringify(NHAN_VIEN_MAU))
    if (!localStorage.getItem("categories")) localStorage.setItem("categories", JSON.stringify(taoDanhMucMau()))
    if (!localStorage.getItem("products")) localStorage.setItem("products", JSON.stringify(taoSanPhamMau(JSON.parse(localStorage.getItem("categories")))))
    if (!localStorage.getItem("inventoryLog")) localStorage.setItem("inventoryLog", JSON.stringify([]))
}
