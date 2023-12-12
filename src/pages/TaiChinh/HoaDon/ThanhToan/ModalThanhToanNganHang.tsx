import { Col, Modal, Row, Space } from 'antd';
import { useModel } from 'umi';

const ModalThanhToanNganHang = (props: { visible: boolean; onOk: () => void }) => {
	const { visible, onOk } = props;
	const { record } = useModel('taichinh.giaodich');

	if (!record?._id) return <></>;
	return (
		<Modal
			visible={visible}
			onCancel={() => onOk()}
			title='Hướng dẫn thanh toán'
			okButtonProps={{ hidden: true }}
			width={1000}
		>
			<Row gutter={[12, 12]}>
				<Col span={24}>THÍ SINH CÓ THỂ SỬ DỤNG PHƯƠNG THỨC THANH TOÁN QUA MÃ ĐỊNH DANH HOẶC MÃ QR</Col>
				<Col xs={24} md={14}>
					<b>
						<u>Hướng dẫn thanh toán:</u>
					</b>
					<>
						<p>
							1. QUÉT MÃ QR:
							<br />
							Thí sinh sử dụng ứng dụng smartbanking của các ngân hàng hoặc ví điện tử và quét mã QR bên phải
						</p>
						<p>
							2. SỬ DỤNG ỨNG DỤNG SMARTBANKING CỦA NGÂN HÀNG HOẶC QUẦY GIAO DỊCH:
							<br />
							Thí sinh thực hiện thanh toán theo hướng dẫn chi tiết tại{' '}
							<a
								target='_blank'
								href='https://xettuyen.hvpnvn.edu.vn/api/file/64d502982f7f8d0cac246178/hd_thanhtoan.pdf'
								rel='noreferrer'
							>
								đây
							</a>
							<br />
							Mã thanh toán của thí sinh là: <b>{record?.identityCode}</b> <br />
							Số tài khoản với thí sinh chuyển khoản 24/7: <b>v100098{record?.identityCode}</b>
						</p>
						<p>
							<b>
								Lưu ý: <br />
								1. Thí sinh nên sử dụng thanh toán theo mã QR để thực hiện thanh toán được chính xác. Trong trường hợp
								sử dụng hình thức còn lại, thí sinh lưu ý nhập chính xác số tiền yêu cầu (không làm tròn) để hệ thống
								ghi nhận giao dịch là hợp lệ
								<br />
								2. Mã QR được khởi tạo dành riêng cho cá nhân thí sinh và chỉ sử dụng để thanh toán một lần. Vui lòng
								không sử dụng để thanh toán hộ người khác
							</b>
						</p>
					</>
				</Col>

				<Col xs={24} md={10}>
					<Space direction='vertical' style={{ alignItems: 'center' }}>
						<b>
							<u>Mã thanh toán QR liên ngân hàng:</u>
						</b>
						<img
							style={{ maxWidth: '100%' }}
							src={`https://img.vietqr.io/image/970405-v100098${record?.identityCode}-compact2.png?amount=${record?.amount}&addInfo=${record?.userFullname}&accountName=${record?.userFullname}`}
						/>
						<i>Thí sinh quét mã QR bằng Ứng dụng ngân hàng để thanh toán</i>
					</Space>
				</Col>
			</Row>
		</Modal>
	);
};

export default ModalThanhToanNganHang;
