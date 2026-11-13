
// cho trang quản lý khách hàng

const modal = document.getElementById('staffModal');
const modalTitle = document.getElementById('modalTitle');
function moMenu(id = "", name = "", email = "", phone = "", address = "",chucvu = "") {
    document.getElementById('staffId').value = id;
    document.getElementById('staffName').value = name;
    document.getElementById('staffEmail').value = email;
    document.getElementById('staffPhone').value = phone;
    document.getElementById('staffAddress').value = address;
    document.getElementById('staffRole').value = chucvu
    modalTitle.textContent = id ? "Cập nhật nhân viên" : "Thêm nhân viên";
    modal.style.display = 'block';
}

function dongMenu() {
    modal.style.display = 'none';
}

const NHANVIEN_KEY = 'danhSachNhanVien';

function luuNhanVien() {
    const id = document.getElementById('staffId').value;
    const name = document.getElementById('staffName').value;
    const email = document.getElementById('staffEmail').value;
    const phone = document.getElementById('staffPhone').value;
    const address = document.getElementById('staffAddress').value;
    const chucvu=document.getElementById('staffRole').value;

    if (!id || !name || !phone) {
        alert("Vui lòng nhập đầy đủ Mã, Tên và SĐT");
        return;
    }

    const nhanvien = { id, name, email, phone, address,chucvu };
    let list = layTuLocal();

    const tontai = list.findIndex(c => c.id === id);
    if (tontai !== -1) list[tontai] = nhanvien;
    else list.push(nhanvien);

    luuVaoLocal(NHANVIEN_KEY, list);
    dongMenu();
    taiDanhSachNhanVien();
}

function xoaNhanVien(id) {
    if (confirm("Bạn có chắc muốn xóa nhân viên này?")) {
        xoaKhoiLocal(NHANVIEN_KEY, id);
        taiDanhSachNhanVien();
    }
}

function taiDanhSachNhanVien() {
    const nhanViens = layTuLocal(NHANVIEN_KEY);
    hienThiDanhSach(nhanViens, 'staff-table', (c, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td data-label="STT">${i + 1}</td>
      <td data-label="Mã nhân viên">${c.id}</td>
      <td data-label="Tên nhân viên">${c.name}</td>
      <td data-label="Email">${c.email}</td>
      <td data-label="Số điện thoại">${c.phone}</td>
      <td data-label="Địa chỉ">${c.address}</td>
      <td data-label="Chức vụ">${c.chucvu}</td>
      <td data-label="Thao tác">
        <button class="btn btn-edit" onclick="moMenu('${c.id}', '${c.name}', '${c.email}', '${c.phone}', '${c.address}')"><i class="fas fa-pen"></i></button>
        <button class="btn btn-delete" onclick="xoaNhanVien('${c.id}')"><i class="fas fa-trash"></i></button>
      </td>`;
        return row;
    });
}

window.onload = taiDanhSachNhanVien;
