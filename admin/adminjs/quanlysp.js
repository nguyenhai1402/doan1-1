
const modal = document.getElementById('productModal');
const modalTitle = document.getElementById('modalTitle');

function moMenu(id = "", name = "", price = "", color = "", size = "", gender = "") {
    document.getElementById('productId').value = id;
    document.getElementById('productName').value = name;
    document.getElementById('productPrice').value = price;
    document.getElementById('productColor').value = color;
    document.getElementById('productSize').value = size;
    document.getElementById('productGender').value = gender;
    modalTitle.textContent = id ? "Cập nhật sản phẩm" : "Thêm sản phẩm";//nếu mã sp trùng thì cho phép cập nhật
    modal.style.display = 'block';
}

function dongMenu() {
    modal.style.display = 'none';
}

const KHOA_SP = 'dsSanPham';

function luuSanPham() {
    const ma = document.getElementById('productId').value;
    const ten = document.getElementById('productName').value;
    const gia = document.getElementById('productPrice').value;
    const mau = document.getElementById('productColor').value;
    const size = document.getElementById('productSize').value;
    const gioiTinh = document.getElementById('productGender').value;

    if (!ma || !ten || !gia) {
        alert("Vui lòng nhập đầy đủ Mã SP, Tên, Giá.");
        return;
    }

    const sanPham = { id: ma, ten, gia, mau, size, gioiTinh };
    let danhSach = layTuLocal(KHOA_SP);

    const viTri = danhSach.findIndex(sp => sp.id === ma);
    if (viTri !== -1) danhSach[viTri] = sanPham;
    else danhSach.push(sanPham);

    luuVaoLocal(KHOA_SP, danhSach);
    dongMenu();
    taiSanPham();
}

function xoaSanPham(ma) {
    if (confirm("Bạn có chắc chắn muốn xóa?")) {
        xoaKhoiLocal(KHOA_SP, ma);
        taiSanPham();
    }
}

function taiSanPham() {
    const danhSach = layTuLocal(KHOA_SP);
    hienThiDanhSach(danhSach, 'product-table', (sp, i) => {
        const dong = document.createElement('tr');
        dong.innerHTML = `
      <td data-label="STT">${i + 1}</td>
      <td data-label="Mã sản phẩm">${sp.id}</td>
      <td data-label="Tên sản phẩm">${sp.ten}</td>
      <td data-label="Giá ">${parseInt(sp.gia).toLocaleString()}đ</td>
      <td data-label="Màu">${sp.mau}</td>
      <td data-label="Kích cỡ">${sp.size}</td>
      <td data-label="Giới tính">${sp.gioiTinh}</td>
      <td data-label="Thao tác">
        <button class="btn btn-edit" onclick="moMenu('${sp.id}','${sp.ten}','${sp.gia}','${sp.mau}','${sp.size}','${sp.gioiTinh}')"><i class="fas fa-pen"></i></button>
        <button class="btn btn-delete" onclick="xoaSanPham('${sp.id}')"><i class="fas fa-trash"></i></button>
      </td>`;
        return dong;
    });
}

window.onload = taiSanPham;//mỗi khi load lại trang thì dữ liệu sẽ đọc lại đảm bảo không mất 
