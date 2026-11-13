

// hiển thị và ẩn nhìn mật khẩu
document.getElementById("togglePassword").addEventListener("change", function () {
    const passwordInput = document.getElementById("matkhau");
    passwordInput.type = this.checked ? "text" : "password";
});

// end hiển thị và ẩn nhìn mật khẩu

// kiểm tra hợp lệ khi nhập thoong tin đăng ký
document.getElementById("submit").addEventListener("click", function () {
    // lấy giá trị của các ô thong tin khi đã nhập
    const ho = document.getElementById("ho").value.trim();
    const ten = document.getElementById("ten").value.trim();
    const gioiTinhInput = document.querySelector('input[name="sex"]:checked');
    const ngaySinh = document.getElementById("date").value;
    const sdt = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const matkhau = document.getElementById("matkhau").value;
    //nếu Giới tính đã được chọn thì sẽ lấy giá trị của ô được chọn Đó
    const gioiTinh = gioiTinhInput ? gioiTinhInput.value : "";

    //dùng regex để kiểm tra tính hợp lệ không có các ký tự sai lệch
    document.querySelectorAll(".error-message").forEach(el => el.innerText = "");
    // Duyệt tất cả phần tử có class "error-message" và xóa nội dung trong đó.
    let hople = true;

    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
    const phoneRegex = /^0\d{9}$/;
    //bắt đầu số 0 và theo sau là 9 số
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!ho || !nameRegex.test(ho)) {
        document.getElementById("error-ho").innerText = "Họ không hợp lệ.";
        hople = false;
    }

    if (!ten || !nameRegex.test(ten)) {
        document.getElementById("error-ten").innerText = "Tên không hợp lệ.";
        hople = false;
    }

    if (!gioiTinh) {
        document.getElementById("error-sex").innerText = "Vui lòng chọn giới tính.";
        hople = false;
    }

    if (!ngaySinh || new Date(ngaySinh) >= new Date()) {
        document.getElementById("error-date").innerText = "Ngày sinh không hợp lệ.";
        hople = false;
    }

    if (!phoneRegex.test(sdt)) {
        document.getElementById("error-phone").innerText = "SĐT phải bắt đầu bằng 0 và đủ 10 số.";
        hople = false;
    }

    if (!emailRegex.test(email)) {
        document.getElementById("error-email").innerText = "Email không hợp lệ.";
        hople = false;
    }

    if (matkhau.length < 6) {
        document.getElementById("error-password").innerText = "Mật khẩu ít nhất 6 ký tự.";
        hople = false;
    }

    // Kiểm tra trùng email
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    if (accounts.some((acc) =>{
        return acc.email===email;
    } )) {
        document.getElementById("error-email").innerText = "Email đã tồn tại.";
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
        diaChi: []                      // sổ địa chỉ (làm ở giai đoạn sau)
    };

    accounts.push(newAccount);
    localStorage.setItem("accounts", JSON.stringify(accounts));

    alert("Đăng ký thành công!");
    window.location.href = "index.html";
});


// end kiểm tra hợp lệ khi nhập thoong tin đăng ký