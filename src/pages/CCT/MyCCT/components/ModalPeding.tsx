import ExpandText from '@/components/ExpandText';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { officialColors } from '@/services/base/constant';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import {
	EActivityCategory,
	EApprovalStatus,
	Evalidation,
	mapColorApprovalStatus,
	mapColorTextApprovalStatus,
	mapEvalidation,
	mapNameActivityCategory,
	mapNameApprovalStatus,
} from '@/services/CCT/constant';
import { Button, Segmented, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';

const ModalPeding = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const intl = useIntl();
	const { visible, setVisible } = props;
	const { danhSach } = useModel('cct.activityoutcome');
	const [segmentSelected, setSegmentSelected] = useState<EActivityCategory | string>(EActivityCategory.REGISTERED);

	const columns: IColumn<ActivityOutCome.IRecord>[] = [
		{
			title: 'Activity Name',
			width: 180,
			render: (val, rec) =>
				rec?.isAwardRecognition ? (
					<Space>
						{rec?.competition}{' '}
						<Tag
							color={officialColors.official300}
							style={{
								color: officialColors.official500,
								fontWeight: 600,
							}}
						>
							Award
						</Tag>
					</Space>
				) : rec?.activityCategory === EActivityCategory.REGISTERED ? (
					rec?.activities?.name
				) : (
					rec?.activitiesOutcomeName
				),
		},
		{
			title: 'Role',
			dataIndex: 'rolesId',
			width: 180,
			render: (val, rec) => rec?.roles?.name,
		},
		{
			title: 'Level',
			dataIndex: 'levelsId',
			width: 120,
			render: (val, rec) => rec?.levels?.name,
		},
		{
			title: 'Attribute',
			width: 160,
			render: (val, rec) => {
				const attriRe = rec?.activities?.coCurricularActivityEquivalency?.filter(
					(item) => item?.rolesId === rec?.rolesId,
				);

				const attriDec = rec?.activitiesType?.attributes;

				if (rec?.activityCategory === EActivityCategory.REGISTERED) {
					return (
						<Space wrap>
							{attriRe?.map((item: any) => <Tag color={item?.attributes?.color}>{item?.attributes?.name}</Tag>)}
						</Space>
					);
				} else return <Space wrap>{attriDec?.map((item: any) => <Tag color={item?.color}>{item?.name}</Tag>)}</Space>;
			},
		},
		{
			title: 'Competency',
			width: 220,
			render: (val, rec) =>
				rec?.activityCategory === EActivityCategory.REGISTERED ? (
					<ExpandText>
						{rec?.activities?.competencyList
							?.map((item) => item?.competency?.name)
							.filter(Boolean)
							.join(', ')}
					</ExpandText>
				) : (
					<ExpandText>
						{rec?.listAchievedCompetencies
							?.map((item) => item?.competencie?.name)
							.filter(Boolean)
							.join(', ')}
					</ExpandText>
				),
		},
		{
			title: 'Activity Type',
			width: 200,
			render: (val, rec) =>
				rec?.activityCategory === EActivityCategory.REGISTERED
					? rec?.activities?.activitiesType?.name
					: rec?.activitiesType?.name,
		},
		{
			title: 'Mentor/Supervisor',
			dataIndex: 'supervisorName',
			width: 150,
			hide: segmentSelected === EActivityCategory.REGISTERED,
		},
		{
			title: 'Submission Time',
			dataIndex: 'submittedAt',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Approver',
			dataIndex: 'studentDeclarationApproverName',
			width: 150,
			render: (val, rec) => {
				const approvalWorkflow =
					rec?.workflow === EApprovalStatus.APPROVED ||
					rec?.workflow === EApprovalStatus.REJECTED ||
					rec?.workflow === EApprovalStatus.CHANGES_REQUIRED;

				return (
					<>
						{rec?.workflow === EApprovalStatus.APPROVED && !rec?.studentDeclarationApproverName
							? 'System'
							: approvalWorkflow
								? rec?.studentDeclarationApproverName
								: rec?.activities?.studentDeclarationApproverList
										?.map((item) => item?.name)
										.filter(Boolean)
										.join(', ')}
					</>
				);
			},
		},
		{
			title: 'Evidence Review Time',
			dataIndex: 'approvalTime',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Impact',
			dataIndex: 'validation',
			align: 'center',
			width: 100,
			render: (val, rec) =>
				rec?.workflow === EApprovalStatus.APPROVED && <Tag color={mapEvalidation[val as Evalidation]}>{val}</Tag>,
			fixed: 'right',
		},
		{
			title: 'Status',
			dataIndex: 'workflow',
			align: 'center',
			width: 120,
			render: (val, rec) => {
				const now = dayjs();
				const endDateUpdateEvidence =
					rec?.workflow === EApprovalStatus.CHANGES_REQUIRED
						? rec?.dueDate
							? dayjs(rec?.dueDate)
							: null
						: rec?.activities?.allowPostEventResultsUpdate
							? rec?.activities?.dueDate
								? dayjs(rec?.activities?.dueDate)
								: null
							: rec?.activities?.endDate
								? dayjs(rec?.activities?.endDate)
								: null;

				const editableWorkflow =
					rec?.workflow === EApprovalStatus.DRAFT ||
					rec?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
					rec?.workflow === EApprovalStatus.EVIDENCE_REQUIRED;

				const isExpired =
					rec?.activityCategory === EActivityCategory.REGISTERED
						? editableWorkflow && now.isAfter(endDateUpdateEvidence)
						: rec?.workflow === EApprovalStatus.CHANGES_REQUIRED && now.isAfter(dayjs(rec?.dueDate));

				if (isExpired) {
					return (
						<Tag
							color={officialColors.official500}
							style={{
								color: officialColors.official300,
								fontWeight: 600,
							}}
						>
							Expired
						</Tag>
					);
				}
				return (
					<Tag
						color={mapColorApprovalStatus[val as EApprovalStatus]}
						style={{
							maxWidth: 120,
							whiteSpace: 'normal',
							wordBreak: 'break-word',
							textAlign: 'center',
							color: mapColorTextApprovalStatus[rec?.workflow as EApprovalStatus],
							fontWeight: 600,
						}}
					>
						{mapNameApprovalStatus[val as EApprovalStatus]}
					</Tag>
				);
			},
			fixed: 'right',
		},
	];

	return (
		<ModalExpandable
			title='List Pending For Approval'
			open={visible}
			onCancel={() => setVisible(false)}
			width={1000}
			footer={null}
		>
			<i className='text-error' style={{ marginBottom: 12 }}>
				Some activities are still pending approval. Please contact the approver
			</i>

			<TableStaticData
				columns={columns}
				data={danhSach?.filter((item) => item.activityCategory === segmentSelected) ?? []}
				size='small'
				addStt
				hasTotal
				otherButtons={[
					<Segmented
						options={[
							{
								value: EActivityCategory.REGISTERED,
								label: mapNameActivityCategory[EActivityCategory.REGISTERED],
							},
							{
								value: EActivityCategory.PERSONAL_CO_CURRICULAR,
								label: mapNameActivityCategory[EActivityCategory.PERSONAL_CO_CURRICULAR],
							},
						]}
						value={segmentSelected}
						onChange={(val) => setSegmentSelected(val)}
					/>,
				]}
			/>

			<div className='form-footer'>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</ModalExpandable>
	);
};

export default ModalPeding;
