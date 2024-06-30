import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { EVaiTroDeTai } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import type { EVaiTroHoiDong } from '@/services/QuyTrinh/HoiDong/constant';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Space, Tooltip } from 'antd';
import { useCallback, useState } from 'react';
import { useModel } from 'umi';
import FormThanhVien from './FormThanhVien';

const TableThanhVien = (props: {
	mode: 'view' | 'edit';
	data: DeTaiKHCN.ThanhVienDeTai[];
	type: 'DeTai' | 'HoiDong';
	fieldName: 'danhSachCTV' | 'danhSachThanhVien' | 'danhSachThanhVienThamGia';
}) => {
	const { record: recDeTai, setRecord: setRecDeTai } = useModel('khoahoc.detaikhcn');
	const [edit, setEdit] = useState<boolean>(false);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [record, setRecord] = useState<DeTaiKHCN.ThanhVienDeTai>();

	const onCancelForm = useCallback(() => {
		setVisibleForm(false);
	}, []);

	const columns: IColumn<DeTaiKHCN.ThanhVienDeTai>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'ten',
			width: 120,
			align: 'center',
		},
		{
			title: 'Mã sinh viên',
			dataIndex: 'maDinhDanh',
			width: 120,
			align: 'center',
			hide: props.type === 'HoiDong',
		},
		{
			title: 'Chức vụ',
			dataIndex: 'chucVu',
			width: 120,
			align: 'center',
			hide: props.type === 'DeTai',
			render: (val, rec) => <div>{props.fieldName === 'danhSachThanhVien' ? val : rec.chucVu}</div>,
		},
		{
			title: 'Khoa',
			width: 120,
			dataIndex: 'tenDonVi',
			align: 'center',
		},
		{
			title: 'Vai trò',
			dataIndex: 'danhSachVaiTroDeTai',
			width: 120,
			align: 'center',
			hide: props.type === 'HoiDong',
			render: (val: EVaiTroDeTai[], rec) => val.join(', '),
		},
		{
			title: 'Chức vụ hội đồng',
			dataIndex: 'danhSachChucVuHoiDong',
			width: 120,
			align: 'center',
			hide: props.type === 'DeTai' || (props.type === 'HoiDong' && props.fieldName === 'danhSachThanhVienThamGia'),
			render: (val: EVaiTroHoiDong[], rec) => <div>{val.join(', ')}</div>,
		},

		{
			title: 'Thao tác',
			align: 'center',
			width: 80,
			fixed: 'right',
			hide: props.mode === 'view',
			render: (rec: DeTaiKHCN.ThanhVienDeTai) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							size='small'
							onClick={() => {
								setEdit(true);
								setVisibleForm(true);
								setRecord(rec);
							}}
							shape='circle'
							icon={<EditOutlined />}
							type='link'
						/>
					</Tooltip>
					<Divider type='vertical' />
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => {
								setRecDeTai({
									...recDeTai,
									dangKyKhcn: {
										...recDeTai?.dangKyKhcn,
										danhSachCTV:
											recDeTai?.dangKyKhcn?.danhSachCTV
												?.map((item, index) => ({ ...item, index: index + 1 }))
												.filter((item) => item.index !== rec.index) ?? [],
									},
								} as DeTaiKHCN.IRecord);
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
				data={props?.data ?? []}
				otherProps={{
					pagination: false,
					size: 'small',
				}}
				columns={columns?.filter((item) => item.hide !== true)}
			>
				{props.mode === 'edit' && (
					<Space wrap>
						<Button
							size='small'
							type='primary'
							icon={<PlusCircleOutlined />}
							onClick={() => {
								setEdit(false);
								setVisibleForm(true);
								setRecord(undefined);
							}}
						>
							Thêm mới
						</Button>
					</Space>
				)}
			</TableStaticData>
			<Modal
				zIndex={1002}
				destroyOnClose
				visible={visibleForm}
				onCancel={onCancelForm}
				footer={false}
				bodyStyle={{ padding: 0 }}
			>
				<FormThanhVien record={record} edit={edit} onCancel={onCancelForm} />
			</Modal>
		</>
	);
};

export default TableThanhVien;
