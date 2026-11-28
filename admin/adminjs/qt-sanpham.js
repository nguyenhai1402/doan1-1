// ===== qt-sanpham.js - Quản lý sản phẩm (UCQLSP01 đến 05, viết bằng jQuery + Bootstrap) =====

$(function () {
    if (!QT.batDau({ trang: "sanpham", tieuDe: "Quản lý sản phẩm", vaiTro: ["admin"] })) return

    const moiTrang = 10
    let trang = 1
    let idDangSua = ""          // rỗng = đang thêm mới; có giá trị = đang sửa sản phẩm đó
    const modalXem = new bootstrap.Modal("#modalXemSP")
    const modalForm = new bootstrap.Modal("#modalSP")

    function layTatCa() { return QT.get("products", []) }
    function luuTatCa(ds) { QT.set("products", ds) }

    // Ô lọc danh mục: Tất cả / từng loại
    $("#spLocDM").html('<option value="">Tất cả danh mục</option>' + QT.optionLoai(""))

    // ---------- 1. Danh sách + tìm kiếm + lọc (UCQLSP01) ----------
    function danhSachLoc() {
        const tuKhoa = $("#spTim").val().trim().toLowerCase()
        const dm = $("#spLocDM").val()
        const tt = $("#spLocTT").val()
        return layTatCa().filter(function (sp) {
            if (tuKhoa && sp.ten.toLowerCase().indexOf(tuKhoa) === -1 && sp.sku.toLowerCase().indexOf(tuKhoa) === -1) return false
            if (dm && sp.loaiId !== dm) return false
            if (tt && QT.trangThaiSP(sp) !== tt) return false
            return true
        })
    }

    function ve() {
        const ds = danhSachLoc()
        const tongTrang = Math.max(1, Math.ceil(ds.length / moiTrang))
        if (trang > tongTrang) trang = tongTrang
        const batDau = (trang - 1) * moiTrang
        if (ds.length === 0) {
            $("#spBang").html('<tr><td colspan="7" class="text-center text-secondary py-4">Không tìm thấy sản phẩm</td></tr>')
        } else {
            let h = ""
            $.each(ds.slice(batDau, batDau + moiTrang), function (i, sp) {
                const tt = QT.trangThaiSP(sp)
                h += `<tr>
                    <td class="d-none d-md-table-cell">${QT.html(sp.maSP)}</td>
                    <td><strong>${QT.html(sp.ten)}</strong><br><small class="text-secondary">SKU: ${QT.html(sp.sku)}</small></td>
                    <td class="small d-none d-lg-table-cell">${QT.html(QT.tenDayDu(sp.loaiId))}</td>
                    <td class="text-end">${QT.money(sp.gia)}</td>
                    <td class="d-none d-md-table-cell">${sp.nhan ? '<span class="tt tt-3">' + sp.nhan + "</span>" : ""}</td>
                    <td>${QT.nhanTrangThaiSP(tt)}</td>
                    <td class="text-end text-nowrap">
                        <button class="btn btn-sm btn-outline-secondary" data-act="xem" data-id="${QT.html(sp.id)}" title="Xem"><i class="fa-solid fa-eye"></i></button>
                        <button class="btn btn-sm btn-outline-primary" data-act="sua" data-id="${QT.html(sp.id)}" title="Sửa"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-sm btn-outline-secondary" data-act="an" data-id="${QT.html(sp.id)}" title="${sp.trangThai === "Ẩn" ? "Xuất bản" : "Ẩn"}"><i class="fa-solid ${sp.trangThai === "Ẩn" ? "fa-toggle-off" : "fa-toggle-on"}"></i></button>
                        <button class="btn btn-sm btn-outline-primary" data-act="xoa" data-id="${QT.html(sp.id)}" title="Xóa"><i class="fa-solid fa-trash"></i></button>
                    </td></tr>`
            })
            $("#spBang").html(h)
        }
        $("#spTong").text("Tổng " + ds.length + " sản phẩm")
        $("#spTrang").html(QT.phanTrangHtml(tongTrang, trang))
    }

    $("#spTim").on("input", function () { trang = 1; ve() })
    $("#spLocDM, #spLocTT").on("change", function () { trang = 1; ve() })
    $("#spTrang").on("click", "[data-trang]", function (e) {
        e.preventDefault()
        trang = Number($(this).attr("data-trang"))
        ve()
    })

    // Các nút ở mỗi dòng (bảng được vẽ lại nên gắn sự kiện qua #spBang)
    $("#spBang").on("click", "[data-act]", function () {
        const id = $(this).attr("data-id")
        const act = $(this).attr("data-act")
        if (act === "xem") xemChiTiet(id)
        if (act === "sua") moForm(id)
        if (act === "an") anHienSP(id)
        if (act === "xoa") xoaSP(id)
    })

    // ---------- 2. Xem chi tiết ----------
    function xemChiTiet(id) {
        const sp = layTatCa().find(function (s) { return s.id === id })
        let bt = ""
        $.each(sp.bienThe, function (i, b) {
            bt += `<tr><td>${QT.html(b.mau)}</td><td>${QT.html(b.size)}</td><td>${QT.html(b.sku)}</td><td>${QT.html(b.maVach)}</td><td class="text-end">${QT.money(b.gia)}</td><td class="text-end">${b.tonKho}</td></tr>`
        })
        let anh = ""
        $.each(sp.hinhAnh, function (i, a) { anh += `<div class="small">${QT.html(a.mau)}: <a href="../${QT.html(a.url)}" target="_blank">${QT.html(a.url)}</a></div>` })
        $("#spChiTiet").html(`
            <h5>${QT.html(sp.ten)} ${QT.nhanTrangThaiSP(QT.trangThaiSP(sp))}</h5>
            <p class="text-secondary mb-2">${QT.html(sp.maSP)} - SKU ${QT.html(sp.sku)} - ${QT.html(QT.tenDayDu(sp.loaiId))}</p>
            <p><strong>Giá bán:</strong> ${QT.money(sp.gia)} &nbsp; <strong>Nhãn:</strong> ${sp.nhan || "Không có"} &nbsp;
               <strong>Khuyến mãi:</strong> ${sp.khongKM ? "Không áp dụng" : "Được áp dụng"} &nbsp; <strong>Ngày xuất bản:</strong> ${sp.ngayXuatBan || "Chưa xuất bản"}</p>
            <p><strong>Mô tả:</strong> ${QT.html(sp.moTa) || "(chưa có)"}</p>
            <h6 style="color:var(--qt-dam)">Biến thể</h6>
            <div class="table-responsive"><table class="table table-sm"><thead><tr><th>Màu</th><th>Size</th><th>SKU</th><th>Mã vạch</th><th class="text-end">Giá</th><th class="text-end">Tồn</th></tr></thead><tbody>${bt || '<tr><td colspan="6" class="text-secondary">Chưa có biến thể</td></tr>'}</tbody></table></div>
            <h6 style="color:var(--qt-dam)">Hình ảnh theo màu</h6>${anh || '<div class="text-secondary">Chưa có hình ảnh</div>'}`)
        modalXem.show()
    }

    // ---------- 3. Form thêm / sửa (UCQLSP02, UCQLSP03) ----------
    function dongBienThe(b) {
        b = b || { id: "", mau: "", size: "", sku: "", maVach: "", gia: $("#spGia").val() || "", tonKho: 0 }
        return `<tr data-id="${QT.html(b.id)}">
            <td><input class="form-control form-control-sm bt-mau" value="${QT.html(b.mau)}"></td>
            <td><input class="form-control form-control-sm bt-size" value="${QT.html(b.size)}" style="min-width:70px"></td>
            <td><input class="form-control form-control-sm bt-sku" value="${QT.html(b.sku)}" style="min-width:130px"></td>
            <td><input class="form-control form-control-sm bt-mavach" value="${QT.html(b.maVach)}" style="min-width:130px"></td>
            <td><input type="number" min="0" class="form-control form-control-sm bt-gia" value="${b.gia}" style="min-width:100px"></td>
            <td><input type="number" min="0" class="form-control form-control-sm bt-ton" value="${b.tonKho}" style="min-width:70px"></td>
            <td><button class="btn btn-sm btn-outline-secondary bt-xoa"><i class="fa-solid fa-xmark"></i></button></td></tr>`
    }
    function dongAnh(a) {
        a = a || { mau: "", url: "" }
        return `<tr><td><input class="form-control form-control-sm anh-mau" value="${QT.html(a.mau)}"></td>
            <td><input class="form-control form-control-sm anh-url" value="${QT.html(a.url)}"></td>
            <td><button class="btn btn-sm btn-outline-secondary anh-xoa"><i class="fa-solid fa-xmark"></i></button></td></tr>`
    }
    $("#spThemBT").on("click", function () { $("#spBienThe").append(dongBienThe()) })
    $("#spThemAnh").on("click", function () { $("#spAnh").append(dongAnh()) })
    $("#spBienThe").on("click", ".bt-xoa", function () { $(this).closest("tr").remove() })
    $("#spAnh").on("click", ".anh-xoa", function () { $(this).closest("tr").remove() })

    function moForm(id) {
        idDangSua = id || ""
        $("#spLoi").text("")
        $(".is-invalid").removeClass("is-invalid")
        $("#spLoai").html(QT.optionLoai(""))
        if (id) {
            const sp = layTatCa().find(function (s) { return s.id === id })
            $("#spTieuDe").text("Sửa sản phẩm")
            $("#spTen").val(sp.ten); $("#spSku").val(sp.sku); $("#spLoai").val(sp.loaiId); $("#spGia").val(sp.gia)
            $("#spNhan").val(sp.nhan); $("#spKhongKM").prop("checked", sp.khongKM); $("#spMoTa").val(sp.moTa)
            $("#spBienThe").html(sp.bienThe.map(dongBienThe).join("") || dongBienThe())      // luôn có sẵn 1 dòng để nhập
            $("#spAnh").html(sp.hinhAnh.map(dongAnh).join("") || dongAnh())
        } else {
            $("#spTieuDe").text("Thêm sản phẩm")
            $("#spTen, #spSku, #spGia, #spMoTa").val("")
            $("#spNhan").val(""); $("#spKhongKM").prop("checked", false)
            $("#spBienThe").html(dongBienThe()); $("#spAnh").html(dongAnh())
        }
        modalForm.show()
    }
    $("#spThem").on("click", function () {
        // PRE-2: phải có ít nhất một danh mục cấp Loại
        if (QT.danhMuc().filter(function (d) { return d.cap === 3 }).length === 0) {
            QT.thongBao("Chưa có danh mục cấp Loại. Hãy thêm danh mục trước.", "loi")
            return
        }
        moForm("")
    })

    // Lưu: kiểm tra dữ liệu rồi thêm / cập nhật
    $("#spLuu").on("click", function () {
        $(".is-invalid").removeClass("is-invalid")
        const loi = []
        const bao = function ($o, noiDung) { $o.addClass("is-invalid"); loi.push(noiDung) }

        const ten = $("#spTen").val().trim()
        const sku = $("#spSku").val().trim()
        const gia = Number($("#spGia").val())
        const tatCa = layTatCa()
        if (ten === "") bao($("#spTen"), "Vui lòng nhập tên sản phẩm.")
        if (sku === "") bao($("#spSku"), "Vui lòng nhập mã SKU.")
        else if (tatCa.some(function (s) { return s.sku.toLowerCase() === sku.toLowerCase() && s.id !== idDangSua })) bao($("#spSku"), "Mã SKU \"" + sku + "\" đã tồn tại.")
        if (!$("#spLoai").val()) bao($("#spLoai"), "Vui lòng chọn loại sản phẩm.")
        if (!(gia > 0)) bao($("#spGia"), "Giá bán phải lớn hơn 0.")

        // Biến thể: SKU và mã vạch không trùng với sản phẩm khác (và không trùng nhau)
        const bienThe = []
        const skuBT = [], maVach = [], cap = []
        tatCa.forEach(function (s) {
            if (s.id === idDangSua) return
            s.bienThe.forEach(function (b) { skuBT.push(b.sku.toLowerCase()); maVach.push(b.maVach) })
        })
        $("#spBienThe tr").each(function () {
            const $r = $(this)
            const b = { id: $r.attr("data-id"), mau: $r.find(".bt-mau").val().trim(), size: $r.find(".bt-size").val().trim(), sku: $r.find(".bt-sku").val().trim(),
                maVach: $r.find(".bt-mavach").val().trim(), gia: Number($r.find(".bt-gia").val()), tonKho: Number($r.find(".bt-ton").val()) }
            if (b.mau === "" || b.size === "" || b.sku === "" || b.maVach === "") bao($r.find("input").first(), "Biến thể thiếu màu, size, SKU hoặc mã vạch.")
            else if (!(b.gia > 0) || !Number.isInteger(b.tonKho) || b.tonKho < 0) bao($r.find(".bt-gia"), "Biến thể \"" + b.sku + "\": giá phải lớn hơn 0 và tồn kho là số nguyên không âm.")
            else if (skuBT.indexOf(b.sku.toLowerCase()) !== -1) bao($r.find(".bt-sku"), "SKU biến thể \"" + b.sku + "\" đã tồn tại.")
            else if (maVach.indexOf(b.maVach) !== -1) bao($r.find(".bt-mavach"), "Mã vạch \"" + b.maVach + "\" đã tồn tại.")
            else if (cap.indexOf(b.mau.toLowerCase() + "|" + b.size.toLowerCase()) !== -1) bao($r.find(".bt-size"), "Trùng biến thể " + b.mau + " / " + b.size + ".")
            skuBT.push(b.sku.toLowerCase()); maVach.push(b.maVach); cap.push(b.mau.toLowerCase() + "|" + b.size.toLowerCase())
            bienThe.push(b)
        })
        const hinhAnh = []
        $("#spAnh tr").each(function () {
            const mau = $(this).find(".anh-mau").val().trim(), url = $(this).find(".anh-url").val().trim()
            if (url !== "") hinhAnh.push({ mau: mau, url: url })
        })
        if (loi.length > 0) { $("#spLoi").html(loi.map(function (l) { return "&bull; " + QT.html(l) }).join("<br>")); return }

        // Lưu
        const khoiTao = function (b, i) { if (!b.id) b.id = "BT" + Date.now() + i; return b }
        bienThe.forEach(khoiTao)
        const du = { ten: ten, sku: sku, loaiId: $("#spLoai").val(), gia: gia, nhan: $("#spNhan").val(), khongKM: $("#spKhongKM").is(":checked"),
            moTa: $("#spMoTa").val().trim(), bienThe: bienThe, hinhAnh: hinhAnh }
        if (idDangSua === "") {
            const so = tatCa.reduce(function (m, s) { return Math.max(m, parseInt(s.maSP.replace(/\D/g, "")) || 0) }, 0) + 1
            tatCa.push($.extend({ id: "SP" + Date.now(), maSP: "SP" + String(so).padStart(3, "0"), trangThai: "Ẩn", ngayXuatBan: "" }, du))   // sản phẩm mới luôn ở trạng thái ẩn
            QT.thongBao("Thêm sản phẩm thành công (đang ở trạng thái ẩn, hãy xuất bản khi sẵn sàng).")
        } else {
            $.extend(tatCa.find(function (s) { return s.id === idDangSua }), du)
            QT.thongBao("Cập nhật sản phẩm thành công")
        }
        luuTatCa(tatCa)
        modalForm.hide()
        ve()
    })

    // ---------- 4. Ẩn / xuất bản (UCQLSP04) ----------
    function anHienSP(id) {
        const ds = layTatCa()
        const sp = ds.find(function (s) { return s.id === id })
        const dangAn = sp.trangThai === "Ẩn"
        // 5a: xuất bản phải có biến thể và hình ảnh
        if (dangAn && (sp.bienThe.length === 0 || sp.hinhAnh.length === 0)) {
            QT.thongBao("Không thể xuất bản: sản phẩm cần có ít nhất một biến thể và một hình ảnh.", "loi")
            return
        }
        QT.xacNhan((dangAn ? "Xuất bản" : "Ẩn") + " sản phẩm <strong>" + QT.html(sp.ten) + "</strong>?" + (dangAn ? "" : "<br>Khách hàng sẽ không còn thấy sản phẩm này."), function () {
            sp.trangThai = dangAn ? "Xuất bản" : "Ẩn"
            if (dangAn && !sp.ngayXuatBan) sp.ngayXuatBan = new Date().toISOString().slice(0, 10)
            luuTatCa(ds)
            QT.thongBao(dangAn ? "Đã xuất bản sản phẩm" : "Đã ẩn sản phẩm")
            ve()
        })
    }

    // ---------- 5. Xóa (UCQLSP05) ----------
    function xoaSP(id) {
        const ds = layTatCa()
        const sp = ds.find(function (s) { return s.id === id })
        // 4a: sản phẩm đã có trong đơn hàng thì không được xóa
        const coTrongDon = QT.get("orders", []).some(function (o) {
            return o.sanPham.some(function (x) { return x.id === sp.id })
        })
        if (coTrongDon) {
            QT.thongBao("Sản phẩm đã có trong đơn hàng nên không thể xóa. Hãy chọn \"Ẩn\" sản phẩm.", "loi")
            return
        }
        QT.xacNhan("Xóa sản phẩm <strong>" + QT.html(sp.ten) + "</strong> cùng biến thể và hình ảnh? Thao tác này không thể hoàn tác.", function () {
            luuTatCa(ds.filter(function (s) { return s.id !== id }))
            // ghi nhớ mã sản phẩm đã xóa để web khách hàng gỡ thẻ sản phẩm tĩnh trong HTML
            const daXoa = QT.get("deletedProducts", [])
            daXoa.push(id)
            QT.set("deletedProducts", daXoa)
            // gỡ khỏi giỏ hàng và danh sách yêu thích của khách (đều lưu trong localStorage)
            QT.set("cart", QT.get("cart", []).filter(function (c) { return c.id !== id }))
            Object.keys(localStorage).forEach(function (k) {
                if (k.indexOf("wishlist_") === 0) QT.set(k, QT.get(k, []).filter(function (w) { return w.id !== id }))
            })
            QT.thongBao("Xóa sản phẩm thành công")
            ve()
        }, "Xóa sản phẩm")
    }

    ve()
})
