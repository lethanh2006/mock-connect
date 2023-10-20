import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Empty, Progress, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ModalChungChiCTDT from './ModalChungChi';

const CardDieuKienTotNghiep = () => {
	const { getTienTrinhChungChiCTDTModel, record, loading, setRecordChungChi, setVisibleForm, dieuKienTotNghiep } =
		useModel('sinhvien.tientrinhtotnghiep');

	useEffect(() => {
		getTienTrinhChungChiCTDTModel();
	}, []);

	const handleView = (rec: ChuongTrinhDaoTao.IChungChiCTDT) => {
		setRecordChungChi(rec);
		setVisibleForm(true);
	};

	return (
		<Card title='Điều kiện xét tốt nghiệp' loading={loading}>
			<Row gutter={[12, 12]} style={{ marginBottom: 18 }}>
				<Col span={24}>
					<div className='fw500'>Điều kiện học tập</div>
				</Col>
				<Col span={24} md={8}>
					<Card className='stat-nhap-diem-tp'>
						<span className={`num ${dieuKienTotNghiep?.isDuDieuKienTBC ? 'text-success' : 'text-error'}`}>
							{record?.kqhtHocKy?.trungBinhTichLuyToanKhoaThang4 ?? 0} / 4
						</span>
						<span className='text'>TBC tích lũy</span>
					</Card>
				</Col>
				<Col span={24} md={8}>
					<Card className='stat-nhap-diem-tp'>
						<Progress width={40} type='dashboard' percent={dieuKienTotNghiep?.phanTramTinChi} />
						<span className='text'>
							Số tín chỉ tích lũy ({record?.kqhtHocKy?.tongSoTinChiTichLuyToanKhoa ?? 0}/
							{record?.ctdtKeHoach?.tongSoTinChi ?? 0})
						</span>
					</Card>
				</Col>
			</Row>

			<Row gutter={[12, 12]} style={{ marginBottom: 18 }}>
				<Col span={24}>
					<div className='fw500'>Chứng chỉ chuẩn đầu ra</div>
				</Col>
				{record?.thongTinCdr?.length ? (
					record?.thongTinCdr?.map((cc) => (
						<Col span={24} md={8} key={cc._id}>
							<Card className='stat-nhap-diem-tp' style={{ cursor: 'pointer' }} onClick={() => handleView(cc)}>
								{cc.datChuanDauRa ? (
									<span className='num text-success'>
										<CheckCircleOutlined />
									</span>
								) : (
									<span className='num text-error'>
										<CloseCircleOutlined />
									</span>
								)}
								<span className='text'>{cc.loaiChungChi?.ten ?? cc.maLoaiChungChi}</span>
							</Card>
						</Col>
					))
				) : (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={<i>Sinh viên chưa đạt chuẩn đầu ra nào !</i>}
						style={{ margin: 'auto' }}
					/>
				)}
			</Row>

			<Row gutter={[12, 12]} style={{ marginBottom: 18 }}>
				<Col span={24}>
					<div className='fw500'>Điều kiện khác</div>
				</Col>
				<Col span={24} md={8}>
					<Card className='stat-nhap-diem-tp'>
						<span className='num text-success'>
							<CheckCircleOutlined />
						</span>
						<span className='text'>Công nợ: Đã thanh toán đủ</span>
					</Card>
				</Col>
				<Col span={24} md={8}>
					<Card className='stat-nhap-diem-tp'>
						<span className='num text-error'>
							<CloseCircleOutlined />
						</span>
						<span className='text'>Thư viện: Chưa hoàn trả học liệu</span>
					</Card>
				</Col>
			</Row>

			{dieuKienTotNghiep?.isDuKieuKien ? (
				<Alert type='success' description='Bạn đã đủ điều kiện để xét tốt nghiệp !' showIcon />
			) : (
				<Alert type='warning' description='Bạn chưa đủ điều kiện để xét tốt nghiệp !' showIcon />
			)}

			<ModalChungChiCTDT />
		</Card>
	);
};

export default CardDieuKienTotNghiep;
