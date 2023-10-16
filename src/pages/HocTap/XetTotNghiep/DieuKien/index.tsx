import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Progress, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ModalChungChiCTDT from './ModalChungChi';

const CardDieuKienTotNghiep = () => {
	const { getTienTrinhChungChiCTDTModel, danhSach, loading, setRecord, setVisibleForm } =
		useModel('sinhvien.chungchictdt');
	const isDuDieuKien = danhSach?.every((item) => item.datChuanDauRa);

	useEffect(() => {
		getTienTrinhChungChiCTDTModel();
	}, []);

	const handleView = (rec: ChuongTrinhDaoTao.IChungChiCTDT) => {
		setRecord(rec);
		setVisibleForm(true);
	};

	return (
		<Card title='Điều kiện xét tốt nghiệp'>
			<Row gutter={[12, 12]} style={{ marginBottom: 18 }}>
				<Col span={24}>
					<div className='fw500'>Điều kiện học tập</div>
				</Col>
				<Col span={24} md={8}>
					<Card className='stat-nhap-diem-tp'>
						<span className='num text-success'>3.2 / 4</span>
						<span className='text'>TBC tích lũy</span>
					</Card>
				</Col>
				<Col span={24} md={8}>
					<Card className='stat-nhap-diem-tp'>
						<Progress width={40} type='dashboard' percent={30} />
						<span className='text'>Số tín chỉ tích lũy (35/121)</span>
					</Card>
				</Col>
			</Row>

			<Spin spinning={loading}>
				<Row gutter={[12, 12]} style={{ marginBottom: 18 }}>
					<Col span={24}>
						<div className='fw500'>Chứng chỉ chuẩn đầu ra</div>
					</Col>
					{danhSach?.map((cc) => (
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
					))}
				</Row>
			</Spin>

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

			{isDuDieuKien ? (
				<Alert type='success' description='Bạn đã đủ điều kiện để xét tốt nghiệp !' showIcon />
			) : (
				<Alert type='warning' description='Bạn chưa đủ điều kiện để xét tốt nghiệp !' showIcon />
			)}

			<ModalChungChiCTDT />
		</Card>
	);
};

export default CardDieuKienTotNghiep;
