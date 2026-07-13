import PageCard from '@/components/PageCard';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import CardBaiTapDashboard from '@/pages/TrangChu/HocTapRenLuyen/BaiTap';
import CardDienDanDashboard from '@/pages/TrangChu/HocTapRenLuyen/DienDan';
import { ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { getPublicAssetPath } from '@/utils/path';
import { Card, Col, Empty, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { history, useIntl, useModel } from 'umi';
import CardLopHocPhanItem from '../LopHocPhan/components/CardLopHocPhanItem';
import BaiTapStatistics from './components/Statistics';
import CardTietHocSapToi from './components/TietHocSapToi';

const LopHocPhanPage = () => {
	const intl = useIntl();
	const { danhSach, sinhVienGetAllModel, loading, sinhVienGetModel, lopHienTai, lopKeTiep } =
		useModel('lophocphan.lophocphan');
	const { record: recHocKy } = useModel('daotao.hocky');

	// Background images array
	const bg1 = getPublicAssetPath('/images/isolation-mode-1.svg');
	const bg2 = getPublicAssetPath('/images/isolation-mode-2.svg');
	const bg3 = getPublicAssetPath('/images/isolation-mode-3.svg');
	const bg4 = getPublicAssetPath('/images/isolation-mode-4.svg');
	const bg5 = getPublicAssetPath('/images/isolation-mode-5.svg');
	const bg6 = getPublicAssetPath('/images/isolation-mode-6.svg');
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
		<PageCard title={intl.formatMessage({ id: 'lophocphan.title' })} extra={<FilterHocKy isSetHocKy />} hideInnerCard>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<BaiTapStatistics />
				</Col>

				<Col span={24}>
					<PageCard hideInnerCard level={2} loading={loading} title={intl.formatMessage({ id: 'lophocphan.danhsach' })}>
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
												soBuoi: lop?.thongKeDiemDanhLhp?.soBuoi,
												coMat: lop?.thongKeDiemDanhLhp?.coMat,
												chuaDiemDanh: lop?.thongKeDiemDanhLhp?.soBuoiChuaDiemDanh,
											}}
											soBaiTap={lop?.soBaiTap}
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
									description={intl.formatMessage({ id: 'lophocphan.empty' })}
									style={{ padding: '40px' }}
									image={Empty.PRESENTED_IMAGE_SIMPLE}
								/>
							</Card>
						)}
					</PageCard>
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
		</PageCard>
	);
};

export default LopHocPhanPage;
