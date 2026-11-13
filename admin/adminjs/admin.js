
// Hàm hiển thị danh sách dữ liệu ở bảng  
function hienThiDanhSach(danhSach, idBang, taoDong) {
  const bang = document.getElementById(idBang);
  bang.innerHTML = '';
  danhSach.forEach((item, i) => {
    const dong = taoDong(item, i);
    bang.appendChild(dong);
  });
}

// Lưu mảng object vào localStorage
function luuVaoLocal(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Lấy mảng object từ localStorage
function layTuLocal(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// Xóa object khỏi localStorage theo id
function xoaKhoiLocal(key, id) {
  let danhSach = layTuLocal(key);
  danhSach = danhSach.filter(obj => obj.id !== id);
  luuVaoLocal(key, danhSach);
}
