// --- 1. DỮ LIỆU SẢN PHẨM ---
const danhSachBanh = [
    { id: 1, ten: "Bánh Bò Thốt Nốt", gia: 55000, anh: "#e6b800" },
    { id: 2, ten: "Tiramisu Cổ Điển", gia: 45000, anh: "#5c3a21" },
    { id: 3, ten: "Bánh Su Kem (Hộp 5)", gia: 30000, anh: "#fffdd0" },
    { id: 4, ten: "Bánh Mousse Đào", gia: 60000, anh: "pink" },
    { id: 5, ten: "Bánh Croissant", gia: 25000, anh: "orange" },
    { id: 6, ten: "Bánh Red Velvet", gia: 50000, anh: "red" },
    { id: 7, ten: "Bánh Macaron", gia: 70000, anh: "purple" },
    { id: 8, ten: "Bánh Donut", gia: 20000, anh: "brown" },
    { id: 9, ten: "Bánh Cupcake", gia: 35000, anh: "cyan" }
];

let gioHang = [];
let trangHienTai = 1;
const soMonMoiTrang = 3; 
let itemDeleteIndex = -1; // Biến tạm lưu món cần xóa

// --- 2. HÀM HIỂN THỊ TOAST ---
function showToast(message, type = 'success') {
    let toastBox = document.getElementById('toast-box');
    let toast = document.createElement('div');
    toast.classList.add('toast', type);
    let icon = type === 'success' ? '✅' : '❌';
    toast.innerHTML = `<div class="toast-icon">${icon}</div> <div>${message}</div>`;
    toastBox.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// --- 3. PHÂN TRANG ---
function hienThiTrang(page) {
    const tongSoTrang = Math.ceil(danhSachBanh.length / soMonMoiTrang);
    if (page < 1) page = 1;
    if (page > tongSoTrang) page = tongSoTrang;
    trangHienTai = page;
    
    const khungSanPham = document.getElementById('khung-san-pham');
    const boPhanTrang = document.getElementById('bo-phan-trang');
    khungSanPham.innerHTML = "";
    boPhanTrang.innerHTML = "";

    const batDau = (page - 1) * soMonMoiTrang;
    const ketThuc = page * soMonMoiTrang;
    const banhTrangNay = danhSachBanh.slice(batDau, ketThuc);

    banhTrangNay.forEach(banh => {
        khungSanPham.innerHTML += `
            <div class="product-card">
                <div class="image-placeholder" style="background-color: ${banh.anh};">
                    <span>${banh.ten}</span>
                </div>
                <h3>${banh.ten}</h3>
                <p>Nguyên liệu tự nhiên, thơm ngon.</p>
                <span class="price">${banh.gia.toLocaleString()}đ</span>
                <button class="btn-order" onclick="themVaoGio('${banh.ten}', ${banh.gia})">Thêm vào giỏ</button>
            </div>`;
    });

    for (let i = 1; i <= tongSoTrang; i++) {
        let activeClass = (i === trangHienTai) ? 'active' : '';
        boPhanTrang.innerHTML += `<button class="page-btn ${activeClass}" onclick="hienThiTrang(${i})">${i}</button>`;
    }
}

// --- 4. LOGIC GIỎ HÀNG ---
function themVaoGio(ten, gia) {
    let monDaCo = gioHang.find(item => item.ten === ten);
    if (monDaCo) {
        monDaCo.soLuong += 1;
        showToast("Đã tăng số lượng món!", "success");
    } else {
        gioHang.push({ ten: ten, gia: gia, soLuong: 1 });
        showToast("Đã thêm vào giỏ hàng!", "success");
    }
    capNhatGiaoDien();
}

function thayDoiSoLuong(index, thayDoi) {
    let item = gioHang[index];
    item.soLuong += thayDoi;

    if (item.soLuong < 1) {
        itemDeleteIndex = index;
        document.getElementById('modal-xac-nhan').style.display = 'block'; // Mở modal xác nhận
    } else {
        renderGioHang();
        capNhatGiaoDien();
    }
}

function xacNhanXoa() {
    if (itemDeleteIndex > -1) {
        gioHang.splice(itemDeleteIndex, 1);
        showToast("Đã xóa món khỏi giỏ!", "error");
        renderGioHang();
        capNhatGiaoDien();
    }
    document.getElementById('modal-xac-nhan').style.display = 'none';
    itemDeleteIndex = -1;
}

function huyXoa() {
    if (itemDeleteIndex > -1) {
        gioHang[itemDeleteIndex].soLuong = 1; // Hủy xóa thì trả về 1
        renderGioHang();
    }
    document.getElementById('modal-xac-nhan').style.display = 'none';
    itemDeleteIndex = -1;
}

function capNhatGiaoDien() {
    let tongSoLuong = gioHang.reduce((tong, item) => tong + item.soLuong, 0);
    document.getElementById('so-luong-gio').innerText = tongSoLuong;
}

function xemGioHang() {
    renderGioHang();
    document.getElementById('modal-gio-hang').style.display = 'block';
}

function dongGioHang() {
    document.getElementById('modal-gio-hang').style.display = 'none';
}

function renderGioHang() {
    let danhSachHTML = document.getElementById('chi-tiet-gio-hang');
    let tongTienHTML = document.getElementById('tong-tien');
    danhSachHTML.innerHTML = "";
    let tongTien = 0;

    if (gioHang.length === 0) {
        danhSachHTML.innerHTML = "<p style='text-align:center; padding:20px;'>Giỏ hàng đang trống!</p>";
    } else {
        gioHang.forEach((sanPham, index) => {
            let thanhTien = sanPham.gia * sanPham.soLuong;
            tongTien += thanhTien;
            danhSachHTML.innerHTML += `
                <div class="cart-item">
                    <div class="item-info">
                        <strong>${sanPham.ten}</strong><br>
                        <span style="font-size:0.9rem; color:#666;">${sanPham.gia.toLocaleString()}đ x ${sanPham.soLuong}</span>
                    </div>
                    <div class="quantity-controls">
                        <button class="btn-qty" onclick="thayDoiSoLuong(${index}, -1)">-</button>
                        <span class="qty-number">${sanPham.soLuong}</span>
                        <button class="btn-qty" onclick="thayDoiSoLuong(${index}, 1)">+</button>
                    </div>
                </div>`;
        });
    }
    tongTienHTML.innerText = tongTien.toLocaleString();
}

function thanhToanZalo() {
    if (gioHang.length === 0) {
        showToast("Giỏ hàng trống trơn!", "error");
        return;
    }
    let loiNhan = "Chào shop, mình muốn đặt đơn này:\n";
    let tong = 0;
    gioHang.forEach(sp => {
        let thanhTien = sp.gia * sp.soLuong;
        loiNhan += `- ${sp.ten} (SL: ${sp.soLuong}): ${thanhTien.toLocaleString()}đ\n`;
        tong += thanhTien;
    });
    loiNhan += `\nTổng cộng: ${tong.toLocaleString()}đ`;

    navigator.clipboard.writeText(loiNhan).then(() => {
        showToast("Đã copy đơn hàng!", "success");
        setTimeout(() => window.open("https://zalo.me/0909xxxxxx", "_blank"), 1000);
    });
}

// Xử lý đóng modal khi click ra ngoài
window.onclick = function(event) {
    let modalCart = document.getElementById('modal-gio-hang');
    let modalConfirm = document.getElementById('modal-xac-nhan');
    if (event.target == modalCart) modalCart.style.display = "none";
    if (event.target == modalConfirm) huyXoa(); // Click ra ngoài modal xóa coi như hủy
}

document.addEventListener("DOMContentLoaded", function() {
    hienThiTrang(1);
});
