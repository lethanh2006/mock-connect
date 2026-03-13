import { Card, Col, Progress, Row } from 'antd';
import { history, useIntl, useModel } from 'umi';

const DieuKienKqhtSection = () => {
	const intl = useIntl();
	const { record, dieuKienTotNghiep } = useModel('sinhvien.tientrinhtotnghiep');

	return (
		<Row gutter={[8, 8]} style={{ marginBottom: 18 }}>
			<Col span={24}>
				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: 8,
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<div className='fw500'>{intl.formatMessage({ id: 'dieukienxettotnghiep.ketquahoctap.title' })}</div>
					<a
						href='/hoc-tap/ket-qua-hoc-tap'
						onClick={(e) => {
							e.preventDefault();
							history.push('/hoc-tap/ket-qua-hoc-tap');
						}}
					>
						{intl.formatMessage({ id: 'dieukienxettotnghiep.ketquahoctap.backlink.xemlai' })} →
					</a>
				</div>
			</Col>

			<Col span={24} md={8}>
				<Card className='card-stat-small'>
					<span className={`num ${dieuKienTotNghiep?.isDuDieuKienTBC ? 'text-success' : 'text-error'}`}>
						{record?.kqhtHocKy?.trungBinhTichLuyToanKhoaThang4 ?? 0} / 4
					</span>
					<span>{intl.formatMessage({ id: 'dieukienxettotnghiep.ketquahoctap.tbctichluy.title' })}</span>
				</Card>
			</Col>
			<Col span={24} md={8}>
				<Card className='card-stat-small'>
					<Progress width={40} type='dashboard' percent={dieuKienTotNghiep?.phanTramTinChi} />
					<span>
						{intl.formatMessage({ id: 'dieukienxettotnghiep.ketquahoctap.tinchitichluy.title' })} (
						{record?.kqhtHocKy?.tongSoTinChiTichLuyToanKhoa ?? 0}/{record?.ctdtKeHoach?.tongSoTinChi ?? 0})
					</span>
				</Card>
			</Col>
		</Row>
	);
};

export default DieuKienKqhtSection;
