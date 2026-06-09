import Awards from '@/assets/cct/Awards.png';
import bgcct from '@/assets/cct/bg-cct.png';
import Featured from '@/assets/cct/Featured.png';
import Profile from '@/assets/cct/Profile.png';
import Skills from '@/assets/cct/Skills.png';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import rules from '@/utils/rules';
import { Checkbox, Col, Form, FormInstance, Input, Row, Spin } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useModel } from 'umi';

export const getLevelSymbol = (levelName: string) => {
	const map: Record<string, number> = {
		Participant: 1,
		Contributor: 2,
		Leader: 3,
		'Impact Driver': 4,
	};

	return '▶'.repeat(map[levelName] || 0);
};

const CCTContent = (props: {
	record: {
		activities: MyCCT.IActivityMyCCT[];
		allCompetencies: string[];
		attributes: MyCCT.IAttributeMyCCT[];
		levelOfEngagement: MyCCT.ILevelOfEngagement[];
		myCCT: MyCCT.IRecord;
		awardsAndRecognition: ActivityOutCome.IRecord[];
	};
	form: FormInstance;
	edit: boolean;
}) => {
	const { record, form, edit } = props;
	const { loading } = useModel('cct.mycct');
	const { loading: loadingDot } = useModel('cct.submissionround');

	const selectedCompetencies = Form.useWatch('listCompetency', form) || [];
	const isMaxSelected = selectedCompetencies.length >= 9;

	const selectedActivity = Form.useWatch('selectedActivities', form) || [];
	const isMaxSelectedActivity = selectedActivity.length >= 7;

	const selectedAward = Form.useWatch('listAwardRecognition', form) || [];
	const isMaxSelectedAward = selectedAward.length >= 7;

	const sortedActivities = _(record?.activities).orderBy(['year', '_levelOrderForSorting'], ['asc', 'desc']).value();
	const selectedActivities = sortedActivities.filter((item) => record?.myCCT?.selectedActivities?.includes(item.id));

	const renderItem = (item: any, withCheckbox = false) => {
		const content = (
			<div className='project-item'>
				<div className='project-year'>
					<span>{item?.year}</span>
					<span className='role-indicator level-2'>{getLevelSymbol(item.level)}</span>
				</div>

				<div className='project-detail'>
					<h3>{[item?.role, item?.activity].filter(Boolean).join(', ')}</h3>
					<p>
						<i>{item?.impact}</i>
					</p>
				</div>
			</div>
		);

		if (withCheckbox) {
			return (
				<div key={item.id} className='project-row'>
					<Checkbox
						value={item.id}
						disabled={!selectedActivity.includes(item.id) && isMaxSelectedActivity}
						style={{ fontSize: 9 }}
					/>
					<div className='project-content'>{content}</div>
				</div>
			);
		}

		return (
			<div key={item.id} className='project-row no-checkbox'>
				{content}
			</div>
		);
	};

	const sortedAwards = _.orderBy(record?.awardsAndRecognition ?? [], ['dateOfAchievement'], ['asc']);
	const selectedAwards = sortedAwards.filter((item) => record?.myCCT?.listAwardRecognition?.includes(item?._id));

	const renderAwards = (item: any, withCheckbox = false) => {
		const content = (
			<div className='award-item'>
				<h3>
					<span className='star'>★</span> {item?.competition} - {item?.rank},{' '}
					{dayjs(item?.dateOfAchievement).format('DD/MM/YYYY')}
				</h3>

				<p>
					<i>{item?.description}</i>
				</p>
			</div>
		);

		if (withCheckbox) {
			return (
				<div key={item._id} className='project-row'>
					<Checkbox
						value={item._id}
						disabled={!selectedAward.includes(item._id) && isMaxSelectedAward}
						style={{ fontSize: 9 }}
					/>
					{content}
				</div>
			);
		}

		return content;
	};

	return (
		<Spin spinning={loading || loadingDot}>
			<div className='cct-container'>
				<header className='cct-header'>
					<div className='header-content-cct'>
						<div className='header-title'>CO-CURRICULAR PORTFOLIO</div>
						<div className='university-logo'>
							<img src={bgcct} style={{ height: 60 }} />
						</div>
					</div>
				</header>

				<main className='cct-body'>
					<div className='column left-column'>
						<section className='intro-section'>
							<p className='intro-text'>
								<b>Co-curricular Portfolio (CCP)</b> is part of VinUniversity’s commitment to developing holistic
								graduates. This Portfolio documents the co-curricular experiences and developmental activities that
								students engage in during their time at VinUni, capturing evidence of their competencies, growth, and
								contributions beyond academic performance.
							</p>
							<div className='student-info'>
								<div className='info-group'>
									<p>Student name: {record?.myCCT?.name || '--'}</p>
									<p>Date of Birth: {record?.myCCT?.dob ? dayjs(record.myCCT.dob).format('DD/MM/YYYY') : '--'}</p>
									<p>Year of Enrollment: {record?.myCCT?.yearOfEnrollment ?? '--'}</p>
								</div>
								<div className='info-group'>
									<p>Student ID: {record?.myCCT?.code || '--'}</p>
									<p>
										{`Program: ${record?.myCCT?.program || ''}${
											record?.myCCT?.college ? ` - ${record?.myCCT?.college}` : ''
										}`}
									</p>
								</div>
							</div>
						</section>

						<section className='profile-section'>
							<div className='section-title gold-text'>
								<img src={Profile} style={{ width: 25, marginLeft: -4, marginTop: -4 }} /> Student Aspiration Statement
							</div>
							{edit ? (
								<Form.Item name='selfAspiration' rules={[...rules.required, ...rules.text]}>
									<Input.TextArea
										rows={3}
										placeholder='Enter Student Aspiration Statement'
										style={{ fontSize: '9px' }}
									/>
								</Form.Item>
							) : (
								<p className='italic-text'>{record?.myCCT?.selfAspiration ?? '--'}</p>
							)}
						</section>

						<section className='skills-section'>
							<div className='section-title gold-text'>
								<img src={Skills} style={{ width: 25, marginLeft: -4, marginTop: -7 }} /> Skills and Competency
								Development
							</div>
							<p className='italic-text'>
								<i>
									The following competencies were developed and demonstrated through verified co-curricular activities
									and experiences.
								</i>
							</p>

							{edit ? (
								<Form.Item
									name='listCompetency'
									rules={record?.allCompetencies?.length ? [...rules.required] : undefined}
								>
									<Checkbox.Group style={{ fontSize: 9 }}>
										<Row gutter={[12, 8]}>
											{record?.allCompetencies?.map((item) => (
												<Col span={12} key={item}>
													<Checkbox
														value={item}
														disabled={!selectedCompetencies.includes(item) && isMaxSelected}
														style={{ fontSize: 9 }}
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
									{record?.myCCT?.listCompetency?.length ? (
										record?.myCCT?.listCompetency?.map((skill, index) => (
											<div key={index} className='skill-item'>
												{skill}
											</div>
										))
									) : (
										<div className='skill-item'>--</div>
									)}
								</div>
							)}
						</section>

						<section className='projects-section'>
							<h2 className='section-title gold-text'>
								<img src={Featured} style={{ width: 25, marginLeft: -4, marginTop: -4 }} /> Featured Projects/Experience
							</h2>

							{edit ? (
								<Form.Item name='selectedActivities' rules={sortedActivities?.length ? [...rules.required] : undefined}>
									<Checkbox.Group style={{ fontSize: 9 }}>
										{sortedActivities.map((item) => renderItem(item, true))}
									</Checkbox.Group>
								</Form.Item>
							) : selectedActivities.length ? (
								selectedActivities.map((item) => renderItem(item))
							) : (
								<div className='project-item'>--</div>
							)}
						</section>
					</div>

					<div className='column right-column'>
						<section className='awards-section'>
							<h2 className='section-title gold-text'>
								<img src={Awards} style={{ width: 25, marginLeft: -7 }} /> Awards, Recognization and Scholarship
							</h2>

							{edit ? (
								<Form.Item
									name='listAwardRecognition'
									//  rules={[...rules.required]}
								>
									<Checkbox.Group style={{ fontSize: 9 }}>
										{sortedAwards?.map((item) => renderAwards(item, true))}
									</Checkbox.Group>
								</Form.Item>
							) : selectedAwards.length ? (
								selectedAwards.map((item) => renderAwards(item))
							) : (
								<div className='project-item'>--</div>
							)}
						</section>

						<section className='footer-legend'>
							<div className='end-transcript-divider'>
								<span>END OF PORTFOLIO</span>
							</div>
							<p className='italic-text' style={{ fontSize: 7 }}>
								<i>
									The following role classifications describe the level of responsibility and impact demonstrated by the
									student in each activity:
								</i>
							</p>

							<div className='legend-table'>
								<div className='legend-row'>
									<span className='symbol'>▶</span>
									<span className='label'>Participant</span>
									<span className='desc'>
										<i>Engages in activities and contributes to implementation</i>
									</span>
								</div>
								<div className='legend-row'>
									<span className='symbol'>▶▶</span>
									<span className='label'>Contributor</span>
									<span className='desc'>
										<i>Demonstrates initiative by contributing ideas and owning specific outputs.</i>
									</span>
								</div>
								<div className='legend-row'>
									<span className='symbol'>▶▶▶</span>
									<span className='label'>Leader</span>
									<span className='desc'>
										<i>Provides direction, mobilizes people, and delivers results.</i>
									</span>
								</div>
								<div className='legend-row'>
									<span className='symbol'>▶▶▶▶</span>
									<span className='label'>Impact Driver</span>
									<span className='desc'>
										<i>Creates scalable impact that extends beyond the original project or context.</i>
									</span>
								</div>
								{/* {record?.levelOfEngagement
									?.sort((a, b) => a.level.order - b.level.order)
									?.map((item) => (
										<div className='legend-row' key={item.level._id}>
											<span className='symbol'>{getLevelSymbol(item.level.name)}</span>

											<span className='label'>{item.level.name}</span>
											<span className='desc'>
												<i>{item.level.description}</i>
											</span>
										</div>
									))} */}
							</div>

							<div className='signatures'>
								<div className='issue-info'>
									<p>
										<i>Serial Number</i>: {record?.myCCT?.serialNumber || ' --'}
									</p>
									<p>
										<i>Date of Issue</i>: {record?.myCCT?.dateOfIssue ?? '--'}
									</p>
								</div>
								<div className='provost-sig'>
									<div>PROVOST OF VINUNIVERSITY</div>
									<div className='sig-name'>Prof. Tan Yap Peng</div>
								</div>
							</div>
						</section>
					</div>
				</main>

				<div className='title-bottom'>
					<i>This Portfolio is officially issued and verified by VinUniversity</i>
				</div>
			</div>
		</Spin>
	);
};

export default CCTContent;
