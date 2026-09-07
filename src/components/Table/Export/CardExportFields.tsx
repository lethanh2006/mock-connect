import { Card, CardContent, CardTitle, IconButton, IconTrash } from '@/components/Icons';
import { useIntl } from 'umi';
import TableStaticData from '../TableStaticData';
import { type IColumn, type TExportField } from '../typing';

const CardExportFields = (props: { fields: TExportField[]; setFields: (val: TExportField[]) => void }) => {
	const intl = useIntl();
	const { fields, setFields } = props;

	const columns: IColumn<TExportField>[] = [
		{
			title: intl.formatMessage({ id: 'global.table.export.field.tentruong' }),
			width: 180,
			render: (val, rec) => rec.labels.join(' / '),
		},
		{
			title: '',
			width: 30,
			align: 'center',
			hide: true,
			render: (val, rec) => (
				<IconButton
					label={intl.formatMessage({ id: 'global.button.xoa', defaultMessage: 'Xoá' })}
					variant='ghost'
					onClick={() => setFields(fields.map((item) => (item._id === rec._id ? { ...item, selected: false } : item)))}
				>
					<IconTrash />
				</IconButton>
			),
		},
	];

	const onSortEnd = (record: TExportField, newIndex: number): void => {
		const tmp = fields.filter((item) => item._id !== record._id);
		const newRecord = fields.filter((item) => item.selected)[newIndex];
		const tempIndex = fields.indexOf(newRecord);
		tmp.splice(tempIndex, 0, record);
		setFields(tmp);
	};

	return (
		<Card>
			<CardTitle style={{ padding: '12px 16px 0' }}>
				{intl.formatMessage({ id: 'global.table.export.field.title' })}
			</CardTitle>
			<CardContent>
				<TableStaticData
					columns={columns}
					data={fields.filter((item) => item.selected)}
					size='small'
					addStt
					columnSetting={false}
					rowSortable
					onSortEnd={onSortEnd}
					otherProps={{ scroll: { y: 380 }, pagination: false }}
				/>
			</CardContent>
		</Card>
	);
};

export default CardExportFields;
