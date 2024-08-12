const CanhBaoGiaoDich = () => {
	return (
		<div>
			<i>Lưu ý: </i>
			<br />- <b className='text-error'>KHÔNG HỦY</b> giao dịch khi đã thực hiện quét mã QR và chuyển khoản thành công.
			<br />- Sau khi chuyển khoản, hệ thống cần chờ thông tin xác nhận từ phía ngân hàng. Sinh viên vui lòng đợi đến
			khi quá trình hoàn tất.
			<br />- Số tiền nộp dư (nếu có) sẽ được hoàn lại vào <b>Số dư ví</b>, sinh viên có thể xem chi tiết trong menu
			Lịch sử giao dịch.
		</div>
	);
};

export default CanhBaoGiaoDich;
