import {
	colorXepLoaiRenLuyen,
	xepLoaiRenLuyen,
} from '@/services/CongTacSinhVien/DiemRenLuyenV2/PhieuDiemRenLuyen/constants';
import { Card, Col, Row } from 'antd';
import { useModel } from 'umi';

const ViewKqRenLuyenYKienHocBa = () => {
	const { record } = useModel('sinhvien.hocba.hocba');

	if (!record?._id) return null;
	return (
		<Row gutter={[12, 12]}>
			<Col span={24} md={12}>
				<Card className='ket-qua-card'>
					<div className='ket-qua-content'>
						<div className='title'>Điểm rèn luyện</div>
						<span className='sum-text'>{record.diemRenLuyen ?? '--'}</span>
					</div>
				</Card>
			</Col>

			<Col span={24} md={12}>
				<Card className='ket-qua-card'>
					<div className='ket-qua-content'>
						<div className='title'>Xếp hạng rèn luyện</div>
						<span
							className='sum-text'
							style={{ color: record.xepLoaiDRL ? colorXepLoaiRenLuyen[record.xepLoaiDRL] : undefined }}
						>
							{record.xepLoaiDRL ? xepLoaiRenLuyen[record.xepLoaiDRL] : '--'}
						</span>
					</div>
				</Card>
			</Col>

			<Col span={24}>
				<Card className='ket-qua-card'>
					<div className='ket-qua-content'>
						<div className='title'>Đánh giá sinh viên</div>
						<Row gutter={[8, 8]}>
							<Col span={24}>
								<div className='row'>
									<span className='fw500'>Cố vấn học tập: </span>
									{record.hoTenNhanSu}
								</div>
								<div className='row'>
									<span className='fw500'>Lớp hành chính: </span>
									{record.tenLopHc}
								</div>
								<div className='row'>
									<span className='fw500'>Ý kiến đánh giá: </span>
									{record.yKienCoVan ?? '--'}
								</div>
							</Col>
						</Row>
					</div>
				</Card>
			</Col>
		</Row>
	);
};

export default ViewKqRenLuyenYKienHocBa;
