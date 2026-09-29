import background from '@/assets/cct/background.png';
import EmptyState from '@/components/EmptyState';
import { Badge, Button, IconDocument, IconHumanCheck, Input, Textarea } from '@/components/Icons';
import { Col, Row } from '@/components/MyGrid';
import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import ActivityCard from '@/pages/TrangChuV2/components/ActivityCard';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EApprovalStatus } from '@/services/CCT/constant';
import { formatDateTime } from '@/utils/formatDate';
import { getNameFile, getPreviewUrl, isFileUrl } from '@/utils/utils';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import { Field, Section } from '../../Activity/components/CardChiTietSuKien';

const ChiTietActivityOutCome = (props: { recOutcome: ActivityOutCome.IRecord }) => {
	const intl = useIntl();
	const { recOutcome } = props;
	const { danhSach: dsAttribute } = useModel('cct.attributes');
	const [previewOpen, setPreviewOpen] = useState<boolean>(false);
	const [previewImage, setPreviewImage] = useState<string>('');

	const msg = (id: string) => intl.formatMessage({ id: `activity.outcome.detail.${id}` });
	const workflow = recOutcome?.workflow;
	// Giữ đúng điều kiện cũ (CardSuKienCCT isExpired): cần chỉnh sửa nhưng đã quá hạn → hiện Expired
	const isExpired = workflow === EApprovalStatus.CHANGES_REQUIRED && dayjs().isAfter(dayjs(recOutcome?.dueDate));

	const equivalencyAttributeIds = recOutcome?.activitiesType?.attributes?.map((x) => x?._id) ?? [];
	const attributes = (dsAttribute ?? []).map((attribute: AttributesManagement.IRecord) => ({
		id: attribute._id,
		letter: attribute.code?.charAt(0)?.toUpperCase() ?? '',
		active: equivalencyAttributeIds.includes(attribute._id),
	}));

	return (
		<>
			<Row gutter={[16, 16]}>
				<Col span={24} md={9} className='activity-detail__card'>
					<ActivityCard
						title={recOutcome?.activitiesOutcomeName || '--'}
						banner={recOutcome?.banner ?? background}
						attributes={attributes}
						startDate={formatDateTime(recOutcome?.startDate) || '--'}
						endDate={formatDateTime(recOutcome?.endDate) || '--'}
						location={[recOutcome?.organizer, recOutcome?.location].filter(Boolean).join(', ')}
						approvalStatus={isExpired ? EApprovalStatus.EXPIRED : workflow}
						deadline={
							<span>
								{intl.formatMessage({ id: 'activity.history.approvedBy' })}{' '}
								{recOutcome?.studentDeclarationApproverName ?? '--'}
							</span>
						}
						deadlineIcon={<IconHumanCheck className='activity-figma-card__icon' />}
						extraTags={
							workflow === EApprovalStatus.APPROVED && recOutcome?.validation ? (
								<span className='activity-figma-card__status activity-figma-card__status--VERIFIED'>
									{recOutcome.validation}
								</span>
							) : undefined
						}
					/>
				</Col>
				<Col span={24} md={15}>
					<Section title={msg('admin')}>
						<div className='grid grid-cols-2 gap-4'>
							<Field label={msg('organizer')}>{recOutcome?.organizer ?? '--'}</Field>
							<Field label={msg('approver')}>{recOutcome?.studentDeclarationApproverName ?? '--'}</Field>
							<Field label={msg('group')}>{recOutcome?.activitiesType?.activitiesTypeDomain?.name ?? '--'}</Field>
							<Field label={msg('type')}>{recOutcome?.activitiesType?.name ?? '--'}</Field>
							<Field label={msg('supervisor')}>{recOutcome?.supervisorName ?? '--'}</Field>
							{(workflow === EApprovalStatus.CHANGES_REQUIRED || workflow === EApprovalStatus.EXPIRED) && (
								<Field label={msg('deadline')}>{formatDateTime(recOutcome?.dueDate) || '--'}</Field>
							)}
							{!!workflow && workflow !== EApprovalStatus.DRAFT && workflow !== EApprovalStatus.EVIDENCE_REQUIRED && (
								<Field label={msg('submissionTime')}>{formatDateTime(recOutcome?.submittedAt) || '--'}</Field>
							)}
							{workflow !== EApprovalStatus.DRAFT && workflow !== EApprovalStatus.SUBMITTED && (
								<Field label={msg('reviewTime')}>{formatDateTime(recOutcome?.approvalTime) || '--'}</Field>
							)}
						</div>
					</Section>
				</Col>

				{(workflow === EApprovalStatus.CHANGES_REQUIRED || !!recOutcome?.revisionNote) && (
					<Col span={24}>
						<Section title={msg('revisionNote')}>
							<div className='text-base text-ds-content-primary'>{recOutcome?.revisionNote || '--'}</div>
						</Section>
					</Col>
				)}

				{(workflow === EApprovalStatus.REJECTED || !!recOutcome?.activityRejectionNote) && (
					<Col span={24}>
						<Section title={msg('rejectionNote')}>
							<div className='text-base text-ds-content-primary'>{recOutcome?.activityRejectionNote || '--'}</div>
						</Section>
					</Col>
				)}

				<Col span={24}>
					<Section title={msg('evidenceInfo')}>
						<div className='grid grid-cols-2 gap-4'>
							<Field label={msg('role')}>
								<Input disabled readOnly value={recOutcome?.roles?.name ?? msg('noInfo')} />
							</Field>
							<Field label={msg('level')}>
								<Input disabled readOnly value={recOutcome?.levels?.name ?? msg('noInfo')} />
							</Field>
							<Field full label={msg('listEvidence')}>
								{recOutcome?.evidenceFile?.length ? (
									<div className='flex flex-col gap-2'>
										{recOutcome.evidenceFile.map((item: any, idx: number) => (
											<div key={idx} className='flex flex-col items-start'>
												<div>{item.name}</div>
												{item?.file?.map((url: string, index: number) => (
													<Button
														key={index}
														variant='link'
														size='sm'
														icon={<IconDocument />}
														onClick={async () => {
															setPreviewImage(await getPreviewUrl(url));
															setPreviewOpen(true);
														}}
													>
														{isFileUrl(url) ? getNameFile(url) : `File ${index + 1}`}
													</Button>
												))}
											</div>
										))}
									</div>
								) : (
									<EmptyState compact description={msg('noEvidence')} />
								)}
							</Field>
							<Field full label={msg('reflection')}>
								<Textarea rows={3} disabled readOnly value={recOutcome?.reflection ?? msg('noInfo')} />
							</Field>
						</div>
					</Section>
				</Col>

				<Col span={24}>
					<Section title={msg('competency')}>
						<div className='flex flex-col gap-3'>
							{recOutcome?.listAchievedCompetencies?.map((item, idx) => (
								<div key={idx} className='flex flex-col items-start gap-2'>
									<Badge variant='inprogress'>• {item?.competencie?.name}</Badge>
									<div className='text-base text-ds-content-primary'>{item?.competencie?.description}</div>
								</div>
							))}
						</div>
					</Section>
				</Col>
			</Row>

			<ModalExpandable
				title={msg('preview')}
				width={1200}
				open={previewOpen}
				footer={null}
				onCancel={() => setPreviewOpen(false)}
			>
				<PreviewFile file={previewImage} isPrivate />

				<div className='form-footer'>
					<Button variant='outline' onClick={() => setPreviewOpen(false)}>
						{intl.formatMessage({ id: 'global.button.dong' })}
					</Button>
				</div>
			</ModalExpandable>
		</>
	);
};

export default ChiTietActivityOutCome;
