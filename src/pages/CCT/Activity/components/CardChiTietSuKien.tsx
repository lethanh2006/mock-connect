import background from '@/assets/cct/background.png';
import EmptyState from '@/components/EmptyState';
import ExpandText from '@/components/ExpandText';
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	IconDocument,
	Input,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableSelectionCell,
	Textarea,
} from '@/components/Icons';
import { Col, Row } from '@/components/MyGrid';
import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import ActivityCard from '@/pages/TrangChuV2/components/ActivityCard';
import { Activity } from '@/services/CCT/Activity/typing';
import { EApprovalStatus } from '@/services/CCT/constant';
import { formatDateTime } from '@/utils/formatDate';
import { getNameFile, getPreviewUrl, isFileUrl } from '@/utils/utils';
import dayjs from 'dayjs';
import { type ReactNode, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { groupEquivalencyByRole } from '../../History/components/FormRoleEvidence';

export const Section = ({ title, children }: { title: ReactNode; children: ReactNode }) => (
	<Card className='h-full border border-ds-bg-mortared bg-ds-bg-card'>
		<CardHeader>
			<CardTitle className='activity-detail__section-title'>{title}</CardTitle>
		</CardHeader>
		<CardContent>{children}</CardContent>
	</Card>
);

export const Field = ({ label, children, full }: { label: ReactNode; children: ReactNode; full?: boolean }) => (
	<div className='flex flex-col gap-1' style={full ? { gridColumn: '1 / -1' } : undefined}>
		<CardDescription>{label}</CardDescription>
		<div className='text-base text-ds-content-primary'>{children}</div>
	</div>
);

const CardChiTietSuKien = (props: {
	record: Activity.IRecord;
	evidenceDeadline: string;
	infoEvidence?: boolean;
	activeKey?: string;
	isExpired?: boolean;
	isRegister?: boolean;
}) => {
	const intl = useIntl();
	const { danhSach: dsAttribute } = useModel('cct.attributes');
	const { record, evidenceDeadline, infoEvidence, activeKey, isExpired } = props;
	const [previewOpen, setPreviewOpen] = useState<boolean>(false);
	const [previewImage, setPreviewImage] = useState<string>('');

	const registered = record?.numberOfRegisteredActivityOutcomes ?? 0;
	const capacity = record?.capacity;
	const isFull = capacity && registered >= capacity;

	const approvalWorkflow =
		record?.activityOutcome?.workflow === EApprovalStatus.APPROVED ||
		record?.activityOutcome?.workflow === EApprovalStatus.REJECTED ||
		record?.activityOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED;

	const equivalencyAttributeIds = record?.coCurricularActivityEquivalency?.map((item) => item.attributesId) ?? [];
	const activeLetters = equivalencyAttributeIds
		.map((id) => id?.split('-').pop()?.toUpperCase())
		.filter((letter) => letter && letter.length === 1);
	const attributes = (dsAttribute ?? []).map((attribute: AttributesManagement.IRecord) => {
		const letter = attribute.code?.charAt(0)?.toUpperCase() ?? '';
		return {
			id: attribute._id,
			letter,
			active: equivalencyAttributeIds.includes(attribute._id) || activeLetters.includes(letter),
		};
	});
	const isNew = record?.createdAt && dayjs().isBefore(dayjs(record.createdAt).add(3, 'day'));
	const registerSource = record?.dueDateRegistration ?? record?.endDate;
	const remainingText = (() => {
		const deadline = registerSource ? dayjs(registerSource) : null;
		const now = dayjs();
		if (!deadline || !deadline.isAfter(now)) return null;
		const days = deadline.diff(now, 'day');
		const hours = deadline.diff(now.add(days, 'day'), 'hour');
		const hourText = `${hours} hour${hours > 1 ? 's' : ''}`;
		return days > 0 ? `${days} day${days > 1 ? 's' : ''} ${hourText}` : hourText;
	})();

	const selectRole = infoEvidence && activeKey !== '1';
	const roleRows = useMemo(
		() => groupEquivalencyByRole(record?.coCurricularActivityEquivalency ?? []),
		[record?.coCurricularActivityEquivalency],
	);
	const competencies = infoEvidence
		? record?.activityOutcome?.listAchievedCompetencies?.map((item) => item?.competencie)
		: record?.competencyList?.map((item) => item?.competency);

	return (
		<>
			<Row gutter={[16, 16]}>
				<Col span={24} md={9} className='activity-detail__card'>
					<ActivityCard
						title={record?.name}
						banner={record?.banner ?? background}
						isNew={!!isNew}
						attributes={attributes}
						startDate={formatDateTime(record?.startDate) || '--'}
						endDate={formatDateTime(record?.endDate) || '--'}
						location={record?.onCampus ? record?.facilityName : record?.otherAddress}
						registerBefore={formatDateTime(registerSource) || '--'}
						approvalStatus={isExpired ? EApprovalStatus.EXPIRED : record?.activityOutcome?.workflow}
						deadline={
							remainingText ? (
								<span className='activity-figma-card__remain'>
									{intl.formatMessage({ id: 'activity.card.remain' })}: {remainingText}
								</span>
							) : undefined
						}
					/>
				</Col>
				<Col span={24} md={15}>
					<Section title={intl.formatMessage({ id: 'activity.chitiet.admin' })}>
						<div className='grid grid-cols-2 gap-4'>
							<Field label={intl.formatMessage({ id: 'activity.chitiet.organizer' })}>
								{record?.organizer ?? '--'}
							</Field>
							<Field label={intl.formatMessage({ id: 'activity.chitiet.approver' })}>
								{record?.activityOutcome?.workflow === EApprovalStatus.APPROVED &&
								!record?.activityOutcome?.studentDeclarationApproverName
									? intl.formatMessage({ id: 'activity.chitiet.system' })
									: approvalWorkflow
										? record?.activityOutcome?.studentDeclarationApproverName
										: record?.studentDeclarationApproverList
												?.map((item) => item?.name)
												.filter(Boolean)
												.join(', ')}
							</Field>
							<Field label={intl.formatMessage({ id: 'activity.chitiet.group' })}>
								{record?.activitiesType?.activitiesTypeDomainText ??
									record?.activitiesType?.activitiesTypeDomain?.name ??
									'--'}
							</Field>
							<Field label={intl.formatMessage({ id: 'activity.chitiet.type' })}>
								{record?.activitiesType?.name ?? '--'}
							</Field>
							{/* <Field label='Track'>
								{record?.activitiesType?.trackText ?? record?.activitiesType?.track?.name ?? '--'}
							</Field> */}
							<Field label={intl.formatMessage({ id: 'activity.chitiet.capacity' })}>
								<span className={isFull ? 'text-ds-negative-primary' : undefined}>
									{capacity ? (
										<>
											{`${registered} / ${capacity}`}
											{isFull && ` (${intl.formatMessage({ id: 'activity.chitiet.full' })})`}
										</>
									) : (
										'--'
									)}
								</span>
							</Field>
							<Field label={intl.formatMessage({ id: 'activity.chitiet.allowUpdate' })}>
								{record?.allowPostEventResultsUpdate
									? intl.formatMessage({ id: 'activity.chitiet.yes' })
									: intl.formatMessage({ id: 'activity.chitiet.no' })}
							</Field>
							<Field label={intl.formatMessage({ id: 'activity.chitiet.deadline' })}>{evidenceDeadline}</Field>
							{(!record?.activityOutcome?.workflow ||
								record?.activityOutcome?.workflow === EApprovalStatus.EVIDENCE_REQUIRED) && (
								<Field full label={intl.formatMessage({ id: 'activity.chitiet.requiredEvidence' })}>
									{record?.activitiesType?.requiredEvidenceList
										? record?.activitiesType?.requiredEvidenceList
												?.map((item) => item)
												.filter(Boolean)
												.join(', ')
										: '--'}
								</Field>
							)}
							{!!record?.activityOutcome?.workflow &&
								record?.activityOutcome?.workflow !== EApprovalStatus.DRAFT &&
								record?.activityOutcome?.workflow !== EApprovalStatus.EVIDENCE_REQUIRED && (
									<Field label={intl.formatMessage({ id: 'activity.chitiet.submissionTime' })}>
										{formatDateTime(record?.activityOutcome?.submittedAt) || '--'}
									</Field>
								)}
							{(record?.activityOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
								record?.activityOutcome?.workflow === EApprovalStatus.REJECTED ||
								record?.activityOutcome?.workflow === EApprovalStatus.APPROVED) && (
								<Field label={intl.formatMessage({ id: 'activity.chitiet.reviewTime' })}>
									{formatDateTime(record?.activityOutcome?.approvalTime) || '--'}
								</Field>
							)}
						</div>
					</Section>
				</Col>

				{(record?.activityOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
					!!record?.activityOutcome?.revisionNote) && (
					<Col span={24}>
						<Section title={intl.formatMessage({ id: 'activity.chitiet.revisionNote' })}>
							<div className='text-base text-ds-content-primary'>{record?.activityOutcome?.revisionNote}</div>
						</Section>
					</Col>
				)}

				{(record?.activityOutcome?.workflow === EApprovalStatus.REJECTED ||
					!!record?.activityOutcome?.activityRejectionNote) && (
					<Col span={24}>
						<Section title={intl.formatMessage({ id: 'activity.chitiet.rejectionNote' })}>
							<div className='text-base text-ds-content-primary'>{record?.activityOutcome?.activityRejectionNote}</div>
						</Section>
					</Col>
				)}

				<Col span={24}>
					<Section
						title={
							selectRole
								? intl.formatMessage({ id: 'activity.chitiet.evidenceInfo' })
								: intl.formatMessage({ id: 'activity.chitiet.role' })
						}
					>
						{roleRows.length ? (
							<Table>
								<TableHeader>
									<TableRow>
										{selectRole && <TableHead />}
										<TableHead>{intl.formatMessage({ id: 'global.table.column.tt' })}</TableHead>
										<TableHead>{intl.formatMessage({ id: 'activity.detail.role' })}</TableHead>
										<TableHead>{intl.formatMessage({ id: 'activity.detail.des' })}</TableHead>
										<TableHead>{intl.formatMessage({ id: 'activity.detail.attributes' })}</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{roleRows.map((row, index) => (
										<TableRow key={row._id}>
											{/* Vai trò sinh viên đã chọn khi khai báo minh chứng (chỉ hiển thị, không sửa) */}
											{selectRole && (
												<TableSelectionCell checked={row._id === record?.activityOutcome?.rolesId} disabled />
											)}
											<TableCell>{index + 1}</TableCell>
											<TableCell>{row.roleName}</TableCell>
											<TableCell className='whitespace-normal'>
												<ExpandText>{row.desRole}</ExpandText>
											</TableCell>
											<TableCell className='whitespace-normal'>
												<div className='flex flex-wrap gap-1'>
													{row.attributes.map((attr, idx) => (
														<Badge key={idx} style={attr.color ? { background: attr.color, color: '#fff' } : undefined}>
															{attr.name}
														</Badge>
													))}
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : (
							<EmptyState compact description={intl.formatMessage({ id: 'global.table.index.empty' })} />
						)}

						{selectRole && (
							<div className='grid grid-cols-2 gap-4' style={{ marginTop: 16 }}>
								{/* <Field label='Track'>
									<Input disabled readOnly value={record?.activityOutcome?.trackText ?? record?.activityOutcome?.track?.name ?? 'No information'} />
								</Field> */}
								<Field label={intl.formatMessage({ id: 'activity.chitiet.level' })}>
									<Input
										disabled
										readOnly
										value={
											record?.activityOutcome?.levels?.name ?? intl.formatMessage({ id: 'activity.chitiet.noInfo' })
										}
									/>
								</Field>
								<Field full label={intl.formatMessage({ id: 'activity.chitiet.listEvidence' })}>
									{record?.activityOutcome?.evidenceFile?.length ? (
										<div className='flex flex-col gap-2'>
											{record.activityOutcome.evidenceFile.map((item: any, idx: number) => (
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
										<EmptyState compact description={intl.formatMessage({ id: 'activity.chitiet.noEvidence' })} />
									)}
								</Field>
								<Field full label={intl.formatMessage({ id: 'activity.chitiet.reflection' })}>
									<Textarea
										rows={3}
										disabled
										readOnly
										value={record?.activityOutcome?.reflection ?? intl.formatMessage({ id: 'activity.chitiet.noInfo' })}
									/>
								</Field>
							</div>
						)}
					</Section>
				</Col>

				<Col span={24}>
					<Section title={intl.formatMessage({ id: 'activity.chitiet.competency' })}>
						<div className='flex flex-col gap-3'>
							{competencies?.map((item, idx) => (
								<div key={idx} className='flex flex-col items-start gap-2'>
									<Badge variant='inprogress'>• {item?.name}</Badge>
									<div className='text-base text-ds-content-primary'>{item?.description}</div>
								</div>
							))}
						</div>
					</Section>
				</Col>

				<Col span={24}>
					<Section title={intl.formatMessage({ id: 'activity.chitiet.description' })}>
						<div className='text-base text-ds-content-primary'>{record?.description}</div>
					</Section>
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
					<Button variant='outline' onClick={() => setPreviewOpen(false)}>
						{intl.formatMessage({ id: 'global.button.dong' })}
					</Button>
				</div>
			</ModalExpandable>
		</>
	);
};

export default CardChiTietSuKien;
