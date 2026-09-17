import { Button, IconChervolDown } from '@/components/Icons';
import { Card } from '@/components/PageCard';
import { Tree } from 'antd';
import { useIntl } from 'umi';
import { type TExportField } from '../typing';

const CardChooseFields = (props: {
	allFields: TExportField[];
	fields: TExportField[];
	setFields: (val: TExportField[]) => void;
}) => {
	const intl = useIntl();
	const { allFields, fields, setFields } = props;

	const genTreeData = (data?: TExportField[]): any => {
		if (!data?.length) return [];
		return data?.map((item) => ({
			title: item.label,
			key: item._id,
			children: genTreeData(item.children),
		}));
	};
	const treeData = genTreeData(allFields);

	const selectedFields = fields.filter((item) => item.selected);
	const isAllSelected = selectedFields.length === allFields.length;
	const isAllUnSelected = selectedFields.length === 0;

	const onCheckAll = () => setFields(fields.map((item) => ({ ...item, selected: true })));

	const onUnCheckAll = () => setFields(fields.map((item) => ({ ...item, selected: false })));

	return (
		<Card title={intl.formatMessage({ id: 'global.table.export.khadung' })}>
			<div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
				<Button
					size='sm'
					variant={isAllSelected ? 'default' : 'outline'}
					onClick={onCheckAll}
					type='button'
				>
					{intl.formatMessage({ id: 'global.table.export.choose.chontatca' })}
				</Button>
				<Button
					size='sm'
					variant={isAllUnSelected ? 'default' : 'outline'}
					onClick={onUnCheckAll}
					type='button'
				>
					{intl.formatMessage({ id: 'global.table.export.choose.bochontatca' })}
				</Button>
			</div>

			<div style={{ maxHeight: 340, overflowY: 'auto', border: '1px solid var(--color-border-secondary)', borderRadius: 8, padding: 4 }}>
				<Tree
					treeData={treeData}
					switcherIcon={<IconChervolDown />}
					checkable
					checkedKeys={fields.filter((item) => item.selected).map((item) => item._id)}
					onCheck={(keys) => {
						if (Array.isArray(keys)) setFields(fields.map((item) => ({ ...item, selected: keys.includes(item._id) })));
					}}
				/>
			</div>
		</Card>
	);
};

export default CardChooseFields;
