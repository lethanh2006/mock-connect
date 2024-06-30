import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { ELoaiUngDungTrongHocVien } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import { MapKeyNameLoaiUngDungTrongHocVien } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { primaryColor } from '@/services/base/constant';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Space, Tag, Tooltip } from 'antd';
import { useCallback, useState } from 'react';
import { useModel } from 'umi';
import FormUngDungTrongHocVien from './FormUngDungTrongHocVien';

const TableUngDungTrongHocVien = (props: { mode: 'view' | 'edit'; data: DeTaiKHCN.UngDungHocVien[] }) => {
	const { record: recDeTai, setRecord: setRecDeTai } = useModel('khoahoc.detaikhcn');

	const [edit, setEdit] = useState<boolean>(false);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [record, setRecord] = useState<DeTaiKHCN.UngDungHocVien>();

	const onCancelForm = useCallback(() => {
		setVisibleForm(false);
	}, []);

	const columns: IColumn<DeTaiKHCN.UngDungHocVien>[] = [
		{
			title: 'Loại ứng dụng',
			dataIndex: 'loaiUngDung',
			width: 250,
			render: (val: ELoaiUngDungTrongHocVien) => MapKeyNameLoaiUngDungTrongHocVien[val],
		},
		{
			title: 'Nội dung',
			dataIndex: 'noiDungUngDung',
			width: 250,
		},

		{
			title: 'Minh chứng',
			dataIndex: 'minhChungUrl',
			width: 150,
			align: 'center',
			fixed: 'right',

			render: (val: string[]) => (
				<div>
					{val?.map((item, index) => (
						<a key={item} href={item} target='_blank' rel='noreferrer'>
							<Tag color={primaryColor}>Xem tập tin {index + 1}</Tag>
						</a>
					))}
				</div>
			),
		},
	];

	columns.push({
		title: 'Thao tác',
		align: 'center',
		width: 80,
		fixed: 'right',
		hide: props.mode === 'view',
		render: (rec: DeTaiKHCN.UngDungHocVien) => (
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
								nghiemThuKhcn: {
									...recDeTai?.nghiemThuKhcn,
									noiDungUngDungHocVien:
										recDeTai?.nghiemThuKhcn?.noiDungUngDungHocVien
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
	});

	const onSortEnd = (recordTemp: DeTaiKHCN.UngDungHocVien, newIndex: number): void => {
		if (!recDeTai) return;
		const noiDungUngDungHocVien =
			recDeTai?.nghiemThuKhcn?.noiDungUngDungHocVien?.filter(
				(item) => item.noiDungUngDung !== recordTemp.noiDungUngDung,
			) ?? [];
		noiDungUngDungHocVien?.splice(newIndex, 0, recordTemp);
		setRecDeTai({
			...recDeTai,
			nghiemThuKhcn: {
				...(recDeTai?.nghiemThuKhcn ?? {}),
				noiDungUngDungHocVien,
			},
		});
	};

	return (
		<>
			<TableStaticData
				onSortEnd={onSortEnd}
				rowSortable
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
				<FormUngDungTrongHocVien record={record} edit={edit} onCancel={onCancelForm} />
			</Modal>
		</>
	);
};

export default TableUngDungTrongHocVien;
