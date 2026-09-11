import background from '@/assets/cct/background.png';
import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { Activity } from '@/services/CCT/Activity/typing';
import { EApprovalStatus } from '@/services/CCT/constant';
import { getNameFile, getPreviewUrl, isFileUrl } from '@/utils/utils';
import { IconDocument } from '@/components/Icons';
import { Button, Card, Col, Divider, Empty, Input, List, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useIntl } from 'umi';
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
	const intl = useIntl();
	const { record, evidenceDeadline, infoEvidence, activeKey, isExpired, isRegister } = props;
	const [previewOpen, setPreviewOpen] = useState<boolean>(false);
	const [previewImage, setPreviewImage] = useState<string>('');

	const registered = record?.numberOfRegisteredActivityOutcomes ?? 0;
	const capacity = record?.capacity;
	const isFull = capacity && registered >= capacity;

	const approvalWorkflow =
		record?.activityOutcome?.workflow === EApprovalStatus.APPROVED ||
		record?.activityOutcome?.workflow === EApprovalStatus.REJECTED ||
		record?.activityOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED;

	return (
		<>
			<Row gutter={[12, 12]}>
				<Col span={24} md={9}>
					<CardSuKienCCT
						record={{ ...record, activityOutcome: record?.activityOutcome }}
						banner={record?.banner ?? background}
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
							{intl.formatMessage({ id: 'activity.chitiet.admin' })}
						</Divider>

						<div className='custom-info-grid grid-2'>
							<div className='info-row'>
								<div className='info-item'>
									<div className='info-label'>{intl.formatMessage({ id: 'activity.chitiet.organizer' })}</div>
									<div className='info-value'>{record?.organizer ?? '--'}</div>
								</div>
								<div className='info-item'>
									<div className='info-label'>{intl.formatMessage({ id: 'activity.chitiet.approver' })}</div>
									<div className='info-value'>
										{record?.activityOutcome?.workflow === EApprovalStatus.APPROVED &&
										!record?.activityOutcome?.studentDeclarationApproverName
											? intl.formatMessage({ id: 'activity.chitiet.system' })
											: approvalWorkflow
												? record?.activityOutcome?.studentDeclarationApproverName
												: record?.studentDeclarationApproverList
														?.map((item) => item?.name)
														.filter(Boolean)
														.join(', ')}
									</div>
								</div>
								<div className='info-item'>
									<div className='info-label'>{intl.formatMessage({ id: 'activity.chitiet.group' })}</div>
									<div className='info-value'>
										{record?.activitiesType?.activitiesTypeDomainText ??
											record?.activitiesType?.activitiesTypeDomain?.name ??
											'--'}
									</div>
								</div>
								<div className='info-item'>
									<div className='info-label'>{intl.formatMessage({ id: 'activity.chitiet.type' })}</div>
									<div className='info-value'>{record?.activitiesType?.name ?? '--'}</div>
								</div>
								{/* <div className='info-item'>
								<div className='info-label'>Track</div>
								<div className='info-value'>
									{record?.activitiesType?.trackText ?? record?.activitiesType?.track?.name ?? '--'}
								</div>
							</div> */}
								<div className='info-item'>
									<div className='info-label'>{intl.formatMessage({ id: 'activity.chitiet.capacity' })}</div>
									<div
										className='info-value'
										style={{
											color: isFull ? '#C72127' : undefined,
										}}
									>
										{capacity ? (
											<>
												{`${registered} / ${capacity}`}
												{isFull && ` (${intl.formatMessage({ id: 'activity.chitiet.full' })})`}
											</>
										) : (
											'--'
										)}
									</div>
								</div>
								<div className='info-item'>
									<div className='info-label'>{intl.formatMessage({ id: 'activity.chitiet.allowUpdate' })}</div>
									<div className='info-value'>
										{record?.allowPostEventResultsUpdate
											? intl.formatMessage({ id: 'activity.chitiet.yes' })
											: intl.formatMessage({ id: 'activity.chitiet.no' })}
									</div>
								</div>
								<div className='info-item'>
									<div className='info-label'>{intl.formatMessage({ id: 'activity.chitiet.deadline' })}</div>
									<div className='info-value'>{evidenceDeadline}</div>
								</div>
								{(!record?.activityOutcome?.workflow ||
									record?.activityOutcome?.workflow === EApprovalStatus.EVIDENCE_REQUIRED) && (
									<div className='info-item'>
										<div className='info-label'>{intl.formatMessage({ id: 'activity.chitiet.requiredEvidence' })}</div>
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
											<div className='info-label'>{intl.formatMessage({ id: 'activity.chitiet.submissionTime' })}</div>
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
										<div className='info-label'>{intl.formatMessage({ id: 'activity.chitiet.reviewTime' })}</div>
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
								{intl.formatMessage({ id: 'activity.chitiet.revisionNote' })}
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
								{intl.formatMessage({ id: 'activity.chitiet.rejectionNote' })}
							</Divider>
							<span>{record?.activityOutcome?.activityRejectionNote}</span>
						</Card>
					</Col>
				)}

				<Col span={24}>
					<Card variant='borderless' size='small'>
						<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
							{infoEvidence && activeKey !== '1'
								? intl.formatMessage({ id: 'activity.chitiet.evidenceInfo' })
								: intl.formatMessage({ id: 'activity.chitiet.role' })}
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
										<div style={{ marginBottom: 8, fontWeight: 600 }}>
											{intl.formatMessage({ id: 'activity.chitiet.level' })}
										</div>
										<Input
											disabled
											value={
												record?.activityOutcome?.levels?.name ?? intl.formatMessage({ id: 'activity.chitiet.noInfo' })
											}
										/>
									</div>
									<div className='info-item full-width'>
										<div style={{ marginBottom: 8, fontWeight: 600 }}>
											{intl.formatMessage({ id: 'activity.chitiet.listEvidence' })}
										</div>

										<List
											size='small'
											dataSource={record?.activityOutcome?.evidenceFile ?? []}
											locale={{
												emptyText: (
													<Empty
														image={Empty.PRESENTED_IMAGE_SIMPLE}
														description={intl.formatMessage({ id: 'activity.chitiet.noEvidence' })}
													/>
												),
											}}
											renderItem={(item: any) => {
												return (
													<List.Item>
														<div>
															<div>{item.name}</div>

															{item?.file?.map((url: string, index: number) => (
																<Typography.Link
																	key={index}
																	style={{ display: 'flex', alignItems: 'center', gap: 8 }}
																	onClick={async () => {
																		setPreviewImage(await getPreviewUrl(url));
																		setPreviewOpen(true);
																	}}
																>
																	<IconDocument />
																	<span>{isFileUrl(url) ? getNameFile(url) : `File ${index + 1}`}</span>
																</Typography.Link>
															))}
														</div>
													</List.Item>
												);
											}}
										/>
									</div>
									<div className='info-item full-width'>
										<div style={{ marginBottom: 8, fontWeight: 600 }}>
											{intl.formatMessage({ id: 'activity.chitiet.reflection' })}
										</div>
										<Input.TextArea
											rows={3}
											disabled
											value={
												record?.activityOutcome?.reflection ?? intl.formatMessage({ id: 'activity.chitiet.noInfo' })
											}
										/>
									</div>
								</div>
							</div>
						)}
					</Card>
				</Col>

				<Col span={24}>
					<Card variant='borderless' size='small'>
						<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
							{intl.formatMessage({ id: 'activity.chitiet.competency' })}
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
							{intl.formatMessage({ id: 'activity.chitiet.description' })}
						</Divider>
						<span>{record?.description}</span>
					</Card>
				</Col>
			</Row>

			<ModalExpandable
				title={intl.formatMessage({ id: 'activity.chitiet.preview' })}
				width={1200}
				open={previewOpen}
				footer={null}
				onCancel={() => setPreviewOpen(false)}
			>
				<PreviewFile file={previewImage} isPrivate />

				<div className='form-footer'>
					<Button onClick={() => setPreviewOpen(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</ModalExpandable>
		</>
	);
};

export default CardChiTietSuKien;
