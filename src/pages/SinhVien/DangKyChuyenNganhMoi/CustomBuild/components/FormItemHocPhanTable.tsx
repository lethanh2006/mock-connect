import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { colorTrangThaiKqht, ETrangThaiKqht, trangThaiKqht } from '@/services/DaoTao/constant';
import { PhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/typing';
import { IconTrash, Icon3SquarePlusmark } from '@/components/Icons';
import { useIntl } from '@umijs/max';
import { FormInstance, Modal, Popconfirm, Tag } from 'antd';
import { useState } from 'react';

interface FormItemHocPhanTableProps {
	form: FormInstance;
	value?: PhieuDkCtdt.HocPhanDkCtdt[];
	disabled?: boolean;
	FormComponent: React.ComponentType<{
		onOk: (val: PhieuDkCtdt.HocPhanDkCtdt[]) => void;
		onCancel?: () => void;
		[key: string]: any;
	}>;
	fieldName: string;
	modalTitle: string;
	buttonText: string;
	spreadValue?: boolean;
	formComponentProps?: Record<string, any>;
	onDelete?: (record: PhieuDkCtdt.HocPhanDkCtdt) => void;
	isDisplayDiem?: boolean;
}

const FormItemHocPhanTable = (props: FormItemHocPhanTableProps) => {
	const {
		form,
		value,
		disabled,
		FormComponent,
		fieldName,
		buttonText,
		modalTitle,
		formComponentProps,
		onDelete,
		isDisplayDiem = false,
	} = props;
	const [openModal, setOpenModal] = useState(false);

	const normalizedValue = Array.isArray(value) ? value : [];
	const intl = useIntl();
	const handleDelete = (record: PhieuDkCtdt.HocPhanDkCtdt) => {
		if (onDelete) {
			onDelete(record);
		} else {
			const currentValue = form.getFieldValue(fieldName) || [];
			const uniqueKey = record.ma;
			const updatedValue = currentValue.filter((item: PhieuDkCtdt.HocPhanDkCtdt) => {
				const itemKey = item.ma;
				return itemKey !== uniqueKey;
			});
			form.setFieldsValue({
				[fieldName]: updatedValue,
			});
		}
	};

	const columns: IColumn<PhieuDkCtdt.HocPhanDkCtdt>[] = [
		{
			title: intl.formatMessage({ id: 'minor.idm.form.courseCode' }),
			dataIndex: 'ma',
			width: 120,
		},
		{
			title: intl.formatMessage({ id: 'minor.idm.form.courseName' }),
			dataIndex: 'ten',
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'minor.idm.form.credits' }),
			dataIndex: 'soTinChi',
			width: 100,
			align: 'center',
			render: (val) => {
				const credits = val || 0;
				const tagColor = credits === 0 ? 'default' : credits === 1 || credits === 2 ? 'gold' : 'red';
				return (
					<Tag color={tagColor}>
						{credits} {intl.formatMessage({ id: 'minor.table.credits' })}
					</Tag>
				);
			},
		},
		{
			title: intl.formatMessage({ id: 'minor.idm.form.status' }),
			dataIndex: 'trangThaiKqht',
			width: 150,
			render: (val) => {
				const status = val as ETrangThaiKqht | undefined;
				if (!status) return '--';
				const color = Object.values(ETrangThaiKqht).includes(status as ETrangThaiKqht)
					? colorTrangThaiKqht[status as ETrangThaiKqht]
					: 'default';
				const label = Object.values(ETrangThaiKqht).includes(status as ETrangThaiKqht)
					? trangThaiKqht[status as ETrangThaiKqht]
					: status;
				return <Tag color={color}>{label}</Tag>;
			},
		},
		...(isDisplayDiem
			? ([
					{
						title: intl.formatMessage({ id: 'minor.idm.table.score' }),
						dataIndex: 'diem',
						width: 150,
						render: (val: string | undefined) => {
							return <Tag color='blue'>{val}</Tag>;
						},
					},
				] as IColumn<PhieuDkCtdt.HocPhanDkCtdt>[])
			: []),
		{
			title: intl.formatMessage({ id: 'minor.idm.table.actions' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => {
				return (
					<>
						<Popconfirm
							onConfirm={() => handleDelete(rec)}
							title={intl.formatMessage({ id: 'minor.idm.popconfirm.deleteConfirm' })}
							placement='topLeft'
						>
							<ButtonExtend
								tooltip={intl.formatMessage({ id: 'minor.idm.action.delete' })}
								danger
								type='link'
								icon={<IconTrash />}
							/>
						</Popconfirm>
					</>
				);
			},
			hide: disabled,
		},
	];

	const handleOk = (val: PhieuDkCtdt.HocPhanDkCtdt[]) => {
		const currentValue = form.getFieldValue(fieldName) || [];
		console.log([...currentValue, ...val], 'currentValue');
		form.setFieldsValue({
			[fieldName]: [...currentValue, ...val],
		});
		setOpenModal(false);
	};

	return (
		<>
			<TableStaticData
				data={normalizedValue}
				columns={columns}
				hasTotal
				addStt
				size='small'
				otherProps={{ pagination: false, scroll: { y: 400 } }}
				otherButtons={[
					<ButtonExtend
						disabled={disabled}
						icon={<Icon3SquarePlusmark />}
						size='small'
						onClick={() => {
							setOpenModal(true);
						}}
						type='primary'
					>
						{buttonText}
					</ButtonExtend>,
				]}
			/>

			<Modal
				title={modalTitle}
				open={openModal}
				width={600}
				footer={null}
				destroyOnClose
				onCancel={() => setOpenModal(false)}
			>
				<FormComponent onOk={handleOk} onCancel={() => setOpenModal(false)} {...formComponentProps} />
			</Modal>
		</>
	);
};

export default FormItemHocPhanTable;
