import type { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Popconfirm, Table, type FormInstance } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'umi';
import FamilyMemberModal from './FamilyMemberModal';
import { getLiabilityWaiverIntro, getLiabilityWaiverItems, getStudentDeclarationItems } from './guardianConstants';
import SectionHeader from './SectionHeader';
import type { TDiaChiGiaDinh, TFamilyMember } from './typing';

const formatAddress = (diaChi?: TDiaChiGiaDinh) =>
	diaChi ? [diaChi.diaChi, diaChi.tenXaPhuong, diaChi.tenTP].filter(Boolean).join(', ') : '';

const getColumns = (
	intl: any,
	handleEdit: (index: number) => void,
	handleDelete: (index: number) => void,
): ColumnsType<TFamilyMember> => [
		{ title: intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.table.no' }), width: 56, render: (_, __, index) => index + 1 },
		{ title: intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.table.name' }), dataIndex: 'fullName' },
		{ title: intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.table.relationship' }), dataIndex: 'loaiThanhVien' },
		{ title: intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.table.primaryPhone' }), dataIndex: 'soDienThoai' },
		{ title: intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.table.secondaryPhone' }), dataIndex: 'soDienThoai2' },
		{ title: intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.table.email' }), dataIndex: 'email' },
		{ title: intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.table.address' }), render: (_, row) => formatAddress(row.diaChiHienNay ?? row.hoKhauThuongTru) },
		{
			title: intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.table.action' }),
			width: 90,
			render: (_, __, index) => (
				<Fragment>
					<Button type='text' icon={<EditOutlined />} onClick={() => handleEdit(index)} />
					<Popconfirm title={intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.table.deleteConfirm' })} onConfirm={() => handleDelete(index)}>
						<Button type='text' icon={<DeleteOutlined />} />
					</Popconfirm>
				</Fragment>
			),
		},
	];

const GuardianConsentsStep = ({ form, listTinh }: { form: FormInstance<any>; listTinh?: DonViHanhChinh.IRecord[] }) => {
	const intl = useIntl();
	const [familyMembers, setFamilyMembers] = useState<TFamilyMember[]>(
		() => form.getFieldValue('thanhVienGiaDinh') || [],
	);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const requiredCheckedRule = useMemo(
		() => ({
			validator: async (_: unknown, value: boolean) => {
				if (!value) throw new Error(intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.requiredConsentError' }));
			},
		}),
		[intl],
	);

	useEffect(() => {
		const initialList = form.getFieldValue('thanhVienGiaDinh');
		if (initialList && Array.isArray(initialList) && initialList.length > 0 && familyMembers.length === 0) {
			setFamilyMembers(initialList);
		}
	}, []);

	const updateFamilyMembers = (newList: TFamilyMember[]) => {
		setFamilyMembers(newList);
		form.setFieldsValue({ thanhVienGiaDinh: newList });
	};

	const handleAdd = () => {
		setEditingIndex(null);
		setModalOpen(true);
	};

	const handleEdit = (index: number) => {
		setEditingIndex(index);
		setModalOpen(true);
	};

	const handleDelete = (index: number) => {
		const newList = familyMembers.filter((_, i) => i !== index);
		updateFamilyMembers(newList);
	};

	const handleSave = (values: TFamilyMember) => {
		const newList =
			editingIndex === null
				? [...familyMembers, values]
				: familyMembers.map((item, i) => (i === editingIndex ? values : item));
		updateFamilyMembers(newList);
		setModalOpen(false);
	};

	const columns = useMemo(() => getColumns(intl, handleEdit, handleDelete), [intl, familyMembers]);

	return (
		<Fragment>
			<SectionHeader>{intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.familyInfo' })}</SectionHeader>

			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
				<span>
					{intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.total' })} <strong>{familyMembers.length}</strong>{' '}
					<span style={{ color: '#d4622a', fontStyle: 'italic' }}>
						{intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.memberCountRequirement' })}
					</span>
				</span>
				<div style={{ display: 'flex', gap: 8 }}>
					<Button icon={<ReloadOutlined />} />
					<Button type='primary' onClick={handleAdd}>
						{intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.addMore' })}
					</Button>
				</div>
			</div>

			<Form.Item
				name='thanhVienGiaDinh'
				rules={[
					{
						validator: async (_, value) => {
							if (!value || value.length < 2)
								throw new Error(intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.minMembersError' }));
						},
					},
				]}
			>
				<Table rowKey={(_, index) => index ?? 0} dataSource={familyMembers} columns={columns} pagination={false} size='small' />
			</Form.Item>

			<Form.Item name='consentShareWithGuardian' valuePropName='checked' rules={[requiredCheckedRule]}>
				<Checkbox>
					{intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.consentShare' })}
				</Checkbox>
			</Form.Item>

			<SectionHeader>{intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.waiverTitle' })}</SectionHeader>
			<p style={{ fontWeight: 700 }}>{getLiabilityWaiverIntro(intl)}</p>
			<ol>
				{getLiabilityWaiverItems(intl).map((item) => (
					<li key={item.slice(0, 24)} style={{ marginBottom: 12 }}>
						{item}
					</li>
				))}
			</ol>

			<SectionHeader>{intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.declarationTitle' })}</SectionHeader>
			{getStudentDeclarationItems(intl).map((item) => (
				<p key={item.slice(0, 24)}>{item}</p>
			))}

			<Form.Item name='agreeDeclaration' valuePropName='checked' rules={[requiredCheckedRule]}>
				<Checkbox>{intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.agreeDeclaration' })}</Checkbox>
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
