# Hướng Dẫn Tích Hợp Web Trả Góp Hóa Đơn — Trang Sinh Viên (Student Portal)

Tài liệu hướng dẫn chi tiết cho Đội ngũ Frontend ghép API chức năng Đăng ký & Theo dõi Trả góp Hóa đơn dành cho Sinh viên.

---

## 1. Kiểm tra điều kiện Hóa đơn có được trả góp hay không

Khi sinh viên bấm xem chi tiết Hóa đơn hoặc bấm nút "Đăng ký trả góp", Frontend cần gọi API này để kiểm tra hóa đơn có hợp lệ để đăng ký trả góp không.

- **URL**: `GET /tra-gop/check-eligible/:billId`
- **Headers**: 
  ```http
  Authorization: Bearer <token_sinh_vien>
  ```
- **URL Parameters**:
  - `billId`: ID của hóa đơn (hoặc `identityCode` hóa đơn).

- **Response thành công (Đủ điều kiện)**:
  ```json
  {
    "eligible": true,
    "billId": "669fc7100011",
    "identityCode": "BILL2026070001",
    "maxSoLanTraGop": 3,
    "tongTien": 30000000
  }
  ```

- **Response (Không đủ điều kiện)**:
  ```json
  {
    "eligible": false,
    "reason": "Các khoản thu trong hóa đơn không cấu hình cho phép trả góp.",
    "billId": "669fc7100011",
    "identityCode": "BILL2026070001",
    "maxSoLanTraGop": 0
  }
  ```

### 💡 Quy tắc hiển thị UI (UI Guidance):
- Nếu `eligible === true`: Hiển thị nút **"Đăng ký trả góp"**. Mở modal đăng ký cho phép chọn số lần trả góp yêu cầu từ `2` đến `maxSoLanTraGop`.
- Nếu `eligible === false`: Disable nút "Đăng ký trả góp" hoặc ẩn nút và hiển thị tooltip lý do (`reason`).

---

## 2. Sinh viên gửi Đơn Đăng ký Trả góp

Khi sinh viên chọn số lần trả góp, điền lý do và đính kèm tài liệu (nếu có) rồi bấm "Xác nhận gửi".

- **URL**: `POST /tra-gop/yeu-cau`
- **Headers**:
  ```http
  Authorization: Bearer <token_sinh_vien>
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "billId": "669fc7100011",
    "soLanTraGopYeuCau": 3,
    "lyDo": "Gia đình gặp khó khăn tài chính đột xuất, xin chia làm 3 đợt đóng.",
    "taiLieuDinhKem": [
      "https://storage.vinuni.edu.vn/files/don-xac-nhan.pdf"
    ]
  }
  ```

- **Response**: Trả về thông tin yêu cầu vừa tạo:
  ```json
  {
    "_id": "669fc88800aa",
    "billId": "669fc7100011",
    "identityCode": "BILL2026070001",
    "userSsoId": "sv_12345",
    "userCode": "20010001",
    "userFullname": "Nguyễn Văn A",
    "soLanTraGopYeuCau": 3,
    "lyDo": "Gia đình gặp khó khăn tài chính...",
    "trangThaiDuyet": "PENDING",
    "createdAt": "2026-07-23T12:00:00.000Z"
  }
  ```

### 💡 Quy tắc hiển thị UI (UI Guidance):
- Trạng thái hóa đơn của sinh viên sẽ chuyển sang **"Chờ duyệt trả góp"** (`CHO_DUYET`).
- Khóa tính năng thanh toán toàn bộ hóa đơn gốc trong thời gian chờ duyệt (tránh sinh viên nộp trùng).

---

## 3. Xem Tiến độ các Phiên/Đợt Trả góp

Khi đơn trả góp đã được Chuyên viên duyệt (`isTraGop === true`), sinh viên vào xem tiến độ đóng từng đợt và hạn nộp của từng đợt.

- **URL**: `GET /tra-gop/phien-tra-gop/:billId`
- **Headers**:
  ```http
  Authorization: Bearer <token_sinh_vien>
  ```
- **Response**: Mảng danh sách các đợt trả góp đã được chuyên viên phân bổ:
  ```json
  [
    {
      "_id": "669fc9000001",
      "yeuCauTraGopId": "669fc88800aa",
      "billId": "669fc7100011",
      "lanTraGop": 1,
      "soTien": 10000000,
      "soTienDaNop": 10000000,
      "ngayHetHan": "2026-08-30T23:59:59.000Z",
      "trangThai": "PAID"
    },
    {
      "_id": "669fc9000002",
      "yeuCauTraGopId": "669fc88800aa",
      "billId": "669fc7100011",
      "lanTraGop": 2,
      "soTien": 10000000,
      "soTienDaNop": 0,
      "ngayHetHan": "2026-09-30T23:59:59.000Z",
      "trangThai": "UNPAID"
    },
    {
      "_id": "669fc9000003",
      "yeuCauTraGopId": "669fc88800aa",
      "billId": "669fc7100011",
      "lanTraGop": 3,
      "soTien": 10000000,
      "soTienDaNop": 0,
      "ngayHetHan": "2026-10-30T23:59:59.000Z",
      "trangThai": "UNPAID"
    }
  ]
  ```

---

## 4. Tra cứu Mã Trạng Thái Dữ Liệu (Enum)

| Enum Trạng Thái | Giá trị | Ý nghĩa hiển thị trên Web Sinh Viên |
| :--- | :--- | :--- |
| **TrangThaiTraGopBill** | `CHO_DUYET` | Đang chờ Chuyên viên duyệt trả góp |
| | `DANG_TRA_GOP` | Đã được duyệt trả góp (Đang trong tiến trình trả góp) |
| | `TU_CHOI` | Yêu cầu trả góp bị từ chối |
| | `DA_HOAN_THANH_TRA_GOP` | Đã hoàn thành đóng đủ tất cả các đợt |
| **TrangThaiPhienTraGop**| `UNPAID` | Chưa thanh toán |
| | `PAID` | Đã thanh toán xong đợt này |
| | `OVERDUE` | Quá hạn đóng đợt này |
