import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';

const QuanLyQuyetDinhGiao = (props: { viewTheoBuoc?: boolean }) => {
	const { getModel, page, limit, condition, deleteModel, setRecord, setEdit, setVisibleForm } =
		useModel('quytrinh.quyetdinh');
	const { record: recordQuyTrinh } = useModel('quytrinh.quanlyquytrinh');

	const getData = () => {
		if (!props.viewTheoBuoc) getModel();
	};
	const columns: IColumn<QuyetDinhGiaoDeTai.IRecord>[] = [
		{
			title: 'Quyết định',
			dataIndex: 'danhSachVanBanLuuTru',
			width: 150,
			render: (val: { tenFile: string; url: string }[]) => (
				<div>
					{val.map((item) => (
						<div key={item.url}>
							<a href={item.url} target='_blank' rel='noreferrer'>
								{item.tenFile}
							</a>
						</div>
					))}
				</div>
			),
		},
		{
			title: 'Bước',
			width: 200,
			align: 'center',
			render: (record: QuyetDinhGiaoDeTai.IRecord) =>
				recordQuyTrinh?.danhSachBuocXuLy?.find((item) => item.ma === record.maBuoc)?.ten,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			hide: props.viewTheoBuoc,
			render: (rec: QuyetDinhGiaoDeTai.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => {
								setRecord(rec);
								setEdit(true);
								setVisibleForm(true);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(rec._id ?? '', getData)}
							title='Bạn có chắc chắn muốn xóa?'
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
		<>
			<TableBase
				hideCard={props.viewTheoBuoc}
				otherProps={{ size: 'small' }}
				title={'Danh sách quyết định'}
				modelName={'quytrinh.quyetdinh'}
				columns={columns}
				dependencies={[page, limit, condition]}
				getData={getData}
			/>
		</>
	);
};
export default QuanLyQuyetDinhGiao;
