import { ESettingKey, unitName } from '@/services/base/constant';
import { ipTaiChinh } from '@/utils/ip';
import { removeVietnameseTones } from '@/utils/utils';
import { Col, Empty, Modal, Row, Space } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ModalThanhToanNganHang = (props: { visible: boolean; onOk: () => void }) => {
	const { visible, onOk } = props;
	const { record } = useModel('taichinh.giaodich');
	const { getByKeyModel, settings } = useModel('tienich.caidat');
	const { initialState } = useModel('@@initialState');
	const userFullname =
		record?.userFullname ??
		(initialState?.currentUser?.family_name
			? `${initialState.currentUser.family_name} ${initialState.currentUser?.given_name ?? ''}`
			: initialState?.currentUser?.name);
	const userCode = record?.userCode ?? initialState?.currentUser?.preferred_username ?? '';
	const addInfo = removeVietnameseTones(
		`${userCode ?? ''} ${userFullname ?? ''} ${record?.name ?? 'Nộp tiền'}`,
	).toUpperCase();
	const unitInfo = removeVietnameseTones(unitName).toUpperCase();
	const { tienToTaiKhoan, maNganHang, urlHuongDanThanhToan } = settings[ESettingKey.THONG_TIN_THANH_TOAN] ?? {};

	// Define the start and end times
	const start = moment('23:00', 'HH:mm');
	const end = moment('01:00', 'HH:mm').add(1, 'day');
	const nganHangBaoTri = moment().isBetween(start, end);

	useEffect(() => {
		getByKeyModel(ESettingKey.THONG_TIN_THANH_TOAN, ipTaiChinh)
			.then()
			.catch((er) => console.log(er));
	}, []);

	const renderLopThuong = () => (
		<Row gutter={[12, 12]}>
			<Col span={24}>SINH VIÊN CÓ THỂ SỬ DỤNG PHƯƠNG THỨC THANH TOÁN QUA MÃ ĐỊNH DANH HOẶC MÃ QR</Col>

			<Col span={24} md={{ span: 10, push: 14 }}>
				<Space direction='vertical' style={{ alignItems: 'center' }}>
					<b>
						<u>Mã thanh toán QR liên ngân hàng:</u>
					</b>
					{maNganHang && tienToTaiKhoan ? (
						<img
							style={{ maxWidth: '100%' }}
							src={`https://img.vietqr.io/image/${maNganHang}-${tienToTaiKhoan}${record?.identityCode}-compact2.png?amount=${record?.amount}&addInfo=${addInfo}&accountName=${unitInfo}`}
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
					Mã thanh toán của sinh viên là: <b>{record?.identityCode}</b> <br />
					Số tài khoản với sinh viên chuyển khoản 24/7:{' '}
					<b>
						{tienToTaiKhoan}
						{record?.identityCode}
					</b>
				</p>
				<p>
					<b>
						Lưu ý: <br />
						1. Sinh viên nên sử dụng thanh toán theo mã QR để thực hiện thanh toán được chính xác. Trong trường hợp sử
						dụng hình thức còn lại, sinh viên lưu ý nhập chính xác số tiền yêu cầu (không làm tròn) để hệ thống ghi nhận
						giao dịch là hợp lệ.
						<br />
						2. Mã QR được khởi tạo dành riêng cho cá nhân sinh viên và chỉ sử dụng để thanh toán một lần. Vui lòng không
						sử dụng để thanh toán hộ người khác.
						<br />
						3. Sau khi thanh toán thành công, sinh viên vui lòng đợi để hệ thống xác nhận thông tin thanh toán từ ngân
						hàng.
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
			title='Hướng dẫn thanh toán'
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
