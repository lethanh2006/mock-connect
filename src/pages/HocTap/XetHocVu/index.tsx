import SinhVienCanhBaoTable from './table';
import { Card, Row, Col } from 'antd';

const XetHocVuPage = () => {
	return (
		<Card>
			<Row gutter={[12, 24]}>
				<Col span={24}>
					<div className='fw500'>Lịch sử cảnh báo học tập </div>
					<SinhVienCanhBaoTable />
				</Col>
				<Col span={24}>
					<div className='fw500'>Lịch sử cảnh báo thôi học </div>
					<SinhVienCanhBaoTable isThoiHoc />
				</Col>
			</Row>
		</Card>
	);
};

export default XetHocVuPage;
