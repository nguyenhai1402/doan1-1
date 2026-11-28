// ===== qt-common.js - Phần dùng chung của mọi trang quản trị (jQuery + Bootstrap 5) =====
// Thứ tự nạp: jquery, bootstrap.bundle, ../js/products.js, qt-data.js, qt-common.js, file js của từng trang
// Mỗi trang gọi QT.batDau({...}) để: kiểm tra đăng nhập + quyền, dựng khung (menu trái, thanh trên cùng).
// Lưu ý: file viết dạng object QT chứa nhiều hàm (giống object JH ở web khách hàng).

// Danh sách menu bên trái. vaiTro: ai được vào. sanSang: false = chưa làm xong, hiện "Sắp có"
const MENU = [
    { id: "tongquan", ten: "Tổng quan", icon: "fa-gauge", href: "index.html", vaiTro: ["admin", "cskh"], sanSang: true },
    { id: "sanpham", ten: "Sản phẩm", icon: "fa-shirt", href: "sanpham.html", vaiTro: ["admin"], sanSang: true },
    { id: "danhmuc", ten: "Danh mục", icon: "fa-sitemap", href: "danhmuc.html", vaiTro: ["admin"], sanSang: true },
    { id: "tonkho", ten: "Tồn kho", icon: "fa-boxes-stacked", href: "tonkho.html", vaiTro: ["admin"], sanSang: true },
    { id: "donhang", ten: "Đơn hàng", icon: "fa-receipt", href: "donhang.html", vaiTro: ["admin", "cskh"], sanSang: false },
    { id: "doihang", ten: "Đổi hàng", icon: "fa-rotate", href: "doihang.html", vaiTro: ["admin", "cskh"], sanSang: false },
    { id: "khachhang", ten: "Khách hàng", icon: "fa-users", href: "khachhang.html", vaiTro: ["admin", "cskh"], sanSang: false },
    { id: "khuyenmai", ten: "Khuyến mãi", icon: "fa-ticket", href: "khuyenmai.html", vaiTro: ["admin"], sanSang: false },
    { id: "cuahang", ten: "Cửa hàng", icon: "fa-store", href: "cuahang.html", vaiTro: ["admin"], sanSang: false },
    { id: "noidung", ten: "Nội dung", icon: "fa-newspaper", href: "noidung.html", vaiTro: ["admin"], sanSang: false },
    { id: "thongke", ten: "Thống kê", icon: "fa-chart-column", href: "thongke.html", vaiTro: ["admin"], sanSang: false }
]
const TEN_VAI_TRO = { admin: "Quản trị viên", cskh: "Nhân viên CSKH" }

