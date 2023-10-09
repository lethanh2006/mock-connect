import { Alert, Button, Card, Col, Row, Empty } from 'antd';

const XetTotNghiepPage = () => {
	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<Card title='Điều kiện xét tốt nghiệp'>
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
						<Button>Đăng ký xét tốt nghiệp</Button>
						<Button>Gửi phản hồi</Button>
						<Button>Yêu cầu hoãn tốt nghiệp</Button>
					</div>
				</Card>
			</Col>
		</Row>
	);
};

export default XetTotNghiepPage;
