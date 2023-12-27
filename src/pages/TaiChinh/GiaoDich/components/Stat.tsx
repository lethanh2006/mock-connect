import { inputFormat } from '@/utils/utils';
import { Card, Col, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const StatGiaoDich = () => {
	const { getSoDuViSinhVienModel, soDuVi } = useModel('taichinh.giaodich');

	useEffect(() => {
		getSoDuViSinhVienModel();
	}, []);

	return (
		<Row gutter={[12, 12]} style={{ marginBottom: 18 }}>
			<Col span={24} md={12}>
				<Card className='card-stat-small'>
					<span className='num text-success'>{soDuVi?.totalIn ? `${inputFormat(soDuVi.totalIn)} VND` : '--'}</span>
					<span>Tổng tiền đã nộp</span>
				</Card>
			</Col>
			<Col span={24} md={12}>
				<Card className='card-stat-small'>
					<span className='num'>{soDuVi?.totalRemain ? `${inputFormat(soDuVi.totalRemain)} VND` : '--'}</span>
					<span>Số dư hiện tại</span>
				</Card>
			</Col>
		</Row>
	);
};

export default StatGiaoDich;
