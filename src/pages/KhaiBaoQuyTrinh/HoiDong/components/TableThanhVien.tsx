import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { HoiDong } from '@/services/QuyTrinh/HoiDong/typings';

import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Space, Tooltip } from 'antd';
import { useModel } from 'umi';

const TableThanhVien = (props: { mode: 'view' | 'edit'; data?: HoiDong.ThanhVienHoiDong[] }) => {
	const { record: recordHoiDong, setRecord: setRecordHoiDong } = useModel('quytrinh.hoidong');

	const columns: IColumn<HoiDong.ThanhVienHoiDong>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'ten',
			width: 120,
			align: 'center',
		},
		{
			title: 'Đơn vị công tác',
			width: 120,
			dataIndex: 'donVi',
		},
		{
			title: 'Vai trò',
			dataIndex: 'vaiTroHoiDong',
			width: 120,
			align: 'center',
		},

		{
			title: 'Thao tác',
			align: 'center',
			width: 80,
			fixed: 'right',
			hide: props.mode === 'view',
			render: (rec: HoiDong.ThanhVienHoiDong) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button size='small' shape='circle' icon={<EditOutlined />} type='link' />
					</Tooltip>
					<Divider type='vertical' />
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => {
								setRecordHoiDong({
									...recordHoiDong,
									danhSachThanhVien:
										recordHoiDong?.danhSachThanhVien
											?.map((item, index) => ({ ...item, index: index + 1 }))
											.filter((item) => item.index !== rec.index) ?? [],
								} as HoiDong.IRecord);
							}}
							title='Bạn có chắc chắn muốn xóa?'
						>
							<Button size='small' shape='circle' type={'link'} danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableStaticData
				addStt
				data={
					props?.data
						? props.data
						: recordHoiDong?.danhSachThanhVien?.map((item, index) => ({ ...item, index: index + 1 })) ?? []
				}
				otherProps={{
					pagination: false,
					size: 'small',
				}}
				columns={columns?.filter((item) => item.hide !== true)}
			>
				{props.mode === 'edit' && (
					<Space wrap>
						<Button size='small' type='primary' icon={<PlusCircleOutlined />}>
							Thêm mới
						</Button>
					</Space>
				)}
			</TableStaticData>
		</>
	);
};

export default TableThanhVien;
