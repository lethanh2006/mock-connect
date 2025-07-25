import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';

import CardDienDanDashboard from '@/pages/TrangChu/HocTapRenLuyen/CardDienDan';

import CardBaiTapDashboard from '@/pages/TrangChu/HocTapRenLuyen/BaiTap';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Card, Col, Row, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import CardLopHocPhanItem from '../LopHocPhan/components/CardLopHocPhanItem';
import Statistics from './components/Statistics';

const { Title, Text } = Typography;

const LopHocPhanPage = () => {
	const { danhSach, sinhVienGetAllModel, loading } = useModel('lophocphan.lophocphan');
	const { record: recHocKy } = useModel('daotao.hocky');
	// Lấy dữ liệu bài tập từ model baitap để truyền vào Statistics
	const { danhSach: danhSachBaiTap, thongKeBaiTapModel, setDanhSach } = useModel('daotao.baitap');

	const [screenSize, setScreenSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	// Background images array
	const bg1 = '/images/isolation-mode-1.svg';
	const bg2 = '/images/isolation-mode-2.svg';
	const bg3 = '/images/isolation-mode-3.svg';
	const bg4 = '/images/isolation-mode-4.svg';
	const bg5 = '/images/isolation-mode-5.svg';
	const bg6 = '/images/isolation-mode-6.svg';
	const backgrounds = [bg1, bg2, bg3, bg4, bg5, bg6];

	// Handle window resize
	useEffect(() => {
		const handleResize = () => {
			setScreenSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const getData = () => {
		if (recHocKy?.ma) {
			sinhVienGetAllModel({ maHocKy: recHocKy?.ma });
			// Gọi API lấy dữ liệu bài tập cho thống kê
			// Có thể điều chỉnh startDate và endDate theo nhu cầu
			const startDate = new Date(recHocKy?.ngayBatDau || Date.now());
			const endDate = new Date(recHocKy?.ngayKetThuc || Date.now());
			thongKeBaiTapModel(startDate, endDate);
		}
	};

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	const isMobile = screenSize.width <= 768;

	const onCell = (loptinchi: LopHocPhan.IRecord) => ({
		onClick: () =>
			loptinchi.loai === ELoaiLopHocPhan.CHINH ? history.push(`/hoc-tap/lop-tin-chi/${loptinchi._id}`) : undefined,
		style: { cursor: loptinchi.loai === ELoaiLopHocPhan.CHINH ? 'pointer' : undefined },
	});

	return (
		<div style={{ padding: '16px' }}>
			{/* Header */}
			<div style={{ marginBottom: '24px' }}>
				{isMobile ? (
					// Mobile layout: 2 rows
					<div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
						<Title level={3} style={{ margin: 0, marginBottom: '16px' }}>
							Lớp tín chỉ
						</Title>
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
							<FilterHocKy isSetHocKy />
						</div>
					</div>
				) : (
					// Desktop layout: 1 row (unchanged)
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
						<Title level={3} style={{ margin: 0 }}>
							Lớp tín chỉ
						</Title>
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
							<FilterHocKy isSetHocKy />
						</div>
					</div>
				)}
			</div>

			{/* Statistics */}
			<Statistics danhSach={danhSachBaiTap} />

			{/* Class List */}
			<div style={{ marginBottom: '24px' }}>
				<Text style={{ fontSize: '18px', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
					Danh sách lớp tín chỉ
				</Text>

				{danhSach.length > 0 ? (
					<Row gutter={[0, 0]} style={{ margin: '0 -8px' }}>
						{danhSach.map((lop, index) => (
							<Col
								key={lop._id}
								xs={24}
								sm={12}
								md={8}
								lg={8}
								xl={8}
								xxl={6}
								onClick={() => history.push(`/hoc-tap/lop-tin-chi/${lop._id}`)}
							>
								<CardLopHocPhanItem lop={lop} index={index} backgrounds={backgrounds} />
							</Col>
						))}
					</Row>
				) : (
					<Card style={{ textAlign: 'center', padding: '40px' }}>
						<Text type='secondary'>Không có lớp tín chỉ nào</Text>
					</Card>
				)}
			</div>

			{/* Assignments and Forum */}
			<Row gutter={[24, 24]}>
				<Col span={isMobile ? 24 : 16}>
					<CardBaiTapDashboard />
				</Col>
				<Col span={isMobile ? 24 : 8}>
					<CardDienDanDashboard />
				</Col>
			</Row>
		</div>
	);
};

export default LopHocPhanPage;
