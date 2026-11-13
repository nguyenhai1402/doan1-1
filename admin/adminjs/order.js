window.addEventListener("DOMContentLoaded", () => {
  //lấy dữ liệu đơn hàng các khách hàng đã đtặ 
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const tbody = document.getElementById("order-table-body");

  if (orders.length === 0) {
    tbody.innerHTML = "<tr><td colspan='10'>Không có đơn hàng nào</td></tr>";
    return;
  }

  orders.forEach((order, index) => {
    const tr = document.createElement("tr");
    tr.dataset.index = index;
    tr.innerHTML = `
      <td data-label="STT">${index + 1}</td>
      <td data-label="Tên">${order.name}</td>
      <td data-label="Điện thoại">${order.phone}</td>
      <td data-label="Email">${order.email}</td>
      <td data-label="Địa chỉ">${order.address}</td>
      <td data-label="Ghi chú">${order.note || "Không có"}</td>
      <td data-label="Xem đơn hàng"><button class="btn btn-view" data-index="${index}">Xem</button></td>
      <td data-label="Trạng thái"><span class="status confirmed">${order.status}</span></td>
      <td data-label="Thao tác">
        <button class="btn btn-confirm" data-index="${index}">Xác nhận</button>
        <button class="btn btn-delete" data-index="${index}">Xóa</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Gắn sự kiện nút Xem
  document.querySelectorAll(".btn-view").forEach(btn => {
    btn.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      const order = orders[index];
      document.getElementById("sdtNguoiDat").textContent = `Số điện thoại người đặt: ${order.phone}`;
      document.getElementById("order-product-name").textContent = `Sản phẩm: ${order.items.ten}`;
      document.getElementById("order-product-qty").textContent = `Số lượng: ${order.items.soluong}`;
      document.getElementById("order-product-total").textContent = `Tổng tiền: ${order.items.tong.toLocaleString("vi-VN")} VNĐ`;
      document.getElementById("order-time").textContent = `Thời gian đặt: ${new Date(order.createdAt).toLocaleString()}`;
      document.getElementById("order-detail-popup").style.display = "block";
    });
  });

  // Gắn sự kiện nút Xác nhận
  document.querySelectorAll(".btn-confirm").forEach(btn => {
    btn.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      if (orders[index].status !== "Đã xác nhận") {
        orders[index].status = "Đã xác nhận";
        localStorage.setItem("orders", JSON.stringify(orders));
        location.reload(); // làm mới lại để cập nhật cái trạng thái vuawfd đổi
      }
    });
  });

  // Gắn sự kiện nút Xóa
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      if (confirm("Bạn có chắc chắn muốn xóa đơn này không?")) {
        orders.splice(index, 1);
        localStorage.setItem("orders", JSON.stringify(orders));
        location.reload();
      }
    });
  });
});