const QT = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
    // Định dạng tiền Việt: 1505731 -> 1.505.731
    so(n) { return String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); },
    money(n) { return this.so(n) + "đ"; },
    // Chuỗi an toàn khi chèn vào HTML (tránh lỗi khi tên có dấu < > " &)
    html(s) { return String(s === undefined || s === null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); },
    ngayGio(iso) { return new Date(iso).toLocaleString("vi-VN"); },

    // ---- Phiên đăng nhập (lưu sessionStorage: đóng tab là hết phiên) ----
    nguoi() { try { return JSON.parse(sessionStorage.getItem("adminSession")); } catch (e) { return null; } },
    dangXuat() { sessionStorage.removeItem("adminSession"); window.location.href = "dangnhap.html"; },

    // ---- Thông báo nhỏ (toast của Bootstrap). loai: "ok" hoặc "loi" ----
    thongBao(noiDung, loai) {
        const $t = $(`<div class="toast align-items-center border-0 text-white" role="alert" style="background:${loai === "loi" ? "#951329" : "#C21935"}">
            <div class="d-flex"><div class="toast-body">${QT.html(noiDung)}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div></div>`)
        $("#khuThongBao").append($t)
        const t = new bootstrap.Toast($t[0], { delay: 2800 })
        $t.on("hidden.bs.toast", function () { $t.remove() })
        t.show()
    },

    // ---- Hộp thoại xác nhận dùng chung ----
    xacNhan(noiDung, khiDongY, tieuDe) {
        $("#xnTieuDe").text(tieuDe || "Xác nhận")
        $("#xnNoiDung").html(noiDung)
        $("#xnDongY").off("click").on("click", function () {
            bootstrap.Modal.getInstance($("#modalXacNhan")[0]).hide()
            khiDongY()
        })
        bootstrap.Modal.getOrCreateInstance($("#modalXacNhan")[0]).show()
    },

    // ---- Thanh phân trang kiểu Bootstrap; mỗi nút có data-trang ----
    phanTrangHtml(tongTrang, trang) {
        if (tongTrang <= 1) return ""
        let h = '<nav><ul class="pagination pagination-sm justify-content-center mb-0">'
        h += '<li class="page-item ' + (trang === 1 ? "disabled" : "") + '"><a class="page-link" href="#" data-trang="' + (trang - 1) + '">&laquo;</a></li>'
        let truoc = 0
        for (let i = 1; i <= tongTrang; i++) {
            if (i === 1 || i === tongTrang || Math.abs(i - trang) <= 1) {
                if (i - truoc > 1) h += '<li class="page-item disabled"><span class="page-link">...</span></li>'
                h += '<li class="page-item ' + (i === trang ? "active" : "") + '"><a class="page-link" href="#" data-trang="' + i + '">' + i + "</a></li>"
                truoc = i
            }
        }
        h += '<li class="page-item ' + (trang === tongTrang ? "disabled" : "") + '"><a class="page-link" href="#" data-trang="' + (trang + 1) + '">&raquo;</a></li></ul></nav>'
        return h
    },

    // ---- Danh mục ----
    danhMuc() { return this.get("categories", []); },
    // Tên đầy đủ của một loại: "John Henry > Áo nam > Áo polo"
    tenDayDu(idDanhMuc) {
        const ds = this.danhMuc(), ten = []
        let dm = ds.find(function (d) { return d.id === idDanhMuc })
        while (dm) { ten.unshift(dm.ten); dm = ds.find(function (d) { return d.id === dm.cha }) }
        return ten.join(" > ")
    },
    // Mã của danh mục và tất cả danh mục con cháu
    idCon(idDanhMuc) {
        const ds = this.danhMuc(), kq = [idDanhMuc]
        for (let i = 0; i < kq.length; i++) {
            ds.forEach(function (d) { if (d.cha === kq[i]) kq.push(d.id) })
        }
        return kq
    },
    // Ô chọn danh mục (chỉ cấp 3 = Loại), nhóm theo thương hiệu > nhóm
    optionLoai(daChon) {
        const ds = this.danhMuc()
        let h = ""
        ds.filter(function (d) { return d.cap === 2 }).forEach(function (nhom) {
            const hieu = ds.find(function (d) { return d.id === nhom.cha })
            h += '<optgroup label="' + QT.html(hieu.ten + " > " + nhom.ten) + '">'
            ds.filter(function (d) { return d.cha === nhom.id }).forEach(function (loai) {
                h += '<option value="' + loai.id + '"' + (loai.id === daChon ? " selected" : "") + ">" + QT.html(loai.ten) + "</option>"
            })
            h += "</optgroup>"
        })
        return h
    },

    // ---- Sản phẩm ----
    // Trạng thái hiển thị: "Ẩn" | "Hết hàng" (đang xuất bản nhưng mọi biến thể tồn = 0) | "Xuất bản"
    trangThaiSP(sp) {
        if (sp.trangThai === "Ẩn") return "Ẩn"
        const tong = sp.bienThe.reduce(function (s, b) { return s + b.tonKho; }, 0)
        return tong === 0 ? "Hết hàng" : "Xuất bản"
    },
    nhanTrangThaiSP(tt) {
        const lop = { "Xuất bản": "tt-1", "Hết hàng": "tt-2", "Ẩn": "tt-4" }[tt]
        return '<span class="tt ' + lop + '">' + tt + "</span>"
    },

    // ---- Dựng khung trang. Trả về false nếu phải chuyển trang (chưa đăng nhập / không đủ quyền) ----
    batDau(cauHinh) {
        khoiTaoDuLieuAdmin()
        const nguoi = this.nguoi()
        if (!nguoi) { window.location.href = "dangnhap.html"; return false }
        if (cauHinh.vaiTro.indexOf(nguoi.vaiTro) === -1) {
            alert("Bạn không có quyền truy cập chức năng này.")
            window.location.href = "index.html"
            return false
        }
        const menu = MENU.filter(function (m) { return m.vaiTro.indexOf(nguoi.vaiTro) !== -1 })
        let nav = '<ul class="qt-nav">'
        menu.forEach(function (m) {
            if (m.sanSang) nav += '<li><a href="' + m.href + '" class="' + (m.id === cauHinh.trang ? "active" : "") + '"><i class="fa-solid ' + m.icon + '"></i>' + m.ten + "</a></li>"
            else nav += '<li><a href="#" class="chua" title="Chức năng đang được xây dựng"><i class="fa-solid ' + m.icon + '"></i>' + m.ten + '<span class="sap-co">Sắp có</span></a></li>'
        })
        nav += "</ul>"
        const brand = '<div class="qt-brand">Duc Hai Styles<small>Trang quản trị</small></div>'

        const $noiDung = $("#noiDungTrang").detach()
        $("body").prepend(`
            <div class="qt-sidebar fixed d-none d-lg-block">${brand}${nav}</div>
            <div class="offcanvas offcanvas-start qt-sidebar" tabindex="-1" id="menuDi">
                <div class="offcanvas-header p-0"><div class="qt-brand flex-grow-1">Duc Hai Styles<small>Trang quản trị</small></div>
                <button type="button" class="btn-close btn-close-white me-3" data-bs-dismiss="offcanvas"></button></div>
                <div class="offcanvas-body p-0">${nav}</div>
            </div>
            <div class="qt-main">
                <header class="qt-topbar">
                    <button class="btn btn-outline-secondary d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#menuDi"><i class="fa-solid fa-bars"></i></button>
                    <h1 class="qt-title">${QT.html(cauHinh.tieuDe)}</h1>
                    <div class="dropdown ms-auto">
                        <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"><i class="fa-solid fa-user"></i> <span class="d-none d-sm-inline">${QT.html(nguoi.hoTen)}</span></button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><span class="dropdown-item-text small text-secondary">${TEN_VAI_TRO[nguoi.vaiTro]}<br>${QT.html(nguoi.email)}</span></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="#" id="mnDoiMatKhau"><i class="fa-solid fa-key"></i> Đổi mật khẩu</a></li>
                            <li><a class="dropdown-item" href="#" id="mnDangXuat"><i class="fa-solid fa-right-from-bracket"></i> Đăng xuất</a></li>
                        </ul>
                    </div>
                </header>
                <main class="qt-content" id="khuNoiDung"></main>
            </div>
            <div class="toast-container position-fixed top-0 end-0 p-3" id="khuThongBao" style="z-index:2000"></div>

            <div class="modal fade" id="modalXacNhan" tabindex="-1"><div class="modal-dialog modal-dialog-centered"><div class="modal-content">
                <div class="modal-header"><h5 class="modal-title" id="xnTieuDe"></h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
                <div class="modal-body" id="xnNoiDung"></div>
                <div class="modal-footer"><button class="btn btn-outline-secondary" data-bs-dismiss="modal">Hủy</button><button class="btn btn-primary" id="xnDongY">Đồng ý</button></div>
            </div></div></div>

            <div class="modal fade" id="modalMatKhau" tabindex="-1"><div class="modal-dialog modal-dialog-centered"><div class="modal-content">
                <div class="modal-header"><h5 class="modal-title">Đổi mật khẩu</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
                <div class="modal-body">
                    <div class="mb-3"><label class="form-label">Mật khẩu hiện tại</label><input type="password" class="form-control" id="mkCu"></div>
                    <div class="mb-3"><label class="form-label">Mật khẩu mới</label><input type="password" class="form-control" id="mkMoi"><div class="form-text">Ít nhất 8 ký tự, gồm cả chữ và số.</div></div>
                    <div class="mb-3"><label class="form-label">Nhập lại mật khẩu mới</label><input type="password" class="form-control" id="mkMoi2"></div>
                    <div class="qt-loi" id="mkLoi"></div>
                </div>
                <div class="modal-footer"><button class="btn btn-outline-secondary" data-bs-dismiss="modal">Hủy</button><button class="btn btn-primary" id="mkLuu">Lưu</button></div>
            </div></div></div>`)
        $("#khuNoiDung").append($noiDung)

        $("#mnDangXuat").on("click", function (e) { e.preventDefault(); QT.dangXuat() })
        $("#mnDoiMatKhau").on("click", function (e) {
            e.preventDefault()
            $("#mkCu, #mkMoi, #mkMoi2").val("")
            $("#mkLoi").text("")
            bootstrap.Modal.getOrCreateInstance($("#modalMatKhau")[0]).show()
        })
        $("#mkLuu").on("click", QT.luuMatKhau)
        $(".qt-nav a.chua").on("click", function (e) { e.preventDefault() })
        return true
    },

    // UCDNQT02: đổi mật khẩu của chính người đang đăng nhập
    luuMatKhau() {
        const nguoi = QT.nguoi()
        const cu = $("#mkCu").val(), moi = $("#mkMoi").val(), moi2 = $("#mkMoi2").val()
        const ds = QT.get("adminStaff", [])
        const nv = ds.find(function (n) { return n.id === nguoi.id })
        let loi = ""
        if (cu === "" || moi === "" || moi2 === "") loi = "Vui lòng nhập đầy đủ các ô."
        else if (cu !== nv.password) loi = "Mật khẩu hiện tại không đúng."
        else if (moi.length < 8 || !/[A-Za-z]/.test(moi) || !/\d/.test(moi)) loi = "Mật khẩu mới phải có ít nhất 8 ký tự, gồm cả chữ và số."
        else if (moi === cu) loi = "Mật khẩu mới phải khác mật khẩu hiện tại."
        else if (moi !== moi2) loi = "Mật khẩu nhập lại không khớp."
        if (loi) { $("#mkLoi").text(loi); return }
        nv.password = moi
        QT.set("adminStaff", ds)
        bootstrap.Modal.getInstance($("#modalMatKhau")[0]).hide()
        QT.thongBao("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.")
        setTimeout(QT.dangXuat, 1400)         // theo đặc tả: các phiên hiện tại phải đăng nhập lại
    }
}
