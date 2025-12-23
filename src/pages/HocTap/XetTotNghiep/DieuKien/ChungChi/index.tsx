import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Row } from 'antd';
import { history, useIntl, useModel } from 'umi';
import ModalChungChiCTDT from './ModalChungChi';

const DieuKienChungChiSection = () => {
	const intl = useIntl();
	const { record, setRecordChungChi, setVisibleForm } = useModel('sinhvien.tientrinhtotnghiep');

	const handleView = (rec: SinhVien.TChungChiDauRaSv) => {
		setRecordChungChi(rec);
		setVisibleForm(true);
	};

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
					<div className='fw500'>{intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.title' })}</div>
					<a
						href='/hoc-tap/xet-tot-nghiep/chung-chi-tot-nghiep'
						onClick={(e) => {
							e.preventDefault();
							history.push('/hoc-tap/xet-tot-nghiep/chung-chi-tot-nghiep');
						}}
					>
						{intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.btn.xemchitiet' })} →
					</a>
				</div>
			</Col>
			{record?.thongTinCdr?.length ? (
				record?.thongTinCdr?.map((cc) => (
					<Col span={24} md={8} key={cc._id}>
						<Card className='card-stat-small' style={{ cursor: 'pointer' }} onClick={() => handleView(cc)}>
							{cc.datChuanDauRa ? (
								<span className='num text-success'>
									<CheckCircleOutlined />
								</span>
							) : (
								<span className='num text-error'>
									<CloseCircleOutlined />
								</span>
							)}
							<span>{cc.loaiChungChi?.ten ?? cc.maLoaiChungChi}</span>
						</Card>
					</Col>
				))
			) : (
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					description={<i>{intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.empty.description' })}</i>}
					style={{ margin: 'auto' }}
				/>
			)}

			<ModalChungChiCTDT />
		</Row>
	);
};

export default DieuKienChungChiSection;
