import { Card, Col, Row, Statistic } from 'antd';
import Progress from 'antd/es/progress';
import { useEffect } from 'react';
import { useModel } from 'umi';

const CardTienTrinhTotNghiep = () => {
	const {
		getTienTrinhTotNghiepModel,
		record: recTienTrinh,
		dieuKienTotNghiep,
		loading,
	} = useModel('sinhvien.tientrinhtotnghiep');

	useEffect(() => {
		getTienTrinhTotNghiepModel();
	}, []);

	return (
		<Row gutter={[16, 16]}>
			<Col span={24} md={8}>
				<Card loading={loading}>
					<Statistic
						valueStyle={{
							color: `${dieuKienTotNghiep?.isDuDieuKienTBC ? '#52c41a' : '#ff4d4f'}`,
							fontWeight: 'bold',
						}}
						title='GPA'
						value={recTienTrinh?.kqhtHocKy?.trungBinhTichLuyToanKhoaThang4 ?? 0}
						suffix='/4'
					/>
				</Card>
			</Col>

			<Col span={24} md={8}>
				<Card loading={loading}>
					<Statistic
						valueStyle={{ fontSize: 14 }}
						title='Tín chỉ tích lũy'
						value={recTienTrinh?.kqhtHocKy?.tongSoTinChiTichLuyToanKhoa ?? 0}
						suffix={`/ ${recTienTrinh?.ctdtKeHoach?.tongSoTinChi ?? 0}`}
						prefix={<Progress width={50} type='dashboard' percent={dieuKienTotNghiep?.phanTramTinChi} />}
					/>
				</Card>
			</Col>

			<Col span={24} md={8}>
				<Card loading={loading}>
					<Statistic title='Công nợ' value={0} />
				</Card>
			</Col>
		</Row>
	);
};

export default CardTienTrinhTotNghiep;
