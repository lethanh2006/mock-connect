import DonutChart from '@/components/Chart/DonutChart';
import { EOperatorType } from '@/components/Table/constant';
import { EMaTrangThaiThanhToan } from '@/services/TaiChinh/constant';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Row, Space } from 'antd';
import { useEffect } from 'react';
import { Link, useModel } from 'umi';

const CardCongNoDashboard = () => {
	const { getModel: getCongNo, loading, danhSach } = useModel('taichinh.hoadon');
	const colors = ['var(--ant-success-color)', 'var(--ant-error-color)'];
	const xAxis = ['Đã thanh toán', 'Chưa thanh toán'];

	useEffect(() => {
		// Get công nợ
		getCongNo(
			undefined,
			[
				{
					field: 'status',
					values: [EMaTrangThaiThanhToan.DONG],
					operator: EOperatorType.NOT_INCLUDE,
				},
			],
			100,
		);
	}, []);

	const renderContent = (items: HoaDon.IRecord[], title: string) => {
		const paid = items
			.map(
				(bill) =>
					bill?.billItems
						?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
						?.reduce((acc, item) => acc + (item.amountPaid || 0), 0) ?? 0,
			)
			.reduce((acc, item) => acc + item, 0);
		const due = items
			.map(
				(bill) =>
					bill?.billItems
						?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
						?.reduce((acc, item) => acc + (item.amountDue ?? 0) - (item.amountDiscount ?? 0), 0) ?? 0,
			)
			.reduce((acc, item) => acc + item, 0);
		const axis = [paid, due - paid];

		return (
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<DonutChart
						xAxis={xAxis}
						yLabel={[title]}
						yAxis={[axis]}
						height={114}
						width={114}
						otherOptions={{
							legend: { show: false },
							dataLabels: { enabled: false },
							chart: { toolbar: { show: false } },
							responsive: [
								{
									breakpoint: 480,
									options: {
										chart: { width: 114 },
										legend: { show: false },
									},
								},
							],
						}}
						colors={colors}
					/>
					<div className='overlay'>{title}</div>
				</Col>

				<Col span={24}>
					<Row gutter={[0, 2]}>
						{xAxis.map((c, ind) => (
							<Col span={24} key={c}>
								<div className='row'>
									<Space>
										<span className='dot' style={{ backgroundColor: colors[ind] }} />
										<span className='text'>{c}</span>
									</Space>
									<span className='sum-text' style={{ color: colors[ind] }}>
										{Math.round(axis[ind] / 1e4) / 1e2}
									</span>
								</div>
							</Col>
						))}
					</Row>
				</Col>
			</Row>
		);
	};

	return (
		<Card className='dashboard-stat-card' loading={loading}>
			<div className='dashboard-stat-content'>
				<div className='header'>
					<div className='title'>
						Công nợ sinh viên
						<span className='subtitle'>(Triệu đồng)</span>
					</div>
					<Link to='/tai-chinh/cong-no' title='Xem chi tiết'>
						<ArrowRightOutlined />
					</Link>
				</div>

				{danhSach.length ? (
					<Row gutter={[8, 0]}>
						<Col span={12}>{renderContent(danhSach, 'Công nợ chung')}</Col>
						<Col span={12}>{renderContent([], 'Dịch vụ số')}</Col>
					</Row>
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />
				)}
			</div>
		</Card>
	);
};

export default CardCongNoDashboard;
