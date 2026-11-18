// ===== phantrang.js - Dùng chung cho yêu thích, tìm kiếm, cửa hàng: tạo thanh phân trang (jQuery) =====

// Trả về HTML thanh phân trang. Mỗi nút có thuộc tính data-trang = số trang sẽ chuyển tới.
// Chỉ hiện trang đầu, trang cuối, trang hiện tại và 1 trang hai bên (còn lại thay bằng "...") để thanh không quá dài khi có nhiều trang.
function htmlPhanTrang(tongTrang, trangHienTai) {
    if (tongTrang <= 1) return ""
    let html = '<div class="phan-trang">'
    html += '<span class="trang-mui ' + (trangHienTai === 1 ? "tat" : "") + '" data-trang="' + (trangHienTai - 1) + '">&laquo;</span>'
    let truoc = 0
    for (let i = 1; i <= tongTrang; i++) {
        if (i === 1 || i === tongTrang || Math.abs(i - trangHienTai) <= 1) {
            if (i - truoc > 1) html += '<span class="trang-cham">...</span>'
            html += '<span class="trang ' + (i === trangHienTai ? "active" : "") + '" data-trang="' + i + '">' + i + "</span>"
            truoc = i
        }
    }
    html += '<span class="trang-mui ' + (trangHienTai === tongTrang ? "tat" : "") + '" data-trang="' + (trangHienTai + 1) + '">&raquo;</span>'
    return html + "</div>"
}

// Gắn sự kiện bấm vào thanh phân trang nằm trong vùng "selector"
// (thanh phân trang được vẽ lại liên tục nên gắn sự kiện qua phần tử cha). callback nhận số trang được chọn.
function ganPhanTrang(selector, callback) {
    $(selector).on("click", ".trang, .trang-mui", function () {
        if ($(this).hasClass("tat")) return
        callback(Number($(this).attr("data-trang")))
    })
}

// Đếm số cột đang hiển thị của lưới sản phẩm (để "2 dòng mỗi trang" đúng với từng kích thước màn hình)
function laySoCot(selector) {
    const cot = getComputedStyle($(selector)[0]).gridTemplateColumns
    return cot.split(" ").length
}
