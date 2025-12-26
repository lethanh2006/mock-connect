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
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SendOutlined } from '@ant-design/icons';
import { Card, Checkbox, Popconfirm, Tabs, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectActivitiesManagement from '../Activities/Select';
import SelectRolesManagement from '../Roles/Select';
import FormActivityOutCome from './components/Form';
import FormPerstionActivityOutCome from './components/FormPerstion';

const HistoryActivityPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, handleEdit, handleView, deleteActivityModel, putModel } =
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

	const attributeColumns: IColumn<any>[] = useMemo(() => {
		if (!dsAtribute?.length) return [];

		return dsAtribute.map((attr: any) => ({
			title: attr.code,
			width: 90,
			align: 'center',
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
			width: 120,
			render: (val, rec) => rec?.activitiesType?.name,
			filterType: 'customselect',
			filterCustomSelect: <SelectActivitiesManagement multiple />,
			onCell,
			hide: tabActive === EActivityCategory.REGISTERED,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.activity' }),
			width: 150,
			render: (val, rec) => rec?.activities?.name,
			onCell,
			hide: tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.attribute' }),
			align: 'center',
			width: 120,
			render: (val, rec) => rec?.activities?.activitiesType?.attributes?.name,
			onCell,
			hide: tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.cca' }),
			width: 170,
			render: (val, rec) => rec?.activities?.activitiesType?.name,
			onCell,
			hide: tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.startdate' }),
			align: 'center',
			width: 120,
			render: (val, rec) => rec?.activities?.startDate && dayjs(rec?.activities?.startDate).format('DD/MM/YYYY'),
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
			width: 120,
			render: (val, rec) => rec?.roles?.name,
			filterType: 'customselect',
			filterCustomSelect: <SelectRolesManagement multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'activity.column.level' }),
			width: 140,
			render: (val, rec) => rec?.roles?.level?.name,
			onCell,
		},
		...attributeColumns,
		{
			title: intl.formatMessage({ id: 'activity.column.status' }),
			dataIndex: 'workflow',
			align: 'center',
			width: 120,
			render: (val, rec) => (
				<Tag color={mapColorApprovalStatus[val as EApprovalStatus]}>
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
			title: 'Rejection Note',
			dataIndex: 'activityRejectionNote',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Revision Note',
			dataIndex: 'revisionNote',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR ? 120 : 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					{tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR && (
						<Popconfirm
							onConfirm={() => putModel(`me/${rec?._id}`, { workflow: EApprovalStatus.SUBMITTED }, getData)}
							title={intl.formatMessage({ id: 'activity.confirm.duyet' })}
							placement='topLeft'
						>
							<ButtonExtend
								disabled={rec?.workflow !== EApprovalStatus.DRAFT && rec?.workflow !== EApprovalStatus.CHANGES_REQUIRED}
								tooltip={intl.formatMessage({ id: 'activity.button.duyet' })}
								type='link'
								icon={<SendOutlined />}
							/>
						</Popconfirm>
					)}

					<ButtonExtend
						disabled={rec?.workflow !== EApprovalStatus.DRAFT && rec?.workflow !== EApprovalStatus.CHANGES_REQUIRED}
						tooltip={
							tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR
								? intl.formatMessage({ id: 'activity.button.chinhsua' })
								: intl.formatMessage({ id: 'activity.button.add' })
						}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR ? <EditOutlined /> : <PlusCircleOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteActivityModel(rec?._id, getData)}
						title={intl.formatMessage({ id: 'activity.confirm.duyet' })}
						placement='topLeft'
					>
						<ButtonExtend
							disabled={rec?.workflow !== EApprovalStatus.DRAFT && rec?.workflow !== EApprovalStatus.CHANGES_REQUIRED}
							tooltip={intl.formatMessage({ id: 'activity.button.xoa' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<Card title={intl.formatMessage({ id: 'activity.title' })}>
			<Tabs activeKey={tabActive} onChange={(tab) => setTabActive(tab as EActivityCategory)}>
				{Object.values(EActivityCategory).map((item) => (
					<Tabs.TabPane tab={mapNameActivityCategory[item]} key={item} />
				))}
			</Tabs>

			<TableBase
				getData={getData}
				formProps={{ getData }}
				columns={columns}
				dependencies={[page, limit, tabActive]}
				modelName='cct.activityoutcome'
				title={intl.formatMessage({ id: 'activity.title' })}
				Form={tabActive === EActivityCategory.REGISTERED ? FormActivityOutCome : FormPerstionActivityOutCome}
				widthDrawer={800}
				hideCard
				buttons={{ create: tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR }}
			/>
		</Card>
	);
};

export default HistoryActivityPage;
