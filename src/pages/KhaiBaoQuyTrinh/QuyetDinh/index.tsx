import PreviewFile from '@/components/PreviewFile';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Carousel, Modal, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const QuanLyQuyetDinhGiao = (props: { viewTheoBuoc?: boolean }) => {
	const { getModel, page, limit, condition, deleteModel, record, setRecord, setEdit, setVisibleForm } =
		useModel('quytrinh.quyetdinh');
	const { record: recordQuyTrinh } = useModel('quytrinh.quanlyquytrinh');
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);

	const getData = () => {
		if (!props.viewTheoBuoc) getModel();
	};
	const columns: IColumn<QuyetDinhGiaoDeTai.IRecord>[] = [
		{
			title: 'Quyết định',
			dataIndex: 'danhSachVanBanLuuTru',
			width: 150,
			render: (val: { tenFile: string; url: string }[], rec) =>
				val?.filter((item) => item?.url)?.length ? (
					<a
						onClick={() => {
							setRecord(rec);
							setVisibleFormFile(true);
						}}
					>
						Xem chi tiết
					</a>
				) : null,
		},
		{
			title: 'Bước',
			width: 200,
			align: 'center',
			render: (rec: QuyetDinhGiaoDeTai.IRecord) =>
				recordQuyTrinh?.danhSachBuocXuLy?.find((item) => item.ma === rec.maBuoc)?.ten,
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

			<Modal
				title='Chi tiết văn bản kèm theo'
				width={800}
				visible={visibleFormFile}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleFormFile(false)}>Đóng</Button>
					</div>
				}
				onCancel={() => setVisibleFormFile(false)}
			>
				<Carousel autoplay pauseOnDotsHover>
					{record?.danhSachVanBanLuuTru?.map((item) => (
						// eslint-disable-next-line react/jsx-key
						<PreviewFile file={item?.url ?? ''} tenFile={item?.tenFile} />
					))}
				</Carousel>
			</Modal>
		</>
	);
};
export default QuanLyQuyetDinhGiao;
