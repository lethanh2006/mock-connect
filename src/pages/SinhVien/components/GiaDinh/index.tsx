import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { SinhVien } from '@/services/SinhVien/typings';
import { formatPhoneNumber } from '@/utils/utils';
import moment from 'moment';
import Form from './Form';
import { useState } from 'react';
import { Tooltip, Button, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const ThongTinGiaDinhFormItem = (props: {
	value?: SinhVien.TThongTinGiaDinh[];
	onChange?: (list?: SinhVien.TThongTinGiaDinh[]) => void;
}) => {
	const { value, onChange } = props;
	const [record, setRecord] = useState<SinhVien.TThongTinGiaDinh>();
	const [visibleForm, setVisibleForm] = useState<boolean>(false);

	const showCreate = (vis: boolean) => {
		if (vis) setRecord(undefined);
		setVisibleForm(vis);
	};

	const handleEdit = (rec: SinhVien.TThongTinGiaDinh) => {
		setRecord(rec);
		setVisibleForm(true);
	};

	const handleDelete = (rec: SinhVien.TThongTinGiaDinh) => {
		if (value?.length && rec.key && onChange) {
			const temp = [...value];
			temp.splice(rec.key, 1);
			onChange(temp);
		}
	};

	const handleForm = (values: SinhVien.TThongTinGiaDinh) => {
		const temp = value?.length ? [...value] : [];
		if (record?.key === undefined) temp.push(values);
		else temp.splice(record.key, 1, values);
		if (onChange) onChange(temp);
		setVisibleForm(false);
	};

	const columns: IColumn<SinhVien.TThongTinGiaDinh>[] = [
		{
			title: 'Loại thành viên',
			dataIndex: 'loaiThanhVien',
			width: 100,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThaiThanhVien',
			width: 120,
		},
		{
			title: 'Họ tên',
			width: 150,
			render: (val, rec) => [rec.hoDem, rec.ten].join(' '),
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			align: 'center',
			width: 120,
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Nghề nghiệp',
			dataIndex: 'ngheNghiep',
			width: 150,
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			align: 'center',
			width: 120,
			render: (val) => val && formatPhoneNumber(val),
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'diaChiHienNay',
			width: 180,
			render: (val, rec) =>
				[rec.diaChiHienNay?.diaChi, rec.diaChiHienNay?.tenXaPhuong, rec.diaChiHienNay?.tenQH, rec.diaChiHienNay?.tenTP]
					.filter((i) => !!i)
					.join(', '),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => handleDelete(rec)}
							title='Bạn có chắc chắn muốn xóa thành viên này?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableStaticData
				columns={columns}
				data={value ?? []}
				addStt
				size='small'
				hasCreate
				Form={Form}
				showEdit={visibleForm}
				setShowEdit={showCreate}
				formProps={{ visible: visibleForm, record, onOk: handleForm }}
				widthDrawer={1000}
			/>
		</>
	);
};

export default ThongTinGiaDinhFormItem;
