import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { Modal } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './Form';

const FormItemNguoiThanKTX = (props: {
	value?: PhieuDangKyKTX.INguoiThan[];
	onChange?: (data: PhieuDangKyKTX.INguoiThan[]) => void;
}) => {
	const { setVisibleForm, visibleForm, record } =
		useModel('kytucxa.nguoithan');
	const { value = [], onChange } = props;
	const intl = useIntl();

	const onAdd = (rec: PhieuDangKyKTX.INguoiThan) => {
		if (!record?.index) {
			const data = [...value, { ...rec, index: value.length + 1 }];
			onChange?.(data);
			setVisibleForm(false);
		} else {
			const data = [...value];
			data.splice(record.index - 1, 1, { ...rec, index: record.index });
			onChange?.(data);
			setVisibleForm(false);
		}
	};

	const columns: IColumn<PhieuDangKyKTX.INguoiThan>[] = [
		{
			title: 'Parent/Guardian Name',
			dataIndex: 'emergencyContactName',
			width: 190,
		},
		{
			title: 'Relationship',
			dataIndex: 'emergencyRelationship',
			width: 160,
		},
		{
			title: 'Primary Contact Number',
			dataIndex: 'emergencyContactNumber',
			width: 170,
		},
		{
			title: 'Secondary Contact Number',
			dataIndex: 'secondaryContactNumber',
			width: 190,
			render: (val) => val || '--',
		},
		{
			title: 'Email',
			dataIndex: 'emergencyEmail',
			width: 220,
			render: (val) => val || '--',
		},
		{
			title: 'Address',
			dataIndex: 'address',
			width: 260,
			render: (val) => val || '--',
		},
	];

	return (
		<>
			<TableStaticData
				data={value}
				columns={columns}
				size='small'
				hasTotal
				addStt
				columnSetting={false}
				otherProps={{ pagination: false, scroll: { y: 400 } }}
			/>

			<Modal
				title='Thêm mới người thân'
				open={visibleForm}
				width={600}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				<Form onOk={onAdd} />
			</Modal>
		</>
	);
};

export default FormItemNguoiThanKTX;
