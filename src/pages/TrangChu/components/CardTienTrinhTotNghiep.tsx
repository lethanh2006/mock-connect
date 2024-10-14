import { EOperatorType } from '@/components/Table/constant';
import { EMaTrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
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
	const { getModel: getCongNo, loading: loadingCongNo, danhSach: danhSachCongNo } = useModel('taichinh.hoadon');
	const congNo = danhSachCongNo
		.map(
			(bill) =>
				bill?.billItems
					?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
					?.reduce(
						(acc, item) => acc + (item.amountDue ?? 0) - (item.amountDiscount ?? 0) - (item.amountPaid || 0),
						0,
					) ?? 0,
		)
		.reduce((acc, item) => acc + item, 0);

	useEffect(() => {
		getKhoaNganhMeModel().then((res) => {
			if (res?.khoaNganhChinh?.ma) getTienTrinhTotNghiepModel(res?.khoaNganhChinh?.ma);
		});

		// Get công nợ
		getCongNo(
			undefined,
			[
				{
					field: 'status',
					values: [EMaTrangThaiThanhToan.CHUA_THANH_TOAN, EMaTrangThaiThanhToan.CHUA_THANH_TOAN_DU],
					operator: EOperatorType.INCLUDE,
				},
			],
			100,
		);
	}, []);

	return (
		<Row gutter={[16, 16]}>
			<Col span={24} md={8} className='dashboard-card-with-icon'>
				<Card loading={loading} style={{ cursor: 'pointer' }} onClick={() => history.push('/hoc-tap/ket-qua-hoc-tap')}>
					<div className='ant-statistic'>
						<div className='ant-statistic-title'>GPA</div>
						<div className='ant-statistic-content'>
							<span
								style={{
									color: `${dieuKienTotNghiep?.isDuDieuKienTBC ? '#52c41a' : '#ff4d4f'}`,
									fontWeight: 'bold',
								}}
							>
								{recTienTrinh?.kqhtHocKy?.trungBinhTichLuyToanKhoaThang4 ?? 0}
							</span>{' '}
							<span style={{ fontSize: 14 }}>/4</span>
						</div>
					</div>
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
				<Card loading={loadingCongNo} style={{ cursor: 'pointer' }} onClick={() => history.push('/tai-chinh/cong-no')}>
					<div className='ant-statistic'>
						<div className='ant-statistic-title'>Công nợ</div>
						<div className='ant-statistic-content'>
							<span
								style={{
									color: `${!congNo ? '#52c41a' : '#ff4d4f'}`,
									fontSize: 22,
								}}
							>
								{inputFormat(congNo)}
							</span>{' '}
							<span style={{ fontSize: 14 }}>VNĐ</span>
						</div>
					</div>
				</Card>
			</Col>
		</Row>
	);
};

export default CardTienTrinhTotNghiep;
