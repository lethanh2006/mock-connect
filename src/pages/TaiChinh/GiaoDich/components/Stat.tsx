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
		<Row gutter={[8, 8]} style={{ marginBottom: 18 }}>
			<Col span={24} md={12}>
				<Card className='card-stat-small'>
					<span className='num text-success'>{`${inputFormat(soDuVi?.totalIn ?? 0)} VND`}</span>
					<span>Tổng tiền đã nộp</span>
				</Card>
			</Col>
			<Col span={24} md={12}>
				<Card className='card-stat-small'>
					<span className='num'>{`${inputFormat(soDuVi?.totalRemain ?? 0)} VND`}</span>
					<span>Số dư hiện tại</span>
				</Card>
			</Col>
		</Row>
	);
};

export default StatGiaoDich;
