import { getChungChiDauRa } from '@/services/DaoTao/SinhVien';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Empty, Progress, Row } from 'antd';
import { useEffect } from 'react';
import './style.less';
import { useModel } from 'umi';

const XetTotNghiepPage = () => {
	const { formSubmiting, record } = useModel('sinhvien.xettotnghiep');

	useEffect(() => {
		getChungChiDauRa();
	}, []);

	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<Card title='Điều kiện xét tốt nghiệp'>
					<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
						<Col span={24} md={8}>
							<Card className='stat-nhap-diem-tp'>
								<span className='num text-success'>3.2 / 4</span>
								<span className='text'>TBC tích lũy</span>
							</Card>
						</Col>
						<Col span={24} md={8}>
							<Card className='stat-nhap-diem-tp'>
								<Progress width={40} type='dashboard' percent={30} />
								<span className='text'>Số tín chỉ tích lũy (35/121)</span>
							</Card>
						</Col>
						<Col span={24} md={8}>
							<Card className='stat-nhap-diem-tp'>
								<span className='num text-success'>
									<CheckCircleOutlined />
								</span>
								<span className='text'>Công nợ: Đã thanh toán đủ</span>
							</Card>
						</Col>
					</Row>

					<Alert type='success' description='Bạn đã đủ điều kiện để xét tốt nghiệp !' showIcon />
				</Card>
			</Col>

			<Col span={24}>
				<Card title='Xét tốt nghiệp'>
					<Empty description='Không có đợt xét tốt nghiệp' style={{ marginBottom: 32, marginTop: 32 }} />

					<Alert
						description={
							<>
								Đợt xét tốt nghiệp <b>Đợt 1 năm 2023</b> đang diễn ra
							</>
						}
					/>
					<div>
						Bạn nằm trong danh sách xét tốt nghiệp đợt này.
						<br />
						Kết quả rà soát sơ bộ: <b>Không đủ điều kiện</b>
						<br />
						Lý do: Điểm trung bình nhỏ hơn mức tối thiểu.
					</div>

					<div className='form-footer'>
						<Button loading={formSubmiting}>Đăng ký xét tốt nghiệp</Button>
						<Button loading={formSubmiting}>Gửi phản hồi</Button>
						<Button loading={formSubmiting}>Yêu cầu hoãn tốt nghiệp</Button>
					</div>
				</Card>
			</Col>
		</Row>
	);
};

export default XetTotNghiepPage;
