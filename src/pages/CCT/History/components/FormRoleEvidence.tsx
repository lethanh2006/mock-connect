import ExpandText from '@/components/ExpandText';
import { Badge } from '@/components/Icons';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { Activity } from '@/services/CCT/Activity/typing';
import type { FormInstance } from 'antd';
import { useMemo } from 'react';
import { useIntl, useModel } from 'umi';

export type RoleEquivalencyRow = {
	_id: string;
	roleName: string;
	desRole: string;
	levelName?: string;
	attributes: { name: string; color?: string }[];
	autoApprove: boolean;
};

export const groupEquivalencyByRole = (equivalency?: Activity.IEquivalency[]): RoleEquivalencyRow[] => {
	const map = new Map<
		string,
		{
			_id: string;
			roleName: string;
			desRole: string;
			levelName?: string;
			attributes: { name: string; color?: string }[];
			autoApprove: boolean;
		}
	>();

	equivalency?.forEach((item) => {
		const roleId = item.roles?._id;
		if (!roleId) return;

		if (!map.has(roleId)) {
			map.set(roleId, {
				_id: roleId,
				roleName: item.roles?.name ?? '',
				desRole: item.roles?.description ?? '',
				levelName: item.roles?.level?.name ?? '',
				attributes: [],
				autoApprove: item?.autoApprove ?? false,
			});
		}

		if (item.attributes?.name) {
			map.get(roleId)!.attributes.push({
				name: item.attributes.name,
				color: item.attributes.color,
			});
		}
	});

	return Array.from(map.values());
};

const FormRoleEvidence = (props: {
	equivalency?: Activity.IEquivalency[];
	select?: boolean;
	rolesId?: string;
	form?: FormInstance;
}) => {
	const intl = useIntl();
	const { equivalency, select, rolesId, form } = props;
	const { isView } = useModel('cct.activityoutcome');

	const groupedEquivalency = useMemo(() => groupEquivalencyByRole(equivalency), [equivalency]);

	const columnsRoles: IColumn<any>[] = [
		{
			title: intl.formatMessage({ id: 'activity.detail.role' }),
			width: 150,
			dataIndex: 'roleName',
		},
		{
			title: intl.formatMessage({ id: 'activity.detail.des' }),
			width: 220,
			dataIndex: 'desRole',
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'activity.detail.attributes' }),
			width: 200,
			render: (_, rec) => (
				<div className='flex flex-wrap gap-1'>
					{rec.attributes?.map((attr: any, idx: number) => (
						<Badge key={idx} style={attr.color ? { background: attr.color, color: '#fff' } : undefined}>
							{attr.name}
						</Badge>
					))}
				</div>
			),
		},
	];

	return (
		<TableStaticData
			columns={columnsRoles}
			data={groupedEquivalency}
			scroll={{ y: 250 }}
			otherProps={{
				pagination: false,
				rowKey: '_id',
				rowSelection: !!select
					? {
							type: 'radio',
							selectedRowKeys: rolesId ? [rolesId] : [],
							onChange: (selectedRowKeys: React.Key[]) => {
								if (isView) return;

								if (selectedRowKeys.length > 0) {
									const selectedId = selectedRowKeys[0] as string;
									form && form.setFieldValue('rolesId', selectedId);
								} else {
									form && form.setFieldValue('rolesId', undefined);
								}
							},
							getCheckboxProps: (record: any) => ({
								disabled: isView,
							}),
						}
					: undefined,
			}}
		/>
	);
};

export default FormRoleEvidence;
