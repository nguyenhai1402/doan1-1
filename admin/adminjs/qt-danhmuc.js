// ===== qt-danhmuc.js - Quản lý danh mục ba tầng (UCQLDM01 đến 04, viết bằng jQuery + Bootstrap) =====

$(function () {
    if (!QT.batDau({ trang: "danhmuc", tieuDe: "Quản lý danh mục", vaiTro: ["admin"] })) return

    const TEN_CAP = { 1: "Thương hiệu", 2: "Nhóm", 3: "Loại" }
    const modalDM = new bootstrap.Modal("#modalDM")
    let dangChon = ""          // mã danh mục đang xem chi tiết
    let idDangSua = ""         // rỗng = đang thêm mới
    const dongMo = {}          // các nhánh đang mở rộng: mở sẵn cấp 1 và 2

    function layDS() { return QT.danhMuc() }
    // Số sản phẩm thuộc danh mục (tính cả danh mục con)
    function demSP(id) {
        const cacLoai = QT.idCon(id)
        return QT.get("products", []).filter(function (sp) { return cacLoai.indexOf(sp.loaiId) !== -1 }).length
    }

    // ---------- 1. Vẽ cây (UCQLDM01) ----------
    function veNhanh(cha) {
        const con = layDS().filter(function (d) { return d.cha === cha })
        if (con.length === 0) return ""
        let h = "<ul>"
        $.each(con, function (i, d) {
            const coCon = layDS().some(function (x) { return x.cha === d.id })
            const mo = dongMo[d.id] !== false && d.cap < 3
            h += `<li><div class="nut ${d.id === dangChon ? "chon" : ""}" data-id="${d.id}">
                <span class="mui" data-mo="${d.id}">${coCon ? '<i class="fa-solid ' + (mo ? "fa-chevron-down" : "fa-chevron-right") + '"></i>' : ""}</span>
                <span>${QT.html(d.ten)}</span><span class="dem">${demSP(d.id)} sp</span></div>
                ${mo ? veNhanh(d.id) : ""}</li>`
        })
        return h + "</ul>"
    }
    function veCay() {
        const ds = layDS()
        if (ds.length === 0) {
            $("#dmCay").html('<p class="text-secondary mb-0">Chưa có danh mục.</p>')       // 2a
            return
        }
        $("#dmCay").html('<div class="qt-cay">' + veNhanh("").replace(/^<ul>/, '<ul style="padding-left:0">') + "</div>")
    }

    // Mở / thu gọn nhánh, chọn danh mục (cây được vẽ lại nên gắn qua #dmCay)
    $("#dmCay").on("click", ".mui", function (e) {
        e.stopPropagation()
        const id = $(this).attr("data-mo")
        dongMo[id] = dongMo[id] === false ? true : false
        veCay()
    })
    $("#dmCay").on("click", ".nut", function () {
        dangChon = $(this).attr("data-id")
        veCay()
        veChiTiet()
    })

    function veChiTiet() {
        const dm = layDS().find(function (d) { return d.id === dangChon })
        if (!dm) { $("#dmChiTiet").html('<p class="text-secondary mb-0">Chọn một danh mục trong cây để xem chi tiết.</p>'); return }
        $("#dmChiTiet").html(`
            <h2>${QT.html(dm.ten)}</h2>
            <table class="table table-sm mb-3"><tbody>
                <tr><th style="width:38%">Mã danh mục</th><td>${dm.id}</td></tr>
                <tr><th>Đường dẫn</th><td>${QT.html(dm.duongDan)}</td></tr>
                <tr><th>Cấp</th><td>${dm.cap} (${TEN_CAP[dm.cap]})</td></tr>
                <tr><th>Thuộc</th><td>${dm.cha ? QT.html(QT.tenDayDu(dm.cha)) : "(thương hiệu)"}</td></tr>
                <tr><th>Số sản phẩm</th><td>${demSP(dm.id)}</td></tr>
            </tbody></table>
            <button class="btn btn-outline-primary btn-sm" data-act="con"><i class="fa-solid fa-plus"></i> Thêm danh mục con</button>
            <button class="btn btn-outline-primary btn-sm" data-act="sua"><i class="fa-solid fa-pen"></i> Sửa</button>
            <button class="btn btn-outline-primary btn-sm" data-act="xoa"><i class="fa-solid fa-trash"></i> Xóa</button>`)
    }
    $("#dmChiTiet").on("click", "[data-act]", function () {
        const act = $(this).attr("data-act")
        if (act === "con") moForm("", dangChon)
        if (act === "sua") moForm(dangChon, "")
        if (act === "xoa") xoaDM(dangChon)
    })

    // ---------- 2. Thêm / sửa (UCQLDM02, UCQLDM03) ----------
    function moForm(id, chaMacDinh) {
        idDangSua = id
        $("#dmLoi").text("")
        $("#dmTieuDe").text(id ? "Sửa danh mục" : "Thêm danh mục")
        let opts = '<option value="">(Không có - tạo thương hiệu mới)</option>'
        layDS().filter(function (d) { return d.id !== id && QT.idCon(id || "---").indexOf(d.id) === -1 }).forEach(function (d) {
            opts += '<option value="' + d.id + '">' + QT.html(QT.tenDayDu(d.id)) + "</option>"
        })
        $("#dmCha").html(opts)
        if (id) {
            const dm = layDS().find(function (d) { return d.id === id })
            $("#dmTen").val(dm.ten)
            $("#dmCha").val(dm.cha).prop("disabled", true)          // khi sửa chỉ đổi tên, không đổi danh mục cha
        } else {
            $("#dmTen").val("")
            $("#dmCha").val(chaMacDinh || "").prop("disabled", false)
        }
        modalDM.show()
    }
    $("#dmThem").on("click", function () { moForm("", "") })

    $("#dmLuu").on("click", function () {
        const ten = $("#dmTen").val().trim()
        const cha = $("#dmCha").val()
        const ds = layDS()
        let loi = ""
        const chaDM = ds.find(function (d) { return d.id === cha })
        if (ten === "") loi = "Vui lòng nhập tên danh mục."
        else if (ds.some(function (d) { return d.cha === cha && d.ten.toLowerCase() === ten.toLowerCase() && d.id !== idDangSua })) loi = "Tên danh mục đã tồn tại trong cùng danh mục cha."
        else if (chaDM && chaDM.cap >= 3) loi = "Danh mục cha đã ở cấp 3, không thể thêm danh mục con (tối đa ba cấp)."
        if (loi) { $("#dmLoi").text(loi); return }

        if (idDangSua === "") {
            const so = ds.reduce(function (m, d) { return Math.max(m, parseInt(d.id.replace(/\D/g, "")) || 0) }, 0) + 1
            const moi = { id: "DM" + String(so).padStart(3, "0"), ten: ten, cha: cha, cap: chaDM ? chaDM.cap + 1 : 1, duongDan: (chaDM ? chaDM.duongDan + "/" : "") + taoDuongDan(ten) }
            ds.push(moi)
            dangChon = moi.id
            if (chaDM) dongMo[chaDM.id] = true
            QT.thongBao("Thêm danh mục thành công")
        } else {
            const dm = ds.find(function (d) { return d.id === idDangSua })
            const cu = dm.duongDan
            dm.ten = ten
            dm.duongDan = (chaDM ? chaDM.duongDan + "/" : "") + taoDuongDan(ten)
            // cập nhật đường dẫn của các danh mục con
            ds.forEach(function (d) { if (d.id !== dm.id && d.duongDan.indexOf(cu + "/") === 0) d.duongDan = dm.duongDan + d.duongDan.slice(cu.length) })
            QT.thongBao("Cập nhật danh mục thành công")
        }
        QT.set("categories", ds)
        modalDM.hide()
        veCay()
        veChiTiet()
    })

    // ---------- 3. Xóa (UCQLDM04) ----------
    function xoaDM(id) {
        const ds = layDS()
        const dm = ds.find(function (d) { return d.id === id })
        // 4a: còn danh mục con hoặc còn sản phẩm thì từ chối
        if (ds.some(function (d) { return d.cha === id })) {
            QT.thongBao("Danh mục còn danh mục con. Hãy chuyển hoặc xóa các danh mục con trước.", "loi")
            return
        }
        if (demSP(id) > 0) {
            QT.thongBao("Danh mục còn " + demSP(id) + " sản phẩm. Hãy chuyển sản phẩm sang danh mục khác trước.", "loi")
            return
        }
        QT.xacNhan("Xóa danh mục <strong>" + QT.html(dm.ten) + "</strong>?", function () {
            QT.set("categories", ds.filter(function (d) { return d.id !== id }))
            dangChon = ""
            QT.thongBao("Xóa danh mục thành công")
            veCay()
            veChiTiet()
        }, "Xóa danh mục")
    }

    veCay()
})
