import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { IconTrash, IconPencil01 } from '@/components/Icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import { FormDanhMuc } from './components/Form';
import { type DanhMucDiemRenLuyen } from '@/services/CongTacSinhVien/DiemRenLuyen/DanhMuc/typing';
import { ELoaiDanhMucChungMappingToTitle } from '@/services/CongTacSinhVien/DiemRenLuyen/DanhMuc/constant';

export default () => {
	const { handleEdit, handleView, deleteModel, getModel, page, limit, getLoaiDanhMucChung } =
		useModel('diemrenluyen.danhmuc');
  const intl = useIntl();

	const onCell = (record: DanhMucDiemRenLuyen.IRecord) => ({
		onClick: () => {
			handleView(record);
		},
		style: { cursor: 'pointer' },
	});
	const columns: IColumn<DanhMucDiemRenLuyen.IRecord>[] = [
		{ width: 140, title: intl.formatMessage({ id: 'diemrenluyen.danhmuc.ma' }), dataIndex: 'ma', filterType: 'string', onCell },
		{ width: 200, title: intl.formatMessage({ id: 'diemrenluyen.danhmuc.ten' }), dataIndex: 'ten', filterType: 'string', onCell },
		{
			width: 240,
			title: intl.formatMessage({ id: 'diemrenluyen.danhmuc.ghichu' }),
			dataIndex: 'ghiChu',
			filterType: 'string',
			render: (value) => <ExpandText>{value}</ExpandText>,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.danhmuc.thaotac' }),
			width: 90,
			align: 'center',
			render: (_, record) => {
				return (
					<>
						<Tooltip title={intl.formatMessage({ id: 'diemrenluyen.danhmuc.chinhsua' })}>
							<Button onClick={() => handleEdit(record)} type='link' icon={<IconPencil01 />} />
						</Tooltip>
						<Tooltip title={intl.formatMessage({ id: 'diemrenluyen.danhmuc.xoa' })}>
							<Popconfirm
								onConfirm={() => deleteModel(record._id, () => getModel())}
								title={intl.formatMessage({ id: 'diemrenluyen.danhmuc.xacnhanxoa' })}
								placement='topLeft'
							>
								<Button danger type='link' icon={<IconTrash />} />
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
