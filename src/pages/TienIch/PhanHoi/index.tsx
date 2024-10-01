import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import { type PhanHoi } from '@/services/TienIch/PhanHoi/typing';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Segmented, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import FormGuiPhanHoi from './components/FormGuiPhanHoi';
import ModalDetailPhanhoi from './components/ModalDetail';

const PhanHoiPage = () => {
	const { setCondition, handleEdit, edit, getModel } = useModel('tienich.phanhoi');
	const [daTraLoi, setDaTraLoi] = useState<string>('all');

	const onCell = (rec: PhanHoi.IRecord) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<PhanHoi.IRecord>[] = [
		{
			title: 'Nội dung phản hồi',
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
			title: 'Ngày gửi',
			dataIndex: 'createdAt',
			align: 'center',
			render: (val) => moment(val).format('HH:mm DD/MM/YYYY'),
			width: 120,
			sortable: true,
			filterType: 'datetime',
			onCell,
		},
		{
			title: 'Chủ đề',
			dataIndex: 'tenLinhVuc',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Bộ phận xử lý',
			dataIndex: 'maDonVi',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectDonVi multiple />,
			render: (val, rec) => `${val ? (rec.tenDonVi ? `${rec.tenDonVi} (${val})` : val) : 'Không có thông tin'}`,
			onCell,
		},
		{
			title: 'Trả lời',
			dataIndex: 'noiDungTraLoiPhanHoi',
			hide: daTraLoi === 'chua',
			width: 250,
			render: (val) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Người trả lời',
			dataIndex: 'maChuyenVien',
			hide: daTraLoi === 'chua',
			width: 120,
			onCell,
		},
		{
			title: 'Thời gian trả lời',
			dataIndex: 'thoiGianTraLoi',
			align: 'center',
			render: (val, rec) =>
				rec.daTraLoiPhanHoi && val ? moment(val).format('HH:mm DD/MM/YYYY') : <Tag color='red'>Chưa trả lời</Tag>,
			width: 120,
			hide: daTraLoi === 'chua',
			sortable: true,
			filterType: 'datetime',
			onCell,
		},
		{
			title: 'Thao tác',
			width: 60,
			align: 'center',
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Tooltip title='Chi tiết'>
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
			columns={columns}
			modelName='tienich.phanhoi'
			title='Phản hồi'
			getData={() => getModel(undefined, undefined, undefined, undefined, undefined, 'me')}
			Form={edit ? ModalDetailPhanhoi : FormGuiPhanHoi}
			widthDrawer={600}
			destroyModal
			otherButtons={[
				<Segmented
					key='1'
					value={daTraLoi}
					onChange={(val) => onChangeTrangThai(val.toString())}
					options={[
						{ value: 'all', label: 'Tất cả' },
						{ value: 'chua', label: 'Chưa trả lời' },
						{ value: 'roi', label: 'Đã trả lời' },
					]}
				/>,
			]}
		/>
	);
};

export default PhanHoiPage;
