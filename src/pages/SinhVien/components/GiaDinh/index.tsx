import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { formatDate } from '@/utils/formatDate';
import { formatPhoneNumber } from '@/utils/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl } from 'umi';
import Form from './Form';

const ThongTinGiaDinhFormItem = (props: {
	value?: SinhVien.TThongTinGiaDinh[];
	onChange?: (list?: SinhVien.TThongTinGiaDinh[]) => void;
}) => {
	const intl = useIntl();
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
		if (value?.length && rec && onChange) {
			const temp = [...value];
			temp.splice(rec?.key ?? 0, 1);
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
			title: intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.loai' }),
			dataIndex: 'loaiThanhVien',
			width: 100,
		},
		{
			title: intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.trangthai' }),
			dataIndex: 'trangThaiThanhVien',
			width: 120,
		},
		{
			title: intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.hoten' }),
			width: 150,
			render: (val, rec) => [rec.hoDem, rec.ten].join(' '),
		},
		{
			title: intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.ngaysinh' }),
			dataIndex: 'ngaySinh',
			align: 'center',
			width: 120,
			render: (val) => val && formatDate(val),
		},
		{
			title: intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.nghenghiep' }),
			dataIndex: 'ngheNghiep',
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.sdt' }),
			dataIndex: 'soDienThoai',
			align: 'center',
			width: 120,
			render: (val) => val && formatPhoneNumber(val),
		},
		{
			title: intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.diachi' }),
			dataIndex: 'diaChiHienNay',
			width: 180,
			render: (val, rec) =>
				[rec.diaChiHienNay?.diaChi, rec.diaChiHienNay?.tenXaPhuong, rec.diaChiHienNay?.tenQH, rec.diaChiHienNay?.tenTP]
					.filter((i) => !!i)
					.join(', '),
		},
		{
			title: intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.chinhsua' })}>
						<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.xoa' })}>
						<Popconfirm
							onConfirm={() => handleDelete(rec)}
							title={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.xoa.xacnhan' })}
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
				Form={Form as any}
				showEdit={visibleForm}
				setShowEdit={showCreate}
				formProps={{ visible: visibleForm, record, onOk: handleForm }}
				widthDrawer={1000}
			/>
		</>
	);
};

export default ThongTinGiaDinhFormItem;
