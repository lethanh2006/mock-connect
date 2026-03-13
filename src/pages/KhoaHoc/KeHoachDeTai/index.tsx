import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormKeHoachDeTai from './components/Form';
import ViewMocThoiGianDot from './components/ViewMocThoiGianDot';
import ViewVanBanDot from './components/ViewVanBanDot';
import { ELoaiDeTai, MapKeyNameLoaiDeTai } from '@/services/KhoaHoc/KeHoachDeTai/constants';
import type { KeHoachDeTai } from '@/services/KhoaHoc/KeHoachDeTai/typings';

const KeHoachDeTaiPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('khoahoc.kehoachdetai');

	const columns: IColumn<KeHoachDeTai.IRecord>[] = [
		{
			title: 'Tên đợt',
			dataIndex: 'ten',
			width: 250,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Loại đề tài KHCN',
			dataIndex: 'loaiDeTai',
			width: 250,
			filterType: 'select',
			filterData: Object.values(ELoaiDeTai).map((item) => ({ value: item, label: MapKeyNameLoaiDeTai[item] })),
			render: (val: ELoaiDeTai) => <div>{MapKeyNameLoaiDeTai[val]}</div>,
		},
		{
			title: 'Các mốc thời gian',
			width: 120,
			align: 'center',
			render: (rec: KeHoachDeTai.IRecord) => (
				<Button
					onClick={() =>
						Modal.info({
							title: 'Mốc thời gian đợt',
							content: (
								<div style={{ marginTop: 20 }}>
									<ViewMocThoiGianDot rec={rec} />
								</div>
							),
						})
					}
					type='link'
					size='small'
				>
					Xem chi tiết
				</Button>
			),
		},
		{
			title: 'Văn bản kèm theo',
			width: 120,
			align: 'center',
			render: (rec: KeHoachDeTai.IRecord) => (
				<Button
					onClick={() => {
						Modal.info({
							title: 'Văn bản',
							content: (
								<div style={{ marginTop: 20 }}>
									<ViewVanBanDot rec={rec} />
								</div>
							),
						});
					}}
					type='link'
					size='small'
				>
					Xem chi tiết
				</Button>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: KeHoachDeTai.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa chức vụ này?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<TableBase
			widthDrawer={900}
			columns={columns}
			dependencies={[page, limit]}
			modelName='kehoachdetai'
			title='Quản lý đợt đăng ký đề tài KHCN'
			Form={FormKeHoachDeTai}
		/>
	);
};

export default KeHoachDeTaiPage;
