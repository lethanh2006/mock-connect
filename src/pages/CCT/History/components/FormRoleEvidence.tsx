import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { FormInstance, Space, Tag } from 'antd';
import { useMemo } from 'react';
import { useIntl, useModel } from 'umi';

const FormRoleEvidence = (props: { select?: boolean; rolesId?: string; form?: FormInstance }) => {
	const intl = useIntl();
	const { select, rolesId, form } = props;
	const { record, isView } = useModel('cct.activityoutcome');

	const groupedEquivalency = useMemo(() => {
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

		record?.activities?.coCurricularActivityEquivalency?.forEach((item) => {
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
	}, [record]);

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
				<Space size={[4, 4]} wrap>
					{rec.attributes?.map((attr: any, idx: number) => (
						<Tag key={idx} color={attr.color}>
							{attr.name}
						</Tag>
					))}
				</Space>
			),
		},
	];

	return (
		<TableStaticData
			columns={columnsRoles}
			data={groupedEquivalency}
			otherProps={{
				pagination: false,
				scroll: { y: 250 },
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
