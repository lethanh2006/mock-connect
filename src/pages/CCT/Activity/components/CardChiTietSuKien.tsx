import { Activity } from '@/services/CCT/Activity/typing';
import { EApprovalStatus, Evalidation, mapEvalidation } from '@/services/CCT/constant';
import { FileOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Empty, Input, List, Row, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import FormCompetencyEvidence from '../../History/components/FormCompetencyEvidence';
import FormRoleEvidence from '../../History/components/FormRoleEvidence';
import CardSuKienCCT from './CardSuKien';

const CardChiTietSuKien = (props: { record: Activity.IRecord; infoEvidence?: boolean }) => {
	const { record, infoEvidence } = props;

	const registered = record?.numberOfRegisteredActivityOutcomes ?? 0;
	const capacity = record?.capacity;
	const isFull = capacity && registered >= capacity;

	return (
		<Row gutter={[12, 12]}>
			<Col span={24} md={9}>
				<CardSuKienCCT
					record={{ ...record, workflow: record?.workflow }}
					equivalencyAttributeIds={record?.coCurricularActivityEquivalency?.map((x) => x.attributesId) ?? []}
					isDetail
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
									{record?.studentDeclarationApproverList
										? record?.studentDeclarationApproverList?.map((item) => item?.name).join(', ')
										: '--'}
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
							<div className='info-item'>
								<div className='info-label'>Track</div>
								<div className='info-value'>
									{record?.activitiesType?.trackText ?? record?.activitiesType?.track?.name ?? '--'}
								</div>
							</div>
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
								<div className='info-value'>
									{record?.allowPostEventResultsUpdate
										? record?.dueDate
											? dayjs(record?.dueDate).format('HH:mm DD/MM/YYYY')
											: '--'
										: '--'}
								</div>
							</div>
							<div className={`info-item  ${!record?.validation ? 'full-width' : ''}`}>
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
							{record?.validation && (
								<div className='info-item'>
									<div className='info-label'>Impact</div>
									<div className='info-value'>
										<Tag color={mapEvalidation[record?.validation as Evalidation]}>{record?.validation}</Tag>
									</div>
								</div>
							)}
						</div>
					</div>
				</Card>
			</Col>

			{(record?.workflow === EApprovalStatus.CHANGES_REQUIRED || !!record?.revisionNote) && (
				<Col span={24}>
					<Card variant='borderless' size='small'>
						<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
							Revision Note
						</Divider>
						<span>{record?.revisionNote}</span>
					</Card>
				</Col>
			)}

			{(record?.workflow === EApprovalStatus.REJECTED || !!record?.activityRejectionNote) && (
				<Col span={24}>
					<Card variant='borderless' size='small'>
						<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
							Rejection Note
						</Divider>
						<span>{record?.activityRejectionNote}</span>
					</Card>
				</Col>
			)}

			<Col span={24}>
				<Card variant='borderless' size='small'>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
						{infoEvidence ? 'Evidence Information' : 'Role'}
					</Divider>
					<FormRoleEvidence
						equivalency={record?.coCurricularActivityEquivalency ?? []}
						select={infoEvidence}
						rolesId={record?.rolesId}
					/>

					{infoEvidence && (
						<div className='custom-info-grid grid-2' style={{ marginTop: 16 }}>
							<div className='info-row'>
								<div className='info-item'>
									<div style={{ marginBottom: 8, fontWeight: 600 }}>Track</div>
									<Input disabled value={record?.tracks?.name ?? 'No information'} />
								</div>
								<div className='info-item'>
									<div style={{ marginBottom: 8, fontWeight: 600 }}>Level</div>
									<Input disabled value={record?.levels?.name ?? 'No information'} />
								</div>
								<div className='info-item full-width'>
									<div style={{ marginBottom: 8, fontWeight: 600 }}>List Evidence</div>
									<List
										size='small'
										dataSource={record?.evidenceFile ?? []}
										locale={{ emptyText: <Empty description='No competency file' /> }}
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
									<div style={{ marginBottom: 8, fontWeight: 600 }}>List Evidence</div>
									<FormCompetencyEvidence competencyList={record?.competencyList?.map((item) => item?.competencyId)} />
								</div>
								<div className='info-item full-width'>
									<div style={{ marginBottom: 8, fontWeight: 600 }}>Reflection</div>
									<Input.TextArea rows={3} disabled value={record?.reflection ?? 'No information'} />
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
						{record?.competencyList?.map((item) => (
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
