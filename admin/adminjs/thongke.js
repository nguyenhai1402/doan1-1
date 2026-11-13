const bieuDoDoanhThuCtx = document.getElementById('bieuDoDoanhThu').getContext('2d');
const bieuDoDoanhThu = new Chart(bieuDoDoanhThuCtx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Doanh thu (triệu)',
            data: [],
            backgroundColor: 'red',
        }]
    }
});

const bieuDoLoaiSanPhamCtx = document.getElementById('bieuDoLoaiSanPham').getContext('2d');
new Chart(bieuDoLoaiSanPhamCtx, {
    type: 'doughnut',
    data: {
        labels: ['Thời trang nam', 'Thời trang nữ'],
        datasets: [{
            data: [55, 30],
            backgroundColor: ['#36A2EB', '#FF6384'],
        }]
    }
});

const chonLoaiThoiGian = document.getElementById('chonLoaiThoiGian');
const chonGiaTriThoiGian = document.getElementById('chonGiaTriThoiGian');

function taoLuaChonThoiGian(loai) {
    chonGiaTriThoiGian.innerHTML = '';
    let luaChon = [];
    if (loai === 'tuan') {
        luaChon = Array.from({ length: 4 }, (_, i) => `Tuần ${i + 1}`);
    } else if (loai === 'thang') {
        luaChon = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
    } else if (loai === 'nam') {
        luaChon = ['2023', '2024', '2025'];
    }
    luaChon.forEach(giaTri => {
        const option = document.createElement('option');
        option.value = giaTri;
        option.textContent = giaTri;
        chonGiaTriThoiGian.appendChild(option);
    });
}

function capNhatBieuDo(loai, giaTri) {
    let nhan = [], duLieu = [];
    if (loai === 'tuan') {
        nhan = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        duLieu = [10, 12, 8, 9, 14, 15, 11];
    } else if (loai === 'thang') {
        nhan = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
        duLieu = [250, 310, 400, 500];
    } else if (loai === 'nam') {
        nhan = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        duLieu = [120, 190, 300, 500, 200, 300, 373, 378, 263, 98, 187, 679];
    }

    bieuDoDoanhThu.data.labels = nhan;
    bieuDoDoanhThu.data.datasets[0].data = duLieu;
    bieuDoDoanhThu.update();
}

chonLoaiThoiGian.addEventListener('change', () => {
    const loai = chonLoaiThoiGian.value;
    taoLuaChonThoiGian(loai);
    capNhatBieuDo(loai);
});

chonGiaTriThoiGian.addEventListener('change', () => {
    capNhatBieuDo(chonLoaiThoiGian.value, chonGiaTriThoiGian.value);
});

// Khởi tạo mặc định
taoLuaChonThoiGian('thang');
capNhatBieuDo('thang', 'Tháng 1');
