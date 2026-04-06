import { Activity } from '@/services/CCT/Activity/typing';
import { EApprovalStatus } from '@/services/CCT/constant';
import { FileOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Empty, Input, List, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import FormRoleEvidence from '../../History/components/FormRoleEvidence';
import CardSuKienCCT from './CardSuKien';

const CardChiTietSuKien = (props: {
	record: Activity.IRecord;
	evidenceDeadline: string;
	infoEvidence?: boolean;
	activeKey?: string;
	isExpired?: boolean;
	isRegister?: boolean;
}) => {
	const { record, evidenceDeadline, infoEvidence, activeKey, isExpired, isRegister } = props;

	const registered = record?.numberOfRegisteredActivityOutcomes ?? 0;
	const capacity = record?.capacity;
	const isFull = capacity && registered >= capacity;

	const approvalWorkflow =
		record?.activityOutcome?.workflow === EApprovalStatus.APPROVED ||
		record?.activityOutcome?.workflow === EApprovalStatus.REJECTED ||
		record?.activityOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED;

	return (
		<Row gutter={[12, 12]}>
			<Col span={24} md={9}>
				<CardSuKienCCT
					record={{ ...record, activityOutcome: record?.activityOutcome }}
					banner={record?.banner ?? undefined}
					name={record?.name}
					startDate={record?.startDate ? dayjs(record?.startDate).format('HH:mm DD/MM/YYYY') : '--'}
					endDate={record?.endDate ? dayjs(record?.endDate).format('HH:mm DD/MM/YYYY') : '--'}
					equivalencyAttributeIds={record?.coCurricularActivityEquivalency?.map((x) => x.attributesId) ?? []}
					isDetail
					activeKey={activeKey}
					isExpired={isExpired}
					isRegister={isRegister}
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
								<div className='info-value'>{record?.organizer ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Approver</div>
								<div className='info-value'>
									{record?.activityOutcome?.workflow === EApprovalStatus.APPROVED &&
									!record?.activityOutcome?.studentDeclarationApproverName
										? 'System'
										: approvalWorkflow
											? record?.activityOutcome?.studentDeclarationApproverName
											: record?.studentDeclarationApproverList
													?.map((item) => item?.name)
													.filter(Boolean)
													.join(', ')}
								</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Activity Group</div>
								<div className='info-value'>
									{record?.activitiesType?.activitiesTypeDomainText ??
										record?.activitiesType?.activitiesTypeDomain?.name ??
										'--'}
								</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Activity Type</div>
								<div className='info-value'>{record?.activitiesType?.name ?? '--'}</div>
							</div>
							{/* <div className='info-item'>
								<div className='info-label'>Track</div>
								<div className='info-value'>
									{record?.activitiesType?.trackText ?? record?.activitiesType?.track?.name ?? '--'}
								</div>
							</div> */}
							<div className='info-item'>
								<div className='info-label'>Capacity</div>
								<div
									className='info-value'
									style={{
										color: isFull ? '#C72127' : undefined,
									}}
								>
									{capacity ? (
										<>
											{`${registered} / ${capacity}`}
											{isFull && ' (Full Slot)'}
										</>
									) : (
										'--'
									)}
								</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Allow post-event results update</div>
								<div className='info-value'>{record?.allowPostEventResultsUpdate ? 'Yes' : 'No'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>Evidence Update Deadline</div>
								<div className='info-value'>{evidenceDeadline}</div>
							</div>
							{(!record?.activityOutcome?.workflow ||
								record?.activityOutcome?.workflow === EApprovalStatus.EVIDENCE_REQUIRED) && (
								<div className='info-item'>
									<div className='info-label'>Required Evidence</div>
									<div className='info-value'>
										{record?.activitiesType?.requiredEvidenceList
											? record?.activitiesType?.requiredEvidenceList
													?.map((item) => item)
													.filter(Boolean)
													.join(', ')
											: '--'}
									</div>
								</div>
							)}
							{!!record?.activityOutcome?.workflow &&
								record?.activityOutcome?.workflow !== EApprovalStatus.DRAFT &&
								record?.activityOutcome?.workflow !== EApprovalStatus.EVIDENCE_REQUIRED && (
									<div className='info-item'>
										<div className='info-label'>Submission Time</div>
										<div className='info-value'>
											{record?.activityOutcome?.submittedAt
												? dayjs(record?.activityOutcome?.submittedAt).format('HH:mm DD/MM/YYYY')
												: '--'}
										</div>
									</div>
								)}
							{(record?.activityOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
								record?.activityOutcome?.workflow === EApprovalStatus.REJECTED ||
								record?.activityOutcome?.workflow === EApprovalStatus.APPROVED) && (
								<div className='info-item'>
									<div className='info-label'>Evidence Review Time</div>
									<div className='info-value'>
										{record?.activityOutcome?.approvalTime
											? dayjs(record?.activityOutcome?.approvalTime).format('HH:mm DD/MM/YYYY')
											: '--'}
									</div>
								</div>
							)}
						</div>
					</div>
				</Card>
			</Col>

			{(record?.activityOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
				!!record?.activityOutcome?.revisionNote) && (
				<Col span={24}>
					<Card variant='borderless' size='small'>
						<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
							Revision Note
						</Divider>
						<span>{record?.activityOutcome?.revisionNote}</span>
					</Card>
				</Col>
			)}

			{(record?.activityOutcome?.workflow === EApprovalStatus.REJECTED ||
				!!record?.activityOutcome?.activityRejectionNote) && (
				<Col span={24}>
					<Card variant='borderless' size='small'>
						<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
							Rejection Note
						</Divider>
						<span>{record?.activityOutcome?.activityRejectionNote}</span>
					</Card>
				</Col>
			)}

			<Col span={24}>
				<Card variant='borderless' size='small'>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
						{infoEvidence && activeKey !== '1' ? 'Evidence Information' : 'Role'}
					</Divider>
					<FormRoleEvidence
						equivalency={record?.coCurricularActivityEquivalency ?? []}
						select={infoEvidence && activeKey !== '1'}
						rolesId={record?.activityOutcome?.rolesId}
					/>

					{infoEvidence && activeKey !== '1' && (
						<div className='custom-info-grid grid-2' style={{ marginTop: 16 }}>
							<div className='info-row'>
								{/* <div className='info-item'>
									<div style={{ marginBottom: 8, fontWeight: 600 }}>Track</div>
									<Input
										disabled
										value={
											record?.activityOutcome?.trackText ?? record?.activityOutcome?.track?.name ?? 'No information'
										}
									/>
								</div> */}
								<div className='info-item'>
									<div style={{ marginBottom: 8, fontWeight: 600 }}>Level</div>
									<Input disabled value={record?.activityOutcome?.levels?.name ?? 'No information'} />
								</div>
								<div className='info-item full-width'>
									<div style={{ marginBottom: 8, fontWeight: 600 }}>List Evidence</div>

									<List
										size='small'
										dataSource={
											record?.activityOutcome?.evidenceFile?.flatMap((item: any) =>
												item.file.map((url: string) => ({
													name: item.name,
													url,
												})),
											) ?? []
										}
										locale={{
											emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No List Evidence' />,
										}}
										renderItem={(item: any) => (
											<List.Item>
												<Typography.Link
													href={item.url}
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
									<Input.TextArea rows={3} disabled value={record?.activityOutcome?.reflection ?? 'No information'} />
								</div>
							</div>
						</div>
					)}
				</Card>
			</Col>

			<Col span={24}>
				<Card variant='borderless' size='small'>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
						Competency
					</Divider>
					<div className='competency-list'>
						{infoEvidence
							? record?.activityOutcome?.listAchievedCompetencies?.map((item) => (
									<div className='competency-item'>
										<span className='competency-title'>{item?.competencie?.name}</span>
										<p className='competency-desc'>{item?.competencie?.description}</p>
									</div>
								))
							: record?.competencyList?.map((item) => (
									<div className='competency-item'>
										<span className='competency-title'>{item?.competency?.name}</span>
										<p className='competency-desc'>{item?.competency?.description}</p>
									</div>
								))}
					</div>
				</Card>
			</Col>

			<Col span={24}>
				<Card variant='borderless' size='small'>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
						Activity Description
					</Divider>
					<span>{record?.description}</span>
				</Card>
			</Col>
		</Row>
	);
};

export default CardChiTietSuKien;
