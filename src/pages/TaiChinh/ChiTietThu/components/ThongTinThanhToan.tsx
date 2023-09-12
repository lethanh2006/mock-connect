import { EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { Button, Card, Col, Descriptions, Row, Tabs, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import TableDanhSachGiaoDich from './TableDanhSachGiaoDich';
import TableDanhSachKhoanThu from './TableDanhSachKhoanThu';

const ThongTinThanhToan = (props: { setVisible: any }) => {
	const { setVisible } = props;
	const { record } = useModel('taichinh.chitietthu');
	const [activeTab, setActiveTab] = useState('1');

	return (
		<Card title='Thông tin thanh toán'>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<b>Trạng thái:</b>{' '}
					{record?.status ? (
						<Tag color={EMauTrangThaiThanhToanTable?.[record.status]}>{ETrangThaiThanhToan?.[record.status] ?? ''}</Tag>
					) : (
						<i>Đang cập nhật</i>
					)}
				</Col>
				<Col span={24}>
					<b>Họ và tên người nộp:</b> {record?.customerInfo?.name ?? <i>Đang cập nhật</i>}
				</Col>
			</Row>

			<Descriptions column={1} bordered>
				<Descriptions.Item label='Số tiền phải thu'>{inputFormat(record?.amountDue ?? 0)} VNĐ</Descriptions.Item>
				<Descriptions.Item label='Số tiền đã thu'>{inputFormat(record?.amountPaid ?? 0)} VNĐ</Descriptions.Item>
				<Descriptions.Item label='Số tiền còn lại phải thu'>
					{inputFormat(record?.amountRemaining ?? 0)} VNĐ
				</Descriptions.Item>
				<Descriptions.Item label='Số tiền hoàn trả'>{inputFormat(record?.amountRefund ?? 0)} VNĐ</Descriptions.Item>
			</Descriptions>

			<Tabs activeKey={activeTab} onChange={(tab) => setActiveTab(tab)}>
				<Tabs.TabPane key={'1'} tab='Chi tiết' />
				<Tabs.TabPane key={'2'} tab='Lịch sử thanh toán' />
			</Tabs>
			{activeTab === '1' ? (
				<TableDanhSachKhoanThu value={record?.items ?? []} />
			) : (
				<TableDanhSachGiaoDich identityCode={record?.identityCode} value={record?.paidHistory ?? []} />
			)}

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
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
							<b>
								<u>Mã thanh toán QR liên ngân hàng:</u>
							</b>
							<img
								width={'270'}
								height='300'
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
										hợp sử dụng hình thức còn lại, thí sinh lưu ý nhập chính xác số tiền yêu cầu (không làm tròn) để hệ
										thống ghi nhận giao dịch là hợp lệ
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
									width={'270'}
									height='300'
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

			<div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
				<Button onClick={() => setVisible(false)}>Đóng</Button>
			</div>
		</Card>
	);
};

export default ThongTinThanhToan;
