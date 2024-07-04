import { Card, Col, Progress, Row, Statistic } from 'antd';
import { useEffect } from 'react';
import { history, useModel } from 'umi';

const CardTienTrinhTotNghiep = () => {
	const {
		getTienTrinhTotNghiepModel,
		record: recTienTrinh,
		dieuKienTotNghiep,
		loading,
	} = useModel('sinhvien.tientrinhtotnghiep');
	const { getKhoaNganhMeModel } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		getKhoaNganhMeModel().then((res) => {
			if (res?.khoaNganhChinh?.ma) getTienTrinhTotNghiepModel(res?.khoaNganhChinh?.ma);
		});
	}, []);

	return (
		<Row gutter={[16, 16]}>
			<Col span={24} md={8} className='dashboard-card-with-icon'>
				<Card loading={loading} style={{ cursor: 'pointer' }} onClick={() => history.push('/hoc-tap/ket-qua-hoc-tap')}>
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

			<Col span={24} md={8} className='dashboard-card-with-icon'>
				<Card loading={loading} style={{ cursor: 'pointer' }} onClick={() => history.push('/hoc-tap/ket-qua-hoc-tap')}>
					<Statistic
						valueStyle={{ fontSize: 14 }}
						title='Tín chỉ tích lũy'
						value={recTienTrinh?.kqhtHocKy?.tongSoTinChiTichLuyToanKhoa ?? 0}
						suffix={`/ ${recTienTrinh?.ctdtKeHoach?.tongSoTinChi ?? 0}`}
						prefix={<Progress width={50} type='dashboard' percent={dieuKienTotNghiep?.phanTramTinChi} />}
					/>
				</Card>
			</Col>

			<Col span={24} md={8} className='dashboard-card-with-icon'>
				<Card loading={loading} style={{ cursor: 'pointer' }} onClick={() => history.push('/tai-chinh/cong-no')}>
					<Statistic title='Công nợ' value={0} />
				</Card>
			</Col>
		</Row>
	);
};

export default CardTienTrinhTotNghiep;
