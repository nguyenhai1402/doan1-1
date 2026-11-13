

document.addEventListener("DOMContentLoaded", function () {
    // Lấy thông tin sản phẩm từ localStorage
    const sp = JSON.parse(localStorage.getItem("sanphamthanhtoan"));
    // console.log(sp)
    if (sp) {
        const giaSp = parseInt(sp.gia.replace(/[^0-9]/g, ""));
        
        //Gán những thông tin lấy từ localstore vào các thông tin của hóa đơn
        document.getElementById("ten-sp").innerText = sp.ten;
        document.getElementById("mau-sp").innerText = sp.mau;
        document.getElementById("gia-sp").innerText = giaSp.toLocaleString("vi-VN") + "đ";
        document.getElementById("so-luong").innerText = sp.soluong;
        document.getElementById("tong-gia").innerText = sp.tong.toLocaleString("vi-VN") + "đ";
    }

    // Lấy thông tin khách hàng từ sessionStorage
    const hoten = sessionStorage.getItem("full-name");
    const email = sessionStorage.getItem("email");
    const phone = sessionStorage.getItem("phone");
    const diachi = sessionStorage.getItem("diachi");
    
    //gán thông tin khách hàng lấy từ ssstoreege vào thông tin khách hàng trong hóa đơn
    document.getElementById("ho-ten").innerText = hoten || "";
    document.getElementById("email").innerText = email || "";
    document.getElementById("sdt").innerText = phone || "";
    document.getElementById("dia-chi").innerText = diachi || "";
});
