import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import UploadFile from '@/components/Upload/UploadFile';
import { EDangSanPham } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { primaryColor } from '@/services/base/constant';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Modal, Popconfirm, Space, Tag, Tooltip } from 'antd';
import { useCallback, useState } from 'react';
import { useModel } from 'umi';
import FormSanPhamDangI from './FormSanPhamDangI';
import FormSanPhamDangII from './FormSanPhamDangII';
import FormSanPhamDangIII from './FormSanPhamDangIII';

const TableSanPham = (props: {
	mode: 'view' | 'edit';
	data: DeTaiKHCN.SanPhamThuyetMinh[];
	type: EDangSanPham;
	showMinhChung?: boolean;
	phase: 'deCuongKhcn' | 'nghiemThuKhcn';
}) => {
	const { record: recDeTai, setRecord: setRecDeTai } = useModel('khoahoc.detaikhcn');
	const [edit, setEdit] = useState<boolean>(false);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [record, setRecord] = useState<DeTaiKHCN.SanPhamThuyetMinh>();
	const onCancelForm = useCallback(() => {
		setVisibleForm(false);
	}, []);

	const fieldName =
		props.type === EDangSanPham.DANG_SAN_PHAM_I
			? 'sanPhamDeCuongDangI'
			: props.type === EDangSanPham.DANG_SAN_PHAM_II
			? 'sanPhamDeCuongDangII'
			: 'sanPhamDeCuongDangIII';

	const columnsDangI: IColumn<DeTaiKHCN.SanPhamThuyetMinh>[] = [
		{
			title: 'Tên sản phẩm cụ thể và chỉ tiêu chất lượng chủ yếu của sản phẩm',
			dataIndex: 'tenSanPham',
			width: 250,
			// align: 'center',
		},
		{
			title: 'Đơn vị đo',
			width: 200,
			dataIndex: 'donViTinh',
		},
		{
			title: 'Mức chất lượng',
			width: 300,
			align: 'center',
			children: [
				{
					title: 'Cần đạt',
					dataIndex: 'mucChatLuongThamKhaoLoai1',
					width: 100,
				},
				{
					title: 'Mẫu tương tự (theo các tiêu chuẩn mới nhất)',
					width: 200,
					children: [
						{
							title: 'Trong nước',
							dataIndex: 'mauTuongTuTrongNuoc',
							width: 100,
						},
						{
							title: 'Thế giới',
							dataIndex: 'mauTuongTuNgoaiNuoc',
							width: 100,
						},
					],
				},
			],
		},
		{
			title: 'Dự kiến số lượng/quy mô sản phẩm tạo ra',
			dataIndex: 'duKienNoiCongBo',
			width: 200,
		},
	];
	const columnsDangII: IColumn<DeTaiKHCN.SanPhamThuyetMinh>[] = [
		{
			title: 'Tên sản phẩm',
			dataIndex: 'tenSanPham',
			width: 250,
			// align: 'center',
		},
		{
			title: 'Yêu cầu khoa học cần đạt',
			width: 200,
			dataIndex: 'yeuCauLoai23',
		},

		{
			title: 'Ghi chú',
			dataIndex: 'chuThichYeuCau',
			width: 200,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 80,
			fixed: 'right',
			hide: props.mode === 'view',
			render: (rec: DeTaiKHCN.SanPhamThuyetMinh) => (
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
										[fieldName]:
											recDeTai?.deCuongKhcn?.[fieldName]
												?.map((item, index) => ({ ...item, index: index + 1 }))
												.filter((item) => item.tenSanPham !== rec.tenSanPham) ?? [],
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
	const columnsDangIII: IColumn<DeTaiKHCN.SanPhamThuyetMinh>[] = [
		{
			title: 'Tên sản phẩm',
			dataIndex: 'tenSanPham',
			width: 250,
			// align: 'center',
		},
		{
			title: 'Yêu cầu khoa học cần đạt',
			width: 200,
			dataIndex: 'yeuCauLoai23',
		},
		{
			title: 'Dự kiến nơi công bố',
			width: 200,
			dataIndex: 'duKienNoiCongBo',
		},

		{
			title: 'Ghi chú',
			dataIndex: 'chuThichYeuCau',
			width: 200,
		},
	];

	const finalColumn =
		props.type === EDangSanPham.DANG_SAN_PHAM_I
			? columnsDangI
			: props.type === EDangSanPham.DANG_SAN_PHAM_II
			? columnsDangII
			: columnsDangIII;

	if (props.showMinhChung && props.mode === 'view') {
		finalColumn.push({
			title: 'Minh chứng',
			dataIndex: 'sanPhamUrl',
			width: 150,
			fixed: 'right',
			align: 'center',
			hide: !(props.showMinhChung || props.mode === 'view'),
			render: (val: string[]) => (
				<div>
					{val?.map((item, index) => (
						<a key={item} href={item} target='_blank' rel='noreferrer'>
							<Tag color={primaryColor}>Xem tập tin {index + 1}</Tag>
						</a>
					))}
				</div>
			),
		});
	}

	finalColumn.push(
		props.showMinhChung
			? {
					title: 'Minh chứng',
					width: 200,
					fixed: 'right',
					hide: props.mode === 'view',
					align: 'center',
					render: (rec: DeTaiKHCN.SanPhamThuyetMinh, val: any, index) => {
						return (
							<Form.Item name={[props.type, index]}>
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
					render: (rec: DeTaiKHCN.SanPhamThuyetMinh) => (
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
												[fieldName]:
													recDeTai?.deCuongKhcn?.[fieldName]
														?.map((item, index) => ({ ...item, index: index + 1 }))
														.filter((item) => item.tenSanPham !== rec.tenSanPham) ?? [],
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

	const onSortEnd = (recordTemp: DeTaiKHCN.SanPhamThuyetMinh, newIndex: number): void => {
		if (!recDeTai) return;
		const sanPham =
			recDeTai?.deCuongKhcn?.[fieldName]?.filter((item) => item.tenSanPham !== recordTemp.tenSanPham) ?? [];
		sanPham?.splice(newIndex, 0, recordTemp);
		setRecDeTai({
			...recDeTai,
			deCuongKhcn: {
				...(recDeTai?.deCuongKhcn ?? {}),
				[fieldName]: sanPham,
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
				columns={finalColumn?.filter((item) => item.hide !== true)}
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
				{props.type === EDangSanPham.DANG_SAN_PHAM_I && (
					<FormSanPhamDangI type={props.phase} record={record} edit={edit} onCancel={onCancelForm} />
				)}
				{props.type === EDangSanPham.DANG_SAN_PHAM_II && (
					<FormSanPhamDangII type={props.phase} record={record} edit={edit} onCancel={onCancelForm} />
				)}
				{props.type === EDangSanPham.DANG_SAN_PHAM_III && (
					<FormSanPhamDangIII type={props.phase} record={record} edit={edit} onCancel={onCancelForm} />
				)}
			</Modal>
		</>
	);
};

export default TableSanPham;
