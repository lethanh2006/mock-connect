import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EApprovalStatus } from '@/services/CCT/constant';
import { FileOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Empty, Input, List, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import CardSuKienCCT from '../../Activity/components/CardSuKien';

const ChiTietActivityOutCome = (props: { recOutcome: ActivityOutCome.IRecord }) => {
	const { recOutcome } = props;

	return (
		<Row gutter={[12, 12]}>
			<Col span={24} md={9}>
				<CardSuKienCCT
					record={{
						...recOutcome?.activities,
						activityOutcome: recOutcome,
					}}
					banner={recOutcome?.banner}
					name={recOutcome?.activitiesOutcomeName}
					startDate={recOutcome?.startDate ? dayjs(recOutcome?.startDate).format('HH:mm DD/MM/YYYY') : '--'}
					endDate={recOutcome?.endDate ? dayjs(recOutcome?.endDate).format('HH:mm DD/MM/YYYY') : '--'}
					equivalencyAttributeIds={recOutcome?.activitiesType?.attributes?.map((x) => x._id)}
					isPersonal
					isDetail
					isExpired={
						recOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED && dayjs().isAfter(dayjs(recOutcome?.dueDate))
					}
				/>
			</Col>
			<Col span={24} md={15}>
				<Card variant='borderless' size='small'>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
						Administrative Information
					</Divider>

					<div className='custom-info-grid grid-2'>
						<div className='info-row'>
							<div className='info-item'>
								<div className='info-label'>Organizer</div>
								<div className='info-value'>{recOutcome?.organizer ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Approver</div>
								<div className='info-value'>{recOutcome?.studentDeclarationApproverName ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Activity Group</div>
								<div className='info-value'>{recOutcome?.activitiesType?.activitiesTypeDomain?.name ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Activity Type</div>
								<div className='info-value'>{recOutcome?.activitiesType?.name ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Track</div>
								<div className='info-value'>{recOutcome?.trackText ?? recOutcome?.track?.name ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Mentor/Supervisor</div>
								<div className='info-value'>{recOutcome?.supervisorName ?? '--'}</div>
							</div>
							{(recOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
								recOutcome?.workflow === EApprovalStatus.EXPIRED) && (
								<div className='info-item'>
									<div className='info-label'>Evidence Update Deadline</div>
									<div className='info-value'>
										{recOutcome?.dueDate ? dayjs(recOutcome?.dueDate).format('HH:mm DD/MM/YYYY') : '--'}
									</div>
								</div>
							)}
							{!!recOutcome?.workflow &&
								recOutcome?.workflow !== EApprovalStatus.DRAFT &&
								recOutcome?.workflow !== EApprovalStatus.EVIDENCE_REQUIRED && (
									<div className='info-item'>
										<div className='info-label'>Submission Time</div>
										<div className='info-value'>
											{recOutcome.submittedAt ? dayjs(recOutcome.submittedAt).format('HH:mm DD/MM/YYYY') : '--'}
										</div>
									</div>
								)}
							{recOutcome?.workflow !== EApprovalStatus.DRAFT && recOutcome?.workflow !== EApprovalStatus.SUBMITTED && (
								<div className='info-item'>
									<div className='info-label'>Evidence Review Time</div>
									<div className='info-value'>
										{recOutcome?.approvalTime ? dayjs(recOutcome?.approvalTime).format('HH:mm DD/MM/YYYY') : '--'}
									</div>
								</div>
							)}
						</div>
					</div>
				</Card>
			</Col>

			{(recOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED || !!recOutcome?.revisionNote) && (
				<Col span={24}>
					<Card variant='borderless' size='small'>
						<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
							Revision Note
						</Divider>
						<span>{recOutcome?.revisionNote}</span>
					</Card>
				</Col>
			)}

			{(recOutcome?.workflow === EApprovalStatus.REJECTED || !!recOutcome?.activityRejectionNote) && (
				<Col span={24}>
					<Card variant='borderless' size='small'>
						<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
							Rejection Note
						</Divider>
						<span>{recOutcome?.activityRejectionNote}</span>
					</Card>
				</Col>
			)}

			<Col span={24}>
				<Card variant='borderless' size='small'>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
						Evidence Information
					</Divider>

					<div className='custom-info-grid grid-2' style={{ marginTop: 16 }}>
						<div className='info-row'>
							<div className='info-item'>
								<div style={{ marginBottom: 8, fontWeight: 600 }}>Role</div>
								<Input disabled value={recOutcome?.roles?.name ?? 'No information'} />
							</div>
							<div className='info-item'>
								<div style={{ marginBottom: 8, fontWeight: 600 }}>Level</div>
								<Input disabled value={recOutcome?.levels?.name ?? 'No information'} />
							</div>
							<div className='info-item full-width'>
								<div style={{ marginBottom: 8, fontWeight: 600 }}>List Evidence</div>
								<List
									size='small'
									dataSource={recOutcome?.evidenceFile ?? []}
									locale={{
										emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No List Evidence' />,
									}}
									renderItem={(item: any) => (
										<List.Item>
											<Typography.Link
												href={item.file}
												target='_blank'
												rel='noopener noreferrer'
												style={{ display: 'flex', alignItems: 'center', gap: 8 }}
											>
												<FileOutlined />
												<span>{item.name}</span>
											</Typography.Link>
										</List.Item>
									)}
								/>
							</div>
							<div className='info-item full-width'>
								<div style={{ marginBottom: 8, fontWeight: 600 }}>Reflection</div>
								<Input.TextArea rows={3} disabled value={recOutcome?.reflection ?? 'No information'} />
							</div>
						</div>
					</div>
				</Card>
			</Col>

			<Col span={24}>
				<Card variant='borderless' size='small'>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
						Competency
					</Divider>
					<div className='competency-list'>
						{recOutcome?.listAchievedCompetencies?.map((item) => (
							<div className='competency-item'>
								<span className='competency-title'>{item?.competencie?.name}</span>
								<p className='competency-desc'>{item?.competencie?.description}</p>
							</div>
						))}
					</div>
				</Card>
			</Col>
		</Row>
	);
};

export default ChiTietActivityOutCome;
