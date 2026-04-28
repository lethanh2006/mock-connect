import background from '@/assets/cct/background.png';
import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EApprovalStatus } from '@/services/CCT/constant';
import { getNameFile } from '@/utils/utils';
import { FileOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Empty, Input, List, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useIntl } from 'umi';
import CardSuKienCCT from '../../Activity/components/CardSuKien';

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
								{/* <div className='info-item'>
								<div className='info-label'>Track</div>
								<div className='info-value'>{recOutcome?.trackText ?? recOutcome?.track?.name ?? '--'}</div>
							</div> */}
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
								{recOutcome?.workflow !== EApprovalStatus.DRAFT &&
									recOutcome?.workflow !== EApprovalStatus.SUBMITTED && (
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
										renderItem={(item: any) => {
											return (
												<List.Item>
													<div>
														<div style={{ fontWeight: 600 }}>{item.name}</div>

														{item?.file?.map((url: string, index: number) => (
															<Typography.Link
																key={index}
																style={{ display: 'flex', alignItems: 'center', gap: 8 }}
																onClick={() => {
																	setPreviewImage(url);
																	setPreviewOpen(true);
																}}
															>
																<FileOutlined />
																<span>{getNameFile(url)}</span>
															</Typography.Link>
														))}
													</div>
												</List.Item>
											);
										}}
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

			<ModalExpandable
				title='File Preview'
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
