
// cho trang quản lý khách hàng

const modal = document.getElementById('customerModal');
const modalTitle = document.getElementById('modalTitle');
function moMenu(id = "", name = "", email = "", phone = "", address = "") {
    document.getElementById('customerId').value = id;
    document.getElementById('customerName').value = name;
    document.getElementById('customerEmail').value = email;
    document.getElementById('customerPhone').value = phone;
    document.getElementById('customerAddress').value = address;
    modalTitle.textContent = id ? "Cập nhật khách hàng" : "Thêm khách hàng";
    modal.style.display = 'block';
}

function dongMenu() {
    modal.style.display = 'none';
}

const CUSTOMER_KEY = 'dsachkhachhang';

function luuKhachHang() {
    const id = document.getElementById('customerId').value;
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;

    if (!id || !name || !phone) {
        alert("Vui lòng nhập đầy đủ Mã, Tên và SĐT");
        return;
    }

    const customer = { id, name, email, phone, address };
    let list = layTuLocal(CUSTOMER_KEY);

    const tontai = list.findIndex(c => c.id === id);
    if (tontai !== -1) list[tontai] = customer;
    else list.push(customer);

    luuVaoLocal(CUSTOMER_KEY, list);
    dongMenu();
    taidsachkhachhang();
}

function xoaKhachHang(id) {
    if (confirm("Bạn có chắc muốn xóa khách hàng này?")) {
        xoaKhoiLocal(CUSTOMER_KEY, id);
        taidsachkhachhang();
    }
}

function taidsachkhachhang() {
    const customers = layTuLocal(CUSTOMER_KEY);
    hienThiDanhSach(customers, 'customer-table', (c, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td data-label="STT">${i + 1}</td>
      <td data-label="Mã KH">${c.id}</td>
      <td data-label="Tên khách hàng">${c.name}</td>
      <td data-label="Email">${c.email}</td>
      <td data-label="Số điện thoại">${c.phone}</td>
      <td data-label="Địa chỉ">${c.address}</td>
      <td data-label="Thao tác">
        <button class="btn btn-edit" onclick="moMenu('${c.id}', '${c.name}', '${c.email}', '${c.phone}', '${c.address}')"><i class="fas fa-pen"></i></button>
        <button class="btn btn-delete" onclick="xoaKhachHang('${c.id}')"><i class="fas fa-trash"></i></button>
      </td>`;
        return row;
    });
}

window.onload = taidsachkhachhang;
