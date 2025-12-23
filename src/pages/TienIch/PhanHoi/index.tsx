import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import { type PhanHoi } from '@/services/TienIch/PhanHoi/typing';
import dayjs from '@/utils/dayjs';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Segmented, Tag, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormGuiPhanHoi from './components/FormGuiPhanHoi';
import ModalDetailPhanhoi from './components/ModalDetail';

const PhanHoiPage = () => {
	const intl = useIntl();
	const { setCondition, handleEdit, edit, getModel } = useModel('tienich.phanhoi');
	const [daTraLoi, setDaTraLoi] = useState<string>('all');

	const getData = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, 'me');
	};

	const onCell = (rec: PhanHoi.IRecord) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<PhanHoi.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'phanhoi.column.noidung' }),
			dataIndex: 'noiDungPhanHoi',
			width: 250,
			render: (val) => <ExpandText ellipsis={{ expandable: false }}>{val}</ExpandText>,
			filterType: 'string',
			onCell,
		},
		// {
		// 	title: 'Loại phản hồi',
		// 	dataIndex: 'loaiPhanHoi',
		// 	width: 100,
		// 	filterType: 'select',
		// 	filterData: Object.values(ELoaiPhanHoi),
		// 	onCell,
		// },
		{
			title: intl.formatMessage({ id: 'phanhoi.column.ngaygui' }),
			dataIndex: 'createdAt',
			align: 'center',
			render: (val) => dayjs(val).format('HH:mm DD/MM/YYYY'),
			width: 120,
			sortable: true,
			filterType: 'datetime',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'phanhoi.column.chude' }),
			dataIndex: 'tenLinhVuc',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'phanhoi.column.donvi' }),
			dataIndex: 'maDonVi',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectDonVi multiple />,
			render: (val, rec) =>
				`${val ? (rec.tenDonVi ? `${rec.tenDonVi} (${val})` : val) : intl.formatMessage({ id: 'phanhoi.trangthai.khongthongtin' })}`,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'phanhoi.column.traloi' }),
			dataIndex: 'noiDungTraLoiPhanHoi',
			hide: daTraLoi === 'chua',
			width: 250,
			render: (val) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'phanhoi.column.nguoitraloi' }),
			dataIndex: 'maChuyenVien',
			hide: daTraLoi === 'chua',
			width: 120,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'phanhoi.column.thoigiantraloi' }),
			dataIndex: 'thoiGianTraLoi',
			align: 'center',
			render: (val, rec) =>
				rec.daTraLoiPhanHoi && val ? (
					dayjs(val).format('HH:mm DD/MM/YYYY')
				) : (
					<Tag color='red'>{intl.formatMessage({ id: 'phanhoi.trangthai.chuatraloi' })}</Tag>
				),
			width: 120,
			hide: daTraLoi === 'chua',
			sortable: true,
			filterType: 'datetime',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'phanhoi.column.thaotac' }),
			width: 60,
			align: 'center',
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'phanhoi.action.detail' })}>
						<Button type='link' icon={<EyeOutlined />} onClick={() => handleEdit(rec)} />
					</Tooltip>
				</>
			),
		},
	];

	const onChangeTrangThai = (value: string) => {
		setDaTraLoi(value);
		setCondition({ daTraLoiPhanHoi: value === 'all' ? undefined : value === 'roi' ? true : false });
	};

	return (
		<TableBase
			getData={getData}
			columns={columns}
			modelName='tienich.phanhoi'
			title={intl.formatMessage({ id: 'phanhoi.title' })}
			Form={edit ? ModalDetailPhanhoi : FormGuiPhanHoi}
			formProps={{ getData }}
			widthDrawer={600}
			destroyModal
			otherButtons={[
				<Segmented
					key='1'
					value={daTraLoi}
					onChange={(val) => onChangeTrangThai(val.toString())}
					options={[
						{ value: 'all', label: intl.formatMessage({ id: 'phanhoi.filter.tatca' }) },
						{ value: 'chua', label: intl.formatMessage({ id: 'phanhoi.filter.chuatraloi' }) },
						{ value: 'roi', label: intl.formatMessage({ id: 'phanhoi.filter.datraloi' }) },
					]}
				/>,
			]}
		/>
	);
};

export default PhanHoiPage;
