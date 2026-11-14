// ===== taotaikhoan.js - Đăng ký tài khoản (viết bằng jQuery) =====

// hiển thị và ẩn nhìn mật khẩu
$("#togglePassword").on("change", function () {
    $("#matkhau").attr("type", this.checked ? "text" : "password");
});

// end hiển thị và ẩn nhìn mật khẩu

// kiểm tra hợp lệ khi nhập thông tin đăng ký
$("#submit").on("click", function () {
    // lấy giá trị của các ô thông tin khi đã nhập
    const ho = $("#ho").val().trim();
    const ten = $("#ten").val().trim();
    const gioiTinh = $('input[name="sex"]:checked').val() || "";
    const ngaySinh = $("#date").val();
    const sdt = $("#phone").val().trim();
    const email = $("#email").val().trim();
    const matkhau = $("#matkhau").val();

    // xóa các thông báo lỗi cũ
    $(".error-message").text("");
    let hople = true;

    //dùng regex để kiểm tra tính hợp lệ không có các ký tự sai lệch
    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
    const phoneRegex = /^0\d{9}$/;
    //bắt đầu số 0 và theo sau là 9 số
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!ho || !nameRegex.test(ho)) {
        $("#error-ho").text("Họ không hợp lệ.");
        hople = false;
    }

    if (!ten || !nameRegex.test(ten)) {
        $("#error-ten").text("Tên không hợp lệ.");
        hople = false;
    }

    if (!gioiTinh) {
        $("#error-sex").text("Vui lòng chọn giới tính.");
        hople = false;
    }

    if (!ngaySinh || new Date(ngaySinh) >= new Date()) {
        $("#error-date").text("Ngày sinh không hợp lệ.");
        hople = false;
    }

    if (!phoneRegex.test(sdt)) {
        $("#error-phone").text("SĐT phải bắt đầu bằng 0 và đủ 10 số.");
        hople = false;
    }

    if (!emailRegex.test(email)) {
        $("#error-email").text("Email không hợp lệ.");
        hople = false;
    }

    if (matkhau.length < 6) {
        $("#error-password").text("Mật khẩu ít nhất 6 ký tự.");
        hople = false;
    }

    // Kiểm tra trùng email
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    if (accounts.some(function (acc) { return acc.email === email; })) {
        $("#error-email").text("Email đã tồn tại.");
        hople = false;
    }

    if (!hople) return;

    const newAccount = {
        ho: ho,
        ten: ten,
        gioiTinh: gioiTinh,
        ngaySinh: ngaySinh,
        sdt: sdt,
        email: email,
        password: matkhau,
        id: "KH" + Date.now(),          // mã khách hàng
        vaiTro: "customer",
        trangThai: "active",            // active | locked (admin khóa/mở khóa)
        ngayTao: new Date().toISOString(),
        diaChi: []                      // sổ địa chỉ: {id, hoTen, sdt, diaChi, macDinh}
    };

    accounts.push(newAccount);
    localStorage.setItem("accounts", JSON.stringify(accounts));

    alert("Đăng ký thành công!");
    window.location.href = "index.html";
});

// end kiểm tra hợp lệ khi nhập thông tin đăng ký
