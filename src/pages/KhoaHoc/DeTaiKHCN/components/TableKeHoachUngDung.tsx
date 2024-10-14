import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Space, Tooltip } from 'antd';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { useModel } from 'umi';
import FormKeHoachUngDung from './FormKeHoachUngDung';

const TableKeHoachUngDung = (props: { mode: 'view' | 'edit'; data: DeTaiKHCN.KeHoachUngDung[] }) => {
	const { record: recDeTai, setRecord: setRecDeTai } = useModel('khoahoc.detaikhcn');

	const [edit, setEdit] = useState<boolean>(false);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [record, setRecord] = useState<DeTaiKHCN.KeHoachUngDung>();

	const onCancelForm = useCallback(() => {
		setVisibleForm(false);
	}, []);

	const columns: IColumn<DeTaiKHCN.KeHoachUngDung>[] = [
		{
			title: 'Nội dung ứng dụng',
			dataIndex: 'noiDung',
			width: 250,
			// align: 'center',
		},

		{
			title: 'Thời gian',
			dataIndex: 'thoiGian',
			width: 120,
			align: 'center',
			render: (val: string, rec) => <div>{moment(val).format('DD/MM/YYYY')}</div>,
		},
		{
			title: 'Địa điểm tiếp nhận ứng dụng',
			width: 250,
			dataIndex: 'diaDiem',
		},
		{
			title: 'Yêu cầu, đầu ra chủ yếu',
			width: 250,
			dataIndex: 'yeuCau',
		},
	];

	columns.push({
		title: 'Thao tác',
		align: 'center',
		width: 80,
		fixed: 'right',
		hide: props.mode === 'view',
		render: (rec: DeTaiKHCN.KeHoachUngDung) => (
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
									keHoachUngDung:
										recDeTai?.nghiemThuKhcn?.keHoachUngDung
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

	const onSortEnd = (recordTemp: DeTaiKHCN.KeHoachUngDung, newIndex: number): void => {
		if (!recDeTai) return;
		const keHoachUngDung =
			recDeTai?.nghiemThuKhcn?.keHoachUngDung?.filter((item) => item.noiDung !== recordTemp.noiDung) ?? [];
		keHoachUngDung?.splice(newIndex, 0, recordTemp);
		setRecDeTai({
			...recDeTai,
			nghiemThuKhcn: {
				...(recDeTai?.nghiemThuKhcn ?? {}),
				keHoachUngDung,
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
				<FormKeHoachUngDung record={record} edit={edit} onCancel={onCancelForm} />
			</Modal>
		</>
	);
};

export default TableKeHoachUngDung;
