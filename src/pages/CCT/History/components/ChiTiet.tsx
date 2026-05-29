import background from '@/assets/cct/background.png';
import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EApprovalStatus } from '@/services/CCT/constant';
import { getFileInfo } from '@/services/uploadFile';
import { ipFile } from '@/utils/ip';
import { getNameFile } from '@/utils/utils';
import { FileOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Empty, Input, List, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useIntl } from 'umi';
import CardSuKienCCT from '../../Activity/components/CardSuKien';

const getFileIdFromValue = (value: string) => {
	const cleanPath = value.split('?')[0].split('#')[0].replace(/^\/+/, '');
	if (/^[0-9a-f]{24}$/i.test(cleanPath)) return cleanPath;
	try {
		const url = new URL(value);
		const parts = url.pathname.split('/').filter(Boolean);
		if (parts.includes('file')) return undefined;
		return parts.length === 1 && /^[0-9a-f]{24}$/i.test(parts[0]) ? parts[0] : undefined;
	} catch {
		return undefined;
	}
};

const isFileUrl = (value: string) => /^https?:\/\//.test(value) || value?.includes('/file/');

const getPreviewUrl = async (value: string) => {
	const fileId = getFileIdFromValue(value);
	if (!fileId && isFileUrl(value)) return value;
	const id = fileId ?? value;
	const result = await getFileInfo(id, ipFile);
	const fileInfo = result?.data?.data;
	return `${ipFile}/file/${id}/${encodeURIComponent(fileInfo?.name ?? 'file')}`;
};

