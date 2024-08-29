import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Row } from 'antd';
import { history, useModel } from 'umi';
import ModalChungChiCTDT from './ModalChungChi';

const DieuKienChungChiSection = () => {
	const { record, setRecordChungChi, setVisibleForm } = useModel('sinhvien.tientrinhtotnghiep');

	const handleView = (rec: SinhVien.TChungChiDauRaSv) => {
		setRecordChungChi(rec);
		setVisibleForm(true);
	};

	return (
		<Row gutter={[12, 12]} style={{ marginBottom: 18 }}>
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
					<div className='fw500'>Chứng chỉ chuẩn đầu ra</div>
					<a
						href='/hoc-tap/xet-tot-nghiep/chung-chi-tot-nghiep'
						onClick={(e) => {
							e.preventDefault();
							history.push('/hoc-tap/xet-tot-nghiep/chung-chi-tot-nghiep');
						}}
					>
						Xem chi tiết →
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
					description={<i>Không có thông tin</i>}
					style={{ margin: 'auto' }}
				/>
			)}

			<ModalChungChiCTDT />
		</Row>
	);
};

export default DieuKienChungChiSection;
