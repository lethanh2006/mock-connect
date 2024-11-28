import {
	colorTrangThaiSinhVienDangKyHocPhanNhuCau as colorTrangThaisvđkHocPhanNhuCau,
	ETrangThaisvđkHocPhanNhuCau as ETrangThaisvddkHocPhanNhuCau,
} from '@/services/HocTap/HocPhanNhuCau/constant';
import { Card, Col, Row, Spin } from 'antd';
import { useModel } from 'umi';

const CardThongKe = () => {
	const { danhSach, loading } = useModel('sinhvien.nhucauhocphan.phieudangky');

	return (
		<Spin spinning={loading}>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={12} md={8}>
					<Card className='card-stat-small'>
						<span
							className='num'
							style={{
								color: colorTrangThaisvđkHocPhanNhuCau[ETrangThaisvddkHocPhanNhuCau.CHUA_DANG_KY],
							}}
						>
							{danhSach?.filter((item) => item?.trangThai === ETrangThaisvddkHocPhanNhuCau.CHUA_DANG_KY)?.length ??
								'--'}
						</span>
						<span>SV {ETrangThaisvddkHocPhanNhuCau.CHUA_DANG_KY.toLocaleLowerCase()}</span>
					</Card>
				</Col>
				<Col span={12} md={8}>
					<Card className='card-stat-small'>
						<span
							className='num'
							style={{
								color: colorTrangThaisvđkHocPhanNhuCau[ETrangThaisvddkHocPhanNhuCau.CHUA_DUYET],
							}}
						>
							{danhSach?.filter((item) => item?.trangThai === ETrangThaisvddkHocPhanNhuCau.CHUA_DUYET)?.length ?? '--'}
						</span>
						<span>SV {ETrangThaisvddkHocPhanNhuCau.CHUA_DUYET.toLocaleLowerCase()}</span>
					</Card>
				</Col>
				<Col span={12} md={8}>
					<Card className='card-stat-small'>
						<span
							className='num'
							style={{
								color: colorTrangThaisvđkHocPhanNhuCau[ETrangThaisvddkHocPhanNhuCau.DA_DUYET],
							}}
						>
							{danhSach?.filter((item) => item?.trangThai === ETrangThaisvddkHocPhanNhuCau.DA_DUYET)?.length ?? '--'}
						</span>
						<span>SV {ETrangThaisvddkHocPhanNhuCau.DA_DUYET.toLocaleLowerCase()}</span>
					</Card>
				</Col>
			</Row>
		</Spin>
	);
};

export default CardThongKe;
