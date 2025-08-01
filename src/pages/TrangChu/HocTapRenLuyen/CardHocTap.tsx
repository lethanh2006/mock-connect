import DonutChart from '@/components/Chart/DonutChart';
import { colorLoaiHocLuc, ELoaiHocLuc } from '@/services/HocTap/constant';
import { ArrowRightOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space, Tooltip } from 'antd';
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
			<div
				className='dashboard-stat-content'
				style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}
			>
				<div>
					<div className='header'>
						<div className='title'>
							Kết quả học tập{' '}
							<Tooltip title='Xem chi tiết'>
								<InfoCircleOutlined className='more-info' onClick={() => history.push(`/hoc-tap/ket-qua-hoc-tap`)} />
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

					{/* Biểu đồ to hơn và căn giữa */}
					<Row gutter={[12, 0]} justify='center'>
						<Col span={24}>
							<div style={{ display: 'flex', justifyContent: 'center' }}>
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
										plotOptions: {
											radialBar: {
												dataLabels: { show: false },
												hollow: { size: '35px' },
												// Bo tròn các góc cho radial bar
												startAngle: 0,
												endAngle: 360,
												track: {
													background: '#f2f2f2',
													strokeWidth: '97%',
													margin: 5,
													dropShadow: {
														enabled: false,
													},
												},
											},
										},
										// Thêm stroke để bo tròn các góc
										stroke: {
											lineCap: 'round' as 'round', // Bo tròn các đầu
										},
									}}
									colors={colors}
								/>
							</div>
						</Col>
					</Row>

					{/* Thông tin căn giữa */}
					<Row justify='center'>
						<Col span={24}>
							<Row gutter={[0, 8]} justify='center'>
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
									<div
										className='row'
										style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
									>
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
						</Col>
					</Row>
				</div>

				<div style={{ cursor: 'pointer' }} onClick={() => history.push('/hoc-tap/ket-qua-hoc-tap#may-tinh')}>
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
