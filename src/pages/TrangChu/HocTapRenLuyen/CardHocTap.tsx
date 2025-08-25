import DonutChart from '@/components/Chart/DonutChart';
import { colorLoaiHocLuc, ELoaiHocLuc } from '@/services/HocTap/constant';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Carousel, Col, Row, Space, Tooltip } from 'antd';
import Chart from 'react-apexcharts';
import { history, Link, useModel } from 'umi';

const CardKetQuaHocTapDashboard = () => {
	const { record: recTienTrinh, loading } = useModel('sinhvien.tientrinhtotnghiep');
	const colors = ['#14B8A6', '#FACC15'];
	const xAxis = ['GPA', 'CPA'];
	const yAxis = [
		recTienTrinh?.kqhtHocKy?.trungBinhHocKyThang4 ?? 0,
		recTienTrinh?.kqhtHocKy?.trungBinhTichLuyToanKhoaThang4 ?? 0,
	];

	return (
		<Card className='dashboard-stat-card' variant='borderless' loading={loading}>
			<div className='dashboard-stat-content'>
				<div className='header'>
					<div className='title'>
						Kết quả học tập{' '}
						<Tooltip title='Xem chi tiết'>
							<ArrowRightOutlined className='more-info' onClick={() => history.push(`/hoc-tap/ket-qua-hoc-tap`)} />
						</Tooltip>
					</div>
					<div
						className='header-tag'
						style={{
							background: colorLoaiHocLuc[recTienTrinh?.kqhtHocKy?.hocLucHocKy ?? ELoaiHocLuc.EMPTY],
						}}
					>
						{recTienTrinh?.kqhtHocKy?.hocLucHocKy || ELoaiHocLuc.EMPTY}
					</div>
				</div>

				<Carousel autoplay pauseOnDotsHover autoplaySpeed={2500} infinite>
					<div>
						{/* Biểu đồ to hơn và căn giữa */}
						<div className='chart-container'>
							<DonutChart
								xAxis={xAxis}
								yLabel={['Điểm']}
								yAxis={[yAxis.map((i) => (i * 100) / 4)]}
								type='radian'
								formatY={(e) => `${e}`}
								height={180}
								width={180}
								otherOptions={{
									legend: { show: false },
									dataLabels: { enabled: false },
									chart: { toolbar: { show: false } },
									tooltip: { enabled: true },
									plotOptions: {
										radialBar: {
											dataLabels: { show: false },
											hollow: { size: '35px' },
										},
									},
									responsive: [
										{
											breakpoint: 480,
											options: {
												chart: { width: 150, height: 150 },
												legend: { show: false },
												plotOptions: {
													radialBar: {
														hollow: { size: '30px' },
													},
												},
											},
										},
									],
									// Thêm stroke để bo tròn các góc
									stroke: {
										lineCap: 'round' as 'round', // Bo tròn các đầu
									},
								}}
								colors={colors}
							/>

							<div className='center-label'>
								<div className='total-value'>{recTienTrinh?.kqhtHocKy?.tongSoTinChiTichLuyToanKhoa ?? '-'}</div>
								<div className='total-text'>Tín chỉ</div>
							</div>
						</div>

						<Row gutter={[0, 4]} justify='center'>
							{colors.map((c, ind) => (
								<Col span={24} key={c}>
									<div
										className='row'
										style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
									>
										<Space>
											<span className='dot' style={{ backgroundColor: c }} />
											<span>
												{xAxis[ind]}
												<span className='suffix'>(/4)</span>
											</span>
										</Space>
										<span className='sum-text' style={{ color: c, fontWeight: 'bold' }}>
											{yAxis[ind]}
										</span>
									</div>
								</Col>
							))}

							<Col span={24}>
								<div className='row' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<Space>
										<span className='dot' />
										<span>
											STC
											<span className='suffix'>(/{recTienTrinh?.ctdtKeHoach?.tongSoTinChi ?? '-'})</span>
										</span>
									</Space>
									<span className='sum-text' style={{ color: '#AAA', fontWeight: 'bold' }}>
										{recTienTrinh?.kqhtHocKy?.tongSoTinChiTichLuyToanKhoa ?? '-'}
									</span>
								</div>
							</Col>
						</Row>
					</div>

					<div>
						<div className='chart-container'>
							<Chart
								options={{
									chart: {
										height: 350,
										type: 'radar',
									},
									title: {
										text: 'Basic Radar Chart',
									},
									yaxis: {
										stepSize: 20,
									},
									xaxis: {
										categories: ['January', 'February', 'March', 'April', 'May', 'June'],
									},
								}}
								series={[3, 3.5, 4.2, 4.5]}
								height={200}
								width={200}
							/>
						</div>
					</div>
				</Carousel>

				<div
					style={{ cursor: 'pointer', marginTop: 8 }}
					onClick={() => history.push('/hoc-tap/ket-qua-hoc-tap#may-tinh')}
				>
					<div className='row highlight text-primary'>
						<span className='text'>Máy tính thông minh</span>
						<Link to='/hoc-tap/ket-qua-hoc-tap#may-tinh' title='Xem chi tiết'>
							<ArrowRightOutlined />
						</Link>
					</div>
				</div>
			</div>
		</Card>
	);
};

export default CardKetQuaHocTapDashboard;
