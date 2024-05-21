import { EDoiTuongLopHanhChinh } from '@/services/HocTap/constant';
import { ESettingKey, unitName } from '@/services/base/constant';
import { removeVietnameseTones } from '@/utils/utils';
import { Col, Modal, Row, Space } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ModalThanhToanNganHang = (props: { visible: boolean; onOk: () => void }) => {
	const { visible, onOk } = props;
	const { record } = useModel('taichinh.giaodich');
	const { getMeModel: getLopHc, danhSach: danhSachLopHc } = useModel('daotao.lophanhchinh');
	const { getByKeyModel, settings } = useModel('tienich.caidat');
	const { initialState } = useModel('@@initialState');
	const isPhanHieu = danhSachLopHc.some((item) => item.doiTuong === EDoiTuongLopHanhChinh.PH);
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

	useEffect(() => {
		getLopHc();
		getByKeyModel(ESettingKey.THONG_TIN_THANH_TOAN)
			.then()
			.catch((er) => console.log(er));
	}, []);

	const renderLopThuong = () => (
		<Row gutter={[12, 12]}>
			<Col span={24}>THÍ SINH CÓ THỂ SỬ DỤNG PHƯƠNG THỨC THANH TOÁN QUA MÃ ĐỊNH DANH HOẶC MÃ QR</Col>
			<Col xs={24} md={14}>
				<b>
					<u>Hướng dẫn thanh toán:</u>
				</b>
				<p>
					1. QUÉT MÃ QR:
					<br />
					Thí sinh sử dụng ứng dụng smartbanking của các ngân hàng hoặc ví điện tử và quét mã QR bên phải
				</p>
				<p>
					2. SỬ DỤNG ỨNG DỤNG SMARTBANKING CỦA NGÂN HÀNG HOẶC QUẦY GIAO DỊCH:
					<br />
					{settings[ESettingKey.THONG_TIN_THANH_TOAN].urlHuongDanThanhToan ? (
						<>
							Thí sinh thực hiện thanh toán theo hướng dẫn chi tiết{' '}
							<a
								target='_blank'
								href={settings[ESettingKey.THONG_TIN_THANH_TOAN].urlHuongDanThanhToan}
								rel='noreferrer'
							>
								tại đây
							</a>
							<br />
						</>
					) : null}
					Mã thanh toán của thí sinh là: <b>{record?.identityCode}</b> <br />
					Số tài khoản với thí sinh chuyển khoản 24/7:{' '}
					<b>
						{settings[ESettingKey.THONG_TIN_THANH_TOAN].tienToTaiKhoan}
						{record?.identityCode}
					</b>
				</p>
				<p>
					<b>
						Lưu ý: <br />
						1. Thí sinh nên sử dụng thanh toán theo mã QR để thực hiện thanh toán được chính xác. Trong trường hợp sử
						dụng hình thức còn lại, thí sinh lưu ý nhập chính xác số tiền yêu cầu (không làm tròn) để hệ thống ghi nhận
						giao dịch là hợp lệ.
						<br />
						2. Mã QR được khởi tạo dành riêng cho cá nhân thí sinh và chỉ sử dụng để thanh toán một lần. Vui lòng không
						sử dụng để thanh toán hộ người khác.
						<br />
						3. Sau khi thanh toán thành công, sinh viên vui lòng đợi để hệ thống xác nhận thông tin thanh toán từ ngân
						hàng.
					</b>
				</p>
			</Col>

			<Col xs={24} md={10}>
				<Space direction='vertical' style={{ alignItems: 'center' }}>
					<b>
						<u>Mã thanh toán QR liên ngân hàng:</u>
					</b>
					<img
						style={{ maxWidth: '100%' }}
						src={`https://img.vietqr.io/image/${settings[ESettingKey.THONG_TIN_THANH_TOAN].maNganHang}-${
							settings[ESettingKey.THONG_TIN_THANH_TOAN].tienToTaiKhoan
						}${record?.identityCode}-compact2.png?amount=${record?.amount}&addInfo=${addInfo}&accountName=${unitInfo}`}
					/>
					<i>Thí sinh quét mã QR bằng Ứng dụng ngân hàng để thanh toán</i>
				</Space>
			</Col>
		</Row>
	);

	const renderPhanHieu = () => (
		<Row gutter={[12, 12]}>
			<Col span={24}>
				SINH VIÊN CÓ THỂ SỬ DỤNG PHƯƠNG THỨC THANH TOÁN CHUYỂN KHOẢN VÀO SỐ TÀI KHOẢN NGÂN HÀNG CỦA HỌC VIỆN HOẶC MÃ QR
			</Col>
			<Col xs={24} md={14}>
				<b>
					<u>Hướng dẫn thanh toán:</u>
				</b>
				<p>
					1. CHUYỂN KHOẢN VÀO SỐ TÀI KHOẢN NGÂN HÀNG CỦA HỌC VIỆN:
					<br />- Tên tài khoản thụ hưởng: PHAN HIEU HOC VIEN PHU NU VIET NAM
					<br />- Số tài khoản: <b>123000079922</b>
					<br />
					- Nội dung chuyển khoản: [Mã sinh viên] [Họ tên] [Nội dung]
					<br />- Ví dụ: <i>23123456P NGUYEN VAN A HocphiHK2NH20232024</i>
				</p>
				<p>
					2. QUÉT MÃ QR:
					<br />
					Sinh viên sử dụng ứng dụng smartbanking của các ngân hàng hoặc ví điện tử và quét mã QR bên phải
				</p>
				<p>
					<b>
						Lưu ý: <br />
						1. Sinh viên nên sử dụng thanh toán theo mã QR để thực hiện thanh toán được chính xác. Trong trường hợp sử
						dụng hình thức còn lại, sinh viên lưu ý nhập chính xác số tiền yêu cầu (không làm tròn) để hệ thống ghi nhận
						giao dịch là hợp lệ.
						<br />
						2. Sau khi thao tác thành công, sinh viên vui lòng chụp lại màn hình giao dịch/biên lai (để phục vụ đối soát
						khi cần thiết) và đợi hệ thống xác nhận thông tin thanh toán từ ngân hàng.
					</b>
				</p>
			</Col>

			<Col xs={24} md={10}>
				<Space direction='vertical' style={{ alignItems: 'center' }}>
					<b>
						<u>Mã thanh toán QR liên ngân hàng:</u>
					</b>
					<img
						style={{ maxWidth: '100%' }}
						src={`https://img.vietqr.io/image/970415-123000079922-compact2.png?amount=${
							record?.amount
						}&addInfo=${addInfo}&accountName=${'PHAN HIEU HOC VIEN PHU NU VIET NAM'}`}
					/>
					<i>Sinh viên quét mã QR bằng Ứng dụng ngân hàng để thanh toán</i>
				</Space>
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
			{isPhanHieu ? renderPhanHieu() : renderLopThuong()}
		</Modal>
	);
};

export default ModalThanhToanNganHang;
