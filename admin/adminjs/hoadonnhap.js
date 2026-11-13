const modal = document.getElementById('invoiceModal');
const modalTitle = document.getElementById('modalTitle');
const HD_KEY = 'danhsachhoadon';

function moHoaDon(ma = "", ngay = "", loai = "", sl = "", tong = "", ncc = "", ghichu = "") {
    document.getElementById('maHD').value = ma;
    document.getElementById('ngayNhap').value = ngay;
    document.getElementById('loai').value = loai;
    document.getElementById('soLuong').value = sl;
    document.getElementById('tongTien').value = tong;
    document.getElementById('nhaCC').value = ncc;
    document.getElementById('ghiChu').value = ghichu;
    modalTitle.textContent = ma ? "Cập nhật hóa đơn" : "Thêm hóa đơn";
    modal.style.display = 'block';
}

function dongHoaDon() {
    modal.style.display = 'none';
}

function luuHoaDon() {
    const ma = document.getElementById('maHD').value.trim();
    const ngay = document.getElementById('ngayNhap').value;
    const loai = document.getElementById('loai').value.trim();
    const sl = parseInt(document.getElementById('soLuong').value);
    const tong = parseInt(document.getElementById('tongTien').value);
    const ncc = document.getElementById('nhaCC').value.trim();
    const ghichu = document.getElementById('ghiChu').value.trim();

    if (!ma || !ngay || !loai || isNaN(sl) || isNaN(tong)) {
        alert("Vui lòng nhập đầy đủ thông tin hợp lệ!");
        return;
    }

    const hoadon = { ma, ngay, loai, sl, tong, ncc, ghichu };
    let list = JSON.parse(localStorage.getItem(HD_KEY)) || [];
    const i = list.findIndex(h => h.ma === ma);
    if (i !== -1) list[i] = hoadon;
    else list.push(hoadon);

    localStorage.setItem(HD_KEY, JSON.stringify(list));
    dongHoaDon();
    hienThiHoaDon();
}

function xoaHoaDon(ma) {
    if (confirm("Bạn có chắc muốn xóa hóa đơn này?")) {
        let list = JSON.parse(localStorage.getItem(HD_KEY)) || [];
        list = list.filter(h => h.ma !== ma);
        localStorage.setItem(HD_KEY, JSON.stringify(list));
        hienThiHoaDon();
    }
}

function hienThiHoaDon() {
    const list = JSON.parse(localStorage.getItem(HD_KEY)) || [];
    const table = document.getElementById('invoice-table');
    table.innerHTML = "";

    list.forEach((h, i) => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td data-label="Mã">${h.ma}</td>
      <td data-label="Thời gian nhập">${h.ngay}</td>
      <td data-label="Loại">${h.loai}</td>
      <td data-label="Số lượng">${h.sl}</td>
      <td data-label="Tổng tiền">${h.tong.toLocaleString("vi-VN")}đ</td>
      <td data-label="Nhà cung cấp">${h.ncc}</td>
      <td data-label="Ghi chú">${h.ghichu}</td>
      <td data-label="Thao tác">
        <button class="btn btn-edit" onclick="moHoaDon('${h.ma}','${h.ngay}','${h.loai}','${h.sl}','${h.tong}','${h.ncc}','${h.ghichu}')"><i class="fas fa-pen"></i></button>
        <button class="btn btn-delete" onclick="xoaHoaDon('${h.ma}')"><i class="fas fa-trash"></i></button>
      </td>`;
        table.appendChild(row);
    });
}

window.onload = hienThiHoaDon;
