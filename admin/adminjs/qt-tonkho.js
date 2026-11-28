// ===== qt-tonkho.js - Quản lý tồn kho biến thể (UCQLTK01 đến 03, viết bằng jQuery + Bootstrap) =====

$(function () {
    if (!QT.batDau({ trang: "tonkho", tieuDe: "Quản lý tồn kho", vaiTro: ["admin"] })) return

    const moiTrang = 12
    const NGUONG_SAP_HET = 5          // tồn từ 1 đến 5 là "Sắp hết"
    let trang = 1
    let dangChon = null               // {idSP, idBT} của dòng đang điều chỉnh / xem lịch sử
    const modalDC = new bootstrap.Modal("#modalDC")
    const modalLS = new bootstrap.Modal("#modalLS")

    $("#tkLocDM").html('<option value="">Tất cả danh mục</option>' + QT.optionLoai(""))

    function tinhTrang(ton) {
        if (ton === 0) return "Hết hàng"
        return ton <= NGUONG_SAP_HET ? "Sắp hết" : "Còn hàng"
    }
    function nhan(tt) {
        return '<span class="tt ' + { "Còn hàng": "tt-5", "Sắp hết": "tt-3", "Hết hàng": "tt-2" }[tt] + '">' + tt + "</span>"
    }

    // ---------- 1. Danh sách biến thể (UCQLTK01) ----------
    function danhSachLoc() {
        const tuKhoa = $("#tkTim").val().trim().toLowerCase()
        const dm = $("#tkLocDM").val()
        const tt = $("#tkLocTT").val()
        const kq = []
        QT.get("products", []).forEach(function (sp) {
            sp.bienThe.forEach(function (bt) {
                if (tuKhoa && sp.ten.toLowerCase().indexOf(tuKhoa) === -1 && bt.sku.toLowerCase().indexOf(tuKhoa) === -1 && sp.sku.toLowerCase().indexOf(tuKhoa) === -1) return
                if (dm && sp.loaiId !== dm) return
                if (tt && tinhTrang(bt.tonKho) !== tt) return
                kq.push({ sp: sp, bt: bt })
            })
        })
        return kq
    }
    function ve() {
        const ds = danhSachLoc()
        const tongTrang = Math.max(1, Math.ceil(ds.length / moiTrang))
        if (trang > tongTrang) trang = tongTrang
        const batDau = (trang - 1) * moiTrang
        if (ds.length === 0) {
            $("#tkBang").html('<tr><td colspan="7" class="text-center text-secondary py-4">Không có dữ liệu tồn kho</td></tr>')       // 4a
        } else {
            let h = ""
            $.each(ds.slice(batDau, batDau + moiTrang), function (i, x) {
                h += `<tr>
                    <td>${QT.html(x.sp.ten)}</td><td class="d-none d-md-table-cell">${QT.html(x.bt.sku)}</td><td class="d-none d-sm-table-cell">${QT.html(x.bt.mau)}</td><td>${QT.html(x.bt.size)}</td>
                    <td class="text-end fw-semibold">${x.bt.tonKho}</td><td>${nhan(tinhTrang(x.bt.tonKho))}</td>
                    <td class="text-end text-nowrap">
                        <button class="btn btn-sm btn-outline-primary" data-act="dc" data-sp="${QT.html(x.sp.id)}" data-bt="${x.bt.id}"><i class="fa-solid fa-sliders"></i> Điều chỉnh</button>
                        <button class="btn btn-sm btn-outline-secondary" data-act="ls" data-sp="${QT.html(x.sp.id)}" data-bt="${x.bt.id}" title="Lịch sử"><i class="fa-solid fa-clock-rotate-left"></i></button>
                    </td></tr>`
            })
            $("#tkBang").html(h)
        }
        $("#tkTong").text("Tổng " + ds.length + " biến thể")
        $("#tkTrang").html(QT.phanTrangHtml(tongTrang, trang))
    }
    $("#tkTim").on("input", function () { trang = 1; ve() })
    $("#tkLocDM, #tkLocTT").on("change", function () { trang = 1; ve() })
    $("#tkTrang").on("click", "[data-trang]", function (e) {
        e.preventDefault()
        trang = Number($(this).attr("data-trang"))
        ve()
    })

    function layBT() {
        const ds = QT.get("products", [])
        const sp = ds.find(function (s) { return s.id === dangChon.idSP })
        return { ds: ds, sp: sp, bt: sp.bienThe.find(function (b) { return b.id === dangChon.idBT }) }
    }
    $("#tkBang").on("click", "[data-act]", function () {
        dangChon = { idSP: $(this).attr("data-sp"), idBT: $(this).attr("data-bt") }
        if ($(this).attr("data-act") === "dc") moDieuChinh()
        else moLichSu()
    })

    // ---------- 2. Điều chỉnh (UCQLTK02) ----------
    function moDieuChinh() {
        const x = layBT()
        $("#dcThongTin").html("<strong>" + QT.html(x.sp.ten) + "</strong><br>" + QT.html(x.bt.mau) + " / " + QT.html(x.bt.size) + " - SKU " + QT.html(x.bt.sku) + "<br>Tồn hiện tại: <strong>" + x.bt.tonKho + "</strong>")
        $("#dcSL").val("").removeClass("is-invalid")
        $("#dcSau").text("")
        $("#dcLyDo").val("Nhập hàng")
        $("#dcLoi").text("")
        modalDC.show()
    }
    $("#dcSL").on("input", function () {          // hiện trước số tồn sau khi điều chỉnh
        const x = layBT(), n = Number($(this).val())
        $("#dcSau").text($(this).val() === "" || isNaN(n) ? "" : "Tồn sau điều chỉnh: " + (x.bt.tonKho + n))
    })
    $("#dcLuu").on("click", function () {
        const x = layBT()
        const n = Number($("#dcSL").val())
        let loi = ""
        if ($("#dcSL").val() === "" || !Number.isInteger(n) || n === 0) loi = "Số lượng điều chỉnh phải là số nguyên khác 0."
        else if (x.bt.tonKho + n < 0) loi = "Số lượng tồn sau điều chỉnh không được âm."          // 5a
        if (loi) { $("#dcLoi").text(loi); $("#dcSL").addClass("is-invalid"); return }

        const truoc = x.bt.tonKho
        x.bt.tonKho = truoc + n
        QT.set("products", x.ds)
        const log = QT.get("inventoryLog", [])
        log.push({ id: "LS" + Date.now(), idSP: x.sp.id, idBT: x.bt.id, tenSP: x.sp.ten, sku: x.bt.sku, tonTruoc: truoc, soLuongDoi: n, tonSau: x.bt.tonKho,
            lyDo: $("#dcLyDo").val(), nguoi: QT.nguoi().hoTen, thoiGian: new Date().toISOString() })
        QT.set("inventoryLog", log)
        modalDC.hide()
        QT.thongBao("Điều chỉnh tồn kho thành công")
        ve()
    })

    // ---------- 3. Lịch sử điều chỉnh (UCQLTK03) ----------
    function veLichSu() {
        const x = layBT()
        let ds = QT.get("inventoryLog", []).filter(function (l) { return l.idBT === x.bt.id })
        if (ds.length === 0) { $("#lsBang").html('<p class="text-secondary">Chưa có lịch sử điều chỉnh.</p>'); return }       // 2a
        const tu = $("#lsTu").val(), den = $("#lsDen").val(), nguoi = $("#lsNguoi").val()
        ds = ds.filter(function (l) {
            const ngay = l.thoiGian.slice(0, 10)
            return (!tu || ngay >= tu) && (!den || ngay <= den) && (!nguoi || l.nguoi === nguoi)
        }).sort(function (a, b) { return new Date(b.thoiGian) - new Date(a.thoiGian) })       // mới nhất trước
        if (ds.length === 0) { $("#lsBang").html('<p class="text-secondary">Không có điều chỉnh nào trong khoảng đã chọn.</p>'); return }
        let h = '<table class="table table-sm"><thead><tr><th>Thời gian</th><th class="text-end">Điều chỉnh</th><th class="text-end">Tồn sau</th><th>Lý do</th><th>Người thực hiện</th></tr></thead><tbody>'
        $.each(ds, function (i, l) {
            h += "<tr><td>" + QT.ngayGio(l.thoiGian) + '</td><td class="text-end">' + (l.soLuongDoi > 0 ? "+" : "") + l.soLuongDoi + '</td><td class="text-end">' + l.tonSau + "</td><td>" + QT.html(l.lyDo) + "</td><td>" + QT.html(l.nguoi) + "</td></tr>"
        })
        $("#lsBang").html(h + "</tbody></table>")
    }
    function moLichSu() {
        const x = layBT()
        $("#lsThongTin").text(x.sp.ten + " - " + x.bt.mau + " / " + x.bt.size + " (" + x.bt.sku + ")")
        $("#lsTu, #lsDen").val("")
        const nguoi = []
        QT.get("inventoryLog", []).filter(function (l) { return l.idBT === x.bt.id }).forEach(function (l) { if (nguoi.indexOf(l.nguoi) === -1) nguoi.push(l.nguoi) })
        $("#lsNguoi").html('<option value="">Tất cả</option>' + nguoi.map(function (n) { return "<option>" + QT.html(n) + "</option>" }).join(""))
        veLichSu()
        modalLS.show()
    }
    $("#lsTu, #lsDen, #lsNguoi").on("change", veLichSu)

    ve()
})
