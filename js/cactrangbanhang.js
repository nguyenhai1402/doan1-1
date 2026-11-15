// ===== cactrangbanhang.js - Sắp xếp và phân trang ở trang danh mục (sanphamchonam, sanphamchonu) - jQuery =====

const soSPMoiTrang = 12
let trangHienTai = 1

const $danhSach = $(".product-boy-girl .product-container")
let cacThe = $danhSach.children(".product-item").get()      // mảng các thẻ sản phẩm
const thuTuGoc = cacThe.slice()                            // nhớ thứ tự ban đầu ("Mới nhất")

// Giá của một thẻ sản phẩm
function giaCuaThe(the) {
    return JH.toNum($(the).find(".item-bottom-last p").first().text())
}

// Vẽ các thẻ của trang hiện tại
function veTrang() {
    $(cacThe).detach()                  // gỡ tất cả thẻ ra (dùng detach để không mất sự kiện trái tim)
    const batDau = (trangHienTai - 1) * soSPMoiTrang
    $danhSach.append(cacThe.slice(batDau, batDau + soSPMoiTrang))
    veSoTrang()
}

// Vẽ các số trang ở thanh phân trang
function veSoTrang() {
    const tongTrang = Math.ceil(cacThe.length / soSPMoiTrang)
    let html = ""
    for (let i = 1; i <= tongTrang; i++) {
        html += '<p class="trang' + (i === trangHienTai ? " active" : "") + '" data-trang="' + i + '">' + i + "</p>"
    }
    $(".product-navpage p").remove()
    $(".product-navpage a").first().after(html)
}

// Bấm số trang
$(".product-navpage").on("click", ".trang", function () {
    trangHienTai = Number($(this).attr("data-trang"))
    veTrang()
    $("html, body").animate({ scrollTop: 150 }, 300)
})
// Bấm mũi tên trước / sau
$(".product-navpage a").first().on("click", function (e) {
    e.preventDefault()
    if (trangHienTai > 1) { trangHienTai--; veTrang() }
})
$(".product-navpage a").last().on("click", function (e) {
    e.preventDefault()
    if (trangHienTai < Math.ceil(cacThe.length / soSPMoiTrang)) { trangHienTai++; veTrang() }
})

// Sắp xếp theo lựa chọn trong menu "Sắp xếp theo"
$(".sapxep li").on("click", function () {
    const kieu = $(this).text().trim()
    if (kieu === "Giá cao đến thấp") {
        cacThe.sort(function (a, b) { return giaCuaThe(b) - giaCuaThe(a) })
    } else if (kieu === "Giá thấp đến cao") {
        cacThe.sort(function (a, b) { return giaCuaThe(a) - giaCuaThe(b) })
    } else if (kieu === "Mới nhất") {
        cacThe = thuTuGoc.slice()
    } else if (kieu === "Cũ nhất") {
        cacThe = thuTuGoc.slice().reverse()
    }
    trangHienTai = 1
    veTrang()
    $(".sapxep p").first().html("Sắp xếp: " + kieu + ' <i class="fa fa-chevron-right"></i>')
})

veTrang()
