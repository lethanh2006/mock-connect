import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import {
	EActivityCategory,
	EApprovalStatus,
	mapColorApprovalStatus,
	mapNameActivityCategory,
	mapNameApprovalStatus,
} from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	PlusCircleOutlined,
	SendOutlined,
} from '@ant-design/icons';
import { Checkbox, Popconfirm, Tabs, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectActivitiesManagement from '../Activities/Select';
import SelectLevelsManagement from '../Levels/Select';
import SelectRolesManagement from '../Roles/Select';
import FormActivityOutCome from './components/Form';
import FormPerstionActivityOutCome from './components/FormPerstion';
import StatActivityOutCome from './components/Stat';

const HistoryActivityPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, handleEdit, handleView, deleteActivityModel, putModel, getAnalyticsStudentModel } =
		useModel('cct.activityoutcome');
	const { getAllModel, danhSach: dsAtribute } = useModel('cct.attributes');

	const [tabActive, setTabActive] = useState<EActivityCategory>(EActivityCategory.REGISTERED);

	useEffect(() => {
		getAllModel(undefined, { order: 1 });
	}, []);

	const getData = () => {
		getModel(
			{
				activityCategory: tabActive,
			},
			undefined,
			undefined,
			undefined,
			undefined,
			'me/page',
		);
	};

	const getThongKe = () => {
		getAnalyticsStudentModel(tabActive);
	};

	const attributeColumns: IColumn<any>[] = useMemo(() => {
		if (!dsAtribute?.length) return [];

		return dsAtribute.map((attr: any) => ({
			title: attr.code,
			width: 60,
			render: (val, rec) => {
				const check = rec?.activities?.coCurricularActivityEquivalency;
				const checkPertion = rec?.activitiesType?.attributesId === attr?._id;

				const isChecked = check?.some((item: any) => item.rolesId === rec.rolesId && item.attributesId === attr._id);

				return <Checkbox checked={isChecked || checkPertion} />;
			},
			onCell,
		}));
	}, [dsAtribute]);

	const onCell = (rec: ActivityOutCome.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const isInTimeRange = (rec: ActivityOutCome.IRecord) => {
		const now = dayjs();

		const start = dayjs(rec?.activities?.startDate);
		const end = rec?.activities?.allowPostEventResultsUpdate
			? dayjs(rec?.activities?.dueDate)
			: dayjs(rec?.activities?.endDate);

		if (!start.isValid() || !end.isValid()) return false;

		return now.isAfter(start) && now.isBefore(end);
	};

	const canEdit = (rec: ActivityOutCome.IRecord) => {
		if (rec?.activityCategory === EActivityCategory.REGISTERED) {
			if (!isInTimeRange(rec)) return false;
		}

		return rec?.workflow === EApprovalStatus.DRAFT || rec?.workflow === EApprovalStatus.CHANGES_REQUIRED;
	};

	const getTooltip = (rec: ActivityOutCome.IRecord) => {
		if (rec?.activityCategory === EActivityCategory.REGISTERED && !isInTimeRange(rec)) {
			return intl.formatMessage({ id: 'activity.button.hethan' });
		}

		return tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR
			? intl.formatMessage({ id: 'activity.button.chinhsua' })
			: intl.formatMessage({ id: 'activity.button.add' });
	};

	const getDeadline = (rec: ActivityOutCome.IRecord) => {
		return rec?.activities?.allowPostEventResultsUpdate ? rec?.activities?.dueDate : rec?.activities?.endDate;
	};

	const getDeadlineStatus = (rec: ActivityOutCome.IRecord) => {
		const deadline = getDeadline(rec);
		if (!deadline) return 'EXPIRED';

		const now = dayjs();
		const end = dayjs(deadline);

		if (!end.isValid()) return 'NONE';

		if (now.isAfter(end)) return 'EXPIRED';

		const diffMinutes = end.diff(now, 'minute');

		if (diffMinutes <= 24 * 60) return 'NEAR';

		return 'OK';
	};

	const renderDeadlineBadge = (rec: ActivityOutCome.IRecord) => {
		const status = getDeadlineStatus(rec);

		if (status === 'EXPIRED')
			return (
				<Tag color='red' icon={<CloseCircleOutlined />}>
					{intl.formatMessage({ id: 'activity.dahethan' })}
				</Tag>
			);

		if (status === 'NEAR')
			return (
				<Tag color='orange' icon={<ClockCircleOutlined />}>
					{intl.formatMessage({ id: 'activity.saphethan' })}
				</Tag>
			);

		if (status === 'OK')
			return (
				<Tag color='green' icon={<CheckCircleOutlined />}>
					{intl.formatMessage({ id: 'activity.conhan' })}
				</Tag>
			);

		return null;
	};

	const columns: IColumn<ActivityOutCome.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'activity.column.name' }),
			dataIndex: 'activitiesOutcomeName',
			width: 150,
			filterType: 'string',
			onCell,
			hide: tabActive === EActivityCategory.REGISTERED,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.cca' }),
			dataIndex: 'activitiesTypeId',
			width: 180,
			render: (val, rec) => rec?.activitiesType?.name,
			filterType: 'customselect',
			filterCustomSelect: <SelectActivitiesManagement multiple />,
			onCell,
			hide: tabActive === EActivityCategory.REGISTERED,
		},
		{
			title: 'Competency',
			dataIndex: 'listAchievedCompetencies',
			width: 140,
			render: (val, rec) =>
				rec?.listAchievedCompetencies
					?.map((item) => item?.competencie?.name)
					.filter(Boolean)
					.join(', '),
			onCell,
			hide: tabActive === EActivityCategory.REGISTERED,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.activity' }),
			width: 180,
			render: (val, rec) => (
				<div>
					{rec?.activities?.name} <br />
					<div style={{ marginTop: 6 }}>{rec?.workflow === EApprovalStatus.DRAFT && renderDeadlineBadge(rec)}</div>{' '}
				</div>
			),
			onCell,
			hide: tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.attribute' }),
			width: 200,
			render: (val, rec) => (
				<Tag color={rec?.activities?.activitiesType?.attributes?.color}>
					{rec?.activities?.activitiesType?.attributes?.name}
				</Tag>
			),
			onCell,
			hide: tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.cca' }),
			width: 200,
			render: (val, rec) => rec?.activities?.activitiesType?.name,
			onCell,
			hide: tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.date' }),
			align: 'center',
			width: 180,
			render: (val, rec) =>
				[
					dayjs(rec?.activities?.startDate).format('HH:mm DD/MM/YYYY'),
					dayjs(rec?.activities?.endDate).format('HH:mm DD/MM/YYYY'),
				]
					.filter(Boolean)
					.join(' - '),
			onCell,
			hide: tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.allow' }),
			align: 'center',
			width: 150,
			render: (val, rec) => (
				<div>
					<Checkbox checked={rec?.activities?.allowPostEventResultsUpdate} /> <br />
					{rec?.activities?.dueDate && (
						<div style={{ marginTop: 6 }}>{dayjs(rec?.activities?.dueDate).format('HH:mm DD/MM/YYYY')}</div>
					)}
				</div>
			),
			onCell,
			hide: tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.created' }),
			dataIndex: 'createdAt',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			onCell,
			sortable: true,
			hide: tabActive === EActivityCategory.REGISTERED,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.role' }),
			dataIndex: 'rolesId',
			width: 180,
			render: (val, rec) => rec?.roles?.name,
			filterType: 'customselect',
			filterCustomSelect: <SelectRolesManagement multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.level' }),
			dataIndex: 'rolesId',
			width: 140,
			render: (val, rec) => rec?.levels?.name,
			filterType: 'customselect',
			filterCustomSelect: <SelectLevelsManagement multiple />,
			onCell,
		},
		...attributeColumns,
		{
			title: 'Rejection Note',
			dataIndex: 'activityRejectionNote',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Revision Note',
			dataIndex: 'revisionNote',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Declaration Approvers',
			dataIndex: 'studentDeclarationApproverName',
			align: 'center',
			width: 180,
			filterType: 'string',
			onCell,
			hide: tabActive === EActivityCategory.REGISTERED,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.status' }),
			dataIndex: 'workflow',
			align: 'center',
			width: 120,
			render: (val, rec) => (
				<Tag
					color={mapColorApprovalStatus[val as EApprovalStatus]}
					style={{
						maxWidth: 120,
						whiteSpace: 'normal',
						wordBreak: 'break-word',
						textAlign: 'center',
					}}
				>
					{mapNameApprovalStatus[val as EApprovalStatus]}
				</Tag>
			),
			fixed: 'right',
			filterType: 'select',
			filterData: Object.values(EApprovalStatus).map((item) => ({
				value: item,
				label: mapNameApprovalStatus[item as EApprovalStatus],
			})),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR ? 120 : 90,
			fixed: 'right',
			render: (val, rec) => {
				const canDelete =
					(rec?.activityCategory !== EActivityCategory.REGISTERED || isInTimeRange(rec)) &&
					rec?.workflow !== EApprovalStatus.APPROVED &&
					rec?.workflow !== EApprovalStatus.REJECTED;

				return (
					<>
						{tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR && (
							<Popconfirm
								onConfirm={() => putModel(`me/${rec?._id}`, { workflow: EApprovalStatus.SUBMITTED }, getData)}
								title={intl.formatMessage({ id: 'activity.confirm.duyet' })}
								placement='topLeft'
							>
								<ButtonExtend
									disabled={!canEdit(rec)}
									tooltip={intl.formatMessage({ id: 'activity.button.duyet' })}
									type='link'
									icon={<SendOutlined />}
								/>
							</Popconfirm>
						)}

						<ButtonExtend
							// disabled={!canEdit(rec)}
							tooltip={getTooltip(rec)}
							onClick={() => handleEdit(rec)}
							type='link'
							icon={tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR ? <EditOutlined /> : <PlusCircleOutlined />}
						/>

						<Popconfirm
							onConfirm={() =>
								deleteActivityModel(rec?._id, () => {
									getData();
									getThongKe();
								})
							}
							title={intl.formatMessage({ id: 'activity.confirm.xoa' })}
							placement='topLeft'
						>
							<ButtonExtend
								disabled={!canDelete}
								tooltip={intl.formatMessage({ id: 'activity.button.xoa' })}
								danger
								type='link'
								icon={<DeleteOutlined />}
							/>
						</Popconfirm>
					</>
				);
			},
		},
	];

	return (
		<TableBase
			getData={getData}
			formProps={{
				getData: () => {
					getData();
					getThongKe();
				},
			}}
			columns={columns}
			dependencies={[page, limit, tabActive]}
			modelName='cct.activityoutcome'
			title={intl.formatMessage({ id: 'activity.title' })}
			Form={tabActive === EActivityCategory.REGISTERED ? FormActivityOutCome : FormPerstionActivityOutCome}
			widthDrawer={tabActive === EActivityCategory.REGISTERED ? 800 : 1000}
			buttons={{ create: tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR }}
			onReload={() => {
				getData();
				getThongKe();
			}}
		>
			<div
				style={{
					padding: '0px 12px 0px 12px',
				}}
			>
				<Tabs activeKey={tabActive} onChange={(tab) => setTabActive(tab as EActivityCategory)}>
					{Object.values(EActivityCategory).map((item) => (
						<Tabs.TabPane tab={mapNameActivityCategory[item]} key={item} />
					))}
				</Tabs>

				<StatActivityOutCome getData={getThongKe} dependency={tabActive} />
			</div>
		</TableBase>
	);
};

export default HistoryActivityPage;
