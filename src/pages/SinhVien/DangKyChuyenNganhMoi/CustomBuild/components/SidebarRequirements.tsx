import dayjs from '@/utils/dayjs';
import { Affix, Card, Col, Divider } from 'antd';
import { useIntl, useModel } from 'umi';

const SidebarRequirements = () => {
	const intl = useIntl();
	const { record: kyHienTai } = useModel('daotao.dotdkctdt');
	const gpa = kyHienTai?.gpaMin ?? '-';
	const minCredits = kyHienTai?.minCredit ?? '-';
	const completedCreditsMax = kyHienTai?.maxCompletedCredit ?? '-';
	const completedCredits =
		completedCreditsMax != null
			? intl.formatMessage({ id: 'minor.idm.sidebar.completedCreditsMaxFormat' }, { count: completedCreditsMax })
			: intl.formatMessage({ id: 'minor.idm.sidebar.completedCreditsDefault' });

	return (
		<Col xs={24} lg={8}>
			<Affix offsetTop={80}>
				<Card title={intl.formatMessage({ id: 'minor.idm.sidebar.requirements' })} style={{ height: 'fit-content' }}>
					<div>
						<Divider orientation='left' className='divider-big-title' dashed>
							{intl.formatMessage({ id: 'minor.idm.sidebar.mandatoryRequirements' })}
						</Divider>
						<ul>
							<li>
								{intl.formatMessage({ id: 'minor.idm.requirement.gpa' })} {gpa}
							</li>
						</ul>
					</div>

					<div>
						<Divider orientation='left' className='divider-big-title' dashed>
							{intl.formatMessage({ id: 'minor.idm.sidebar.creditRequirements' })}
						</Divider>
						<ul>
							<li>
								{intl.formatMessage({ id: 'minor.idm.requirement.minCredits' })}
								{minCredits !== '-'
									? ` ${minCredits} ${intl.formatMessage({ id: 'minor.idm.credits' })}`
									: ` ${minCredits}`}
							</li>
							<li>
								{intl.formatMessage({ id: 'minor.idm.requirement.completedCredits' })} {completedCredits}
							</li>
						</ul>
					</div>

					<div>
						<Divider orientation='left' className='divider-big-title' dashed>
							{intl.formatMessage({ id: 'minor.idm.sidebar.deadlines' })}
						</Divider>
						<ul>
							<li>
								{intl.formatMessage(
									{ id: 'minor.idm.deadline.start' },
									{ date: dayjs(kyHienTai?.thoiGianBatDau?.toString()).format('DD/MM/YYYY') },
								)}
							</li>
							<li>
								{intl.formatMessage(
									{ id: 'minor.idm.deadline.end' },
									{ date: dayjs(kyHienTai?.thoiGianKetThuc?.toString()).format('DD/MM/YYYY') },
								)}
							</li>
						</ul>
					</div>

					<Card style={{ marginTop: 16 }}>
						<p style={{ fontWeight: 'bold' }}>{intl.formatMessage({ id: 'minor.idm.sidebar.note' })}</p>
						<p>{intl.formatMessage({ id: 'minor.idm.sidebar.noteContent' })}</p>
					</Card>
				</Card>
			</Affix>
		</Col>
	);
};

export default SidebarRequirements;
