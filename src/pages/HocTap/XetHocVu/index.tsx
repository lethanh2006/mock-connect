import { Col, Row } from 'antd';
import SinhVienCanhBaoTable from './table';

const XetHocVuPage = () => {
	return (
		<Row gutter={[0, 12]}>
			<Col span={24}>
				<SinhVienCanhBaoTable />
			</Col>
			<Col span={24}>
				<SinhVienCanhBaoTable isThoiHoc />
			</Col>
		</Row>
	);
};

export default XetHocVuPage;
