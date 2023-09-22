import { postThongTinMomo } from '@/services/TaiChinh/ChiTietThu';
import type { ChiTietThu } from '@/services/TaiChinh/ChiTietThu/typing';
import { EMaTrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { Button, Col, Descriptions, Modal, Radio, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import './style.less';

const HuongDanThanhToan = (props: { setVisible: any }) => {
	const { record } = useModel('taichinh.chitietthu');
	const [visibleHuongDan, setVisibleHuongDan] = useState<boolean>(false);
	const [paymentType, setPaymentType] = useState<string>();
	const [infoMomo, setInfoMomo] = useState<ChiTietThu.IResponseMomo>();
	const { setVisible } = props;
	const payable =
		record?.status === EMaTrangThaiThanhToan.CHUA_THANH_TOAN ||
		record?.status === EMaTrangThaiThanhToan.CHUA_THANH_TOAN_DU;

	useEffect(() => {
		if (!paymentType && payable) setPaymentType('atm');
	}, [record?.status]);

	const onChangeType = async (type: string) => {
		setPaymentType(type);
		if (type === 'momo' && !infoMomo && record?.identityCode)
			await postThongTinMomo({
				identityCode: record?.identityCode,
				redirectUrl: window.location.origin + window.location.pathname,
			}).then((res) => setInfoMomo(res.data?.data));
	};

	const onPaid = () => {
		if (paymentType === 'atm') setVisibleHuongDan(true);
		else if (paymentType === 'momo' && !!infoMomo?.payUrl) window.location.href = infoMomo.payUrl;
	};

	return (
		<>
			<Row gutter={[18, 18]} style={{ marginTop: 12 }}>
				<Col span={24} md={8}>
					<Radio.Group
						className='radio-thanh-toan'
						disabled={!payable}
						value={paymentType}
						onChange={(val) => onChangeType(val.target.value)}
					>
						<Radio value='atm'>
							<img src='/images/vietqr.png' alt='vietqr' />
							Thẻ nội địa
						</Radio>
						<Radio value='momo'>
							<img src='/images/momo.svg' alt='momo' />
							Ví MOMO
						</Radio>
					</Radio.Group>
				</Col>
				<Col span={24} md={16}>
					<Descriptions column={1} bordered labelStyle={{ width: '50%' }}>
						<Descriptions.Item label='Số tiền phải thu'>{inputFormat(record?.amountDue ?? 0)} VNĐ</Descriptions.Item>
						<Descriptions.Item label='Số tiền đã thu'>{inputFormat(record?.amountPaid ?? 0)} VNĐ</Descriptions.Item>
						<Descriptions.Item label='Số tiền còn lại phải thu'>
							{inputFormat(record?.amountRemaining ?? 0)} VNĐ
						</Descriptions.Item>
						<Descriptions.Item label='Số tiền hoàn trả'>{inputFormat(record?.amountRefund ?? 0)} VNĐ</Descriptions.Item>
						{paymentType === 'momo' && !!infoMomo ? (
							<>
								<Descriptions.Item
									label={`Phí người dùng (${infoMomo.userFeePercent}%, tối đa ${inputFormat(infoMomo.userFeeMax)} VNĐ)`}
								>
									{inputFormat(infoMomo.userFee ?? 0)} VNĐ
								</Descriptions.Item>
								<Descriptions.Item label='Tổng tiền thanh toán'>
									{inputFormat((record?.amountRemaining ?? 0) + infoMomo.userFee)} VNĐ
								</Descriptions.Item>
							</>
						) : null}
					</Descriptions>
				</Col>
			</Row>

			<div className='form-footer' style={{ marginTop: 18 }}>
				{payable ? (
					<Button type='primary' onClick={onPaid} disabled={!paymentType}>
						Thanh toán
					</Button>
				) : null}
				<Button onClick={() => setVisible(false)}>Đóng</Button>
			</div>

			<Modal
				visible={visibleHuongDan}
				onCancel={() => setVisibleHuongDan(false)}
				title='Hướng dẫn thanh toán'
				okButtonProps={{ hidden: true }}
				width={1000}
			>
				{!record?.metadata?.tenCoSoDaoTao?.toLocaleLowerCase()?.includes('hồ chí minh') ? (
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
										1. Thí sinh nên sử dụng thanh toán theo mã QR để thực hiện thanh toán được chính xác. Trong trường
										hợp sử dụng hình thức còn lại, thí sinh lưu ý nhập chính xác số tiền yêu cầu (không làm tròn) để hệ
										thống ghi nhận giao dịch là hợp lệ
										<br />
										2. Mã QR được khởi tạo dành riêng cho cá nhân thí sinh và chỉ sử dụng để thanh toán một lần. Vui
										lòng không sử dụng để thanh toán hộ người khác
									</b>
								</p>
							</>
						</Col>
						<Col xs={24} md={10}>
							<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
								<b>
									<u>Mã thanh toán QR liên ngân hàng:</u>
								</b>
								<img
									width='100%'
									src={`https://img.vietqr.io/image/970405-v100098${record?.identityCode}-compact2.png?amount=${record?.amountRemaining}&addInfo=${record?.customerInfo?.name}&accountName=${record?.customerInfo?.name}`}
								/>
								<i style={{ maxWidth: 215 }}>Thí sinh quét mã QR bằng Ứng dụng ngân hàng để thanh toán</i>
							</div>
						</Col>
					</Row>
				) : (
					<>
						{/* {props.type === 'nhaphoc' && ( */}
						<Row gutter={[12, 12]}>
							<Col span={24}>
								THÍ SINH CÓ THỂ SỬ DỤNG PHƯƠNG THỨC THANH TOÁN CHUYỂN KHOẢN VÀO SỐ TÀI KHOẢN NGÂN HÀNG CỦA HỌC VIỆN HOẶC
								MÃ QR
							</Col>
							<Col xs={24} md={14}>
								<b>
									<u>Hướng dẫn thanh toán:</u>
								</b>
								<>
									<p>
										1. CHUYỂN KHOẢN VÀO SỐ TÀI KHOẢN NGÂN HÀNG CỦA HỌC VIỆN:
										<br />- Tên tài khoản thụ hưởng: PHAN HIEU HOC VIEN PHU NU VIET NAM
										<br />- Số tài khoản: 123000079922
										<br />
										- Nội dung chuyển khoản: [Mã sinh viên]/[Họ tên]/[Ngành]/[Các khoản phí]/HK1.NH2023.2024
										<br />- Ví dụ: 227610014P.VoThanhTruong.CTXH.CackhoanphiHK1.NH2023.2024
									</p>
									<p>
										2. QUÉT MÃ QR:
										<br />
										Thí sinh sử dụng ứng dụng smartbanking của các ngân hàng hoặc ví điện tử và quét mã QR bên phải
									</p>
									<p>
										<b>
											Lưu ý: <br />
											1. Thí sinh nên sử dụng thanh toán theo mã QR để thực hiện thanh toán được chính xác. Trong trường
											hợp sử dụng hình thức còn lại, thí sinh lưu ý nhập chính xác số tiền yêu cầu (không làm tròn) để
											hệ thống ghi nhận giao dịch là hợp lệ
										</b>
									</p>
								</>
							</Col>
							<Col xs={24} md={10}>
								<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
									<b>
										<u>Mã thanh toán QR liên ngân hàng:</u>
									</b>
									<img
										width='100%'
										src={`https://img.vietqr.io/image/970415-123000079922-compact2.png?amount=${record?.amountRemaining}&addInfo=

									${record?.customerInfo?.name} ${record?.identityCode}&accountName=${record?.customerInfo?.name}`}
									/>
									<i style={{ maxWidth: 215 }}>Thí sinh quét mã QR bằng Ứng dụng ngân hàng để thanh toán</i>
								</div>
							</Col>
						</Row>
						{/* )} */}
					</>
				)}
			</Modal>
		</>
	);
};

export default HuongDanThanhToan;
