import { ESettingKey, unitName } from '@/services/base/constant';
import { ELoaiHinhThucThanhToan } from '@/services/TaiChinh/HinhThucThanhToan/constant';
import { ipTaiChinh } from '@/utils/ip';
import { removeVietnameseTones } from '@/utils/utils';
import { Col, Empty, Modal, Row, Space } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ModalThanhToanNganHang = (props: { visible: boolean; onOk: () => void }) => {
	const { visible, onOk } = props;
	const { record } = useModel('taichinh.giaodich');
	const { record: recDotThu, getByIdModel: getDotThu } = useModel('taichinh.dotthu');
	const { getByKeyModel, settings } = useModel('tienich.caidat');
	const { getAllModel: getHinhThuc, defaultHinhThuc } = useModel('taichinh.hinhthucthanhtoan');
	const { initialState } = useModel('@@initialState');
	// thông tin người nộp tiền
	const userFullname =
		record?.userFullname ??
		(initialState?.currentUser?.family_name
			? `${initialState.currentUser.family_name} ${initialState.currentUser?.given_name ?? ''}`
			: initialState?.currentUser?.name);
	const userCode = record?.userCode ?? initialState?.currentUser?.preferred_username ?? '';
	/** Nội dung chuyển khoản */
	const addInfo = removeVietnameseTones(
		`${userCode ?? ''} ${userFullname ?? ''} ${record?.name ?? 'Nộp tiền'}`,
	).toUpperCase();

	// Thông tin thanh toán từ cài đặt
	const { tienToTaiKhoan, maNganHang, urlHuongDanThanhToan } = settings[ESettingKey.THONG_TIN_THANH_TOAN] ?? {};
	/** Hình thức thanh toán cuối cùng, theo thứ tự ưu tiên: Kênh từ Đợt thu => Kênh mặc định => Thông tin ở Setting */
	const hinhThucFinal = recDotThu?.kenhThanhToan ??
		defaultHinhThuc ?? {
			loaiKenhThanhToan: ELoaiHinhThucThanhToan.DONG,
			maNganHangVNPay: maNganHang,
			tienToSTK: tienToTaiKhoan,
			huongDanThanhToan: urlHuongDanThanhToan,
		};
	/** Tên ngân hàng: Lấy từ Hình thức hoặc Tên trường */
	const unitInfo = removeVietnameseTones(hinhThucFinal.tenNganHang ?? unitName).toUpperCase();

	// Define the start and end times
	const start = moment('23:00', 'HH:mm'); // Từ 23h đến
	const end = moment('00:00', 'HH:mm').add(1, 'day'); // 0h ngày hôm sau
	const start1 = moment('00:00', 'HH:mm'); // Hoặc từ 0h đến
	const end1 = moment('01:00', 'HH:mm'); // 1h hôm nay
	const nganHangBaoTri = moment().isBetween(start, end) || moment().isBetween(start1, end1);

	useEffect(() => {
		getByKeyModel(ESettingKey.THONG_TIN_THANH_TOAN, ipTaiChinh)
			.then()
			.catch((er) => console.log(er));

		// Chỉ get 1 lần
		if (!defaultHinhThuc) getHinhThuc();
	}, []);

	useEffect(() => {
		if (record?.idDotThu) getDotThu(record.idDotThu);
	}, [record?.idDotThu]);

	const renderLopThuong = () => (
		<Row gutter={[12, 12]}>
			<Col span={24}>SINH VIÊN CÓ THỂ SỬ DỤNG PHƯƠNG THỨC THANH TOÁN QUA MÃ ĐỊNH DANH HOẶC MÃ QR</Col>

			<Col span={24} md={{ span: 10, push: 14 }}>
				<Space direction='vertical' style={{ alignItems: 'center' }}>
					<b>
						<u>Mã thanh toán QR liên ngân hàng:</u>
					</b>
					{hinhThucFinal.loaiKenhThanhToan === ELoaiHinhThucThanhToan.CO_DINH &&
					hinhThucFinal.maNganHangVNPay &&
					hinhThucFinal.soTaiKhoanThanhToanCoDinh ? (
						<img
							style={{ maxWidth: '100%' }}
							src={`https://img.vietqr.io/image/${hinhThucFinal.maNganHangVNPay}-${hinhThucFinal.soTaiKhoanThanhToanCoDinh}-compact2.png?amount=${record?.amount}&addInfo=${addInfo}&accountName=${unitInfo}`}
						/>
					) : hinhThucFinal.maNganHangVNPay && hinhThucFinal.tienToSTK ? (
						<img
							style={{ maxWidth: '100%' }}
							src={`https://img.vietqr.io/image/${hinhThucFinal.maNganHangVNPay}-${hinhThucFinal.tienToSTK}${record?.identityCode}-compact2.png?amount=${record?.amount}&addInfo=${addInfo}&accountName=${unitInfo}`}
						/>
					) : null}
					<i>Sinh viên quét mã QR bằng Ứng dụng ngân hàng để thanh toán</i>
				</Space>
			</Col>

			<Col span={24} md={{ span: 14, pull: 10 }}>
				<b>
					<u>Hướng dẫn thanh toán:</u>
				</b>
				<p>
					1. QUÉT MÃ QR:
					<br />
					Sinh viên sử dụng ứng dụng smartbanking của các ngân hàng hoặc ví điện tử và quét mã QR bên phải
				</p>
				<p>
					2. SỬ DỤNG ỨNG DỤNG SMARTBANKING CỦA NGÂN HÀNG HOẶC QUẦY GIAO DỊCH:
					<br />
					{urlHuongDanThanhToan ? (
						<>
							Sinh viên thực hiện thanh toán theo hướng dẫn chi tiết{' '}
							<a target='_blank' href={urlHuongDanThanhToan} rel='noreferrer'>
								tại đây
							</a>
							<br />
						</>
					) : null}
					{hinhThucFinal.loaiKenhThanhToan === ELoaiHinhThucThanhToan.CO_DINH ? (
						<>
							- Ngân hàng: {hinhThucFinal.maNganHang}
							<br />- Tên tài khoản thụ hưởng: {unitInfo}
							<br />- Số tài khoản: <b>{hinhThucFinal.soTaiKhoanThanhToanCoDinh}</b>
							<br />
							- Nội dung chuyển khoản: [Mã sinh viên] [Họ tên] [Nội dung]
							<br />- Ví dụ: <i>23123456P NGUYEN VAN A HocphiHK2NH20232024</i>
						</>
					) : (
						<>
							Mã thanh toán của sinh viên là: <b>{record?.identityCode}</b> <br />
							Số tài khoản với sinh viên chuyển khoản 24/7:{' '}
							<b>
								{hinhThucFinal.tienToSTK}
								{record?.identityCode}
							</b>
						</>
					)}
				</p>

				<p>
					<b>
						Lưu ý: <br />
						1. Sinh viên nên sử dụng thanh toán theo mã QR để thực hiện thanh toán được chính xác. Trong trường hợp sử
						dụng hình thức còn lại, sinh viên lưu ý nhập chính xác số tiền yêu cầu (không làm tròn) để hệ thống ghi nhận
						giao dịch là hợp lệ.
						<br />
						2. Sau khi thanh toán thành công, sinh viên vui lòng đợi để hệ thống xác nhận thông tin thanh toán từ ngân
						hàng.
						{hinhThucFinal.loaiKenhThanhToan === ELoaiHinhThucThanhToan.DONG ? (
							<>
								<br />
								3. Mã QR được khởi tạo dành riêng cho cá nhân sinh viên và chỉ sử dụng để thanh toán một lần. Vui lòng
								không sử dụng để thanh toán hộ người khác.
							</>
						) : null}
					</b>
				</p>
			</Col>
		</Row>
	);

	if (!record?._id) return <></>;
	return (
		<Modal
			visible={visible}
			onCancel={() => onOk()}
			title='Hướng dẫn thanh toán không tiền mặt'
			okButtonProps={{ hidden: true }}
			width={1000}
		>
			{nganHangBaoTri ? (
				<Empty description='Hệ thống đang sao lưu dữ liệu, vui lòng thực hiện thanh toán từ 01:00 đến 23:00' />
			) : (
				renderLopThuong()
			)}
		</Modal>
	);
};

export default ModalThanhToanNganHang;
