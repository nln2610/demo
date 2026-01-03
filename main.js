// --- 1. DỮ LIỆU SẢN PHẨM (DATABASE GIẢ) ---
const danhSachBanh = [
    { id: 1, ten: "Bánh Bò Thốt Nốt", gia: 55000, anh: "#e6b800" },
    { id: 2, ten: "Tiramisu Cổ Điển", gia: 45000, anh: "#5c3a21" },
    { id: 3, ten: "Bánh Su Kem (Hộp 10)", gia: 30000, anh: "#fffdd0" },
    { id: 4, ten: "Bánh Mousse Đào", gia: 60000, anh: "pink" },
    { id: 5, ten: "Bánh Croissant", gia: 25000, anh: "orange" },
    { id: 6, ten: "Bánh Red Velvet", gia: 50000, anh: "red" },
    { id: 7, ten: "Bánh Macaron", gia: 70000, anh: "purple" },
    { id: 8, ten: "Bánh Donut", gia: 20000, anh: "brown" },
    { id: 9, ten: "Bánh Cupcake", gia: 35000, anh: "cyan" }
];

// --- 2. CẤU HÌNH PHÂN TRANG ---
let gioHang = [];
let trangHienTai = 1;
const soMonMoiTrang = 3; 

// --- 3. LOGIC HIỂN THỊ (PHÂN TRANG) ---
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

    // Vẽ sản phẩm
    banhTrangNay.forEach(banh => {
        let html = `
            <div class="product-card">
                <div class="image-placeholder" style="background-color: ${banh.anh};">
                    <span>${banh.ten}</span>
                </div>
                <h3>${banh.ten}</h3>
                <p>Nguyên liệu tự nhiên, làm mới mỗi ngày.</p>
                <span class="price">${banh.gia.toLocaleString()}đ</span>
                <button class="btn-order" onclick="themVaoGio('${banh.ten}', ${banh.gia})">Thêm vào giỏ</button>
            </div>
        `;
        khungSanPham.innerHTML += html;
    });

    // Vẽ nút phân trang
    for (let i = 1; i <= tongSoTrang; i++) {
        let activeClass = (i === trangHienTai) ? 'active' : '';
        boPhanTrang.innerHTML += `<button class="page-btn ${activeClass}" onclick="hienThiTrang(${i})">${i}</button>`;
    }
}

// --- 4. LOGIC GIỎ HÀNG ---
function themVaoGio(ten, gia) {
    gioHang.push({ ten: ten, gia: gia });
    capNhatGiaoDien();
    alert("Đã thêm " + ten + " vào giỏ!");
}

function xoaKhoiGio(index) {
    gioHang.splice(index, 1);
    renderGioHang();
    capNhatGiaoDien();
}

function capNhatGiaoDien() {
    document.getElementById('so-luong-gio').innerText = gioHang.length;
}

// --- 5. LOGIC POPUP & THANH TOÁN ---
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
        danhSachHTML.innerHTML = "<p style='text-align:center; padding:10px;'>Giỏ hàng đang trống!</p>";
    } else {
        gioHang.forEach((sanPham, index) => {
            tongTien += sanPham.gia;
            danhSachHTML.innerHTML += `
                <div class="cart-item">
                    <div>
                        <strong>${sanPham.ten}</strong><br>
                        <span>${sanPham.gia.toLocaleString()}đ</span>
                    </div>
                    <button class="btn-delete" onclick="xoaKhoiGio(${index})">Xóa</button>
                </div>
            `;
        });
    }
    tongTienHTML.innerText = tongTien.toLocaleString();
}

function thanhToanZalo() {
    if (gioHang.length === 0) {
        alert("Bạn chưa chọn món nào cả!");
        return;
    }
    let loiNhan = "Chào shop, mình muốn đặt đơn này:\n";
    let tong = 0;
    gioHang.forEach(sp => {
        loiNhan += `- ${sp.ten} (${sp.gia.toLocaleString()}đ)\n`;
        tong += sp.gia;
    });
    loiNhan += `\nTổng cộng: ${tong.toLocaleString()}đ`;

    navigator.clipboard.writeText(loiNhan).then(() => {
        alert("Đã copy đơn hàng! Bạn hãy Paste vào ô chat Zalo nhé.");
        window.open("https://zalo.me/0909xxxxxx", "_blank"); // Thay số điện thoại của bạn vào đây
    });
}

// Đóng modal khi click ra ngoài
window.onclick = function(event) {
    let modal = document.getElementById('modal-gio-hang');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Khởi chạy khi web load xong
document.addEventListener("DOMContentLoaded", function() {
    hienThiTrang(1);
});