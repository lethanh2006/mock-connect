import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EStatusMyCCT } from '@/services/CCT/constant';
import rules from '@/utils/rules';
import { Checkbox, Col, Form, FormInstance, Input, Rate, Row, Spin } from 'antd';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useModel } from 'umi';
import DragAwards from './DragAwards';
import DragTable, { mapLevelToStar } from './DragTable';

const CheckboxIcon = () => (
	<div className='checkbox-icon'>
		<span>✓</span>
	</div>
);

const CCTContent = (props: {
	record: {
		allCompetencies: string[];
		attributes: MyCCT.IAttributeMyCCT[];
		levelOfEngagement: MyCCT.ILevelOfEngagement[];
		myCCT: MyCCT.IRecord;
		awardsAndRecognition: ActivityOutCome.IRecord[];
	};
	form: FormInstance;
	setSelectedActivities: (val: any) => void;
	setListAwardRecognition: (val: any) => void;
	edit: boolean;
}) => {
	const { record, form, setSelectedActivities, setListAwardRecognition, edit } = props;
	const { loading } = useModel('cct.mycct');
	const { loading: loadingDot } = useModel('cct.submissionround');
	const selectedCompetencies = Form.useWatch('listCompetency', form) || [];
	const isMaxSelected = selectedCompetencies.length >= 10;

	const handleOrderChange = (attributeId: string, activityIds: string[]) => {
		setSelectedActivities((prev: any) => {
			const index = prev.findIndex((i: any) => i.attributeId === attributeId);

			if (index > -1) {
				const newArr = [...prev];
				newArr[index] = { attributeId, activityIds };
				return newArr;
			}

			return [...prev, { attributeId, activityIds }];
		});
	};

	const awards = record?.awardsAndRecognition || [];
	const order = record?.myCCT?.listAwardRecognition || [];

	const sortedAwards = useMemo(() => {
		if (!order.length) return awards;

		const orderMap = new Map(order.map((id, index) => [id, index]));

		return [...awards].sort((a, b) => {
			return (orderMap.get(a._id) ?? 9999) - (orderMap.get(b._id) ?? 9999);
		});
	}, [awards, order]);

	return (
		<Spin spinning={loading || loadingDot}>
			<Row gutter={[36, 20]}>
				<Col span={24} md={12}>
					<div className='cct-column left'>
						<header>
							<div style={{ marginBottom: 12 }}>
								<img src='/logo-text.png' alt='logo' width={90} />
							</div>
							<span
								style={{
									color: '#134D8B',
									fontWeight: 700,
									fontSize: 18,
								}}
							>
								CO-CURRICULAR & COMPETENCY TRANSCRIPT
							</span>
							<div style={{ marginTop: 6 }}>
								<span className='description'>
									Co-curricular & Competency Transcript (CCT) is part of VinUniversity’s commitment to developing
									holistic graduates. This transcript documents the co-curricular experiences and developmental
									activities that students engage in during their time at VinUni, capturing evidence of their
									competencies, growth, and contributions beyond academic performance.
								</span>
							</div>
						</header>

						<section className='skills-section'>
							<h3>STUDENT INFORMATION</h3>
						</section>

						<section className='student-meta-table'>
							<div className='cell label'>Student name</div>
							<div className='cell value'>{record?.myCCT?.name || '--'}</div>
							<div className='cell label'>Student ID</div>
							<div className='cell value'>{record?.myCCT?.code || '--'}</div>

							<div className='cell label'>Date of Birth</div>
							<div className='cell value'>
								{record?.myCCT?.dob ? dayjs(record.myCCT.dob).format('DD/MM/YYYY') : '--'}
							</div>
							<div className='cell label'>College</div>
							<div className='cell value'>{record?.myCCT?.college || '--'}</div>

							<div className='cell label'>Year of Enrollment</div>
							<div className='cell value'>{record?.myCCT?.yearOfEnrollment ?? '--'}</div>
							<div className='cell label'>Program</div>
							<div className='cell value'>{record?.myCCT?.program || '--'}</div>
						</section>

						<section className='skills-section'>
							<h3>STUDENT PROFILE</h3>
							{edit ? (
								<Form.Item name='selfAspiration' rules={[...rules.required, ...rules.text]}>
									<Input.TextArea rows={3} placeholder='Enter Student Profile' />
								</Form.Item>
							) : (
								<span className='description'>{record?.myCCT?.selfAspiration}</span>
							)}
						</section>

						<section className='skills-section'>
							<h3>SKILLS & COMPETENCY DEVELOPMENT</h3>
							<div style={{ marginBottom: 12 }}>
								<span className='description'>
									<i>
										The following competencies were developed and demonstrated through verified co-curricular activities
										and experiences.
									</i>
								</span>
							</div>
							{edit ? (
								<Form.Item name='listCompetency'>
									<Checkbox.Group style={{ width: '100%' }}>
										<Row gutter={[12, 8]}>
											{record?.allCompetencies?.map((item) => (
												<Col span={12} key={item}>
													<Checkbox
														value={item}
														disabled={!selectedCompetencies.includes(item) && isMaxSelected}
														style={{
															fontSize: 11,
														}}
													>
														{item}
													</Checkbox>
												</Col>
											))}
										</Row>
									</Checkbox.Group>
								</Form.Item>
							) : (
								<div className='skills-grid'>
									{record?.myCCT?.listCompetency?.map((skill, index) => (
										<div key={index} className='skill-item'>
											<CheckboxIcon /> {skill}
										</div>
									))}
								</div>
							)}
						</section>

						<section className='featured-projects'>
							<section className='skills-section'>
								<h3>FEATURED PROJECTS/INITIATIVES</h3>
							</section>

							<div style={{ marginBottom: 12 }}>
								<span className='description'>
									<i>
										Featured Projects showcase high-impact projects where students applied knowledge to real-world
										challenges. Each project is mapped to VinUni’s EXCEL competency framework, representing the core
										attributes developed through the VinUni education model.
									</i>
								</span>
							</div>

							<Row gutter={[0, 20]}>
								{record?.attributes?.slice(0, 2)?.map((item, index) => (
									<Col span={24}>
										<div className={`competency-block ${index === 0 ? 'blue' : 'red'}`}>
											<div className='block-header'>
												<div className='title'>{item?.attribute?.name.toUpperCase()}</div>
												<div className='desc'>{item?.attribute?.description}</div>
												<div>
													<img src={item?.attribute?.icon} alt='logo' width={40} className='icon-white' />
												</div>
											</div>

											<DragTable
												item={{
													attributeId: item?.attribute?._id,
													activitiesOutCome: item?.activitiesOutCome ?? [],
												}}
												edit={edit}
												onChangeOrder={handleOrderChange}
											/>
										</div>
									</Col>
								))}
							</Row>
						</section>
					</div>
				</Col>
				<Col span={24} md={12}>
					<div className='cct-column right'>
						<Row gutter={[0, 20]}>
							{record?.attributes?.slice(2)?.map((item, index) => (
								<Col span={24}>
									<div className={`competency-block ${index === 1 ? 'red' : 'blue'}`}>
										<div className='block-header'>
											<div className='title'>{item?.attribute?.name.toUpperCase()}</div>
											<div className='desc'>{item?.attribute?.description}</div>
											<div>
												<img src={item?.attribute?.icon} alt='logo' width={40} className='icon-white' />
											</div>
										</div>

										<DragTable
											item={{
												attributeId: item?.attribute?._id,
												activitiesOutCome: item?.activitiesOutCome ?? [],
											}}
											edit={edit}
											onChangeOrder={handleOrderChange}
										/>
									</div>
								</Col>
							))}
						</Row>

						<section className='awards'>
							<section className='skills-section'>
								<h3>AWARDS & RECOGNITION</h3>
							</section>

							<DragAwards
								data={sortedAwards}
								edit={edit}
								onChangeOrder={(ids) => {
									setListAwardRecognition?.(ids);
								}}
							/>
						</section>

						<footer className='transcript-footer'>
							<div className='divider'>
								<span>END OF TRANSCRIPT</span>
							</div>
							<section className='skills-section'>
								<h3>LEVEL OF ENGAGEMENT</h3>
							</section>

							<span
								style={{
									fontSize: 13,
									fontWeight: 600,
								}}
							>
								The following role classifications describe the level of responsibility and impact demonstrated by the
								student in each activity:
							</span>

							<div className='gauge-row'>
								<div className='gauge-container'>
									<Chart
										options={{
											chart: {
												type: 'donut',
											},
											colors: ['#7EA4D5', '#F7981D', '#058069', '#A91F24'],
											labels: (record?.levelOfEngagement ?? []).map((item) => item?.level?.name?.toUpperCase?.() || ''),

											stroke: {
												show: true,
												width: 4,
												colors: ['#ffffff'],
												lineCap: 'round',
											},

											dataLabels: {
												enabled: true,
												formatter: (val: number) => `${Math.round(val)}%`,
												style: {
													fontSize: '13px', // ✅ Tăng font size
													fontWeight: 'bold',
													colors: ['#fff'],
												},
												dropShadow: {
													enabled: false,
												},
											},

											legend: { show: false },

											plotOptions: {
												pie: {
													expandOnClick: false,
													donut: {
														size: '50%',
														labels: {
															show: true,
															total: {
																show: true,
																showAlways: true,
																label: '',
																formatter: (w: any) => {
																	const max = Math.max(...w.globals.series);
																	return `${max}%`;
																},
																fontSize: '22px',
																fontWeight: 'bold',
																color: '#1a1a2e',
															},
															value: { show: false },
															name: { show: false },
														},
													},
												},
											},

											tooltip: { enabled: true },
										}}
										series={(record?.levelOfEngagement ?? []).map((item) => item?.percentage ?? 0)}
										type='donut'
										width={220}
										height={220}
									/>
								</div>

								<div className='role-desc'>
									{record?.levelOfEngagement?.map((item, index) => (
										<div key={index} style={{ marginBottom: '12px' }}>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: '8px',
													fontWeight: '600',
													color: '#134D8B',
													width: '100%',
												}}
											>
												<div
													style={{
														width: '20px',
														height: '12px',
														backgroundColor: ['#7EA4D5', '#F7981D', '#058069', '#A91F24'][index],
														borderRadius: '4px',
													}}
												/>

												<span style={{ minWidth: '100px' }}>{item.level?.name?.toUpperCase?.()}</span>

												<Rate
													disabled
													value={mapLevelToStar(item?.level?.name)}
													count={mapLevelToStar(item?.level?.name)}
													style={{ fontSize: 12 }}
												/>

												<span style={{ marginLeft: 'auto' }}>{item?.percentage ?? 0}%</span>
											</div>

											<p style={{ margin: '2px 0 0 28px', fontStyle: 'italic', fontSize: '12px', color: '#555' }}>
												{item.level?.description}
											</p>
										</div>
									))}
								</div>
							</div>
						</footer>

						<div className='info-footer'>
							<span>
								<i>This Transcript is officially issued and verified by VinUniversity</i>
							</span>
							{record?.myCCT?.dateOfIssue && (
								<span>
									<i>Date of Issue: {record?.myCCT?.dateOfIssue ?? '--'}</i>
								</span>
							)}
							{record?.myCCT?.serialNumber && (
								<span>
									<i>Serial Number: {record?.myCCT?.serialNumber || ' --'}</i>
								</span>
							)}
						</div>

						{record?.myCCT?.status === EStatusMyCCT.APPROVED && (
							<div
								style={{
									width: '100%',
									textAlign: 'right',
									position: 'relative',
									display: 'inline-block',
								}}
							>
								<img src='/images/cct/footer.png' alt='logo' width={120} />

								<div
									style={{
										position: 'absolute',
										top: 10,
										right: 10,
										transform: 'rotate(-15deg)',
										border: '2px solid #d32f2f',
										color: '#d32f2f',
										padding: '4px 10px',
										fontWeight: 'bold',
										fontSize: 12,
										background: 'rgba(255,255,255,0.7)',
										borderRadius: 4,
										letterSpacing: 1,
										textTransform: 'uppercase',
										boxShadow: '0 0 6px rgba(0,0,0,0.2)',
									}}
								>
									Approved ✓
								</div>
							</div>
						)}
					</div>
				</Col>
			</Row>
		</Spin>
	);
};

export default CCTContent;
