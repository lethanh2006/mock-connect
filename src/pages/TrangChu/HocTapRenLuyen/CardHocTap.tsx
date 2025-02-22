import DonutChart from '@/components/Chart/DonutChart';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space } from 'antd';
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
		<Card className='dashboard-stat-card' loading={loading}>
			<div
				className='dashboard-stat-content'
				style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 8 }}
			>
				<div>
					<div className='header'>
						<div className='title'>Kết quả học tập</div>
					</div>

					<Row gutter={[12, 0]}>
						<Col span={8}>
							<div style={{ margin: '-7px' }}>
								<DonutChart
									xAxis={xAxis}
									yLabel={['Điểm']}
									yAxis={[yAxis.map((i) => (i * 100) / 4)]}
									type='radian'
									formatY={(e) => `${e}`}
									height={120}
									width={120}
									otherOptions={{
										legend: { show: false },
										dataLabels: { enabled: false },
										chart: { toolbar: { show: false } },
										plotOptions: {
											radialBar: {
												dataLabels: { show: false },
												hollow: { size: '28px' },
											},
										},
										responsive: [
											{
												breakpoint: 480,
												options: {
													chart: { width: 120 },
													legend: { show: false },
												},
											},
										],
									}}
									colors={colors}
								/>
							</div>
						</Col>

						<Col span={16}>
							<Row gutter={[0, 4]}>
								{colors.map((c, ind) => (
									<Col span={24} key={c}>
										<div className='row'>
											<Space>
												<span className='dot' style={{ backgroundColor: c }} />
												<span>
													{xAxis[ind]}
													<span className='suffix'>(/4)</span>
												</span>
											</Space>
											<span className='sum-text' style={{ color: c }}>
												{yAxis[ind]}
											</span>
										</div>
									</Col>
								))}

								<Col span={24}>
									<div className='row'>
										<Space>
											<span className='dot' />
											<span>
												STC
												<span className='suffix'>(/{recTienTrinh?.ctdtKeHoach?.tongSoTinChi ?? '-'})</span>
											</span>
										</Space>
										<span className='sum-text' style={{ color: '#AAA' }}>
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
