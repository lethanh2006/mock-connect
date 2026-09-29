import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { SoLanNhapCanhVisa, TenSoLanNhapCanhVisa } from '@/services/DaoTao/SinhVien/constants';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import dayjs from '@/utils/dayjs';
import { Button, IconTrash, IconPencil01 } from '@/components/Icons';
import { Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl } from 'umi';
import Form from './Form';

const ThongTinVisaFormItem = (props: {
	value?: SinhVien.TThongTinVisa[];
	onChange?: (list?: SinhVien.TThongTinVisa[]) => void;
}) => {
	const intl = useIntl();
	const { value, onChange } = props;
	const [record, setRecord] = useState<SinhVien.TThongTinVisa>();
	const [visibleForm, setVisibleForm] = useState<boolean>(false);

	const showCreate = (vis: boolean) => {
		if (vis) setRecord(undefined);
		setVisibleForm(vis);
	};

	const handleEdit = (rec: SinhVien.TThongTinVisa) => {
		setRecord(rec);
		setVisibleForm(true);
	};

	const handleDelete = (rec: SinhVien.TThongTinVisa) => {
		if (value?.length && rec && onChange) {
			const temp = [...value];
			temp.splice(rec?.key ?? 0, 1);
			onChange(temp);
		}
	};

	const handleForm = (values: SinhVien.TThongTinVisa) => {
		const temp = value?.length ? [...value] : [];
		if (record?.key === undefined) temp.push(values);
		else temp.splice(record.key, 1, values);
		if (onChange) onChange(temp);
		setVisibleForm(false);
	};

	const columns: IColumn<SinhVien.TThongTinVisa>[] = [
		{
			title: intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.tenquocgia' }),
			dataIndex: 'tenQuocGia',
			width: 120,
		},
		{
			title: intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.sohieuvisa' }),
			dataIndex: 'soHieuVisa',
			width: 120,
		},
		{
			title: intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.loaivisa' }),
			dataIndex: 'loaiVisa',
			width: 220,
		},
		{
			title: intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.ngaycapphep' }),
			dataIndex: 'ngayCapPhep',
			align: 'center',
			width: 120,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.ngayhethan' }),
			dataIndex: 'ngayHetHan',
			align: 'center',
			width: 110,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.solannhapcanh' }),
			dataIndex: 'soLanNhapCanh',
			align: 'center',
			width: 110,
			render: (val: SoLanNhapCanhVisa) =>
				val ? intl.formatMessage({ id: TenSoLanNhapCanhVisa[val] }) : '',
		},
		{
			title: intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.chinhsua' })}>
						<Button onClick={() => handleEdit(rec)} variant="ghost" size="sm" icon={<IconPencil01 />} />
					</Tooltip>
					<Tooltip title={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.xoa' })}>
						<Popconfirm
							onConfirm={() => handleDelete(rec)}
							title={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.xoa.xacnhan' })}
							placement="topRight"
						>
							<Button variant="destructive" size="sm" icon={<IconTrash />} />
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
				size="small"
				hasCreate
				Form={Form as any}
				showEdit={visibleForm}
				setShowEdit={showCreate}
				formProps={{ visible: visibleForm, record, onOk: handleForm }}
				widthDrawer={800}
			/>
		</>
	);
};

export default ThongTinVisaFormItem;
