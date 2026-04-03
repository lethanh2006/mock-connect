import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EStatusMyCCT } from '@/services/CCT/constant';
import rules from '@/utils/rules';
import { Checkbox, Col, Form, FormInstance, Input, Row, Spin } from 'antd';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useModel } from 'umi';
import DragAwards from './DragAwards';
import DragTable from './DragTable';

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
							<div style={{ marginBottom: 20 }}>
								<img src='/student/logo-text.png' alt='logo' width={90} />
							</div>
							<h1>CO-CURRICULAR & COMPETENCY TRANSCRIPT</h1>
							<div style={{ marginTop: -5 }}>
								<span className='description'>
									Co-curricular & Competency Transcript (CCT) is part of VinUniversity’s commitment to developing
									holistic graduates. This transcript documents the co-curricular experiences and developmental
									activities that students engage in during their time at VinUni, capturing evidence of their
									competencies, growth, and contributions beyond academic performance.
								</span>
							</div>
						</header>

						<section className='student-meta'>
							<div className='meta-item'>
								<span>•</span> Student name: {record?.myCCT?.name || '--'}
							</div>
							<div className='meta-item'>
								<span>•</span> Student ID: {record?.myCCT?.code || '--'}
							</div>
							<div className='meta-item'>
								<span>•</span> Date of Birth: {record?.myCCT?.dob ? dayjs(record.myCCT.dob).format('DD/MM/YYYY') : '--'}
							</div>
							<div className='meta-item'>
								<span>•</span> {record?.myCCT?.college || '--'}
							</div>
							<div className='meta-item'>
								<span>•</span> Year of Enrollment: {record?.myCCT?.yearOfEnrollment ?? '--'}
							</div>
							<div className='meta-item'>
								<span>•</span>{' '}
								{[record?.myCCT?.program, `Concentration ${record?.myCCT?.concentration}`].filter(Boolean).join(' - ')}
							</div>
						</section>

						<section className='skills-section'>
							<h3>SELF-REFLECTION</h3>
							{edit ? (
								<Form.Item name='selfAspiration' rules={[...rules.required, ...rules.text]}>
									<Input.TextArea rows={3} placeholder='Enter Self-Reflection' />
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
							<h3 className='section-title'>Level of Engagement</h3>

							<div className='gauge-row'>
								{record?.levelOfEngagement?.map((item, index) => (
									<div className='gauge-item' key={index}>
										<div className='gauge-container'>
											<svg viewBox='0 0 100 55' className='gauge-svg'>
												<path
													className='gauge-bg'
													d='M 10 45 A 40 40 0 0 1 90 45'
													fill='none'
													stroke='#92b3d9'
													strokeWidth='12'
													strokeLinecap='round'
												/>
												<path
													className='gauge-progress'
													d='M 10 45 A 40 40 0 0 1 90 45'
													fill='none'
													stroke={'#005a8c'}
													strokeWidth='12'
													strokeLinecap='round'
													style={{
														strokeDasharray: 126,
														strokeDashoffset: 126 - (126 * (item?.percentage ?? 0)) / 100,
													}}
												/>
											</svg>
											<span className='gauge-value'>{item?.percentage ?? 0} %</span>
										</div>
										<div className='label'>{item.level?.name.toUpperCase()}</div>
									</div>
								))}
							</div>

							<div className='role-desc'>
								<p>
									<strong>
										The following role classifications describe the level of responsibility and impact demonstrated by
										the student in each activity:
									</strong>
								</p>

								<p>
									<b>PARTICIPANT:</b> Engages in activities and contributes to implementation.
								</p>
								<p>
									<b>CONTRIBUTOR:</b> Demonstrates initiative by contributing ideas and owning specific outputs.
								</p>
								<p>
									<b>LEADER:</b> Provides direction, mobilizes people, and delivers results.
								</p>
								<p>
									<b>IMPACT DRIVER:</b> Creates scalable impact that extends beyond the original project or context.
								</p>
							</div>
						</footer>

						<div className='info-footer'>
							<span>
								<i>This Transcript is officially issued and verified by VinUniversity</i>
							</span>
							<span>
								<i>Date of Issue: {record?.myCCT?.dateOfIssue ?? '--'}</i>
							</span>
							<span>
								<i>Serial Number: {record?.myCCT?.serialNumber || ' --'}</i>
							</span>
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
								<img src='/student/images/cct/footer.png' alt='logo' width={120} />

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
