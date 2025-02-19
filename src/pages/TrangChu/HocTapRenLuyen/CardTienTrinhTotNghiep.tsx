import { ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Row } from 'antd';
import { Link, useModel } from 'umi';

const CardTienTrinhTotNghiep = () => {
	const { record: recTienTrinh, loading } = useModel('sinhvien.tientrinhtotnghiep');

	return (
		<Card className='dashboard-stat-card' loading={loading}>
			<div className='dashboard-stat-content'>
				<div className='header'>
					<div className='title'>Điều kiện chứng chỉ</div>
					<Link to='/hoc-tap/xet-tot-nghiep/xet-tot-nghiep' title='Xem chi tiết'>
						<ArrowRightOutlined />
					</Link>
				</div>

				{recTienTrinh?.thongTinCdr?.length ? (
					<div className='description'>
						<Row gutter={[0, 4]}>
							{recTienTrinh?.thongTinCdr?.map((cdr) => (
								<Col span={24} key={cdr._id}>
									<div className='row highlight' style={{ padding: '1px 8px' }}>
										<span className='text'>{cdr.loaiChungChi?.ten ?? cdr.maLoaiChungChi}</span>
										{cdr.datChuanDauRa ? (
											<CheckCircleOutlined className='text-success' />
										) : (
											<span style={{ color: '#CCC' }}>-</span>
										)}
									</div>
								</Col>
							))}
						</Row>
					</div>
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />
				)}
			</div>
		</Card>
	);
};

export default CardTienTrinhTotNghiep;
