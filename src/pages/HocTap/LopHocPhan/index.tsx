import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import CardBaiTapDashboard from '@/pages/TrangChu/HocTapRenLuyen/BaiTap';
import CardDienDanDashboard from '@/pages/TrangChu/HocTapRenLuyen/DienDan';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Card, Col, Empty, Row } from 'antd';
import { useEffect } from 'react';
import { history, useModel } from 'umi';
import CardLopHocPhanItem from '../LopHocPhan/components/CardLopHocPhanItem';
import Statistics from './components/Statistics';

const LopHocPhanPage = () => {
	const { danhSach, sinhVienGetAllModel, loading } = useModel('lophocphan.lophocphan');
	const { record: recHocKy } = useModel('daotao.hocky');
	// Lấy dữ liệu bài tập từ model baitap để truyền vào Statistics
	const { danhSach: danhSachBaiTap, thongKeBaiTapModel } = useModel('daotao.baitap');

	// Background images array
	const bg1 = '/images/isolation-mode-1.svg';
	const bg2 = '/images/isolation-mode-2.svg';
	const bg3 = '/images/isolation-mode-3.svg';
	const bg4 = '/images/isolation-mode-4.svg';
	const bg5 = '/images/isolation-mode-5.svg';
	const bg6 = '/images/isolation-mode-6.svg';
	const backgrounds = [bg1, bg2, bg3, bg4, bg5, bg6];

	const getData = () => {
		if (recHocKy?.ma) {
			sinhVienGetAllModel({ maHocKy: recHocKy?.ma });
			// Gọi API lấy dữ liệu bài tập cho thống kê
			// Có thể điều chỉnh startDate và endDate theo nhu cầu
			const startDate = new Date(recHocKy?.thoiGianBatDau || Date.now());
			const endDate = new Date(recHocKy?.thoiGianKetThuc || Date.now());
			thongKeBaiTapModel(startDate, endDate);
		}
	};

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	const onCell = (loptinchi: LopHocPhan.IRecord) => ({
		onClick: () =>
			loptinchi.loai === ELoaiLopHocPhan.CHINH ? history.push(`/hoc-tap/lop-tin-chi/${loptinchi._id}`) : undefined,
		style: { cursor: loptinchi.loai === ELoaiLopHocPhan.CHINH ? 'pointer' : undefined },
	});

	return (
		<Card
			variant='borderless'
			className='card-big-title card-borderless'
			title='Lớp tín chỉ'
			extra={<FilterHocKy isSetHocKy />}
		>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Statistics danhSach={danhSachBaiTap} />
				</Col>

				<Col span={24}>
					<Card
						loading={loading}
						variant='borderless'
						className='card-borderless card-big-title'
						title='Danh sách lớp tín chỉ'
					>
						{danhSach.length > 0 ? (
							<Row gutter={[0, 0]} style={{ margin: '-8px' }}>
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
							<Card variant='borderless' style={{ textAlign: 'center' }}>
								<Empty
									description='Không có lớp tín chỉ'
									style={{ padding: '40px' }}
									image={Empty.PRESENTED_IMAGE_SIMPLE}
								/>
							</Card>
						)}
					</Card>
				</Col>

				<Col span={24} md={16}>
					<CardBaiTapDashboard />
				</Col>
				<Col span={24} md={8}>
					<CardDienDanDashboard />
				</Col>
			</Row>
		</Card>
	);
};

export default LopHocPhanPage;
