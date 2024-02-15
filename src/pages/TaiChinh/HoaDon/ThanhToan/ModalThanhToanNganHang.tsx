import { EDoiTuongLopHanhChinh } from '@/services/HocTap/constant';
import { unitName } from '@/services/base/constant';
import { removeVietnameseTones } from '@/utils/utils';
import { Col, Modal, Row, Space } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ModalThanhToanNganHang = (props: { visible: boolean; onOk: () => void }) => {
	const { visible, onOk } = props;
	const { record } = useModel('taichinh.giaodich');
	const { getMeModel: getLopHc, danhSach: danhSachLopHc } = useModel('daotao.lophanhchinh');
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
	}, []);

	const renderLopThuong = () => (
		<Row gutter={[12, 12]}>
			<Col span={24}>SINH VIÊN CÓ THỂ SỬ DỤNG PHƯƠNG THỨC THANH TOÁN QUA MÃ ĐỊNH DANH HOẶC MÃ QR</Col>
			<Col xs={24} md={14}>
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
					Sinh viên thực hiện thanh toán theo hướng dẫn chi tiết tại{' '}
					<a
						target='_blank'
						href='https://xettuyen.hvpnvn.edu.vn/api/file/64d502982f7f8d0cac246178/hd_thanhtoan.pdf'
						rel='noreferrer'
					>
						đây
					</a>
					<br />
					Mã thanh toán của sinh viên là: <b>{record?.identityCode}</b> <br />
					Số tài khoản với sinh viên chuyển khoản 24/7: <b>v100098{record?.identityCode}</b>
				</p>
				<p>
					<b>
						<u>Lưu ý: </u>
					</b>
					<br />
					1. Sinh viên nên sử dụng thanh toán theo mã QR để thực hiện thanh toán được chính xác. Trong trường hợp sử
					dụng hình thức còn lại, sinh viên lưu ý nhập chính xác số tiền yêu cầu (không làm tròn) để hệ thống ghi nhận
					giao dịch là hợp lệ.
					<br />
					2. Mã QR được khởi tạo dành riêng cho cá nhân sinh viên và chỉ sử dụng để thanh toán một lần. Vui lòng không
					sử dụng để thanh toán hộ người khác.
					<br />
					3. Sau khi thao tác thành công, sinh viên vui lòng chụp lại màn hình giao dịch/biên lai (để phục vụ đối soát
					khi cần thiết) và đợi hệ thống xác nhận thông tin thanh toán từ ngân hàng.
				</p>
			</Col>

			<Col xs={24} md={10}>
				<Space direction='vertical' style={{ alignItems: 'center' }}>
					<b>
						<u>Mã thanh toán QR liên ngân hàng:</u>
					</b>
					<img
						style={{ maxWidth: '100%' }}
						src={`https://img.vietqr.io/image/970405-v100098${record?.identityCode}-compact2.png?amount=${record?.amount}&addInfo=${addInfo}&accountName=${unitInfo}`}
					/>
					<i>Sinh viên quét mã QR bằng Ứng dụng ngân hàng để thanh toán</i>
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
