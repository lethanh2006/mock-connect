import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Empty, Progress, Row, Space, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ModalChungChiCTDT from './ModalChungChi';

const CardDieuKienTotNghiep = () => {
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');
	const { record: recDot, getDotHienHanhModel } = useModel('sinhvien.xettotnghiep');
	const { getTienTrinhTotNghiepModel, record, loading, setRecordChungChi, setVisibleForm, dieuKienTotNghiep } =
		useModel('sinhvien.tientrinhtotnghiep');

	const getData = async () => {
		let dot = null;
		if (!recDot?._id) dot = await getDotHienHanhModel();
		const idDot = recDot?._id ?? dot?._id;

		if (maKhoaNganh) {
			getTienTrinhTotNghiepModel(maKhoaNganh, idDot);
		}
	};

	useEffect(() => {
		getData();
	}, [maKhoaNganh]);

	const handleView = (rec: ChuongTrinhDaoTao.IChungChiCTDT) => {
		setRecordChungChi(rec);
		setVisibleForm(true);
	};

	return (
		<Card
			title={
				<Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
					<span>Điều kiện xét tốt nghiệp</span>
					<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />
				</Space>
			}
		>
			<Spin spinning={loading}>
				<Row gutter={[12, 12]} style={{ marginBottom: 18 }}>
					<Col span={24}>
						<div className='fw500'>Kết quả học tập</div>
					</Col>
					<Col span={24} md={8}>
						<Card className='card-stat-small'>
							<span className={`num ${dieuKienTotNghiep?.isDuDieuKienTBC ? 'text-success' : 'text-error'}`}>
								{record?.kqhtHocKy?.trungBinhTichLuyToanKhoaThang4 ?? 0} / 4
							</span>
							<span>TBC tích lũy</span>
						</Card>
					</Col>
					<Col span={24} md={8}>
						<Card className='card-stat-small'>
							<Progress width={40} type='dashboard' percent={dieuKienTotNghiep?.phanTramTinChi} />
							<span>
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
				</Row>

				<Row gutter={[12, 12]} style={{ marginBottom: 18 }}>
					<Col span={24}>
						<div className='fw500'>Điều kiện khác</div>
					</Col>
					<Col span={24} md={8}>
						<Card className='card-stat-small'>
							{dieuKienTotNghiep?.noTaiChinh ? (
								<span className='num text-error'>
									<CloseCircleOutlined />
								</span>
							) : (
								<span className='num text-success'>
									<CheckCircleOutlined />
								</span>
							)}
							<span>Công nợ: {dieuKienTotNghiep?.noTaiChinh ? 'Chưa thanh toán đủ' : 'Đã thanh toán đủ'}</span>
						</Card>
					</Col>
					<Col span={24} md={8}>
						<Card className='card-stat-small'>
							{dieuKienTotNghiep?.noThuVien ? (
								<span className='num text-error'>
									<CloseCircleOutlined />
								</span>
							) : (
								<span className='num text-success'>
									<CheckCircleOutlined />
								</span>
							)}
							<span>Thư viện: {dieuKienTotNghiep?.noThuVien ? 'Chưa hoàn trả học liệu' : 'Đã hoàn trả học liệu'}</span>
						</Card>
					</Col>
				</Row>
			</Spin>

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
