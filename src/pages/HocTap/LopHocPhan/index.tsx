import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import CardBaiTapDashboard from '@/pages/TrangChu/HocTapRenLuyen/BaiTap';
import CardDienDanDashboard from '@/pages/TrangChu/HocTapRenLuyen/DienDan';
import { ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { Card, Col, Empty, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { history, useModel } from 'umi';
import CardLopHocPhanItem from '../LopHocPhan/components/CardLopHocPhanItem';
import BaiTapStatistics from './components/Statistics';
import CardTietHocSapToi from './components/TietHocSapToi';

const LopHocPhanPage = () => {
	const { danhSach, sinhVienGetAllModel, loading, sinhVienGetModel, lopHienTai, lopKeTiep } =
		useModel('lophocphan.lophocphan');
	const { record: recHocKy } = useModel('daotao.hocky');

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
			sinhVienGetModel({ maHocKy: recHocKy?.ma });
		}
	};

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	return (
		<Card
			variant='borderless'
			className='card-big-title card-borderless'
			title='Lớp tín chỉ'
			extra={<FilterHocKy isSetHocKy />}
		>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<BaiTapStatistics />
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
										<CardLopHocPhanItem
											lop={lop}
											index={index}
											backgrounds={backgrounds}
											diemDanh={{
												coMat: lop?.thongKeDiemDanhLhp?.coMat,
												chuaDiemDanh: lop?.thongKeDiemDanhLhp?.chuaDiemDanh,
											}}
											soBaiTap={lop?.thongKeBaiTap?.tongSo}
											soBaiDang={lop?.soBaiDang}
											isKeTiep={
												lopKeTiep?._id === lop._id &&
												lopHienTai?._id !== lopKeTiep?._id &&
												(lop.thoiKhoaBieuList ?? []).some((tkb: ThoiKhoaBieu.IRecord) =>
													dayjs(tkb.ngay).isAfter(dayjs()),
												)
											}
											isHienTai={lopHienTai?._id === lop._id}
										/>
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

				<Col span={24} md={8}>
					<CardBaiTapDashboard />
				</Col>
				<Col span={24} md={8}>
					<CardDienDanDashboard typeLop={'lop-hoc-phan'} />
				</Col>
				<Col span={24} md={8}>
					<CardTietHocSapToi />
				</Col>
			</Row>
		</Card>
	);
};

export default LopHocPhanPage;
