import { Col, Row } from 'antd';
import BaoLuuThoiHocTable from './table';

const BaoLuuThoiHoc = () => {
	return (
		<Row gutter={[0, 12]}>
			<Col span={24}>
				<div className='fw500'>Lịch sử bảo lưu</div>
				<BaoLuuThoiHocTable />
			</Col>
			<Col span={24}>
				<div className='fw500'>Lịch sử thôi học</div>
				<BaoLuuThoiHocTable isThoiHoc />
			</Col>
		</Row>
	);
};

export default BaoLuuThoiHoc;
