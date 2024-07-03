import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import UploadFile from '@/components/Upload/UploadFile';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { primaryColor } from '@/services/base/constant';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Modal, Popconfirm, Space, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { useModel } from 'umi';
import FormTimeline from './FormTimeline';

const TableTimeline = (props: {
	mode: 'view' | 'edit';
	data: DeTaiKHCN.TimelineThuyetMinh[];
	showMinhChung?: boolean;
}) => {
	const { record: recDeTai, setRecord: setRecDeTai } = useModel('khoahoc.detaikhcn');

	const [edit, setEdit] = useState<boolean>(false);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [record, setRecord] = useState<DeTaiKHCN.TimelineThuyetMinh>();

	const onCancelForm = useCallback(() => {
		setVisibleForm(false);
	}, []);

	const columns: IColumn<DeTaiKHCN.TimelineThuyetMinh>[] = [
		{
			title: 'Nội dung công việc',
			dataIndex: 'noiDungTimeline',
			width: 250,
			// align: 'center',
		},
		{
			title: 'Kết quả dự kiến',
			width: 200,
			dataIndex: 'ketQuaDuKien',
		},
		{
			title: 'Thời gian',
			dataIndex: 'startDate',
			width: 120,
			align: 'center',
			render: (val: string, rec) => (
				<div>
					{moment(val).format('DD/MM/YYYY')} - {moment(rec.endDate).format('DD/MM/YYYY')}
				</div>
			),
		},
		{
			title: 'Người thực hiện',
			width: 200,
			render: (rec: DeTaiKHCN.TimelineThuyetMinh) => (
				<div>
					{rec?.danhSachNguoiThucHien?.map((item) => (
						<div key={item.userId || item.ten}>{item.ten}</div>
					))}
				</div>
			),
		},
		{
			title: 'Minh chứng',
			dataIndex: 'sanPhamUrl',
			width: 150,
			align: 'center',
			fixed: 'right',
			hide: !(props.showMinhChung && props.mode === 'view'),
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

	columns.push(
		props.showMinhChung
			? {
					title: 'Minh chứng',
					width: 170,
					fixed: 'right',
					hide: props.mode === 'view',
					align: 'center',
					render: (rec: DeTaiKHCN.TimeLine, val: any, index) => {
						return (
							<Form.Item name={['timeline', index]}>
								<UploadFile
									maxCount={5}
									accept='.doc, .docx, .pdf, .png'
									otherProps={{
										multiple: true,
										showUploadList: { showDownloadIcon: false },
									}}
								/>
							</Form.Item>
						);
					},
			  }
			: {
					title: 'Thao tác',
					align: 'center',
					width: 80,
					fixed: 'right',
					hide: props.mode === 'view',
					render: (rec: DeTaiKHCN.TimelineThuyetMinh) => (
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
											deCuongKhcn: {
												...recDeTai?.deCuongKhcn,
												timeline:
													recDeTai?.deCuongKhcn?.timeline
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
	);

	const onSortEnd = (recordTemp: DeTaiKHCN.TimelineThuyetMinh, newIndex: number): void => {
		if (!recDeTai) return;
		const timeline =
			recDeTai?.deCuongKhcn?.timeline?.filter((item) => item.noiDungTimeline !== recordTemp.noiDungTimeline) ?? [];
		timeline?.splice(newIndex, 0, recordTemp);
		setRecDeTai({
			...recDeTai,
			deCuongKhcn: {
				...(recDeTai?.deCuongKhcn ?? {}),
				timeline,
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
				{props.mode === 'edit' && !props.showMinhChung && (
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
				<FormTimeline record={record} edit={edit} onCancel={onCancelForm} />
			</Modal>
		</>
	);
};

export default TableTimeline;
