import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './Form';

const FormItemNguoiThanKTX = (props: {
	value?: PhieuDangKyKTX.INguoiThan[];
	onChange?: (data: PhieuDangKyKTX.INguoiThan[]) => void;
}) => {
	const { handleEdit, setVisibleForm, visibleForm, setEdit, edit, record, setRecord, isView, setIsView } =
		useModel('kytucxa.nguoithan');
	const { value = [], onChange } = props;
	const intl = useIntl();
	const onDelete = (index: number) => {
		const data = [...value];
		data.splice(index, 1);
		if (onChange) onChange(data);
	};

	const onAdd = (rec: PhieuDangKyKTX.INguoiThan) => {
		if (!record?.index) {
			const data = [...value, rec];
			if (onChange) onChange(data);
			setVisibleForm(false);
		} else {
			const data = [...value];
			data.splice(record?.index - 1, 1, rec);
			if (onChange) onChange(data);
			setVisibleForm(false);
		}
	};

	const columns: IColumn<PhieuDangKyKTX.INguoiThan>[] = [
		{
			title: 'Parent/Guardian Name',
			dataIndex: 'hoTen',
			width: 190,
		},
		{
			title: 'Relationship',
			dataIndex: 'moiQuanHe',
			width: 160,
		},
		{
			title: 'Primary Contact Number',
			dataIndex: 'sdtChinh',
			width: 170,
		},
		{
			title: 'Secondary Contact Number',
			dataIndex: 'sdtPhu',
			width: 190,
			render: (val) => val || '--',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 220,
			render: (val) => val || '--',
		},
		{
			title: 'Address',
			dataIndex: 'diaChi',
			width: 260,
			render: (val) => val || '--',
		},
		{
			title: 'Action',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (_, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
						type='link'
						onClick={() => handleEdit(rec)}
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => onDelete(rec.index - 1)}
						title={intl.formatMessage({ id: 'quytrinhiso.hosoluu.formitem.confirm' })}
						placement='topLeft'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
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
		<>
			<TableStaticData
				data={value}
				columns={columns}
				size='small'
				hasTotal
				addStt
				otherProps={{ pagination: false, scroll: { y: 400 } }}
			>
				<Button
					icon={<PlusCircleOutlined />}
					onClick={() => {
						setRecord({} as PhieuDangKyKTX.INguoiThan);
						setEdit(false);
						setIsView(false);
						setVisibleForm(true);
					}}
					size='small'
					type='primary'
				>
					Thêm mới
				</Button>
			</TableStaticData>

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
