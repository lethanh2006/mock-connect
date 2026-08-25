import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Form, Popconfirm, type FormInstance } from 'antd';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'umi';
import FamilyMemberModal from './FamilyMemberModal';
import { getLiabilityWaiverIntro, getLiabilityWaiverItems, getStudentDeclarationItems } from './guardianConstants';
import type { TDiaChiGiaDinh, TFamilyMember } from './typing';

const formatAddress = (diaChi?: TDiaChiGiaDinh) =>
	diaChi ? [diaChi.diaChi, diaChi.tenXaPhuong, diaChi.tenTP].filter(Boolean).join(', ') : '';

const getColumns = (
	intl: any,
	handleEdit: (index: number) => void,
	handleDelete: (index: number) => void,
): IColumn<TFamilyMember>[] => [
	{
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.table.name' }),
		dataIndex: 'fullName',
		width: 160,
	},
	{
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.table.relationship' }),
		dataIndex: 'loaiThanhVien',
		width: 120,
	},
	{
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.table.primaryPhone' }),
		dataIndex: 'soDienThoai',
		width: 120,
	},
	{
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.table.secondaryPhone' }),
		dataIndex: 'soDienThoai2',
		width: 120,
	},
	{
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.table.email' }),
		dataIndex: 'email',
		width: 160,
	},
	{
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.table.address' }),
		width: 220,
		render: (_, row) => formatAddress(row.diaChiHienNay ?? row.hoKhauThuongTru),
	},
	{
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.table.action' }),
		width: 90,
		align: 'center',
		render: (_, __, index) => (
			<Fragment>
				<Button type='text' icon={<EditOutlined />} onClick={() => handleEdit(index)} />
				<Popconfirm
					title={intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.table.deleteConfirm' })}
					onConfirm={() => handleDelete(index)}
				>
					<Button type='text' danger icon={<DeleteOutlined />} />
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
				if (!value)
					throw new Error(intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.requiredConsentError' }));
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

	const handleReload = () => {
		const list = form.getFieldValue('thanhVienGiaDinh');
		setFamilyMembers(Array.isArray(list) ? [...list] : []);
	};

	const columns = useMemo(() => getColumns(intl, handleEdit, handleDelete), [intl, familyMembers]);

	return (
		<Fragment>
			<Divider size='small' className='divider-big-title' orientation='left' dashed style={{ marginTop: 0 }}>
				{intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.familyInfo' })}
			</Divider>

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
				<TableStaticData
					data={familyMembers}
					columns={columns}
					addStt
					size='small'
					columnSetting={false}
					globalSearch={false}
					hasTotal
					onReload={handleReload}
					header={{
						total: {
							prefix: intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.memberCountRequirement' }),
						},
					}}
					otherButtons={[
						<Button
							key='add-family-member'
							type='primary'
							size='small'
							icon={<PlusCircleOutlined />}
							onClick={handleAdd}
						>
							{intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.addMore' })}
						</Button>,
					]}
					otherProps={{ pagination: false, rowKey: (_: TFamilyMember, index?: number) => index ?? 0 }}
				/>
			</Form.Item>

			<Form.Item name='consentShareWithGuardian' valuePropName='checked' rules={[requiredCheckedRule]}>
				<Checkbox>{intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.consentShare' })}</Checkbox>
			</Form.Item>

			<Divider size='small' className='divider-big-title' orientation='left' dashed>
				{intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.waiverTitle' })}
			</Divider>
			<p style={{ fontWeight: 700 }}>{getLiabilityWaiverIntro(intl)}</p>
			<ol>
				{getLiabilityWaiverItems(intl).map((item) => (
					<li key={item.slice(0, 24)} style={{ marginBottom: 12 }}>
						{item}
					</li>
				))}
			</ol>

			<Divider size='small' className='divider-big-title' orientation='left' dashed>
				{intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.declarationTitle' })}
			</Divider>
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
