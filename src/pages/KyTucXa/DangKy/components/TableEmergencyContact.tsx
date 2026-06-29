import { Button, Table, Space, Popconfirm, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import { useState } from 'react';
import FormEmergencyContact, { EmergencyContact } from './Form/FormEmergencyContact';

interface TableEmergencyContactProps {
	value?: EmergencyContact[];
	onChange?: (value: EmergencyContact[]) => void;
	onReload?: () => Promise<void> | void;
	disabled?: boolean;
}

const TableEmergencyContactKTX: React.FC<TableEmergencyContactProps> = (props) => {
	const { value = [], onChange, disabled } = props;
	const intl = useIntl();
	const [visibleForm, setVisibleForm] = useState(false);
	const [editingRecord, setEditingRecord] = useState<EmergencyContact | null>(null);

	const handleAdd = () => {
		setEditingRecord(null);
		setVisibleForm(true);
	};

	// const handleEdit = (record: EmergencyContact) => {
	// 	setEditingRecord(record);
	// 	setVisibleForm(true);
	// };

	const handleDelete = (index: number) => {
		const newData = [...value];
		newData.splice(index, 1);
		onChange?.(newData);
	};

	const handleSave = (data: EmergencyContact) => {
		const newData = [...value];
		if (data.id) {
			const index = newData.findIndex(item => item.id === data.id);
			if (index > -1) {
				newData[index] = data;
			}
		} else {
			newData.push({ ...data, id: Date.now().toString() });
		}
		onChange?.(newData);
		setVisibleForm(false);
	};

	const actionColumn = {
		title: intl.formatMessage({ id: 'kytucxa.dangky.table.emergencyContact.action' }),
		dataIndex: 'action',
		width: 100,
		align: 'center' as const,
		fixed: 'right' as const,
		render: (_text: any, record: EmergencyContact, index: number) => (
			<Space>
				<Popconfirm
					title={intl.formatMessage({ id: 'kytucxa.dangky.table.emergencyContact.deleteConfirm' })}
					onConfirm={() => handleDelete(index)}
				>
					<Button type="text" danger icon={<DeleteOutlined />} />
				</Popconfirm>
			</Space>
		),
	};

	const baseColumns = [
		{
			title: intl.formatMessage({ id: 'kytucxa.dangky.table.emergencyContact.stt' }),
			dataIndex: 'index',
			width: 50,
			align: 'center' as const,
			render: (_text: any, _record: any, index: number) => index + 1,
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.dangky.form.field.emergencyContactName' }),
			dataIndex: 'emergencyContactName',
			width: 120,
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.dangky.form.field.emergencyRelationship' }),
			dataIndex: 'emergencyRelationship',
			width: 80,
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.dangky.form.field.emergencyContactNumber' }),
			dataIndex: 'emergencyContactNumber',
			width: 100,
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.dangky.form.field.secondaryContactNumber' }),
			dataIndex: 'secondaryContactNumber',
			width: 100,
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.dangky.form.field.email' }),
			dataIndex: 'emergencyEmail',
			width: 120,
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.dangky.form.field.address' }),
			dataIndex: 'address',
			width: 150,
		},
	];

	const columns = disabled ? baseColumns : [...baseColumns, actionColumn];

	return (
		<div>
			{value.length > 0 ? (
				<>
					{!disabled && (
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
							<Typography.Text style={{ fontSize: 13 }}>
								<span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
								{intl.formatMessage({ id: 'kytucxa.dangky.table.emergencyContact.msg.min2Contacts' })}
							</Typography.Text>
							<Space>
								<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
									{intl.formatMessage({ id: 'kytucxa.dangky.table.emergencyContact.add' })}
								</Button>
							</Space>
						</div>
					)}

					<Table
						dataSource={value}
						columns={columns}
						rowKey="id"
						pagination={false}
						bordered
						size="middle"
					/>
				</>
			) : (
				!disabled && (
					<>
						<Typography.Text style={{ display: 'block', marginBottom: 12, fontSize: 13 }}>
							<span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
							{intl.formatMessage({ id: 'kytucxa.dangky.table.emergencyContact.msg.min2Contacts' })}
						</Typography.Text>
						<Button type="dashed" block icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
							{intl.formatMessage({ id: 'kytucxa.dangky.table.emergencyContact.add' })}
						</Button>
					</>
				)
			)}

			<FormEmergencyContact
				visible={visibleForm}
				onClose={() => setVisibleForm(false)}
				onSave={handleSave}
				initialData={editingRecord}
			/>
		</div>
	);
};

export default TableEmergencyContactKTX;
