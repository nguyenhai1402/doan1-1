

window.addEventListener("DOMContentLoaded", function () {
    // Thông báo khi mở trang
    alert("Nhập mã duchaitrian để được giảm giá 10% tổng hàng hóa");

})

// Lấy dữ liệu sản phẩm từ localStorage

let sp//khai báo biến lấy dữ liệu sanpham từ local storage
const data = localStorage.getItem("sanpham");
if (data) {
    sp = JSON.parse(data);
    const giaSp = parseInt(sp.gia.replace(/[^0-9]/g, ""));
    const tong = giaSp * sp.soluong;
    sp.tong = tong //tổng ban đầu khi chưa giảm giá
    const html = `
                <tr class="sanpham">
                    <td>
                        <img src="${sp.anh}" alt="">
                        <div class="soluong">${sp.soluong}</div>
                    </td>
                    <td>
                        <h6 class="name">${sp.ten}</h6>
                        <span class="color">${sp.mau}</span>
                    </td>
                    <td class="price-root">${giaSp.toLocaleString("vi-VN")}đ</td>
                </tr>
            `;

    const table = document.querySelector(".product-buy");
    const discountRow = document.querySelector(".product-buy .discount");
    if (discountRow) {
        discountRow.insertAdjacentHTML("beforebegin", html);//chèn sản phẩm mới vào trước div giảm giá
    }

    // Hiển thị tổng tiền ban đầu
    const priceTotal = document.querySelector(".price-total");
    priceTotal.innerText = tong.toLocaleString("vi-VN");

    // Gắn sự kiện cho nút sử dụng giảm giá
    const nutGiamGia = document.querySelector(".dcuse");
    let daGiamGia
    nutGiamGia.addEventListener("click", function (e) {
        e.preventDefault();//Giữ trang k bị load mất thông tin, để áp dụng mã giảm giá thành coong
        const ma = document.getElementById("discount").value.trim().toLowerCase();
        if (ma === "duchaitrian") {
            const giam = Math.round(tong * 0.9);
            daGiamGia = true
            priceTotal.innerText = giam.toLocaleString("vi-VN");
            sp.tong = giam
            alert("Áp dụng mã giảm giá thành công! Tổng giảm 10%");
        }
        else {
            if (daGiamGia) {
                // Nếu đã giảm mà giờ mã sai thì sẽ khôi phục giá gốc
                priceTotal.innerText = tong.toLocaleString("vi-VN");
                sp.tong = tong
                daGiamGia = false;
            }
            alert("Mã giảm giá bạn nhập vào không hợp lệ");
        }
    });
};



//Kiểm tra sự hợp lệ khi nhập dữ liệu

document.getElementById("submit-btn").addEventListener("click", function (e) {
    e.preventDefault();

    let isValid = true;

    const name = document.getElementById("full-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("diachi").value.trim();
    const payment = document.getElementById("payment-method")

    // Xóa thông báo lỗi cũ
    document.getElementById("error-fullname").innerText = "";
    document.getElementById("error-email").innerText = "";
    document.getElementById("error-phone").innerText = "";
    document.getElementById("error-address").innerText = "";
    document.getElementById("error-payment").innerText = "";

    // Regex kiểm tra
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^0\d{9}$/;

    // Tên
    if (name === "") {
        document.getElementById("error-fullname").innerText = "Vui lòng nhập họ tên.";
        isValid = false;
    }

    // Email
    if (!emailRegex.test(email)) {
        document.getElementById("error-email").innerText = "Email không đúng định dạng.";
        isValid = false;
    }

    // SĐT
    if (!phoneRegex.test(phone)) {
        document.getElementById("error-phone").innerText = "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số.";
        isValid = false;
    }

    // Địa chỉ
    if (address === "") {
        document.getElementById("error-address").innerText = "Hãy nhập địa chỉ của bạn.";
        isValid = false;
    }
    // Kiểm tra chọn phương thức thanh toán
    if (payment.value === "") {
        document.getElementById("error-payment").innerText = "Vui lòng chọn phương thức thanh toán.";
        isValid = false;
        // console.log(payment.value)
    }
    // Gửi form nếu hợp lệ
    if (isValid) {


        //gán thông tin sản phẩm đặt vào lưu trữ khác để chuyển sang trang thanh toán 
        let sanphamdat = sp
        localStorage.setItem("sanphamthanhtoan", JSON.stringify(sanphamdat))
        // console.log(sanphamdat)

        //end gán thông tin sản phẩm đặt vào lưu trữ khác để chuyển sang trang thanh toán 
        sessionStorage.setItem("full-name", name);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("phone", phone);
        sessionStorage.setItem("diachi", address);
        
        const order = {
            name,
            address,
            phone,
            email,
            items: sp, // lấy từ localStorage hoặc biến toàn cục
            createdAt: new Date().toISOString(),
            status: "Chưa xác nhận"
        };

        let orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));
        window.location.href = "hoadon.html";


    }
});
//end Kiểm tra sự hợp lệ khi nhập dữ liệu



// Khi rời trang, xóa dữ liệu
window.addEventListener("beforeunload", function () {
    localStorage.removeItem("sanpham");
});





