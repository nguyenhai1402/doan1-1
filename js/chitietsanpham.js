let allimg = document.querySelectorAll(".left-item > img") // Lấy tất cả các thẻ <img> nằm trong phần tử có class "left-item"
let imgContain = document.querySelector(".left-item") // Lấy tất cả các thẻ <img> nằm trong phần tử có class "left-item" Đây 
// là phần tử bao chứa các hình ảnh
let navBannerleft = document.querySelector(".nav > .left") // lấy nút điều hướng ảnh sang trái
let navBannerright = document.querySelector(".nav > .right") // lấy nút điều hướng ảnh sang ơhair
allimg.forEach(function (img, index) {
    img.style.left = index * 100 + "%";

})
let imgQuantity = allimg.length
let navimgindex = 0
// ấn vào nút sẽ dịch banner theo vị trí của dot tương ứng banner
navBannerleft.addEventListener("click", function () {
    navimgindex--
    if (navimgindex < 0) {
        navimgindex = imgQuantity - 1
    }
    handleImg(navimgindex)

})
navBannerright.addEventListener("click", function () {
    navimgindex++
    if (navimgindex >= imgQuantity) {
        navimgindex = 0
    }
    handleImg(navimgindex)
})
// end ấn vào nút sẽ dịch banner theo vị trí của dot tương ứng banner
function handleImg(index) {
    imgContain.style.right = index * 100 + "%"
}


// Gắn sự kiện click cho các size đã bán hết
document.querySelectorAll('.run-out').forEach(function (phantu) {
    phantu.addEventListener('click', function () {
        alert("Kích cỡ này chúng tôi đã hết. Bạn hãy liên hệ chúng tôi qua số điện thoại hoặc các trang mạng xã hội");
    });
});


// open hướng dẫn chọn size

let menusize = document.querySelector(".size-reference-container")

let opensize = document.querySelectorAll(".size-measure > img,.size-measure > p")
opensize.forEach(function (bien) {
    bien.addEventListener("click", () => {
        menusize.style.display = "block"
    })
})


//   close hướng dẫn chọn size

let closesize = document.querySelector(".size-reference .close")

closesize.addEventListener("click", () => {
    menusize.style.display = "none"
})

//end    close hướng dẫn chọn size


// mô tả và policy
let detail = document.querySelector(".nav-detail")

let policy = document.querySelector(".nav-policy")
let detailclick = document.querySelector(".nav-header > .lione")

let policyclick = document.querySelector(".nav-header > .litwo")

detailclick.addEventListener("click", () => {
    detail.style.display = "block"
    policy.style.display = "none"
    detailclick.classList.add("active")
    policyclick.classList.remove("active")
})
policyclick.addEventListener("click", () => {
    policy.style.display = "block"
    detail.style.display = "none"
    policyclick.classList.add("active")
    detailclick.classList.remove("active")
})


document.addEventListener('DOMContentLoaded', function () {
    // Lấy bảng số lượng sản phẩm
    const quantityTable = document.querySelector('.product-quantity');

    // Lấy các ô trong bảng
    const minusBtn = quantityTable.querySelector('tr > td:first-child p');
    const plusBtn = quantityTable.querySelector('tr > td:last-child p');
    const quantityDisplay = quantityTable.querySelector('tr > td:nth-child(2) p');

    // Khởi tạo số lượng ban đầu
    let quantity = 1;

    // Xử lý sự kiện khi nhấn nút giảm (-)
    minusBtn.addEventListener('click', function () {
        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
        } else {
            quantity = 1; // Đảm bảo không nhỏ hơn 1
            quantityDisplay.textContent = quantity;
        }
    });

    // Xử lý sự kiện khi nhấn nút tăng (+)
    plusBtn.addEventListener('click', function () {
        quantity++;
        quantityDisplay.textContent = quantity;
    });
});

// ===== Chọn size =====
let sizeChon = ""
document.querySelectorAll(".size > ul > li:not(.run-out)").forEach(function (li) {
    li.addEventListener("click", function () {
        document.querySelectorAll(".size > ul > li").forEach(x => x.classList.remove("selected"))
        li.classList.add("selected")
        sizeChon = li.innerText.trim()
    })
})

// Lấy thông tin sản phẩm đang xem (null nếu chưa chọn size)
function laySanPham() {
    if (!sizeChon) { JH.toast("Vui lòng chọn kích thước"); return null }
    const anh = document.querySelector(".product-detail-left .left-item img").getAttribute("src")
    return {
        id: anh,                                                   // dùng ảnh đầu làm mã nhận diện
        ten: document.querySelector(".title").innerText.trim(),
        mau: document.querySelector(".color span").innerText.trim(),
        size: sizeChon,
        gia: JH.toNum(document.querySelector(".price").innerText),
        soLuong: parseInt(document.querySelector(".product-quantity tr .quantity p").innerText.trim()),
        anh: anh,
        link: location.pathname.split("/").pop()
    }
}

// Thêm vào giỏ hàng (khách vãng lai cũng được dùng)
document.querySelector(".them-gio").addEventListener("click", function () {
    const sp = laySanPham()
    if (!sp) return
    JH.addToCart(sp)
    JH.toast("Đã thêm vào giỏ hàng")
})

// Mua ngay: bắt buộc đăng nhập, rồi chuyển sang thanh toán
document.querySelector(".mua-ngay").addEventListener("click", function () {
    const sp = laySanPham()
    if (!sp || !JH.requireLogin()) return
    sessionStorage.setItem("checkoutItems", JSON.stringify([sp]))
    window.location.href = "thanhtoan.html"
})

// Yêu thích
const nutYT = document.querySelector(".ct-wish")
if (nutYT) {
    const anhYT = document.querySelector(".product-detail-left .left-item img").getAttribute("src")
    nutYT.querySelector("i").dataset.wid = anhYT
    JH.refresh()
    nutYT.addEventListener("click", function () {
        JH.toggleWish({
            id: anhYT, ten: document.querySelector(".title").innerText.trim(),
            gia: JH.toNum(document.querySelector(".price").innerText),
            anh: anhYT, link: location.pathname.split("/").pop()
        })
    })
}
