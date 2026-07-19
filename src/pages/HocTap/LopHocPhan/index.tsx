import PageCard from '@/components/PageCard';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import { ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import dayjs from '@/utils/dayjs';
import { Card, Col, Empty, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import CardLopHocPhanV2 from './components/CardLopHocPhanV2';
import UpcomingLesson from './components/UpcomingLesson';

const LopHocPhanPage = () => {
	const intl = useIntl();
	const { danhSach, loading, sinhVienGetModel, lopHienTai, lopKeTiep } = useModel('lophocphan.lophocphan');
	const { record: recHocKy } = useModel('daotao.hocky');

	useEffect(() => {
		if (recHocKy?.ma) {
			sinhVienGetModel({ maHocKy: recHocKy?.ma });
		}
	}, [recHocKy?.ma]);

	return (
		<PageCard title={intl.formatMessage({ id: 'lophocphan.title' })} extra={<FilterHocKy isSetHocKy />} hideInnerCard>
			<Row gutter={[16, 16]}>
				<Col xs={24} xl={16}>
					<Card loading={loading} title={intl.formatMessage({ id: 'lophocphan.current-section' })}>
						{danhSach.length > 0 ? (
							<Row gutter={[0, 0]} style={{ margin: '-8px' }}>
								{danhSach.map((lop) => (
									<Col key={lop._id} xs={24} sm={12} md={12} lg={12} xl={12} xxl={8} style={{ padding: 8 }}>
										<CardLopHocPhanV2
											lop={lop}
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
							<Empty
								description={intl.formatMessage({ id: 'lophocphan.empty' })}
								style={{ padding: '40px' }}
								image={Empty.PRESENTED_IMAGE_SIMPLE}
							/>
						)}
					</Card>
				</Col>

				<Col xs={24} xl={8}>
					<UpcomingLesson danhSach={danhSach} />
				</Col>
			</Row>
		</PageCard>
	);
};

export default LopHocPhanPage;
