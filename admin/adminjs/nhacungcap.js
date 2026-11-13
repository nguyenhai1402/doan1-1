const modal = document.getElementById("supplierModal");
const modalTitle = document.getElementById("modalTitle");

function openModal(id = "", name = "", phone = "", email = "", address = "") {
    document.getElementById("supplierId").value = id;
    document.getElementById("supplierName").value = name;
    document.getElementById("supplierPhone").value = phone;
    document.getElementById("supplierEmail").value = email;
    document.getElementById("supplierAddress").value = address;

    modalTitle.textContent = id ? "Cập nhật nhà cung cấp" : "Thêm nhà cung cấp";
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

function saveSupplier() {
    const id = document.getElementById("supplierId").value;
    const name = document.getElementById("supplierName").value;
    const phone = document.getElementById("supplierPhone").value;
    const email = document.getElementById("supplierEmail").value;
    const address = document.getElementById("supplierAddress").value;

    if (!id || !name || !phone) {
        alert("Vui lòng điền đầy đủ Mã, Tên và SĐT!");
        return;
    }

    const table = document.getElementById("supplier-table");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td data-label="STT">#</td>
        <td data-label="Mã">${id}</td>
        <td data-label="Tên NCC">${name}</td>
        <td data-label="Số điện thoại">${phone}</td>
        <td data-label="Email">${email}</td>
        <td data-label="Địa chỉ">${address}</td>
        <td data-label="Thao tác">
          <button class="btn btn-edit" onclick="openModal('${id}', '${name}', '${phone}', '${email}', '${address}')"><i class="fas fa-pen"></i></button>
          <button class="btn btn-delete"><i class="fas fa-trash"></i></button>
        </td>
      `;
    table.appendChild(row);
    closeModal();
}

// Đóng modal khi click ngoài vùng
window.onclick = function (event) {
    if (event.target === modal) {
        closeModal();
    }
};