const ChiTietActivityOutCome = (props: { recOutcome: ActivityOutCome.IRecord }) => {
	const intl = useIntl();
	const { recOutcome } = props;
	const [previewOpen, setPreviewOpen] = useState<boolean>(false);
	const [previewImage, setPreviewImage] = useState<string>('');

	return (
		<>
			<Row gutter={[12, 12]}>
				<Col span={24} md={9}>
					<CardSuKienCCT
						record={{
							...recOutcome?.activities,
							activityOutcome: recOutcome,
						}}
						banner={recOutcome?.banner ?? background}
						name={recOutcome?.activitiesOutcomeName}
						startDate={recOutcome?.startDate ? dayjs(recOutcome?.startDate).format('HH:mm DD/MM/YYYY') : '--'}
						endDate={recOutcome?.endDate ? dayjs(recOutcome?.endDate).format('HH:mm DD/MM/YYYY') : '--'}
						equivalencyAttributeIds={recOutcome?.activitiesType?.attributes?.map((x) => x?._id)}
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
							{intl.formatMessage({ id: 'activity.outcome.detail.admin' })}
						</Divider>

						<div className='custom-info-grid grid-2'>
							<div className='info-row'>
								<div className='info-item'>
									<div className='info-label'>{intl.formatMessage({ id: 'activity.outcome.detail.organizer' })}</div>
									<div className='info-value'>{recOutcome?.organizer ?? '--'}</div>
								</div>
								<div className='info-item'>
									<div className='info-label'>{intl.formatMessage({ id: 'activity.outcome.detail.approver' })}</div>
									<div className='info-value'>{recOutcome?.studentDeclarationApproverName ?? '--'}</div>
								</div>
								<div className='info-item'>
									<div className='info-label'>{intl.formatMessage({ id: 'activity.outcome.detail.group' })}</div>
									<div className='info-value'>{recOutcome?.activitiesType?.activitiesTypeDomain?.name ?? '--'}</div>
								</div>
								<div className='info-item'>
									<div className='info-label'>{intl.formatMessage({ id: 'activity.outcome.detail.type' })}</div>
									<div className='info-value'>{recOutcome?.activitiesType?.name ?? '--'}</div>
								</div>
								{/* <div className='info-item'>
								<div className='info-label'>Track</div>
								<div className='info-value'>{recOutcome?.trackText ?? recOutcome?.track?.name ?? '--'}</div>
							</div> */}
								<div className='info-item'>
									<div className='info-label'>{intl.formatMessage({ id: 'activity.outcome.detail.supervisor' })}</div>
									<div className='info-value'>{recOutcome?.supervisorName ?? '--'}</div>
								</div>
								{(recOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
									recOutcome?.workflow === EApprovalStatus.EXPIRED) && (
									<div className='info-item'>
										<div className='info-label'>{intl.formatMessage({ id: 'activity.outcome.detail.deadline' })}</div>
										<div className='info-value'>
											{recOutcome?.dueDate ? dayjs(recOutcome?.dueDate).format('HH:mm DD/MM/YYYY') : '--'}
										</div>
									</div>
								)}
								{!!recOutcome?.workflow &&
									recOutcome?.workflow !== EApprovalStatus.DRAFT &&
									recOutcome?.workflow !== EApprovalStatus.EVIDENCE_REQUIRED && (
										<div className='info-item'>
											<div className='info-label'>
												{intl.formatMessage({ id: 'activity.outcome.detail.submissionTime' })}
											</div>
											<div className='info-value'>
												{recOutcome.submittedAt ? dayjs(recOutcome.submittedAt).format('HH:mm DD/MM/YYYY') : '--'}
											</div>
										</div>
									)}
								{recOutcome?.workflow !== EApprovalStatus.DRAFT &&
									recOutcome?.workflow !== EApprovalStatus.SUBMITTED && (
										<div className='info-item'>
											<div className='info-label'>
												{intl.formatMessage({ id: 'activity.outcome.detail.reviewTime' })}
											</div>
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
								{intl.formatMessage({ id: 'activity.outcome.detail.revisionNote' })}
							</Divider>
							<span>{recOutcome?.revisionNote}</span>
						</Card>
					</Col>
				)}

				{(recOutcome?.workflow === EApprovalStatus.REJECTED || !!recOutcome?.activityRejectionNote) && (
					<Col span={24}>
						<Card variant='borderless' size='small'>
							<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
								{intl.formatMessage({ id: 'activity.outcome.detail.rejectionNote' })}
							</Divider>
							<span>{recOutcome?.activityRejectionNote}</span>
						</Card>
					</Col>
				)}

				<Col span={24}>
					<Card variant='borderless' size='small'>
						<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
							{intl.formatMessage({ id: 'activity.outcome.detail.evidenceInfo' })}
						</Divider>

						<div className='custom-info-grid grid-2' style={{ marginTop: 16 }}>
							<div className='info-row'>
								<div className='info-item'>
									<div style={{ marginBottom: 8, fontWeight: 600 }}>
										{intl.formatMessage({ id: 'activity.outcome.detail.role' })}
									</div>
									<Input
										disabled
										value={recOutcome?.roles?.name ?? intl.formatMessage({ id: 'activity.outcome.detail.noInfo' })}
									/>
								</div>
								<div className='info-item'>
									<div style={{ marginBottom: 8, fontWeight: 600 }}>
										{intl.formatMessage({ id: 'activity.outcome.detail.level' })}
									</div>
									<Input
										disabled
										value={recOutcome?.levels?.name ?? intl.formatMessage({ id: 'activity.outcome.detail.noInfo' })}
									/>
								</div>
								<div className='info-item full-width'>
									<div style={{ marginBottom: 8, fontWeight: 600 }}>
										{intl.formatMessage({ id: 'activity.outcome.detail.listEvidence' })}
									</div>
									<List
										size='small'
										dataSource={recOutcome?.evidenceFile ?? []}
										locale={{
											emptyText: (
												<Empty
													image={Empty.PRESENTED_IMAGE_SIMPLE}
													description={intl.formatMessage({ id: 'activity.outcome.detail.noEvidence' })}
												/>
											),
										}}
										renderItem={(item: any) => {
											return (
												<List.Item>
													<div>
														<div style={{ fontWeight: 600 }}>{item.name}</div>

														{item?.file?.map((url: string, index: number) => (
															<Typography.Link
																key={index}
																style={{ display: 'flex', alignItems: 'center', gap: 8 }}
																onClick={async () => {
																	setPreviewImage(await getPreviewUrl(url));
																	setPreviewOpen(true);
																}}
															>
																<FileOutlined />
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
										{intl.formatMessage({ id: 'activity.outcome.detail.reflection' })}
									</div>
									<Input.TextArea
										rows={3}
										disabled
										value={recOutcome?.reflection ?? intl.formatMessage({ id: 'activity.outcome.detail.noInfo' })}
									/>
								</div>
							</div>
						</div>
					</Card>
				</Col>

				<Col span={24}>
					<Card variant='borderless' size='small'>
						<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
							{intl.formatMessage({ id: 'activity.outcome.detail.competency' })}
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

			<ModalExpandable
				title={intl.formatMessage({ id: 'activity.outcome.detail.preview' })}
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

export default ChiTietActivityOutCome;
