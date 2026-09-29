import { IconShieldCheck, IconXmarkCircle } from '@/components/Icons';
import { Card, Col, Row } from 'antd';
import { useModel } from 'umi';

const DieuKienKhacSection = () => {
	const { dieuKienTotNghiep } = useModel('sinhvien.tientrinhtotnghiep');

	return (
		<Row gutter={[8, 8]} style={{ marginBottom: 18 }}>
			<Col span={24}>
				<div className='fw500'>Điều kiện khác</div>
			</Col>
			<Col span={24} md={8}>
				<Card className='card-stat-small'>
					{dieuKienTotNghiep?.noTaiChinh ? (
						<span className='num text-error'>
							<IconXmarkCircle />
						</span>
					) : (
						<span className='num text-success'>
							<IconShieldCheck />
						</span>
					)}
					<span>Công nợ: {dieuKienTotNghiep?.noTaiChinh ? 'Chưa thanh toán đủ' : 'Đã thanh toán đủ'}</span>
				</Card>
			</Col>
			<Col span={24} md={8}>
				<Card className='card-stat-small'>
					{dieuKienTotNghiep?.noThuVien ? (
						<span className='num text-error'>
							<IconXmarkCircle />
						</span>
					) : (
						<span className='num text-success'>
							<IconShieldCheck />
						</span>
					)}
					<span>Thư viện: {dieuKienTotNghiep?.noThuVien ? 'Chưa hoàn trả học liệu' : 'Đã hoàn trả học liệu'}</span>
				</Card>
			</Col>
		</Row>
	);
};

export default DieuKienKhacSection;
