import type { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Popconfirm, Table, type FormInstance } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Fragment, useEffect, useState } from 'react';
import FamilyMemberModal from './FamilyMemberModal';
import { LIABILITY_WAIVER_INTRO, LIABILITY_WAIVER_ITEMS, STUDENT_DECLARATION_ITEMS } from './guardianConstants';
import SectionHeader from './SectionHeader';
import type { TDiaChiGiaDinh, TFamilyMember } from './typing';

const formatAddress = (diaChi?: TDiaChiGiaDinh) =>
	diaChi ? [diaChi.diaChi, diaChi.tenXaPhuong, diaChi.tenTP].filter(Boolean).join(', ') : '';

const requiredCheckedRule = {
	validator: async (_: unknown, value: boolean) => {
		if (!value) throw new Error('This confirmation is required');
	},
};

const GuardianConsentsStep = ({ form, listTinh }: { form: FormInstance<any>; listTinh?: DonViHanhChinh.IRecord[] }) => {
	const [familyMembers, setFamilyMembers] = useState<TFamilyMember[]>([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	useEffect(() => {
		form.setFieldsValue({ thanhVienGiaDinh: familyMembers });
	}, [familyMembers]);

	const handleAdd = () => {
		setEditingIndex(null);
		setModalOpen(true);
	};

	const handleEdit = (index: number) => {
		setEditingIndex(index);
		setModalOpen(true);
	};

	const handleDelete = (index: number) => {
		setFamilyMembers((list) => list.filter((_, i) => i !== index));
	};

	const handleSave = (values: TFamilyMember) => {
		setFamilyMembers((list) => {
			if (editingIndex === null) return [...list, values];
			return list.map((item, i) => (i === editingIndex ? values : item));
		});
		setModalOpen(false);
	};

	const columns: ColumnsType<TFamilyMember> = [
		{ title: 'No.', width: 56, render: (_, __, index) => index + 1 },
		{ title: 'Parent/Guardian Name', dataIndex: 'fullName' },
		{ title: 'Relationship', dataIndex: 'loaiThanhVien' },
		{ title: 'Primary Contact Number', dataIndex: 'soDienThoai' },
		{ title: 'Secondary Contact Number', dataIndex: 'soDienThoai2' },
		{ title: 'Email', dataIndex: 'email' },
		{ title: 'Address', render: (_, row) => formatAddress(row.diaChiHienNay ?? row.hoKhauThuongTru) },
		{
			title: 'Action',
			width: 90,
			render: (_, __, index) => (
				<Fragment>
					<Button type='text' icon={<EditOutlined />} onClick={() => handleEdit(index)} />
					<Popconfirm title='Remove this family member?' onConfirm={() => handleDelete(index)}>
						<Button type='text' icon={<DeleteOutlined />} />
					</Popconfirm>
				</Fragment>
			),
		},
	];

	return (
		<Fragment>
			<SectionHeader>Family Information</SectionHeader>

			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
				<span>
					Total: <strong>{familyMembers.length}</strong>{' '}
					<span style={{ color: '#d4622a', fontStyle: 'italic' }}>
						(You need to provide information for at least two family members)
					</span>
				</span>
				<div style={{ display: 'flex', gap: 8 }}>
					<Button icon={<ReloadOutlined />} />
					<Button type='primary' onClick={handleAdd}>
						Add more
					</Button>
				</div>
			</div>

			<Form.Item
				name='thanhVienGiaDinh'
				rules={[
					{
						validator: async (_, value) => {
							if (!value || value.length < 2)
								throw new Error('Please provide information for at least two family members');
						},
					},
				]}
			>
				<Table rowKey={(_, index) => index ?? 0} dataSource={familyMembers} columns={columns} pagination={false} size='small' />
			</Form.Item>

			<Form.Item name='consentShareWithGuardian' valuePropName='checked' rules={[requiredCheckedRule]}>
				<Checkbox>
					I consent to granting the parent/guardian selected above access to my academic results, tuition information,
					attendance records, and university notifications.
				</Checkbox>
			</Form.Item>

			<SectionHeader>Student Liability Release and Waiver</SectionHeader>
			<p style={{ fontWeight: 700 }}>{LIABILITY_WAIVER_INTRO}</p>
			<ol>
				{LIABILITY_WAIVER_ITEMS.map((item) => (
					<li key={item.slice(0, 24)} style={{ marginBottom: 12 }}>
						{item}
					</li>
				))}
			</ol>

			<SectionHeader>Student Declaration</SectionHeader>
			{STUDENT_DECLARATION_ITEMS.map((item) => (
				<p key={item.slice(0, 24)}>{item}</p>
			))}

			<Form.Item name='agreeDeclaration' valuePropName='checked' rules={[requiredCheckedRule]}>
				<Checkbox>I have carefully read, fully understood, and agree to the above.</Checkbox>
			</Form.Item>

			<FamilyMemberModal
				open={modalOpen}
				initialValues={editingIndex !== null ? familyMembers[editingIndex] : undefined}
				listTinh={listTinh}
				onClose={() => setModalOpen(false)}
				onSave={handleSave}
			/>
		</Fragment>
	);
};

export default GuardianConsentsStep;
