import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import { FormDanhMuc } from './components/Form';
import { type DanhMucDiemRenLuyen } from '@/services/DiemRenLuyen/DanhMuc/typing';
import { ELoaiDanhMucChungMappingToTitle } from '@/services/DiemRenLuyen/DanhMuc/constant';

export default () => {
	const { handleEdit, handleView, deleteModel, getModel, page, limit, getLoaiDanhMucChung } =
		useModel('diemrenluyen.danhmuc');

	const onCell = (record: DanhMucDiemRenLuyen.IRecord) => ({
		onClick: () => {
			handleView(record);
		},
		style: { cursor: 'pointer' },
	});
	const columns: IColumn<DanhMucDiemRenLuyen.IRecord>[] = [
		{ width: 140, title: 'Mã', dataIndex: 'ma', filterType: 'string', onCell },
		{ width: 200, title: 'Tên', dataIndex: 'ten', filterType: 'string', onCell },
		{
			width: 240,
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			filterType: 'string',
			render: (value) => <ExpandText>{value}</ExpandText>,
			onCell,
		},
		{
			title: 'Thao tác',
			width: 90,
			align: 'center',
			render: (_, record) => {
				return (
					<>
						<Tooltip title='Chỉnh sửa'>
							<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
						</Tooltip>
						<Tooltip title='Xóa'>
							<Popconfirm
								onConfirm={() => deleteModel(record._id, () => getModel())}
								title={`Bạn có chắc chắn muốn xóa ${ELoaiDanhMucChungMappingToTitle[
									getLoaiDanhMucChung()
								].toLowerCase()} này?`}
								placement='topLeft'
							>
								<Button danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip>
					</>
				);
			},
		},
	];

	return (
		<TableBase
			title={ELoaiDanhMucChungMappingToTitle[getLoaiDanhMucChung()]}
			dependencies={[page, limit]}
			modelName='diemrenluyen.danhmuc'
			columns={columns}
			Form={FormDanhMuc}
		/>
	);
};
